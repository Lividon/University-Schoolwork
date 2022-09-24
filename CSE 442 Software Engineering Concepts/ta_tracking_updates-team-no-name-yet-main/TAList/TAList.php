<?php 
    session_start();
	require "../lib/database.php";
	require "../lib/constants.php";
	require "../lib/pageHeader.php";
	require "../lib/loginStatus.php";
    $conn = connect_to_database();
?>

<html lang="en">
<head>
    <title>TA List</title>
</head>
<body>
<header>
    <?php page_header_emit(); ?>
  </header>
    <h1>Look up a TA  by first name here:</h1>
    <form method = "post" name = "form">
        <input type = "text" id = "Name" name ="Name">
    </form>
    <?php
	if(isset($_POST["Name"]))
		{
			$query = mysqli_query($conn, "SELECT first_name, last_name, email FROM registered_users WHERE faculty = 1");
			if(!empty($query))
			{
				echo "There was a TA, but I'm still trying to figure out how to get the value out of the string lol";
			}
			else
			{
				echo "There was no TA with the name requested, try again";
			}
		}
    ?>
</body>
</html>
