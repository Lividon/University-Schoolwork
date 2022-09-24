<?php
session_start();
if ($_POST["csrf_token"] != $_SESSION["csrf_token"]) {

    // Reset token
    unset($_SESSION["csrf_token"]);
    die("CSRF token validation failed");
}
require "../lib/database.php";
$conn = connect_to_database();
header('Content-Type: text/csv; charset=utf-8');
header("Content-Disposition: attachment; filename=TA Times and Locations.csv");
$output = fopen("php://output", "w");
fputcsv($output, array('Start OH', 'End OH', 'Location', 'Name'));


$temp_ar=array();



$email =htmlspecialchars($_SESSION['emailUser'],ENT_QUOTES, "UTF-8");
$query = "SELECT course FROM staff_list WHERE email = ? ";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();





$result = $stmt->get_result();
$stmt->close();

if(!empty($result)){

    while($row = $result->fetch_assoc()){
        $temp_ar[]=$row['course'];





    }
}



$selectedTA = htmlspecialchars($_SESSION['name'],ENT_QUOTES, "UTF-8");
        $query = "SELECT StartOH, EndOH, Location,Name FROM TA_Location_Time WHERE Name = ? and (course=? or course=?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sss", $selectedTA,$temp_ar[0],$temp_ar[1]);
        $stmt->execute();
        $result = $stmt->get_result();

 while($row = $result->fetch_assoc()){
     fputcsv($output, $row);


		}


fclose($output);
$stmt->close();
?>