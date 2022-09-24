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
        $_SESSION['token'] = bin2hex(random_bytes(32));
        $_SESSION["token"] = $token;

    } else {
        // Reuse the token
        $token = $_SESSION["csrf_token"];
    }
    return $token;
}

function getTAHours()
{
	$conn = connect_to_database();
        $selectedTA = htmlspecialchars($_POST['TAname'],ENT_QUOTES, "UTF-8");
        $query = "SELECT StartOH, EndOH, Location FROM TA_Location_Time WHERE Name = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $selectedTA);
	$stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        return $result;
}
function getTAHoursNums()
{
        $conn1 = connect_to_database();
        $selectedTA = htmlspecialchars($_POST['TAname'],ENT_QUOTES, "UTF-8");
        $query = "SELECT StartOH, EndOH FROM TA_List_Time_Numbers WHERE Name = ?";
        $stmt = $conn1->prepare($query);
        $stmt->bind_param("s", $selectedTA);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        return $result;
}
function getHours()
{
	$result = getTAHoursNums();
	
	$start = str_replace("-","",$_POST['Bday']);
	$end = str_replace("-","",$_POST['Eday']);
	if((strlen($start) + strlen($end)) != 16)
	{
		echo "Incorrect length for dates";
		return -1;
	}
	if(!is_numeric($start) || !is_numeric($end))
	{
		echo "A non date was entered";
		return -2;
	}
	if($end < $start)
	{
	echo "<br>" . "The dates are in the wrong order";
	return -3;
	}
	$start = $start . " 00:00:00";
	$end = $end . " 24:59:59";
	$count = 0;
	while($row = $result->fetch_assoc())
	{
		$v1 = str_replace("-","", $row["StartOH"]);
		if($v1 > $start && $v1 < $end)
      		{
			$time1s = substr($row["StartOH"], 11);
                                   $time2s = substr($row["EndOH"], 11);
                                   $time1a = explode(':',$time1s);
                                   $time2a = explode(':',$time2s);
                                   $seconds1 = $time1a[0] * 3600 + $time1a[1] * 60 + $time1a[2];
                                   $seconds2 = $time2a[0] * 3600 + $time2a[1] * 60 + $time2a[2];
                                   $count = $count + (($seconds2-$seconds1));
			}
	}
	return floor(($count)/3600);
}  
?>
<html lang="en">
<head>
<title>TA List</title>
<meta charset="UTF-8">
	  <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous\
">
    <link rel="stylesheet" href="../styles/default.css">
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<script>
$( function() {
    $( "#Bday" ).datepicker({ dateFormat: 'yy-mm-dd' }).val();
    $( "#Eday" ).datepicker({ dateFormat: 'yy-mm-dd' }).val();
  } );
</script>
<style>
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
.footer {
            position: fixed; 
            bottom: 0; 
            width:100%;
        }
</style>
</head>
<body>
<header>
    <?php page_header_emit(); ?>
    </header>
<div class = "div">
<h1>Select a TA</h1>
    <form method = "POST">
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
    <input type = "hidden" name = "blank for position">
    <br>
    <div>Please click on the left textbox to choose a beginning date, and the right textbox to choose an end date<div>
    <br>
    <input type = "text" name = "Bday" id = "Bday" readonly="readonly" style = "margin-right: 100px">
    <input type = "text" name = "Eday" id = "Eday" readonly="readonly" style = "margin-left: 100px">
    <br>
    <input type = "submit" name = "submit">
    </form>
    </select>
    <?php
    if(IsSet($_POST['submit']))
		{
			$TA = $_POST['TAname'];
			$Bday = $_POST['Bday'];
			$Eday = $_POST['Eday'];
			$_SESSION['name'] = $TA;
			if(empty($TA))
                         {
                                echo "<br>Please Select a TA from the dropdown menu<br>";
                         }
			 elseif(empty($Bday) || empty($Eday))
			 {
			 echo "<br>Please make sure you have entered dates into the above fields<br>";
			 }
			 else
			 {
			 $hours = getHours();
			 if($hours == "" || $hours == 0)
			 {
			 echo "<br>" .$TA . " hasn't held office hours yet or has not held office hours in within the specified timeframe";
			 }
			 elseif($hours == -3)
			 {
			 }
			 else
				{
				echo "<br>" .$TA . "'s total hours is: ";
			 	echo $hours;
				}
			}
		}
    ?>
</div>
<footer class="mastfoot mt-auto" style = "position:fixed; bottom:0; width:100%">
    <div class="inner">
      <p> (c) Jacob Gordon, Brandon Channer, Carlos Castano, Harpreet Mahal </p>
    </div>
  </footer>
</body>
</html>