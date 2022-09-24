<?php
function buildTAList($conn, $course) {
  // Get TA rows in specific course
  $stmt_ta_list = $conn->prepare("SELECT first_name, last_name, staff_list.email FROM staff_list INNER JOIN registered_users ON staff_list.email=registered_users.email WHERE faculty = 0 AND course=?");
  $stmt_ta_list->bind_param('s', $course);
  $stmt_ta_list->execute();
  $stmt_ta_list->bind_result($first_name, $last_name, $email);
  $stmt_ta_list->store_result();
  $ta_list = array();
  while ($stmt_ta_list->fetch()) {
    $ta_list[] = array($first_name, $last_name, $email);
  }
  return $ta_list;
}
?>
