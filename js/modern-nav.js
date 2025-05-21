// This script enhances the existing navigation with modern popup styling
// It doesn't replace the existing functionality but adds visual enhancements

document.addEventListener('DOMContentLoaded', function() {
  // Apply modern popup styling classes
  const navMenu = document.querySelector('.nav-menu');
  const navMenuInner = document.querySelector('.nav-menu-inner');
  
  // Ensure the existing bodyScrollingToggle function works properly
  const originalBodyScrollingToggle = window.bodyScrollingToggle;
  window.bodyScrollingToggle = function() {
    document.body.classList.toggle('stop-scrolling');
    if (originalBodyScrollingToggle) {
      originalBodyScrollingToggle();
    }
  };
  
  // Add animation classes to menu items
  const menuItems = navMenu.querySelectorAll('ul li');
  menuItems.forEach((item, index) => {
    item.classList.add('menu-item-' + (index + 1));
  });
  
  // Enhance the fade effect
  const fadeOutEffect = document.querySelector('.fade-out-effect');
  if (fadeOutEffect) {
    fadeOutEffect.classList.add('modern-fade');
  }
});
