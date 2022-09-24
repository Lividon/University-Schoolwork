<?php
session_start();
require "lib/database.php";
require "lib/constants.php";
require "lib/taListBuilder.php";
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
//Code 1 indicates invalid/unknown email or UBIT, code 2 indicates failure to connect to the server due to form failure or other complications
if(!empty($_SESSION["failurecode"])){
    if($_SESSION["failurecode"] == 1){
        echo('<div class="alert" style="font-size: 20px"><span Class = "closebtn" onclick = "this.parentElement.style.display=\'none\';">&times;</span><strong>Login failed: </strong>Invalid UBIT entered. </div>');   
        $_SESSION["failurecode"] = 0;
    }
    if($_SESSION["failurecode"] == 2){
        echo('<div class="alert" style="font-size: 20px"><span Class = "closebtn" onclick = "this.parentElement.style.display=\'none\';">&times;</span><strong>Login failed: </strong>Failed to connect to server or no UBIT entered. </div>');   
        $_SESSION["failurecode"] = 0;
    }



}
?>


<html lang ="en">
<head>
    <title>Login screen</title>
    <link rel="stylesheet" href="styles/default.css">
</head>
<header>
    <h1 style="color:0B1950;background-color:375EF9;">University at Buffalo TA system</h1>
</header>     
<body>
    <form method="post" action="start.php">
        <input type="hidden" name="csrf_token" value="<?php echo generate_token();?>" />
        <label for="UBIT">UBIT/Person Number: </label><br>
        <input type="text" id="UBIT" name="UBIT">
        <input type="submit" value="Login">    
</form>
</body>
</html>