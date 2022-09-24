
<?php
function page_header_emit() {
  
  echo '<nav class="navbar navbar-expand-sm fixed-top">';
  echo 'TA Tool -- '.htmlspecialchars($_SESSION['firstName']).' '.htmlspecialchars($_SESSION['lastName']);
  echo '<button class="navbar-toggler" data-toggle="collapse" data-target="#collapsibleNavbar" aria-controls="collapsibleNavbar" aria-expanded="false" aria-label="Toggle navigation">';
  echo '<span class="navbar-toggler-icon"></span>';
  echo '</button>';
  echo '<div class="collapse navbar-collapse" id="collapsibleNavbar">';
  echo '<ul class="navbar-nav">';
  echo '<li class="nav-item ml-2"><a class="nav-link" href="'.SITE_HOME.'/office_hours/oh.php">Office Hours</a></li>';
  echo '<li class="nav-item ml-2"><a class="nav-link" href="'.SITE_HOME.'/active_TAs/active.php">TA Activity</a></li>';
  echo '<li class="nav-item ml-2"><a class="nav-link" href="'.SITE_HOME.'/ta_records/taRecords.php">TA Calendar</a></li>';
  echo '<li class="nav-item ml-2"><a class="nav-link" href="'.SITE_HOME.'/TAList/TAListfromClass.php">TA Listing</a></li>';
  

  if ($_SESSION["faculty"]) {
    echo '<li class="nav-item ml-2"><a class="nav-link" href="'.SITE_HOME.'/faculty/facultyManage.php">Manage TAs</a></li>';
    echo '<li class="nav-item ml-2"><a class="nav-link" href="'.SITE_HOME.'/TAList/TAHours.php">Individual TA hours</a></li>';
    echo '<li class="nav-item ml-2"><a class="nav-link" href="'.SITE_HOME.'/hours.php">TA Hours</a></li>';
    echo '<li class="nav-item ml-2"><a class="nav-link" href="'.SITE_HOME.'/add_course/addCourse.php">Add Course</a></li>';
  }

  echo '<li class="nav-item ml-2"><a class="nav-link" href="'.SITE_HOME.'/account/account.php">Account Details</a></li>';
  echo '<li class="nav-item ml-3"><a class="nav-link" href="'.SITE_HOME.'/logout.php">Logout</a></li>';
  echo '</ul>';
  echo '</div>';
  echo '</nav>';
}
?>
