<?php
function connect_to_database() {
  // Create database connection
  $DATABASE_HOST = "oceanus.cse.buffalo.edu"; // if using online server, need to change the name
  $DATABASE_USER = "jpgordon"; // you can chnage to your ubit and person number below
  $DATABASE_PASS = "50273072";
  $DATABASE_NAME = "cse442_2021_summer_team_e_db";
  // Try and connect using the info above.
  mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
  try {
    $con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
    if ( mysqli_connect_errno() ) {
         // If there is an error with the connection, stop the script and display the error.
         die ('Failed to connect to MySQL: ' . mysqli_connect_error());
    }
    return $con;
  } catch (Exception $e) {
    die ('Failed to connect to MySQL: ' . $e->getMessage());
  }
}
?>
