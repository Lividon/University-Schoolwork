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
if ((!$_SESSION["faculty"]) || !isset($_SESSION["courses"]) || !isset($_SESSION['ta_lists'])) {
  http_response_code(403);
  echo "Request forbidden: Course does not include user as an instructor";
  exit();
}

if (!isset($_POST["course"])) {
  http_response_code(400);
  echo "Bad request: parameters provided do not match what is required";
  exit();
}

if (!in_array(trim($_POST["course"]), $_SESSION["courses"])) {
  http_response_code(403);
  echo "Request forbidden: Course does not include user as an instructor";
  exit();
}

$_SESSION['courseSelected'] = trim($_POST["course"]);

$ret_val = array();


// Get the user's first name and faculty status
$query_course_data = $conn->prepare("SELECT display_message, default_length, default_location FROM courses WHERE active=1 AND course=?");
$query_course_data->bind_param('s',$_SESSION['courseSelected']);
$query_course_data->execute();
$result_course_data = $query_course_data->get_result();
$row = $result_course_data->fetch_array(MYSQLI_NUM);
$ret_val['message'] = $row[0];
$ret_val['minutes'] = $row[1];
$ret_val['location'] = $row[2];
$ret_val["url"] = $_SESSION['course_url'][$_SESSION['courseSelected']];

$ret_val["rows"] = array();
$ta_list = $_SESSION['ta_lists'][$_SESSION['courseSelected']];
if (count($ta_list) == 0) {
  $ret_val["rows"][] = '<tr><td colspan="4">No TAs found...</td></tr>';
} else {
  foreach ($_SESSION['ta_lists'][$_SESSION['courseSelected']] as $ta) {
    $ret_val["rows"][] = '<tr>' .
                 '<td><input type="checkbox" class="delete_checkbox" value="' . $ta[2] . '"onclick="toggleCheckbox(this);" /></td>' .
                 '<td>' . htmlspecialchars($ta[0]) . '</td>' .
                 '<td>' . htmlspecialchars($ta[1]) . '</td>' .
                 '<td>' . htmlspecialchars($ta[2]) . '</td>' .
                 '</tr>';
  }
}
echo json_encode($ret_val);
?>
