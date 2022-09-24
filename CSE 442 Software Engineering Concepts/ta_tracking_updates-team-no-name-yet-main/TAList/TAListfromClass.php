<?php
session_start();
require "../lib/database.php";
require "../lib/pageHeader.php";
require "../lib/constants.php";
require "../lib/loginStatus.php";
$conn = connect_to_database();
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

function getTA()
{
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










    $conn = connect_to_database();
if($_POST["select_course"]=="All courses"){
    $selectedTA = htmlspecialchars($_POST['TAname'],ENT_QUOTES, "UTF-8");
    $query = "SELECT StartOH, EndOH, Location FROM TA_Location_Time WHERE Name = ? and (course=? or course=?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sss", $selectedTA,$temp_ar[0],$temp_ar[1]);
    $stmt->execute();

}else{
    $selectedTA = htmlspecialchars($_POST['TAname'],ENT_QUOTES, "UTF-8");
    $selectedCourse=htmlspecialchars($_POST['select_course'],ENT_QUOTES, "UTF-8");
    $query = "SELECT StartOH, EndOH, Location FROM TA_Location_Time WHERE Name = ? and course=?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ss", $selectedTA,$selectedCourse);
    $stmt->execute();
}


        $result = $stmt->get_result();
        $stmt->close();
        return $result;
}  
?>
<html lang="en">
<head>

<title>TA List</title>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="../styles/default.css">
    <meta charset="UTF-8">

<style>
    footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 2.5rem;

        text-align:center; //to align the text in center
    }
table, th, td {
  border: 2px solid black;
  border-collapse: collapse;
  

}
table{
	margin-top:8;
	margin-left:auto;
	margin-right:auto;

}
th, td {
  padding: 5px;
  border: 1px solid black;
}

.div {
     margin-top:80;
     text-align:center;
}
</style>
</head>

<body>
<header>
    <?php page_header_emit(); ?>
    </header>
    <div class = "div">
    <h1>Your TAs are here, click one to see their information</h1>
    <form method = "post">
        <select name="select_course">
            <?php
            echo "<option value='All courses'";
            if(isset($_POST["select_course"])){if($_POST["select_course"] == 'All courses') {echo "selected='selected'"; }};
            echo ">All courses</option>";









            selC();

            ?>




        </select>
    <select name = "TAname">
    <option selected disabled hidden style='display:none' value = "-1">
    <?php
    $names = mysqli_query($conn, "SELECT first_name, last_name FROM TA_List");
	       if(!empty($names))
                        {
                                while($row = $names->fetch_assoc())
                                {
                                        echo "<option value='".$row['first_name'] ." " .$row['last_name'] ."'>" .$row['first_name'] . " " .$row['last_name'] . "</option>";
                                }
                        }
    ?>
			</form>
            <input type="hidden" name="csrf_token" value="<?php echo generate_token();?>" />
			<input type = "submit" name = "input">
			</select>
			<table class = "TA_location_hours">
               <th>Start Time</th>
               <th>End Time</th>
               <th>Location</th>
	       <?php
		if(IsSet($_POST['input']))
            if ($_POST["csrf_token"] != $_SESSION["csrf_token"]) {

                // Reset token
                unset($_SESSION["csrf_token"]);
                die("CSRF token validation failed");
            }
			{
			 $TA = $_POST['TAname'];
			 $result = getTA();
			 if(empty($TA))
                         {
                                echo "<br>Please Select a TA from the dropdown menu<br>";
                         }
			 elseif($result->num_rows == 0)
			 {
				echo"<br>" .$TA. " has not held office hours<br>";
				unset($TA); 
				 
			 }
			 else
			 {
			 echo "<br>We're looking at " .$TA . "'s location and times now: <br>";
			 $_SESSION['name'] = $TA;
			 while ($row = $result->fetch_assoc())
			       {
				echo "<tr>";
              			echo "<td>".$row['StartOH']."</td>";
                		echo "<td>".$row['EndOH']."</td>";
                		echo "<td>".$row['Location']."</td>";
                		echo "</tr>";
			       }
			       echo"</table>";
			       echo "<form action ='download.php' method = 'POST'>";
                                    echo "<input type = 'submit' name = 'download' value = 'OHs' style = 'display: none'>";
                                    echo"</form>"; 
               	       }
		       }	      
	       ?>
	       <form action = "csv.php" method = "POST">

               <input type = "submit" name = "DownloadCSV" value ="Download Student CSV here">
               <input type="hidden" name="csrf_token" value="<?php echo generate_token();?>" />
               </form>
	       </div>

</body>
<footer class="mastfoot mt-auto">
    <div class="inner">
        <p> (c) Jacob Gordon, Brandon Channer, Carlos Castano, Harpreet Mahal </p>
    </div>
</footer>
</html>
