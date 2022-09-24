<?php
session_start();
require "../lib/database.php";
if(isSet($_POST['download']))
{
$conn = connect_to_database();
$TA_name = $_POST['TAname'];
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=TAOH.csv');
$output = fopen("php://output", "w");
fputcsv($output, array('StartOH', 'EndOH', 'Location'));
$query = mysqli_query($conn, "SELECT StartOH, EndOH, Location FROM TA_List_Time_Numbers WHERE Name = '$TA_name'");
while($row = mysqli_fetch_assoc($query))
{
	fputcsv($output, $row);
}
fclose($output);
}
?>