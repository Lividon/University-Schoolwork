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

// Check that this was called from the proper page
if (!isset($_POST["end"])) {
  http_response_code(400);
  echo "Bad parameter: Incorrect arguments provided to end office hours.";
  exit();
}

$stmt_request = $conn->prepare("UPDATE office_hours SET actual_end=CURRENT_TIMESTAMP WHERE email=? AND actual_end IS NULL AND NOW() <= DATE_ADD(expected_end, INTERVAL 10 MINUTE)");
$stmt_request->bind_param('s', $_SESSION['emailUser']);
if ($stmt_request->execute()) {
  $_SESSION['status'] = 'end_succ';
} else {
  $_SESSION['status'] = 'end_err';
}
header("Location: ./oh.php");
?>
