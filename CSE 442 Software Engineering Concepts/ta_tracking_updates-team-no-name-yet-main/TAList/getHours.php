<?php
session_start();
require "lib/database.php";
require "lib/constants.php";
//require "lib/pageHeader.php";
//require "lib/loginStatus.php";

//$start = $_POST['Bday'] . " 00:00:00";
//$end = $_POST['Eday'] . "24:59:59";
//$selectedTA = htmlspecialchars($_SESSION['name'],ENT_QUOTES, "UTF-8");

//$query = "SELECT StartOH, EndOH, FROM TA_List_Time_Numbers WHERE Name = ?";
//$stmt = $conn->prepare($query);
//$stmt->bind_param("s", $selectedTA);
//$stmt->execute();
//$result = $stmt->get_result();
//echo "Hello there";
//$count = 0;
//while($row = $result->fetch_assoc())
//{
//	if($row["StartOH"] > $start && $row["StartOH"] < $end)
//	{
//		$time1s = substr($row["StartOH"], 11);
//                $time2s = substr($row["EndOH"], 11);     
//                $time1a = explode(':',$time1s);
//                $time2a = explode(':',$time2s);
//                $seconds1 = $time1a[0] * 3600 + $time1a[1] * 60 + $time1a[2];
//                $seconds2 = $time2a[0] * 3600 + $time2a[1] * 60 + $time2a[2];
//                $totalTime = $totalTime + (($seconds2-$seconds1)/60);
//		echo $totalTime;
//	}
//}
?>