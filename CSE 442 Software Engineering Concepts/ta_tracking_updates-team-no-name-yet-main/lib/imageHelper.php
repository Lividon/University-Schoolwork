<?php

function getImageNameFromEmail($conn, $email) {
  $image_reader_query = $conn->prepare("SELECT image FROM registered_users WHERE email=? AND image IS NOT null");
  $image_reader_query->bind_param('s', $email);
  $image_reader_query->execute();
  $result = $image_reader_query->get_result();
  $count = mysqli_num_rows($result);
  if ($count > 0) {
    $row = $result->fetch_array(MYSQLI_NUM);
    $filename = $row[0];
    $username = strstr($email, '@', TRUE);
    $fullpath = IMAGE_PATH.$username."_".$filename;
    return $fullpath;
  } else {
    return NULL;
  }
}

function createImageNameFromEmail($email, $uniqid) {
  // Get the current users username
  $username = strstr($email, '@', TRUE);
  $filename = $uniqid;
  // Combine them as required
  $fullpath = IMAGE_PATH.$username."_".$filename;
  return $fullpath;
}
?>
