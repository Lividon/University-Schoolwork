<?php
session_start();
require "lib/database.php";
require "lib/constants.php";
require "lib/taListBuilder.php";
$conn = connect_to_database();

$error_message = "";

//Check for CSRF token
if ($_POST["csrf_token"] != $_SESSION["csrf_token"]) {

  // Reset token
  unset($_SESSION["csrf_token"]);
  die("CSRF token validation failed");
}

// Check if this user is submitting a one-time password
if (!empty($_POST["UBIT"])) {
  $_SERVER["uid"] = htmlspecialchars($_POST["UBIT"]);
  $email = $_SERVER["uid"]."@buffalo.edu";
  $stmt_request = $conn->prepare("SELECT * FROM registered_users WHERE email=?");
  $stmt_request->bind_param('s',$email);
  $stmt_request->execute();
  $result = $stmt_request->get_result();
  $count  = mysqli_num_rows($result);
  
  if ($count > 0) {
    // Set up the SESSION variables
    $_SESSION["emailUser"] = $email;

    // Get the user's first name and faculty status
    $query_session_data = $conn->prepare("SELECT first_name, last_name, faculty, default_location FROM registered_users WHERE email=?");
    $query_session_data->bind_param('s',$_SESSION["emailUser"]);
    $query_session_data->execute();
    $result_session_data = $query_session_data->get_result();
    $row = $result_session_data->fetch_array(MYSQLI_NUM);
    $_SESSION['firstName'] = $row[0];
    $_SESSION['lastName'] = $row[1];
    $_SESSION['faculty'] = ($row[2] == 1);
    $_SESSION['location'] = $row[3];
    $_SESSION['LAST_ACTIVITY'] = $_SERVER['REQUEST_TIME'];
    
    $rows = array();
    $display_messages = array();
    $default_lengths = array();
    $query_course_data=$conn->prepare("SELECT staff_list.course, display_message, default_length FROM staff_list INNER JOIN courses on staff_list.course = courses.course WHERE email=? AND active=1");
    $query_course_data->bind_param('s',$_SESSION["emailUser"]);
    $query_course_data->execute();
    $course_data = $query_course_data->get_result();
    while ($row = $course_data->fetch_array(MYSQLI_ASSOC)) {
      $rows[] = $row["course"];
      $display_messages[$row["course"]] = $row["display_message"];
      $default_lengths[$row["course"]] = $row["default_length"];
    }
    $_SESSION["courses"] = $rows;
    $_SESSION["default_lengths"] = $default_lengths;
    // For faculty we will also record per-course lists of TAs
    if ($_SESSION['faculty']) {
      $_SESSION["display_messages"] = $display_messages;
      $_SESSION['course_url'] = array();
      $_SESSION['ta_lists'] = array();
      foreach ($_SESSION["courses"] as $course) {
        $ta_list = buildTAList($conn, $course);
        $_SESSION['ta_lists'][$course] = $ta_list;
        $_SESSION['course_url'][$course] = SITE_HOME . "/active_list/TAList.php?class=" . urlencode($course);
      }
      header("Location: ". SITE_HOME . "/faculty/facultyManage.php");
    } else {
      header("Location: ". SITE_HOME . "/office_hours/oh.php");
    }
  } else {
    $_SESSION["failurecode"] = 1;
    header("Location: ". SITE_HOME . "/login.php");
    //echo "Unknown email address entered. Talk to your professor to get you added as a TA.";
    exit();
  }
} else {
  $_SESSION["failurecode"] = 2;
  header("Location: ". SITE_HOME . "/login.php");
  //echo "Could not connect: Error connecting to shibboleth. Talk to Matthew to get this fixed.";
  exit();
}
?>
