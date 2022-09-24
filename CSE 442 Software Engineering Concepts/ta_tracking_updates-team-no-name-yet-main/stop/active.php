<?php
session_start();
require "../lib/database.php";
require "../lib/pageHeader.php";
require "../lib/constants.php";
require "../lib/loginStatus.php";
$conn = connect_to_database();
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
        .blink_me {
            color: #2ba805;
            animation: blinker 1s linear infinite;
        }

        @keyframes blinker {
            50% {
                opacity: 0;
            }
        }
        .container{
            margin-top:80px;
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
        }

        td, th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }

        tr:nth-child(even) {
            background-color: #dddddd;
        }
        #myDIV {
            width: 100%;
            padding: 50px 0;
            text-align: center;
            background-color: lightblue;
            margin-top: 20px;

        }
        .button {
            background-color: #1c87c9;
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
        @keyframes glowing {
            0% {
                background-color: #2ba805;
                box-shadow: 0 0 5px #2ba805;
            }
            50% {
                background-color: #49e819;
                box-shadow: 0 0 20px #49e819;
            }
            100% {
                background-color: #2ba805;
                box-shadow: 0 0 5px #2ba805;
            }
        }
        .button {
            animation: glowing 1300ms infinite;
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
    function myFunction() {
        var x = document.getElementById("form");
        if (x.style.display === "none") {

            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
        if (document.getElementById("myDIV").style.display==="contents"){
            document.getElementById("myDIV").style.display="none";
        }
    }
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
    <button type="submit" class="button"  onclick="myFunction()">TAs Active now!!</button>
    <form action = "" method="POST" name="form" id="form" style="display:none">
        <select name="select_location">
            <option value="UB 300">UB 300</option>
            <option value="UB 243">UB 243</option>
            <option value="UB 145">UB 145</option>
            <option value="UB 439">UB 439</option>
            <option value="UB 233">UB 233</option>
            <option value="UB 123">UB 123</option>
            <option value="UB 08">UB 08</option>
            <option value="UB 10">UB 10</option>
        </select>


        <input type="submit" name="submit" value="Select Location"  ></input>
    </form>
</div>
<div id="myDIV" style="display:none">
    <table>
        <tr>
            <th style='background-color:Black'>Email</th>
            <th style='background-color:Black'>Location</th>
            <th style='background-color:Black'>Start Time</th>
            <th style='background-color:Black'>Actual End</th>
        </tr>
        <?php
        if(isset($_POST["submit"])){

            $get_location = $_POST['select_location'];


            $query = mysqli_query($conn,"SELECT course, email, location ,start_time, expected_end, actual_end FROM office_hours WHERE location = '$get_location' ORDER BY start_time");

            if(!empty($query)){
                while($row = $query->fetch_assoc()){

                    echo "<tr><td style='background-color:Black'>" . $row['email'] . "</td><td style='background-color:Black'>" .$row['location'] . "</td><td style='background-color:Black'>" .date("Y-d-m h:i:s a", strtotime($row['start_time'])) .
                        "</td><td style='background-color:Black'>" .date("Y-d-m h:i:s a", strtotime($row['actual_end'])). "</td></tr>";

                }
            }else{
                echo "<tr><td>None</td><td>None</td><td>None</td><td>
                        None</td><td>None</td><td>None</td></tr>";
                echo "whack";
            }
            echo '<script type="application/javascript">displayTable();</script>';

        }
        ?>

    </table>

</div>



</body>
</html>