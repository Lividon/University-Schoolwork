<?php
session_start();
if ($_POST["csrf_token"] != $_SESSION["csrf_token"]) {

    // Reset token
    unset($_SESSION["csrf_token"]);
    die("CSRF token validation failed");
}
$location_name=unserialize(rawurldecode(json_decode($_POST['export_loc'])));
$filename = $location_name.'.csv';
$export_data = unserialize(rawurldecode(json_decode($_POST['export_data'])));

// file creation
$file = fopen($filename,"w");
if(file_exists($filename)){
    fputcsv($file, array('Email',  'Location', 'Start Time', 'End Time'));

}


foreach ($export_data as $line){
    fputcsv($file,$line);
}

fclose($file);

// download
header("Content-Description: File Transfer");
header("Content-Disposition: attachment; filename=".$filename);
header("Content-Type: application/csv; ");

readfile($filename);

// deleting file
unlink($filename);
exit();

