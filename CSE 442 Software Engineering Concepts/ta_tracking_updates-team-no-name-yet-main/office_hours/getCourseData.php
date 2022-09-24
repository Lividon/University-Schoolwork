<?php
session_start();
require "../lib/database.php";
require "../lib/constants.php";
require "../lib/loginStatus.php";

$conn = connect_to_database();

if (!is_logged_in()) {
  header("Location: " . SITE_HOME . "/login.php");
  exit();
}

if (!isset($_POST["course"])) {
  http_response_code(400);
  echo "Bad request: parameters provided do not match what is required";
  exit();
}

if (!in_array(trim($_POST["course"]), $_SESSION["courses"])) {
  http_response_code(403);
  echo "Request forbidden: Course does not include user in the staff list";
  exit();
}

$ret_val = array();
$rows = array();
$rows[] = '<option selected disabled>Only use this if subbing for another TA</option>';
$stmt_subs = $conn->prepare("SELECT first_name, last_name, staff_list.email FROM staff_list INNER JOIN registered_users ON staff_list.email = registered_users.email WHERE staff_list.email<>? AND course=? AND faculty=0");
$stmt_subs->bind_param('ss', $_SESSION['emailUser'], $_POST["course"]);
$stmt_subs->execute();
$result = $stmt_subs->get_result();
while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
  $rows[] = '<option value="'.$row["email"].'">'.htmlspecialchars($row["first_name"]." ".$row["last_name"]).'</option>';
}
$stmt_subs = $conn->prepare("SELECT course, default_length FROM courses WHERE course=? AND active=1");
$stmt_subs->bind_param('s', $_POST["course"]);
$stmt_subs->execute();
$result = $stmt_subs->get_result();
$row = $result->fetch_array(MYSQLI_ASSOC);
$ret_val["length"] = $row["default_length"];
$ret_val["rows"] = $rows;
echo json_encode($ret_val);
?>
