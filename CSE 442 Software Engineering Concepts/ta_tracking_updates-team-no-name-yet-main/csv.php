<?php
session_start();
require "../lib/database.php";
$conn = connect_to_database();
header('Content-Type: text/csv; charset=utf-8');
header("Content-Disposition: attachment; filename=TA Times and Locations.csv");
$output = fopen("php://output", "w");
fputcsv($output, array('Start OH', 'End OH', 'Location', 'Name'));

$selectedTA = htmlspecialchars($_SESSION['name'],ENT_QUOTES, "UTF-8");
        $query = "SELECT StartOH, EndOH, Location FROM TA_List_Time_Numbers WHERE Name = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $selectedTA);
        $stmt->execute();
        $result = $stmt->get_result();
	$count = 0;
 while($row = $result->fetch_assoc()){
		if($count == 0)
		{
			$count = 1;
			array_push($row, $_SESSION['name']);
               		fputcsv($output, $row);
		}
		else
		{
			fputcsv($output, $row);
		}
            }
fclose($output);
$stmt->close();
?>