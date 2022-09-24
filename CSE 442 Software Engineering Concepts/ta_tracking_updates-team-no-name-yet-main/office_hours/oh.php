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

// Submit a query to see if this user is currently holding office hours
$stmt_request = $conn->prepare("SELECT course FROM office_hours WHERE email=? AND actual_end IS NULL AND NOW() <= expected_end");
$stmt_request->bind_param('s', $_SESSION['emailUser']);
$stmt_request->execute();
$result = $stmt_request->get_result();

// If they are holding office hours, we will presume that is the course they want
$in_office_hours = mysqli_num_rows($result) > 0;
if ($in_office_hours) {
  $row = $result->fetch_array(MYSQLI_ASSOC);
  $courseSelected = $row["course"];
} else if (count($_SESSION['courses']) == 1) {
  $courseSelected = $_SESSION['courses'][0];
} else {
  $courseSelected = NULL;
}

if (isset($courseSelected)) {
  $defLen = $_SESSION["default_lengths"][$courseSelected];
} else {
  $defLen = 60;
}

// If a course was selected, get a list of the TAs who they might be subbing in for
$co_tas = array();
if (isset($courseSelected)) {
  $stmt_subs = $conn->prepare("SELECT first_name, last_name, staff_list.email FROM staff_list INNER JOIN registered_users ON staff_list.email = registered_users.email WHERE staff_list.email<>? AND course=? AND faculty=0");
  $stmt_subs->bind_param('ss', $_SESSION['emailUser'], $courseSelected);
  $stmt_subs->execute();
  $result = $stmt_subs->get_result();
  while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
    $co_tas[$row["email"]] = htmlspecialchars($row["first_name"]." ".$row["last_name"]);
  }
}

// Get status message
if (!empty($_SESSION['status'])) {
  switch ($_SESSION['status']) {
    case 'start_succ':
      $statusType = 'alert-success';
      $statusMsg = 'Started Office Hours!';
      break;
    case 'start_err':
      $statusType = 'alert-success';
      $statusMsg = 'An error occurred. Office hour start was not recorded.';
      break;
    case 'end_succ':
      $statusType = 'alert-success';
      $statusMsg = 'Ended Office Hours!';
      break;
    case 'end_err':
      $statusType = 'alert-success';
      $statusMsg = 'An error occurred. Office hours could not be ended in the system.';
      break;
  }
}
$_SESSION['status']=NULL;
?>

<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
  <!-- CALL TO STYLESHEET -->
  <link rel="stylesheet" href="../styles/default.css">
  <link rel="stylesheet" href="../styles/account.css">
  <title>UB TA Tool Account Page</title>
</head>


<!-- NAVBAR HERE -->

<body class="text-center">
  <header>
    <?php page_header_emit(); ?>
  </header>
    <main role="main" class="container" style="margin-top: 80px; margin-bottom: 80px">

  <div class="cover-container d-flex h-100 p-3 mx-auto flex-column">

      <!-- Display status message -->
      <?php
      if (!empty($statusMsg)) {
        echo '<div class="alert ' . $statusType . '" role="alert">' . $statusMsg . '</div>';
      }
      ?>

      <h1 class="cover-heading">Office Hour Management</h1>

      <div class="table-responsive">
        <div class="input-group lead" style="padding-bottom: 50px;">
          <div class="input-group-prepend">
            <span class="input-group-text">Course:</span>
          </div>
          <select class="custom-select" id="course_list" <?php if ($in_office_hours || (count($_SESSION["courses"]) < 2)) { echo 'disabled'; } ?>>
            <?php
            if ((!$in_office_hours) && (count($_SESSION["courses"]) != 1)) {
              echo '<option selected disabled>Choose a course</option>';
            }
            foreach ($_SESSION["courses"] as $course) {
              if ($courseSelected == $course) {
                echo '<option selected value="'.htmlspecialchars($course).'">'.htmlspecialchars($course).'</option>';
              } else {
                echo '<option value="'.htmlspecialchars($course).'">'.htmlspecialchars($course).'</option>';
              }
            }
            ?>
          </select>
      </div>

      <div class="<?php if ($in_office_hours) { echo "collapse"; } else { echo "collapse.show"; } ?> ">
        <div class="card bg-dark text-white">
          <div class="card-body">
            <h5 class="card-title">Start Office Hours</h5>
            <form name="oh_start_post" method="post" action="./start_oh.php">
              <input type="hidden" id="courseSelected" name="courseSelected" <?php if (isset($courseSelected)) { echo 'value="'.$courseSelected.'"'; } ?> />
              <div class="input-group mb-6">
                <label for="location">Office Hour Location:&nbsp;</label>
                <input type="text" name="location" class="form-control" <?php if (empty($_SESSION['location'])) { echo 'placeholder="Carl\'s Corner"'; } else { echo 'value="'.$_SESSION['location'].'"'; } ?> id="location" required />
              </div><br>
              <div class="input-group mb-6">
                <label for="expected_end">Expected Office Hour End:&nbsp;</label>
                <input type="time" name="expected_end" class="form-control" min="<?php echo date('H:i');?>" id="expected_end" value="<?php if (isset($courseSelected)) {echo date('H:i',time()+$defLen*60);} ?>" required />
              </div><br>
              <div class="input-group mb-6">
                <label for="sub_list">Subbing for:&nbsp;</label>
                <select class="custom-select" name="subbing_for" id="sub_list"  <?php if (count($co_tas) == 0) { echo 'disabled'; } ?>>
                  <option selected disabled>Only use this if subbing for another TA</option>
                  <?php
                  foreach ($co_tas as $email => $name) {
                    echo '<option value="'.$email.'">'.$name.'</option>';
                  }
                  ?>
                </select>
              </div><br>
              <input type="submit" name="start" id="start" class="btn btn-success" value="I solemnly swear I am up to no good"
                      <?php if (!isset($courseSelected)) { echo 'disabled'; }?> />
            </form>
          </div>
        </div>
      </div>
      <div class="<?php if ($in_office_hours) { echo "collapse.show"; } else { echo "collapse"; } ?> ">
        <div class="card bg-dark text-white">
          <div class="card-body">
            <h5 class="card-title">End <?php echo htmlspecialchars($_SESSION['courseSelected']); ?> Office Hours</h5>
            <form name="oh_end_post" method="post" action="./end_oh.php">
              <input type="submit" name="end" id="end" class="btn btn-success" value="Mischief Managed" />
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer class="mastfoot mt-auto">
    <div class="inner">
      <p> (c) Matthew Hertz</p>
    </div>
  </footer>

  <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
</body>
</html>
<script>
$(document).ready(function() {
  $('#course_list').change(function() {
    // Prevent changes while we are making changes...
    let courseSelected = $('#courseSelected');
    courseSelected.val($('#course_list').val());
    let startButton = $('#start');
    startButton.prop('disabled', false);
    $.ajax({
      url: "getCourseData.php",
      method: "POST",
      dataType: "JSON",
      data: { course: $('#course_list').val() },
      success: function(obj) {
        let expected = $('#expected_end');
        let end_time = new Date(Date.now());
        end_time.setMinutes(end_time.getMinutes() + obj['length']);
        let time_str = end_time.toTimeString().substring(0,5);
        expected.val(time_str);
        let select = $('#sub_list');
        select.prop('disabled', false);
        select.empty();
        let data = obj['rows'];
        for (let row of data) {
          select.append(row);
        }
      }
    });
  });
});
</script>
