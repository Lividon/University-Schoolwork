

<?php
//Formatting for the input courtesy of https://stackoverflow.com/questions/10868640/align-html-input-fields-by
session_start();
require "lib/database.php";
require "lib/constants.php";
require "lib/pageHeader.php";
require "lib/loginStatus.php";

//getHours fetches the required data from the table
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
function getHours(){
    $conn = connect_to_database();
    if(isset($_POST["hoursubmit"])){
        if ($_POST["csrf_token"] != $_SESSION["csrf_token"]) {

            // Reset token
            unset($_SESSION["csrf_token"]);
            die("CSRF token validation failed");
        }
        //This checks if both of the dates are actually full
        if(strlen($_POST["date1"]) == 0 || strlen($_POST["date2"]) == 0){
            echo('One or both dates are blank');
        }else if($_POST["date1"] > $_POST["date2"]){
            echo("Impossible range entered.");
        }else{
            //Checking for proper input and doing some basic formatting before further computation
            $date1 = $_POST["date1"];
            $date2 = $_POST["date2"];
            $date1 = $date1 . " 00:00:00";
            $date2 = $date2 . " 24:59:59";
           //Getting courses for user
            $email = $_SESSION["emailUser"];
            $stmt_request = $conn->prepare("SELECT course FROM staff_list WHERE email= ?");
            $stmt_request->bind_param('s',$email);
            $stmt_request->execute();
            $result = $stmt_request->get_result();
            $courseI = "";
            //Assistance in reading from https://www.php.net/manual/en/function.mysql-fetch-assoc.php 
            while($row = $result->fetch_assoc()){
                $courseI = $courseI . $row["course"] . "/";
            }
            $courses = explode("/", $courseI);
            //Getting start and end times for each course

            $result = $conn->query("SELECT start_time, actual_end, course FROM office_hours");
            $totalTime = 0;
            //Here we'll convert each start/endtime to the hour/minute/second format, transform it into a valid number, and then use that number to increment totalTime
            //Conversion formula courtesy of https://write.corbpie.com/php-converting-hours-minutes-seconds-string-to-seconds/  
            while($row = $result->fetch_assoc()){
                $passed = 0;
                foreach($courses as $curC){
                    if($curC == $row["course"] && $row["start_time"] > $date1 && $row["start_time"] < $date2){
                        $passed = 1;
                    }
                }
                if($passed == 1){
                    $time1s = substr($row["start_time"], 11);
                    $time2s = substr($row["actual_end"], 11);     
                    $time1a = explode(':',$time1s);
                    $time2a = explode(':',$time2s);
                    $seconds1 = $time1a[0] * 3600 + $time1a[1] * 60 + $time1a[2];
                    $seconds2 = $time2a[0] * 3600 + $time2a[1] * 60 + $time2a[2];
                    $totalTime = $totalTime + (($seconds2-$seconds1)/60);
                }
            }
            //number_format ref from https://www.php.net/manual/en/function.number-format.php
            echo("Your TA's have been active for " . floor($totalTime/60) . " hours and " . floor($totalTime % 60) . " minutes.");
            
        }
        
            
        }
        


    }
    




?>

<!doctype html>
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


          .container{
        margin-top:80px;
        margin-bottom:500px;
    
    }

    td{
    text-align:center;
    padding:5px;
    }

    table{
        margin:auto;
    }


    
  </style>
  <title>Total TA Hours</title>
  
<script>
         $(function() {
            $( "#datepicker" ).datepicker({dateFormat: 'yy-mm-dd'});
            $( "#datepicker2" ).datepicker({dateFormat: 'yy-mm-dd'});
         });
      </script>
   </head>
</head>

<body class="text-center">
  <header>
    <?php page_header_emit(); ?>
  </header>
 <div class="container">
    <h3>Select a range of dates to see the total office hours in that period for your TA's</h3>
    <table>
    <form action="" method="post" autocomplete="off">
    <input type="hidden" name="csrf_token" value="<?php echo generate_token();?>" />
   <tr><td> Starting Date:</td><td> <input type="text" id = "datepicker" name="date1"></td>
    <td>Ending Date:</td><td> <input type="text" id="datepicker2" name="date2"> </td></tr>

    </table>
    <br>
    <input type="submit" name="hoursubmit">
    <br>
    </form>
    
    <?php getHours();?>

 </div>

 <footer class="mastfoot mt-auto">
    <div class="inner">
      <p> (c) Jacob Gordon, Brandon Channer, Carlos Castano, Harpreet Mahal </p>
    </div>
  </footer>


</body>
</html>