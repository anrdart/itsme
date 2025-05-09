// CV Dropdown Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
  const cvDropdownBtn = document.querySelector('.cv-dropdown-btn');
  const cvDropdown = document.querySelector('.cv-dropdown');
  
  // Toggle dropdown when clicking the button
  cvDropdownBtn.addEventListener('click', function(e) {
    e.preventDefault();
    cvDropdown.classList.toggle('show');
    e.stopPropagation();
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!cvDropdown.contains(e.target)) {
      cvDropdown.classList.remove('show');
    }
  });
  
  // Add hover effect for cursor animation
  const dropdownLinks = document.querySelectorAll('.cv-dropdown-content a');
  const cursorMoveAnimation = document.querySelector(".cursorMoveAnimation");
  const cursorMoveAnimation2 = document.querySelector(".cursorMoveAnimation2");
  
  if (cursorMoveAnimation && cursorMoveAnimation2) {
    dropdownLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        cursorMoveAnimation.classList.add('hover');
        cursorMoveAnimation2.classList.add('hover');
      });
      
      link.addEventListener('mouseleave', () => {
        cursorMoveAnimation.classList.remove('hover');
        cursorMoveAnimation2.classList.remove('hover');
      });
    });
  }
});
