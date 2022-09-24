<?php 
    session_start();
    require "../lib/database.php";
    require "../lib/constants.php";
    require "../lib/pageHeader.php";
    require "../lib/loginStatus.php";
    require "../csrfToken.php";

    function createCourse(){
        $connect = connect_to_database();
        $stmt = '';
        $token = generateRandomToken();

        if($_POST['token'] == $token){
            if(isset($_POST['submit'])){
                $email = htmlspecialchars($_POST['email']);
                $semester = htmlspecialchars($_POST['semester']);
                $course = htmlspecialchars($_POST['course']);

                $query = "INSERT INTO add_course (email, semester, course) VALUES (?, ?, ?)";

                $stmt = $connect->prepare($query);
                $stmt->bind_param("sss", $email, $semester, $course);
            }
        }
    
        if($stmt->execute()){
            $stmt->close();
            return "<h2>New Course Added</h2>";
        }else{
            return "<h2>Error! Course not added</h2>";
        }
    }
?>
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
        .container{margin-top: 80px;}
        form{
            text-align: center;
        }
        input{
            margin: 5px;
            width: 300px;
        }

        .submit-button{
            width: 100px;
        }

        h3,h2,p {
            text-align: center;
        }

        .footer {
            position: fixed; 
            bottom: 0; 
            width:100%;
        }
    </style>
    <script>
         function validateForm() {
            let emailInput = document.forms["form"]["email"].value;
            let semesterInput = document.forms["form"]["semester"].value;
            let courseInput = document.forms["form"]["course"].value;

            if (emailInput == "" || semesterInput == "" || courseInput == "") {
                alert("No blank input allowed");
                return false;
            }
        }
    </script>
    <title>Add Course</title>
</head>
<body>
    <header>
        <?php page_header_emit(); ?>
  </header>
    <div class="container">
        <h2>Add course to the system</h2>
        <form action="" method="POST" name="form" onsubmit="return validateForm()">
            <label for="email">Email</label><br>
            <input type="text" name="email" id="email"><br>
            <label for="semester">Semester</label><br>
            <input type="text" name="semester" id="semester"><br>
            <label for="course">Course Name</label><br>
            <input type="text" name="course" id="course"><br><br>
            <input type="hidden" name="token" value="<?=generateRandomToken(); ?>">
            <input type="submit" value="Add Course" name="submit" class="submit-button">
        </form>
    </div>
    <p class="footer">(c) Jacob Gordon, Brandon Channer, Carlos Castano, Harpreet Mahal </p>
    <?php echo createCourse(); ?>
</body>
<script>
    if ( window.history.replaceState ) {
    window.history.replaceState( null, null, window.location.href );
    }
</script>