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

// Check that the user is a faculty member and that this is one of their courses.
if ((!$_SESSION["faculty"]) || !isset($_SESSION["courses"]) || !isset($_SESSION['ta_lists'])) {
    http_response_code(403);
    echo "Request forbidden: Course does not include user as an instructor";
    exit();
}

$statusType = '';
$statusMsg = '';

// Get status message
if (!empty($_SESSION['status'])) {
    switch ($_SESSION['status']) {
        case 'add_succ':
            $statusType = 'alert-success';
            $statusMsg = 'TA has been added successfully.';
            break;
        case 'import_succ':
            $statusType = 'alert-success';
            $statusMsg = 'TA data was imported successfully.';
            break;
        case 'update_succ':
            $statusType = 'alert-success';
            $statusMsg = 'Course data was updated successfully.';
            break;
        case 'err':
            $statusType = 'alert-danger';
            $statusMsg = 'Some problem occurred, please try again.';
            break;
        case 'invalid_file':
            $statusType = 'alert-danger';
            $statusMsg = 'Please upload a valid CSV file.';
            break;
        case 'improper_format':
            $statusType = 'alert-danger';
            $statusMsg = 'File row(s) did not have 3 columns or 3rd column was not a valid email.';
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
  <link rel="stylesheet" href="../styles/default.css">
  <link rel="stylesheet" href="../styles/faculty.css">
  <title>UB TA Tool Faculty Page</title>
</head>


<!-- NAVBAR HERE -->

<body class="text-center">
  <header>
    <?php page_header_emit(); ?>
  </header>
  <main role="main" class="container" style="margin-top: 80px; margin-bottom: 80px">
    <div class="cover-container d-flex h-100 p-3 mx-auto flex-column">

      <!-- display error msg if necessary -->
      <?php
      if (!empty($statusMsg)) {
        echo '<div class="alert '.$statusType.'" role="alert">'.$statusMsg.'</div>';
      }
      ?>

      <h1 class="cover-heading">Manage Course</h1><br />
      <div class="input-group lead">
        <div class="input-group-prepend">
          <span class="input-group-text">Course:</span>
        </div>
        <select class="custom-select" id="course_list">
          <?php
          if (!isset($_SESSION['courseSelected'])) {
            echo '<option selected disabled>Choose a course</option>';
          }
          foreach ($_SESSION["courses"] as $course) {
            if ($_SESSION['courseSelected'] == $course) {
              echo '<option selected value="'.htmlspecialchars($course).'">'.$course.'</option>';
            } else {
              echo '<option value="'.htmlspecialchars($course).'">'.$course.'</option>';
            }
          }
          ?>
        </select>
        <div class="input-group-append">
          <button class="btn-clipboard btn-outline-info btn-sm" title="" data-original-title="Copy to clipboard" onclick="copyToClipboard()">Copy URL</button>
        </div>
      </div>
      <div class="input-group-sm" style="padding-bottom: 50px;">
        <input type="text" class="form-control" id="ta_list_url" aria-label="Small" aria-describedby="ta_list_url_desc" readonly></input>
      </div>

      <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="pills-ta-tab" data-toggle="pill" href="#pills-ta" role="tab" aria-controls="pills-ta" aria-selected="true">TA List</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="pills-data-tab" data-toggle="pill" href="#pills-data" role="tab" aria-controls="pills-data" aria-selected="false">Course Data</a>
        </li>
      </ul>
      <div class="tab-content" id="pills-tabContent">
        <div class="tab-pane fade show active" id="pills-ta" role="tabpanel" aria-labelledby="pills-ta-tab">
          <div class="table-responsive">
            <!-- Data list table -->
            <table class="table table-bordered table-active" id="ta_table">
              <thead class="thead-dark">
                <tr>
                    <th width="5%"><button type="button" name="delete_all" id="delete_all" class="btn btn-danger btn-xs" disabled>Delete</button></th>
                    <th width="30%">First Name</th>
                    <th width="30%">Last Name</th>
                    <th width="35%">Email</th>
                </tr>
              </thead>
              <tbody>
                <tr><td colspan="4">No TAs found...</td></tr>
              </tbody>
            </table>
            <br/>

              <!-- submit form -->
            <div class="accordian" id="AddAccordian">
              <div class="card bg-dark text-white">
                <div class="card-header" id="addTA">
                  <h2 class="mb-0">
                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#manualAdd" aria-expanded="true" aria-controls="manualAdd">
                      Manually Add a TA
                    </button>
                  </h2>
                </div>
                <div id="manualAdd" class="collapse" aria-labelledby="addTA" data-parent="#AddAccordian">
                  <div class="card-body">
                    <form method="post" action="./add.php">
                      <div class="form-group">
                        <label for="first_name">First name</label>
                        <input type="text" name="first_name" class="form-control" placeholder="First Name" required />
                      </div>
                      <div class="form-group">
                        <label for="last_name">Last name</label>
                        <input type="text" name="last_name" class="form-control" placeholder="Last Name" required />
                      </div>
                      <div class="form-group">
                        <label for="email">UB Email Address</label>
                        <input type="email" name="email" pattern="^[a-zA-Z0-9]+@buffalo.edu" class="form-control" placeholder="ta_email@buffalo.edu" size="64" maxLength="64" required />
                      </div>
                      <div class="form-group">
                        <input type="submit" name="add" id="add" class="btn btn-success" value="Add TA" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div class="card bg-dark text-white">
                <div class="card-header" id="importTA">
                  <h2 class="mb-0">
                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#importAdd" aria-expanded="true" aria-controls="importAdd">
                      Import TAs from CSV
                    </button>
                  </h2>
                </div>
                <div id="importAdd" class="collapse" aria-labelledby="import" data-parent="#AddAccordian">
                  <div class="card-body">
                    <form action="./importData.php" method="post" enctype="multipart/form-data">
                      <label for="file">CSV File to Import</label>
                      <input type="file" name="file" required />
                      <input type="submit" class="btn btn-success" name="importSubmit" value="Import From File">
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="pills-data" role="tabpanel" aria-labelledby="pills-data-tab">
          <form action="./changeCourseDetails.php" method="post">
            <div class="form-group row">
              <label for="input_message">Message for Students:&nbsp;</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" id="input_message" name="input_message"></input>
              </div>
            </div>
            <div class="form-group row">
              <label for="input_minutes">Default Minutes TA is Active:&nbsp;</label>
              <div class="col-sm-3">
                <input type="number" class="form-control" id="input_minutes" name="input_minutes" min="5" max="240" step="5"></input>
              </div>
            </div>
            <div class="form-group row">
              <label for="input_location">Default TA Location:&nbsp;</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" id="input_location" name="input_location"></input>
              </div>
            </div>
            <div class="row col-md-2 mt-1">
              <button type="submit" name="submitName" class="btn btn-primary">Update Data</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>

  <footer class="mastfoot mt-auto">
    <div class="inner">
      <p> (c) Fei Ji, Tim Losito, Preston Sergent, Lloyd Tanedo, Kevin Truong </p>
    </div>
  </footer>

  <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
</body>

</html>

<script>
  function copyToClipboard() {
    /* Select the text in our text field */
    let textfield = document.getElementById("ta_list_url");
    textfield.focus();
    textfield.setSelectionRange(0, textfield.value.length+1);

    /* Copy the text inside the text field */
    document.execCommand("copy");
  }
  function toggleCheckbox(obj) {
    let row = obj.parentElement.parentElement;
    let disable_btn = true;
    if (obj.checked) {
     row.classList.add("removeRow");
     disable_btn = false;
    } else {
      let row = obj.parentElement.parentElement;
      row.classList.remove("removeRow");

      let checkboxes = document.getElementsByClassName("delete_checkbox");
      for (let checkbox of checkboxes) {
        if (checkbox.checked) {
          disable_btn = false;
        }
      }
    }
    let delete_btn = document.getElementById('delete_all');
    delete_btn.disabled = disable_btn;
  }
  function receive_course_data(obj) {
    let site_url = obj.url;
    $("#ta_list_url").val(site_url);

    let site_message = obj.message;
    $("#input_message").val(site_message);

    let site_minutes = obj.minutes;
    $("#input_minutes").val(site_minutes);

    let site_location = obj.location;
    $("#input_location").val(site_location);

    $("#ta_table tbody").empty();
    let row_data = obj.rows;
    for (let row of row_data) {
      $("#ta_table tbody").append(row);
    }
    let add_one_btn = $('#add');
    add_one_btn.prop('disabled', false);
    let import_btn = $('#importSubmit');
    import_btn.prop('disabled', false);
  }
  $(document).ready(function() {
    $('#course_list').change(function() {
      // Prevent changes while we are making changes...
      let delete_btn = $('#delete_all');
      delete_btn.prop('disabled', true);
      let add_one_btn = $('#add');
      add_one_btn.prop('disabled', true);
      let import_btn = $('#importSubmit');
      import_btn.prop('disabled', true);
      $.ajax({
        url: "getCourseData.php",
        method: "POST",
        dataType: "JSON",
        data: {
          course: $('#course_list').val()
        },
        success: receive_course_data
      });
    });
    $('#delete_all').click(function() {
      let checkbox = $('.delete_checkbox:checked');
      if (checkbox.length > 0) {
        let checkbox_value = [];
        $(checkbox).each(function() {
          checkbox_value.push($(this).val());
        });
        $.ajax({
          url: "delete.php",
          method: "POST",
          data: {
            checkbox_value: checkbox_value
          },
          success: function() {
            $('.removeRow').fadeOut(888);
            let delete_btn = $('#delete_all');
            delete_btn.prop('disabled', true);
          }
        });
      }
    });
    <?php
    // If they previously selected a course, initialize the page with that course's data
    if (isset($_SESSION['courseSelected'])) {
      echo '$.ajax({';
      echo 'url: "getCourseData.php",';
      echo 'method: "POST",';
      echo 'dataType: "JSON",';
      echo 'data: { course: "'.$_SESSION['courseSelected'].'"},';
      echo 'success: receive_course_data';
      echo '});';
    }
    ?>
  });
</script>
