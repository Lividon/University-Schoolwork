<?php
require "../lib/database.php";
require "../lib/constants.php";

if (!isset($_GET['class'])) {
  http_response_code(400);
  echo "Bad Request: Missing parameters in URL";
  exit();
}
$course = trim($_GET['class']);

$conn = connect_to_database();

$stmt_request = $conn->prepare("SELECT * FROM staff_list WHERE course=?");
$stmt_request->bind_param('s',$course);
$stmt_request->execute();
$result = $stmt_request->get_result();
$count = mysqli_num_rows($result);
if ($count > 0) {
  $stmt_request = $conn->prepare("SELECT actual.first_name, actual.last_name, expected_end, location, office_hours.email, email_original_ta, original.first_name orig_f_name, original.last_name orig_l_name FROM office_hours INNER JOIN registered_users actual ON actual.email=office_hours.email LEFT JOIN registered_users original ON original.email=email_original_ta WHERE course=? AND actual_end IS NULL AND NOW() <= expected_end ORDER BY expected_end DESC");
  $stmt_request->bind_param('s',$course);
  $stmt_request->execute();
  $result = $stmt_request->get_result();

  $active_tas = array();
  while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
    $phpdate = strtotime($row['expected_end']);
    $row['expected_end']=date('g:i A', $phpdate);
    $active_tas[] = $row;
  }
  $count_tas = count($active_tas);
} else {
  $count_tas = -1;
}

$stmt_request = $conn->prepare("SELECT display_message FROM courses WHERE course=? AND active=1");
$stmt_request->bind_param('s',$course);
$stmt_request->execute();
$result = $stmt_request->get_result();
$count = mysqli_num_rows($result);
if ($count > 0) {
  $row = $result->fetch_array(MYSQLI_ASSOC);
  $display_message = htmlspecialchars($row["display_message"]);
} else {
  $display_message = NULL;
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Active TAs for <?php echo htmlspecialchars($course);?></title>
    <!-- Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  </head>
<body>

  <?php
  if (isset($display_message)) {
    echo '<div class="row">';
    echo '<div class="col-sm-12">';
    echo '<h1>'.$display_message.'</h1>';
    echo '</div>';
    echo '</div>';
  }
  ?>

<!--"Card Deck" used to show TA "cards" with name, time, photo etc.. on them-->
  <?php
  if ($count_tas > 0) {
    $col_count = 0;
    foreach ($active_tas as $ta) {
      if ($col_count % 4 == 0) {
        echo '<div class="row">';
      }
      $col_count = $col_count + 1;
      echo '<div class="col-sm-4">';
      echo '<div class="card" style="width: 200px">';
      if (is_null($ta["email_original_ta"])) {
        echo '<img class="card-img-top" src="' . SITE_HOME . '/lib/displayPic.php?email=' . $ta["email"] . '" alt="">';
        echo  '<div class="card-body" style="color: white;background-color: Navy;">';
        echo  '     <h2 class="mt-0 mb-1 card-title" style="font-weight: bolder">' . htmlspecialchars($ta["first_name"]) . " " . htmlspecialchars($ta["last_name"]) . '</h2>';
      } else {
        echo '<img class="card-img-top" src="' . SITE_HOME . '/lib/displayPic.php?email=' . $ta["email_original_ta"] . '" alt="">';
        echo  '<div class="card-body" style="color: white;background-color: Navy;">';
        echo  '     <h2 class="mt-0 mb-1 card-title" style="font-weight: bolder">' . htmlspecialchars($ta["orig_f_name"]) . " " . htmlspecialchars($ta["orig_l_name"]) . '</h2>';
      }
      echo     '<span class="mt-0 mb-1 card-text" style="color: LightSlateGrey;">Location:</span> <span style="font-weight: bold; font-size:large;">';
      if (filter_var($ta["location"], FILTER_VALIDATE_URL)) {
        echo '<a style="color: Turquoise;" href="'.$ta["location"].'">Online</a>';
      } else {
        echo htmlspecialchars($ta["location"]);
      }
      echo     '</span><br>';
      echo     '<span class="mt-0 mb-1 card-text" style="color: LightSlateGrey;">Through:</span> <span style="font-weight: bold; font-size:large;">' . $ta['expected_end'] . '</span>';
      if (is_null($ta["email_original_ta"])) {
        echo     '<br><span class="mt-0 mb-1 card-text" style="color: LightSlateGrey;">&nbsp;</span> <span style="font-weight: bold;">&nbsp;</span><br>';
      } else {
        echo     '<br><span class="mt-0 mb-1 card-text" style="color: LightSlateGrey;">(sub: <span style="font-weight: bold;">'.htmlspecialchars($ta["first_name"]) . " " . htmlspecialchars($ta["last_name"]).'</span>)</span><br>';
      }
      echo  '</div>';
      echo '</div>';
      echo '</div>';
      if ($col_count % 4 == 3) {
        echo '</div>';
      }
    }
    echo '</div>';
  } else if ($count_tas == 0){
    echo '<div class="row"><div class="col-sm-12"><h2>No TAs are currently active. Sorry!</h2></div></div>';
  } else {
    echo '<div class="row"><div class="col-sm-12"><h2>Unknown class provided. Talk to your instructor to fix this error!</h2></div></div>';
  }
  ?>
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
</body>
</html>
