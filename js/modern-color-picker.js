// Modern Color Picker Functionality
document.addEventListener('DOMContentLoaded', function() {
  const colorPickerToggler = document.querySelector('.modern-color-picker-toggler');
  const colorPickerClose = document.querySelector('.modern-color-picker-close');
  const colorPicker = document.querySelector('.modern-color-picker');
  const colorPickerOverlay = document.querySelector('.color-picker-overlay');
  const colorItems = document.querySelectorAll('.modern-color-picker .color-item');
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  
  // Toggle color picker
  colorPickerToggler.addEventListener('click', function() {
    colorPicker.classList.toggle('open');
    colorPickerOverlay.classList.toggle('active');
    
    // Update active color
    updateActiveColor();
  });
  
  // Close color picker
  colorPickerClose.addEventListener('click', function() {
    colorPicker.classList.remove('open');
    colorPickerOverlay.classList.remove('active');
  });
  
  // Close color picker when clicking on overlay
  colorPickerOverlay.addEventListener('click', function() {
    colorPicker.classList.remove('open');
    colorPickerOverlay.classList.remove('active');
  });
  
  // Set active color
  colorItems.forEach(item => {
    item.addEventListener('click', function() {
      const color = this.getAttribute('data-color');
      setActiveStyle(color);
      updateActiveColor();
    });
  });
  
  // Update active color indicator
  function updateActiveColor() {
    const activeColor = getActiveStyleTitle();
    
    colorItems.forEach(item => {
      const itemColor = item.getAttribute('data-color');
      const colorCircle = item.querySelector('.color-circle');
      
      if (itemColor === activeColor) {
        colorCircle.classList.add('active');
      } else {
        colorCircle.classList.remove('active');
      }
    });
  }
  
  // Get active style title
  function getActiveStyleTitle() {
    let activeStyle = 'color-1'; // Default
    
    const alternateStyles = document.querySelectorAll('.alternate-style');
    alternateStyles.forEach(style => {
      if (!style.hasAttribute('disabled')) {
        activeStyle = style.getAttribute('title');
      }
    });
    
    return activeStyle;
  }
  
  // Toggle dark mode
  darkModeToggle.addEventListener('click', function() {
    const darkModeIcon = darkModeToggle.querySelector('.dark-mode-icon i');
    darkModeIcon.classList.toggle('fa-sun');
    darkModeIcon.classList.toggle('fa-moon');
    document.body.classList.toggle('dark');
    
    // Update dark mode text
    const darkModeText = darkModeToggle.querySelector('.dark-mode-text');
    if (document.body.classList.contains('dark')) {
      darkModeText.textContent = 'Light Mode';
    } else {
      darkModeText.textContent = 'Dark Mode';
    }
  });
  
  // Initialize
  window.addEventListener('load', function() {
    updateActiveColor();
    
    // Set initial dark mode text
    const darkModeText = darkModeToggle.querySelector('.dark-mode-text');
    if (document.body.classList.contains('dark')) {
      darkModeText.textContent = 'Light Mode';
      darkModeToggle.querySelector('.dark-mode-icon i').classList.add('fa-sun');
    } else {
      darkModeText.textContent = 'Dark Mode';
      darkModeToggle.querySelector('.dark-mode-icon i').classList.add('fa-moon');
    }
  });
});
