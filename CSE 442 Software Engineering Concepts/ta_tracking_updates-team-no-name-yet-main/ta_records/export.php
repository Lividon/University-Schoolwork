<?php

    session_start();
    require "../lib/database.php";
    require "../lib/constants.php";
    require "../lib/loginStatus.php";
if ($_POST["csrf_token"] != $_SESSION["csrf_token"]) {

    // Reset token
    unset($_SESSION["csrf_token"]);
    die("CSRF token validation failed");
}


    function exportToCSV(){

        $conn = connect_to_database();


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








        if(isset($_POST['export'])){
            $connect = connect_to_database();

            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename=taAvailability.csv');
            
            $output = fopen("php://output", "w");
            fputcsv($output, array('Email', 'Course', 'Location', 'Start Time', 'End Time'));
            $ready=unserialize($_POST['select_course']);

            if($ready=="All courses"){
                $selectedDate = htmlspecialchars($_POST['date'],ENT_QUOTES, "UTF-8");
                $startDate = $selectedDate. " 00:00:00";
                $endDate= $selectedDate. " 23:59:59";

                #$query = "SELECT  `email`, `course`, `location`, `start_time`, `actual_end` FROM `office_hours` WHERE `start_time` BETWEEN ? AND ? AND `course` = 'CSE 442'" ;
                $query = "SELECT  `email`, `course`, `location`, `start_time`, `actual_end` FROM `office_hours` WHERE (course=? or course=?) and `start_time` BETWEEN ? AND ? " ;
                $stmt = $conn->prepare($query);
                $stmt->bind_param("ssss",$temp_ar[0],$temp_ar[1], $startDate,$endDate);
                $stmt->execute();

            }else{
                $selectedDate = htmlspecialchars($_POST['date'],ENT_QUOTES, "UTF-8");
                $selectedCourse=htmlspecialchars($_POST['select_course'],ENT_QUOTES, "UTF-8");
                $startDate = $selectedDate. " 00:00:00";
                $endDate= $selectedDate. " 23:59:59";

                #$query = "SELECT  `email`, `course`, `location`, `start_time`, `actual_end` FROM `office_hours` WHERE `start_time` BETWEEN ? AND ? AND `course` = 'CSE 442'" ;
                $query = "SELECT  `email`, `course`, `location`, `start_time`, `actual_end` FROM `office_hours` WHERE `start_time` BETWEEN ? AND ? AND `course` = '$ready'" ;
                $stmt = $connect->prepare($query);
                $stmt->bind_param("ss", $startDate,$endDate);
                $stmt->execute();
            }
            $result = $stmt->get_result();
            $stmt->close();
            
            while($row = $result->fetch_assoc()){
                fputcsv($output, $row);
            }
            
            fclose($output);
            $stmt->close();
            
        }
    }

    exportToCSV();
?>