<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Update Profile — Placemate</title>
  <link rel="stylesheet" href="updateProfile.css" />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
  />
</head>
<body>

  <!-- HEADER -->
  <header class="pm-header">
    <div class="brand">
      <img src="../images/logoz.png" alt="logo" />
      <span>Placemate</span>
    </div>
    <nav>
      <a href="homePage.html">Home</a>
      <a href="announcements.html">Announcements</a>
      <a href="drives.html">Placement Drives</a>
      <a href="placedStudents.html">Placed Students</a>
    </nav>
  </header>

  <!-- MAIN PROFILE UPDATE SECTION -->
  <main class="update-profile">
    <h1>Update Your Profile</h1>

    <!-- BACKEND: Fetch student details from DB here -->
    <!-- For now, static placeholder values are shown -->

    <form class="profile-form" method="post" action="#">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input type="text" id="name" name="name" value="Aditya Jaiswal" />
      </div>

      <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" name="email" value="adi@gmail.com" />
      </div>

      <div class="form-group">
        <label for="phone">Contact Number</label>
        <input type="text" id="phone" name="phone" value="9876543210" />
      </div>

      <div class="form-group">
        <label for="branch">Branch</label>
        <select id="branch" name="branch">
          <option selected>Computer Science</option>
          <option>Information Technology</option>
          <option>Electronics</option>
          <option>Mechanical</option>
        </select>
      </div>

      <div class="form-group">
        <label for="year">Year</label>
        <select id="year" name="year">
          <option>1st</option>
          <option>2nd</option>
          <option selected>3rd</option>
          <option>4th</option>
        </select>
      </div>

      <div class="form-group">
        <label for="resume">Upload Resume</label>
        <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" />
        <!-- BACKEND: Handle file upload in server -->
      </div>

      <button type="submit" class="save-btn">
        <i class="fa-solid fa-save"></i> Save Changes
      </button>
    </form>

    <!-- BACKEND: On success or failure, display a message here -->
    <!-- Example: <p class="success-msg">Profile updated successfully!</p> -->

  </main>

  <footer class="footer">
    <p>© 2025 Placemate | Campus Placement Management System</p>
  </footer>

</body>
</html>
