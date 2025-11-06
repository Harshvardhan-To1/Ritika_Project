// Notification counter
let notifCount = 3; // example, you can dynamically update this
const notifElement = document.getElementById('notif-count');

function updateNotificationCount(count) {
  if(count > 0){
    notifElement.textContent = count;
    notifElement.style.display = 'block';
  } else {
    notifElement.style.display = 'none';
  }
}

updateNotificationCount(notifCount);

// Typing animation for search placeholder
const searchInput = document.getElementById('search-input');
const placeholderTexts = [
  "What do you want to search?",
  "Companies, placements, students..."
];
let textIndex = 0;
let charIndex = 0;

function typePlaceholder() {
  if(charIndex <= placeholderTexts[textIndex].length){
    searchInput.setAttribute('placeholder', placeholderTexts[textIndex].substring(0, charIndex));
    charIndex++;
    setTimeout(typePlaceholder, 100);
  } else {
    setTimeout(() => {
      charIndex = 0;
      textIndex = (textIndex + 1) % placeholderTexts.length;
      typePlaceholder();
    }, 2000); // 2s pause before next text
  }
}

typePlaceholder();
const studentsContainer = document.querySelector('.students-flashcards');
let studentScroll = 0;
setInterval(() => {
  studentScroll += 1;
  if(studentScroll > studentsContainer.scrollWidth - studentsContainer.clientWidth) studentScroll = 0;
  studentsContainer.scrollTo({ left: studentScroll, behavior: 'smooth' });
}, 50);
