<?php

require_once 'constants.php';

function is_logged_in() {
  // First, check if the user is already logged in this session
  if (isset($_SESSION['emailUser'])) {
    $cur_time = $_SERVER['REQUEST_TIME'];
    // If they are logged in, check that the session has not timed out.
    if (isset($_SESSION['LAST_ACTIVITY']) &&
        (($cur_time - $_SESSION['LAST_ACTIVITY']) < SESSION_EXPIRATION_SECONDS)) {
      $_SESSION['LAST_ACTIVITY'] = $cur_time;
      return true;
    } else {
      session_unset();
      session_destroy();
      $_SESSION['SESSION_TIMEOUT'] = 'Session timed out. Please log in again.';
      header("Location: " . SITE_HOME . "/login.php");
    }
  }
   return isset($_SESSION['emailUser']);
 }
?>
