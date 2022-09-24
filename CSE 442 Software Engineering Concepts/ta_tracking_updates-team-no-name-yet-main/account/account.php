<?php
session_start();
require "../lib/database.php";
require "../lib/constants.php";
require "../lib/pageHeader.php";
require "../lib/loginStatus.php";

$conn = connect_to_database();

if (!is_logged_in()) {
  header("Location: " . SITE_HOME . "/login.php");
  exit();
}

if (!empty($_SESSION['status'])) {
  switch ($_SESSION['status']) {
    case 'upload_succ':
      $statusType = 'alert-success';
      $statusMsg = 'Image has been uploaded successfully.';
      break;
    case 'upload_err':
      $statusType = 'alert-warning';
      $statusMsg = 'An internal error prevented uploading the image to the database.';
      break;
    case 'invalid_size':
      $statusType = 'alert-danger';
      $statusMsg = 'File size was larger than the system allows (must be under 10MB).';
      break;
    case 'invalid_file':
    case 'invalid_file_type':
      $statusType = 'alert-danger';
      $statusMsg = 'File was not one that the system recognizes as an image.';
      break;
    case 'name_change_succ':
      $statusType = 'alert-success';
      $statusMsg = 'Name has been changed successfully.';
      break;
    case 'name_change_err':
      $statusType = 'alert-danger';
      $statusMsg = 'Database could not update the name due to an internal error.';
  }
}
$_SESSION['status'] = NULL;
?>

<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>
    <!-- CALL TO STYLESHEET -->
    <link rel="stylesheet" href="<?php echo SITE_HOME;?>/styles/default.css">
    <title>UB TA Tool Account Page</title>
</head>

<body>
  <header>
      <?php page_header_emit(); ?>
  </header>
  <main role="main" class="container" style="margin-top: 80px; margin-bottom: 80px">
    <!-- display error msg if necessary -->
    <?php
    if (!empty($statusMsg)) {
      echo '<div class="alert '.$statusType.'" role="alert">'.$statusMsg.'</div>';
    }
    ?>

    <div class="form-row justify-content-center">
      <h1>Modify Account Details</h1>
    </div>
    <form action="./changeDetails.php" method="post">
      <div class="form-inline justify-content-center align-items-center" style="margin-top: 13px; margin-bottom: 13px;">
        <div class="form-group col-md-auto">
          <label for="inputFirstName">First Name:&nbsp;</label>
          <input type="text" class="form-control" name="inputFirstName" placeholder="<?php echo htmlspecialchars($_SESSION['firstName']); ?>">
        </div>
        <div class="form-group col-md-auto">
          <label for="inputLastName">Last Name:&nbsp;</label>
          <input type="text" class="form-control" name="inputLastName" placeholder="<?php echo htmlspecialchars($_SESSION['lastName']); ?>">
        </div>
        <div class="form-group col-md-auto">
          <label for="inputLocation">Default Office Hour Location:&nbsp;</label>
          <input type="text" class="form-control" name="inputLocation" placeholder="<?php echo htmlspecialchars($_SESSION['location']); ?>">
        </div>
        <div class="col-md-2 mt-1">
          <button type="submit" name="submitName" class="btn btn-primary">Update Details</button>
        </div>
      </div>
    </form>
    <br>
    <div class="row justify-content-center mt-3">
      <div class="col-sm-3">
        <img class="img-fluid" src="<?php echo SITE_HOME;?>/lib/displayPic.php?email=<?php echo $_SESSION['emailUser']; ?>" />
      </div>
    </div>
    <form action="./changePic.php" method="post" enctype="multipart/form-data">
      <div class="form-inline justify-content-center align-items-center" style="margin-top: 13px; margin-bottom: 13px;">
        <div class="form-group col-md-auto">
          <label for="file">New image file:&nbsp;</label>
          <input type="file" name="file" class="form-control-file" id="file" accept="image/*" capture required />
        </div>
        <div class="col-md-2">
          <button type="submit" class="btn btn-primary" name="picSubmit">Update Image</button>
        </div>
      </div>
    </form>
  </main>
  <footer class="mastfoot mt-auto">
    <div class="row justify-content-center">
      <div class="col-md-auto">
        <p> (c) Matthew Hertz</p>
      </div>
    </div>
  </footer>
</body>
</html>
