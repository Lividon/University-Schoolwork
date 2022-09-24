<?php
session_start();
require "../lib/database.php";
require "../lib/pageHeader.php";
require "../lib/constants.php";
require "../lib/loginStatus.php";

function generate_token() {
    // Check if a token is present for the current session
    if(!isset($_SESSION["csrf_token"])) {
        // No token present, generate a new one
        $token = md5(uniqid(microtime(), true)); ;
        $_SESSION["csrf_token"] = $token;

    } else {
        // Reuse the token
        $token = $_SESSION["csrf_token"];
    }
    return $token;
}



function selC(){


    $conn = connect_to_database();
    $email =htmlspecialchars($_SESSION['emailUser'],ENT_QUOTES, "UTF-8");
    $query = "SELECT course FROM staff_list WHERE email = ? ";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();





    $result = $stmt->get_result();
    $stmt->close();

    if(!empty($result)){

        while($row = $result->fetch_assoc()){
           # echo '<option value="'.$row['course'].'"'.'<?php'.'if(isset('.''.$row['course'].'</option>';





            echo "<option value='".$row['course']."'";
            if(isset($_POST["select_course"])){if($_POST["select_course"] == $row['course']) {echo "selected='selected'"; }};
            echo ">".$row['course']."</option>";





        }
    }




}




function getTB(){
    if ($_POST["csrf_token"] != $_SESSION["csrf_token"]) {

        // Reset token
        unset($_SESSION["csrf_token"]);
        die("CSRF token validation failed");
    }
    $temp_ar=array();


    $conn = connect_to_database();
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















    if(!$conn){
        echo "Connection Failed: " . mysqli_connect_error();
    }

    $selectedLocation =htmlspecialchars($_POST['select_location'],ENT_QUOTES, "UTF-8");
    $selectedCourse=htmlspecialchars($_POST['select_course'],ENT_QUOTES, "UTF-8");
    if($_POST["select_course"]=="All courses"){
        #$query = "SELECT course, email, location ,start_time, expected_end, actual_end FROM office_hours WHERE location = ? ORDER BY start_time" ;
        $query = "SELECT course, email, location ,start_time, expected_end, actual_end FROM office_hours WHERE location = ? and (course=? or course = ?) ORDER BY start_time" ;

        $stmt = $conn->prepare($query);
        #$stmt->bind_param("s", $selectedLocation);
        $stmt->bind_param("sss", $selectedLocation,$temp_ar[0],$temp_ar[1]);
        $stmt->execute();





        $result = $stmt->get_result();
        $stmt->close();


    }else{
        $query = "SELECT course, email, location ,start_time, expected_end, actual_end FROM office_hours WHERE location = ? and course=? ORDER BY start_time" ;

        $stmt = $conn->prepare($query);
        $stmt->bind_param("ss", $selectedLocation,$selectedCourse);
        $stmt->execute();





        $result = $stmt->get_result();
        $stmt->close();
    }


    #$query = "SELECT  `email`, `course`, `location`, `start_time`, `actual_end` FROM `office_hours` WHERE `start_time` BETWEEN ? AND ? AND `course` = 'CSE 442'" ;

    $user_arr = array();


    if(!empty($result)){
        echo "<tr>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                </tr>";
        while($row = $result->fetch_assoc()){




            #$user_arr = array();
            $user_arr[] = array($row['email'] ,$row['location'],date("m/d/Y h:i a", strtotime($row['start_time'])),date("m/d/Y h:i a", strtotime($row['actual_end'])) );
            #$carlos=array(1,2,3,4);

            echo "<tr><td >" . $row['email'] . "</td><td >" .$row['location'] . "</td><td> " .date("m/d/Y h:i a", strtotime($row['start_time'])) .
                "</td><td >" .date("m/d/Y h:i a", strtotime($row['actual_end'])). "</td></tr>";

        }
    }else{
        echo "Sorry No Data Available";

    }
    if(empty($user_arr)){
        echo "No Data available for selected location and selected course";
    }
    echo '<script type="application/javascript">displayTable();</script>';
    $d=array($user_arr,$selectedLocation);

    return $d;




}








?>

