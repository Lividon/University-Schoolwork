<?php
session_start();
require "./database.php";
require "./constants.php";
require "./imageHelper.php";

$conn = connect_to_database();

if (!isset($_GET['email'])) {
  http_response_code(400);
  echo "Bad parameters: No account was specified";
  exit();
}

$filename = getImageNameFromEmail($conn, $_GET['email']);
if (!$filename) {
  $filename = "../styles/default-pic.png";
}
$handle = fopen($filename, "r");
$imagetype = exif_imagetype($filename);
$mime = image_type_to_mime_type($imagetype);
header("Content-type: ".$mime);
header("Content-length: ".filesize($filename));
fpassthru($handle);
?>
