<?php
function addTA($conn, $firstName, $lastName, $email) {
  // Check whether email is for a TA already added to the database
  $stmt_return_ta = $conn->prepare("SELECT * FROM registered_users WHERE email = ?");
  $stmt_return_ta->bind_param('s', $email);
  $stmt_return_ta->execute();
  $result_return_ta = $stmt_return_ta->get_result();
  $count = mysqli_num_rows($result_return_ta);

  // If this is the first time this student has been listed as a TA
  if ($count == 0) {
    $stmt_add_user = $conn->prepare("INSERT INTO registered_users (first_name, last_name, faculty, email) VALUES (?,?,0,?)");
    $stmt_add_user->bind_param('sss', $firstName, $lastName, $email);
    $add_success = $stmt_add_user->execute();
    if (!$add_success) {
      return FALSE;
    }
  }

  // Check whether email is already a TA in this course
  $stmt_course_ta = $conn->prepare("SELECT * FROM staff_list WHERE email=? AND course=?");
  $stmt_course_ta->bind_param('ss', $email, $_SESSION['courseSelected']);
  $stmt_course_ta->execute();
  $result_course_ta = $stmt_course_ta->get_result();
  $count = mysqli_num_rows($result_course_ta);

  // If this is the first time this student has been listed as a TA
  if ($count == 0) {
    $stmt_add_user = $conn->prepare("INSERT INTO staff_list (email, course) VALUES (?,?)");
    $stmt_add_user->bind_param('ss', $email, $_SESSION['courseSelected']);
    $add_success = $stmt_add_user->execute();
    if (!$add_success) {
      return FALSE;
    }
    $_SESSION['ta_lists'][$_SESSION['courseSelected']][] = array($firstName, $lastName, $email);
  }
  return TRUE;
}
?>
