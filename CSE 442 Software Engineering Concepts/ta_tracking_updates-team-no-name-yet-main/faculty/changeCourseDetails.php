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

// Check that the user is a faculty member and that this is one of their courses.
if ((!$_SESSION["faculty"]) || !isset($_SESSION["courses"])) {
  http_response_code(403);
  echo "Request forbidden: Course does not include user as an instructor";
  exit();
}

if (!isset($_POST["input_message"]) || !isset($_POST["input_minutes"]) || !isset($_POST["input_location"])) {
  http_response_code(400);
  echo "Bad request: parameters provided do not match what is required";
  exit();
}

if (!in_array($_SESSION['courseSelected'], $_SESSION["courses"])) {
  http_response_code(403);
  echo "Request forbidden: Course does not include user as an instructor";
  exit();
}

$display_message = trim($_POST['input_message']);
$default_length = trim($_POST['input_minutes']);
$default_location = trim($_POST['input_location']);

if (empty($display_message)) {
  $display_message = NULL;
}
if (empty($default_location)) {
  $default_location = NULL;
}

$update_course_data = $conn->prepare("UPDATE courses SET display_message=?, default_length=?, default_location=? WHERE active=1 AND course=?");
$update_course_data->bind_param('ssss', $display_message, $default_length, $default_location, $_SESSION['courseSelected']);
$update_success = $update_course_data->execute();
if (!$update_success) {
  $_SESSION['status'] = "err";
} else {
  $_SESSION['status'] = "update_succ";
}
header("Location: ./facultyManage.php");
?>