<html lang="en">
<head>
    <title>Active TAs</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="../styles/default.css">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style>
        footer {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 2.5rem;

            text-align:center; //to align the text in center
        }
        .page-header{
            margin-top: 10px;
            text-align: center;
        }
        h2{
            text-align: center;
        }


        @keyframes blinker {
            50% {
                opacity: 0;
            }
        }
        .container{
            margin-top:80;
            text-align: center;
            padding: 14px 16px;
            width: 100%;
        }
        .container a {
            text-decoration: none;
            color: white;
            padding: 15px;
        }

        .container a:hover {
            background-color: #ddd;
            color: black;
        }




        table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.0) !important;
        }

        td, th {
            border: 4px solid black;
            text-align: left;
            padding: 8px;
            background-color: rgba(0, 0, 0, 0.0) !important;
        }

        tr:nth-child(even) {
            background-color: rgba(0, 0, 0, 0.0) !important;;
        }
        #myDIV {
            width: 100%;
            padding: 50px 0;
            text-align: center;
            background-color: lightblue;
            margin-top: 20px;

        }
        .button {
            background-color: dodgerblue;
            -webkit-border-radius: 60px;
            border-radius: 60px;
            border: none;
            color: #eeeeee;
            cursor: pointer;
            display: inline-block;
            font-family: sans-serif;
            font-size: 20px;
            padding: 10px 10px;
            text-align: center;
            text-decoration: none;
        }

        #form {
            text-align: center;
            margin-bottom: 20px;

        }
    </style>
</head>
<body>
<header>
    <?php page_header_emit(); ?>
</header>

<!-- Link to your feature -->
<script>
    // function myFunction() {
    //    var x = document.getElementById("form");
    //   if (x.style.display === "none") {

    //      x.style.display = "block";
    //  } else {
    //      x.style.display = "none";
    //  }
    // if (document.getElementById("myDIV").style.display==="contents"){
    //     document.getElementById("myDIV").style.display="none";
    // }
    // }
    function displayTable() {
        var x = document.getElementById("myDIV");
        if (x.style.display === "none") {

            x.style.display = "contents";
        }
        var f = document.getElementById("form");
        f.style.display="contents"

    }

</script>

<div class="container">
    <h2 class="page-header">Select "Location" below to view list of TA office hour locations</h2>

    <form action = "" method="POST" name="form" id="form" >
        <select name="select_location">
            <option value="UB 300"<?php if(isset($_POST['select_location'])){if($_POST['select_location'] == 'UB 300') {echo "selected=selected"; }} ?>>UB 300</option>

            <option value="UB 243" <?php if(isset($_POST['select_location'])){if($_POST['select_location'] == 'UB 243') {echo "selected=selected"; }} ?>>UB 243</option>
            <option value="UB 145"<?php if(isset($_POST['select_location'])){if($_POST['select_location'] == 'UB 145') {echo "selected=selected"; }} ?>>UB 145</option>
            <option value="UB 439"<?php if(isset($_POST['select_location'])){if($_POST['select_location'] == 'UB 439') {echo "selected=selected"; }} ?>>UB 439</option>
            <option value="UB 233"<?php if(isset($_POST['select_location'])){if($_POST['select_location'] == 'UB 233') {echo "selected=selected"; }} ?>>UB 233</option>
            <option value="UB 123"<?php if(isset($_POST['select_location'])){if($_POST['select_location'] == 'UB 123') {echo "selected=selected"; }} ?>>UB 123</option>
            <option value="UB 08"<?php if(isset($_POST['select_location'])){if($_POST['select_location'] == 'UB 08') {echo "selected=selected"; }} ?>>UB 08</option>
            <option value="UB 10"<?php if(isset($_POST['select_location'])){if($_POST['select_location'] == 'UB 10') {echo "selected=selected"; }} ?>>UB 10</option>



        </select>

        <select name="select_course">
            <?php
            echo "<option value='All courses'";
            if(isset($_POST["select_course"])){if($_POST["select_course"] == 'All courses') {echo "selected='selected'"; }};
            echo ">All courses</option>";









            selC();

            ?>




        </select>
        <input type="hidden" name="csrf_token" value="<?php echo generate_token();?>" />










        <input type="submit" name="submit" value="Select Location"  ></input>
    </form>

</div>
<div id="myDIV" style="display:none">
    <form method='post' action='download.php'>
        <table >

            <?php

            if(isset($_POST["submit"])){
                $table_L= getTB();




            }
            ?>



        </table>

        <?php



        $serialize_user_arr= json_encode(rawurlencode(serialize($table_L[0])));


        $local=json_encode(rawurlencode(serialize($table_L[1])));


        ?>

        <textarea name='export_data' style='display: none;'><?php echo htmlspecialchars($serialize_user_arr,ENT_QUOTES, "UTF-8"); ?></textarea>
        <textarea name='export_loc' style='display: none;'><?php echo htmlspecialchars($local,ENT_QUOTES, "UTF-8"); ?></textarea>
        <input type="hidden" name="csrf_token" value="<?php echo generate_token();?>" />


        <input type='submit' value='Export' name='Export'>
    </form>

</div>

<footer class="mastfoot mt-auto">
    <div class="inner">
        <p> (c) Jacob Gordon, Brandon Channer, Carlos Castano, Harpreet Mahal </p>
    </div>
</footer>

</body>


</html>
