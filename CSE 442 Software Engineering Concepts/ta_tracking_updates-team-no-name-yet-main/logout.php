<?php
session_start();
session_unset();
session_destroy();

require "lib/constants.php";

header("Location: " . SITE_HOME . "/start.php");
?>
