<?php
session_start();
require "../lib/database.php";
require "../lib/constants.php";
require "../lib/loginStatus.php";
require "lib/add_to_database.php";

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

if (!isset($_POST['first_name']) || !isset($_POST['last_name']) || !isset($_POST['email'])) {
  http_response_code(400);
  echo "Bad request: Missing data on this request";
  exit();
}

// Get row data
$firstName = trim($_POST['first_name']);
$lastName = trim($_POST['last_name']);
$email = trim($_POST['email']);

$added = addTA($conn, $firstName, $lastName, $email);
if (!$added) {
  $_SESSION['status'] = "err";
} else {
  $_SESSION['status'] = "add_succ";
}
header("Location: ./facultyManage.php");
?>
