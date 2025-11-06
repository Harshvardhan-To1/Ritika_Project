<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Announcements | Placemate</title>
  <link rel="stylesheet" href="announcements.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
  <header>
    <div class="brand">
      <img src="../images/logoz.png" alt="logo" class="logo">
      <div class="brand-text">
        <h1>Placemate</h1>
        <p>Campus Placement Management</p>
      </div>
    </div>
    <nav>
      <a href="homePage.html">Home</a>
      <a href="announcements.jsp" class="active">Announcements</a>
      <a href="drives.jsp">Placement Drives</a>
      <a href="placedStudents.jsp">Placed Students</a>
    </nav>
  </header>

  <section class="announcements-section">
    <h2>Latest Announcements</h2>
    <div class="announcement-grid">
      <div class="announcement-column fade">
        <div class="announcement-card"><i class="fa-solid fa-bullhorn"></i><p>Resume submission deadline extended to 30 Oct</p></div>
        <div class="announcement-card"><i class="fa-solid fa-bullhorn"></i><p>Google results published on 26 Oct</p></div>
        <div class="announcement-card"><i class="fa-solid fa-bullhorn"></i><p>TCS HR interviews start next week</p></div>
      </div>
      <div class="announcement-column fade">
        <div class="announcement-card"><i class="fa-solid fa-bullhorn"></i><p>Mock Interviews scheduled for all final year students</p></div>
        <div class="announcement-card"><i class="fa-solid fa-bullhorn"></i><p>Placement preparation material uploaded</p></div>
        <div class="announcement-card"><i class="fa-solid fa-bullhorn"></i><p>Company Z drive on 5th Dec</p></div>
      </div>
      <div class="announcement-column fade">
        <div class="announcement-card"><i class="fa-solid fa-bullhorn"></i><p>New internship openings available</p></div>
        <div class="announcement-card"><i class="fa-solid fa-bullhorn"></i><p>Resume review session on 31 Oct</p></div>
        <div class="announcement-card"><i class="fa-solid fa-bullhorn"></i><p>Interview tips webinar scheduled</p></div>
      </div>
    </div>
  </section>

  <footer>
    <p>© Placemate — Campus Placement Management</p>
  </footer>

  <script>
    // Fade-in animation on load
    const columns = document.querySelectorAll('.announcement-column');
    let index = 0;
    function showNextColumn() {
      columns.forEach((col, i) => {
        col.style.opacity = (i === index) ? 1 : 0.2;
      });
      index = (index + 1) % columns.length;
    }
    setInterval(showNextColumn, 2500);
  </script>
</body>
</html>
