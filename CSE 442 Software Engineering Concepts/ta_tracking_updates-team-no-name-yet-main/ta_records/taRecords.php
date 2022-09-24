<?php 
    session_start();
    require "../lib/database.php";
    require "../lib/constants.php";
    require "../lib/pageHeader.php";
    require "../lib/loginStatus.php";
    define('TABLE_DATA', "</td><td>");
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

    function formatTime($time){
        $format_time = strtotime($time);
        return date("m/d/y g:i A", $format_time);
    }

    function getTaAvailability(){
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










        
        if(!$conn){
            echo "Connection Failed: " . mysqli_connect_error();
        }        
       
        if(isset($_POST['submit'])){
            if ($_POST["csrf_token"] != $_SESSION["csrf_token"]) {

                // Reset token
                unset($_SESSION["csrf_token"]);
                die("CSRF token validation failed");
            }
            if($_POST['select_course']=="All courses"){
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
                $query = "SELECT  `email`, `course`, `location`, `start_time`, `actual_end` FROM `office_hours` WHERE `start_time` BETWEEN ? AND ? AND `course` = '$selectedCourse'" ;
                $stmt = $conn->prepare($query);
                $stmt->bind_param("ss", $startDate,$endDate);
                $stmt->execute();
            }

        }
        
        $result = $stmt->get_result();
        $stmt->close();
        
        return $result;
    }

    function createDataTable(){
        $data = getTaAvailability();

        if($data->num_rows != 0){
            echo "<tr>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Location</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                </tr>";
            
            while($row = $data->fetch_assoc()){
                if(empty($row['actual_end'])){
                    echo "<tr><td>". $row['email'] . TABLE_DATA. $row['course'] . TABLE_DATA. $row['location'] .TABLE_DATA
                . formatTime($row['start_time']) . TABLE_DATA . formatTime($row['expected_end']) ."</td></tr>";
                }else{
                    echo "<tr><td>". $row['email'] . TABLE_DATA . $row['course'] . TABLE_DATA. $row['location'] .TABLE_DATA
                . formatTime($row['start_time']) . TABLE_DATA . formatTime($row['actual_end']) ."</td></tr>";
                }
            }
        }
        else{
            echo "<h2>No TA's Available on this day.</h2>";
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="../styles/default.css">
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <style>
        footer {


            text-align:center; //to align the text in center
        }
       body {
           color: white;
       }
      .page-header{
            margin-top: 10px;
            text-align: center;
        }

        h2{
            text-align: center;
        }

        form {
            text-align: center;
            margin-bottom: 20px;
        }

        table, td, th {
            border: 1px solid white;
        }

        .ta-info-table{
            margin-left: auto;
            margin-right: auto;
            text-align: center;
        }

        .ta-info-table td {
            padding: 3px;
            
        }

        .date {
            font-size: 25px;
            display:inline-block;
            margin:0 auto;
            
        }
        .get-records-button {
            margin-top: 20px;
        }

        .container{
            margin-top: 80px;

        }

        a{
            text-deocration:none;
        }
    </style>
    <title>TA Calendar</title>
    <script>
        $( function() {
            $( ".date" ).datepicker({
                dateFormat: 'yy-mm-dd',
                onSelect: function(dateText, inst){
                    $("input[name='date']").val(dateText);
                }
            });
        } );

        function validateForm() {
            let formInput = document.forms["form"]["date"].value;
            if (formInput == "") {
                alert("Date must not be empty");
                return false;
            }
        }
    </script>
</head>
<body>
<header>
    <?php page_header_emit(); ?>
  </header>
    <div class="container">
        <h2 class="page-header">Select a date to see TA availabilty and location</h2>
        <form action="" method="POST" name="form" onsubmit="return validateForm()">
            <div class="date"></div><br>
            <input type="text" name="date" id="date" class="get-records-button" maxlength="12" readonly="readonly" <?php if (isset($_POST['date'])) echo 'value="'.$_POST['date'].'"';?>>
            <select name="select_course">
                <?php
                echo "<option value='All courses'";
                if(isset($_POST["select_course"])){if($_POST["select_course"] == 'All courses') {echo "selected='selected'"; }};
                echo ">All courses</option>";









                selC();


                ?>




            </select>
            <input type="submit" name="submit" value="Get Records">
            <input type="hidden" name="csrf_token" value="<?php echo generate_token();?>" />
        </form>
        <form action="export.php" method="POST" onsubmit="exportToCSV()">
            <input type="text" name="date" id="date" class="get-records-button" <?php if (isset($_POST['date'])) echo 'value="'.$_POST['date'].'"';?> hidden>
            <?php $sC=serialize($_POST['select_course']);?>
            <textarea name='select_course' style='display: none;'><?php echo htmlspecialchars($sC,ENT_QUOTES, "UTF-8"); ?></textarea>
            <input type="submit" name="export" value="Download CSV">
            <input type="hidden" name="csrf_token" value="<?php echo generate_token();?>" />
        </form>
        <table class="ta-info-table" aria-describedby="tabledesc">
            <?php
            if(isset($_POST['submit'])){
                createDataTable();
            }
                
            ?>
        </table>
    </div>
<footer class="mastfoot mt-auto">
    <div class="inner">
        <p> (c) Jacob Gordon, Brandon Channer, Carlos Castano, Harpreet Mahal </p>
    </div>
</footer>
</body>
</html>