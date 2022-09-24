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

$first_name = trim($_POST['inputFirstName']);
$last_name = trim($_POST['inputLastName']);
$location = trim($_POST['inputLocation']);

if (!empty($first_name) || !empty($last_name) || !empty($_POST['inputLocation'])) {
  // For laziness purposes, we will update the entire name each time
  if (empty($first_name)) {
    $first_name = $_SESSION['firstName'];
  }

  if (empty($last_name)) {
    $last_name = $_SESSION['lastName'];
  }

  if (empty($location)) {
    $location = NULL;
  }

  $name_update_query = $conn->prepare("UPDATE registered_users SET first_name=?, last_name=?, default_location=? WHERE email=?");
  $name_update_query->bind_param('ssss', $first_name, $last_name, $location, $_SESSION['emailUser']);
  $db_result = $name_update_query->execute();
  if (!$db_result) {
    $_SESSION['status'] = 'name_change_err';
  } else {
    $_SESSION['lastName'] = $last_name;
    $_SESSION['firstName'] = $first_name;
    if (empty($location)) {
      $_SESSION['location'] = '';
    } else {
      $_SESSION['location'] = $location;
    }
    $_SESSION['status'] = 'name_change_succ';
  }
} else {
  $_SESSION['status'] = NULL;
}
header("Location: ./account.php");
?>
