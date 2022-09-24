<?php
session_start();
require "../lib/database.php";
require "../lib/constants.php";
require "../lib/taListBuilder.php";
require "../lib/loginStatus.php";

$conn = connect_to_database();

if (!is_logged_in()) {
  header("Location: " . SITE_HOME . "/login.php");
  exit();
}

// Check that the user is a faculty member and that this is one of their courses.
if ((!$_SESSION["faculty"]) || !isset($_SESSION["courses"]) || !in_array($_SESSION['courseSelected'], $_SESSION["courses"])) {
  http_response_code(403);
  echo "Request forbidden: Course does not include user as an instructor";
  exit();
}

if (!isset($_POST["checkbox_value"])) {
  http_response_code(400);
  echo "Bad request: parameters provided do not match what is required";
}

$stmt = $conn->prepare("DELETE FROM staff_list WHERE email=? AND course=?");
foreach ($_POST["checkbox_value"] as $victim) {
  $stmt->bind_param('ss',$victim,$_SESSION['courseSelected']);
  $stmt->execute();
}
// Now rebuild the ta list
$ta_list = buildTAList($conn, $_SESSION['courseSelected']);
$_SESSION['ta_lists'][$_SESSION['courseSelected']] = $ta_list;
?>
