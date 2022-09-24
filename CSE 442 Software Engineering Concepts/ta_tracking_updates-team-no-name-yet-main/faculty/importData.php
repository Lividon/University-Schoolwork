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


if (!isset($_POST['importSubmit']) || empty($_FILES['file']['name'])) {
  http_response_code(400);
  echo "Bad parameters: No file was input";
  exit();
}

// Verify that the file which was uploaded is actually from the user's machine
if (is_uploaded_file($_FILES['file']['tmp_name'])) {
  // Open uploaded CSV file with read-only mode
  $csvFile = fopen($_FILES['file']['tmp_name'], 'r');

  // Parse data from CSV file line by line
  while (($line = fgetcsv($csvFile)) !== FALSE) {
    if (count($line) != 3) {
      $_SESSION['status'] = "improper_format";
      header("Location: ./facultyManage.php");
      exit();
    }

    // Get row data
    $firstName = $line[0];
    $lastName = $line[1];
    $email = $line[2];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $_SESSION['status'] = "improper_format";
      header("Location: ./facultyManage.php");
      exit();
    }

    $added = addTA($conn, $firstName, $lastName, $email);

    if (!$added) {
      $_SESSION['status'] = "err";
      header("Location: ./facultyManage.php");
      exit();
    }
  }
  // Close opened CSV file
  fclose($csvFile);
  $_SESSION['status'] = "import_succ";
} else {
  $_SESSION['status'] = "err";
}
header("Location: ./facultyManage.php");
?>
