<?php
session_start();
require "../lib/database.php";
require "../lib/constants.php";

$conn = connect_to_database();

if (!isset($_SESSION['emailUser'])) {
  header("Location: " . SITE_HOME . "/login.php");
  exit();
}

// Check that the user is a faculty member and that this is one of their courses.
if (!isset($_SESSION["courses"]) || !in_array($_POST['courseSelected'], $_SESSION["courses"])) {
  http_response_code(403);
  echo "Request forbidden: Course does not include user in the staff listing.";
  exit();
}

// Check that the user is a faculty member and that this is one of their courses.
if (!isset($_POST["expected_end"]) || !isset($_POST['location']) || !isset($_POST['start'])) {
  http_response_code(400);
  echo "Bad parameter: Incorrect arguments provided to start office hours.";
  exit();
}

if (isset($_POST["subbing_for"]) && !filter_var($_POST["subbing_for"], FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo "Bad parameter: Invalid email address specified.";
  exit();
}

$colon_loc = strpos($_POST['expected_end'], ':');
$hour = intval(substr($_POST['expected_end'], 0, $colon_loc));
$min = intval(substr($_POST['expected_end'], $colon_loc+1));
$end_time = date("Y-m-d H:i:s", mktime($hour, $min));

if (!isset($_POST["subbing_for"])) {
  $stmt_request = $conn->prepare("INSERT INTO office_hours (email, course, expected_end, location) VALUES (?, ?, ?, ?)");
  $stmt_request->bind_param('ssss', $_SESSION['emailUser'], $_POST['courseSelected'], $end_time, $_POST["location"]);
  $result = $stmt_request->execute();
  if ($result) {
    $_SESSION['status'] = 'start_succ';
  } else {
    $_SESSION['status'] = 'start_err';
  }
} else {
  $stmt_request = $conn->prepare("INSERT INTO office_hours (email, email_original_ta, course, expected_end, location) VALUES (?, ?, ?, ?, ?)");
  $stmt_request->bind_param('sssss', $_SESSION['emailUser'], $_POST["subbing_for"], $_POST['courseSelected'], $end_time, $_POST["location"]);
  $result = $stmt_request->execute();
  if ($result) {
    $_SESSION['status'] = 'start_succ';
  } else {
    $_SESSION['status'] = 'start_err';
  }
}
header("Location: ./oh.php");
?>
