<?php
session_start();
require "../lib/database.php";
require "../lib/constants.php";
require "../lib/imageHelper.php";
require "../lib/loginStatus.php";

$conn = connect_to_database();

if (!is_logged_in()) {
  header("Location: " . SITE_HOME . "/login.php");
  exit();
}

if (!isset($_POST['picSubmit']) || empty($_FILES['file']['name'])) {
  http_response_code(400);
  echo "Bad parameters: No image was input";
  exit();
}

if ($_FILES['file']['error'] != UPLOAD_ERR_OK) {
  http_response_code(400);
  echo "Bad parameters: Error uploading image";
  exit();
}


// Validate the selected file is an image file
if ($imagetype = exif_imagetype($_FILES['file']['tmp_name'])) {

  // Verify that the file which was uploaded is actually from the user's machine
  if (is_uploaded_file($_FILES['file']['tmp_name'])) {
    // Let's not waste too much space on the web server
    if ($_FILES['file']['size'] <= MAX_IMAGE_SIZE) {
      // Generate a random name for this new file
      $filename = uniqid();
      $newImageName = createImageNameFromEmail($_SESSION['emailUser'], $filename);
      // And store the file in our images directory
      $success = move_uploaded_file($_FILES['file']['tmp_name'], $newImageName);
      // If this worked, we need to update the database
      if ($success) {
        // Check to see if there was an existing image
        $oldImageName = getImageNameFromEmail($conn, $_SESSION['emailUser']);
        if ($oldImageName) {
          $success = unlink($oldImageName);
        }
        if ($success) {
          $image_update_query = $conn->prepare("UPDATE registered_users SET image=? WHERE email=?");
          $image_update_query->bind_param('ss', $filename, $_SESSION['emailUser']);
          $success = $image_update_query->execute();
        }
      }
      if (!$success) {
        $_SESSION['status'] = 'upload_err';
      } else {
        $_SESSION['status'] = 'upload_succ';
      }
    } else {
      $_SESSION['status'] = "invalid_size";
    }
  } else {
    $_SESSION['status'] = "invalid_file";
  }
} else {
  $_SESSION['status'] = "invalid_file_type";
}
header("Location: ./account.php");
?>
