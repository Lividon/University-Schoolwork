<?php 
     function generateRandomToken(){
        if(empty($_SESSION['token'])){
            $_SESSION['token'] = bin2hex(random_bytes(32));
            return $_SESSION['token'];
        }
        return null;
    }
?>