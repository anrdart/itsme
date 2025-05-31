/**
 * Theme Manager - Fixed blue theme with dark/light mode toggle only
 * Simplified version removing theme color selection feature
 */

// Theme configuration with fixed blue theme
const THEME_CONFIG = {
  blueTheme: {
    id: 'color-3',
    name: 'Blue', 
    hex: '#1fabeb', 
    rgb: '31, 171, 237'
  },
  localStorageKeys: {
    darkMode: 'theme-dark'
  }
};

// Execute immediately
(function() {
  // Load theme on page load
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup contact form if it exists
    setupContactForm();
    
    // Hide theme color selectors
    hideThemeColorSelectors();
  });
  
  // Apply theme immediately to prevent flash
  applyThemeImmediately();
})();

// Apply theme immediately before DOM is fully loaded
function applyThemeImmediately() {
  try {
    // Get dark mode preference
    const isDark = localStorage.getItem(THEME_CONFIG.localStorageKeys.darkMode) === 'true';
    
    // Apply dark theme if needed
    if (isDark) {
      document.body.classList.add('dark');
    }
    
    // Create and append blue theme stylesheet
    const themeLink = document.createElement('link');
    themeLink.rel = 'stylesheet';
    themeLink.href = 'css/skins/color-3.css'; // Always use blue theme
    themeLink.className = 'active-theme-style';
    document.head.appendChild(themeLink);
    
    // Apply CSS variables for blue theme
    document.documentElement.style.setProperty('--skin-color', `rgb(${THEME_CONFIG.blueTheme.rgb})`);
    document.documentElement.style.setProperty('--skin-color-rgb', THEME_CONFIG.blueTheme.rgb);
  } catch (error) {
    console.error('Error applying immediate theme:', error);
  }
}

// Initialize theme after DOM is loaded
function initializeTheme() {
  try {
    // Get dark mode preference
    const isDark = localStorage.getItem(THEME_CONFIG.localStorageKeys.darkMode) === 'true';
    
    // Update dark/light mode UI
    updateDarkModeUI(isDark);
  } catch (error) {
    console.error('Error initializing theme:', error);
  }
}

// Hide all theme color selectors from HTML
function hideThemeColorSelectors() {
  // Hide theme color section
  const themeColorSection = document.querySelector('.style-switcher h4');
  if (themeColorSection) {
    themeColorSection.style.display = 'none';
  }
  
  // Hide color selection elements
  const colorSelectors = document.querySelector('.style-switcher .colors');
  if (colorSelectors) {
    colorSelectors.style.display = 'none';
  }
}

// Setup all event listeners
function setupEventListeners() {
  try {
    // Style switcher toggle (only for dark/light mode)
    const styleSwitcherToggle = document.querySelector('.style-switcher-toggler');
    const styleSwitcher = document.querySelector('.style-switcher');
    
    if (styleSwitcherToggle && styleSwitcher) {
      styleSwitcherToggle.addEventListener('click', function() {
        styleSwitcher.classList.toggle('open');
      });
      
      // Close style switcher on scroll
      window.addEventListener('scroll', function() {
        if (styleSwitcher.classList.contains('open')) {
          styleSwitcher.classList.remove('open');
        }
      });
    }
    
    // Theme dot and Day/night toggle - di pojok kanan bawah
    const dayNightBottom = document.querySelector('.theme-controls-bottom .day-night-bottom');
    if (dayNightBottom) {
      dayNightBottom.addEventListener('click', function() {
        toggleDarkMode();
      });
    }
    
    // Theme dot has been removed
    
    // Clean URL parameters if present
    if (window.location.search.includes('theme') || window.location.search.includes('dark')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('theme');
      url.searchParams.delete('dark');
      window.history.replaceState({}, document.title, url.toString());
    }
  } catch (error) {
    console.error('Error setting up event listeners:', error);
  }
}

// Setup contact form to preserve theme when submitting
function setupContactForm() {
  try {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get current theme settings
      const isDarkTheme = document.body.classList.contains('dark');
      const activeSkin = localStorage.getItem(THEME_CONFIG.localStorageKeys.activeStyle) || THEME_CONFIG.defaultColor;
      
      // Setup form
      contactForm.action = 'https://formsubmit.co/ekalliptus@gmail.com';
      contactForm.method = 'POST';
      
      // Add hidden fields
      const hiddenFields = [
        { name: '_subject', value: 'Pesan Baru dari Website Portfolio' },
        { name: '_captcha', value: 'false' },
        { name: '_template', value: 'table' },
        { name: '_next', value: `${window.location.origin}${window.location.pathname.replace('index.html', '')}success.html?theme=${activeSkin}&dark=${isDarkTheme}` }
      ];
      
      // Remove existing hidden fields
      contactForm.querySelectorAll('input[type="hidden"]').forEach(input => {
        if (['_subject', '_captcha', '_template', '_next'].includes(input.name)) {
          input.remove();
        }
      });
      
      // Add new hidden fields
      hiddenFields.forEach(field => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = field.name;
        input.value = field.value;
        contactForm.appendChild(input);
      });
      
      // Show sending popup
      const sendingPopup = document.getElementById('sendingPopup');
      if (sendingPopup) {
        sendingPopup.classList.add('active');
      }
      
      // Submit form after delay
      setTimeout(() => {
        contactForm.submit();
      }, 500);
    });
  } catch (error) {
    console.error('Error setting up contact form:', error);
  }
}

// Update dark mode UI elements
function updateDarkModeUI(isDark) {
  try {
    const dayNightBottom = document.querySelector('.theme-controls-bottom .day-night-bottom');
    if (!dayNightBottom) return;
    
    const icon = dayNightBottom.querySelector('i');
    if (!icon) return;
    
    if (isDark) {
      // Dark mode active - show sun icon (to switch to light)
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      // Light mode active - show moon icon (to switch to dark)
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  } catch (error) {
    console.error('Error updating dark mode UI:', error);
  }
}

/**
 * Global functions that need to be accessible from HTML
 */

// Dummy function to prevent errors in case it's called from HTML
function setActiveStyle(colorId) {
  // This function is intentionally left empty as we're using fixed blue theme
  console.log('Theme color selection is disabled, using fixed blue theme');
  return;
}

// Toggle dark/light mode
function toggleDarkMode() {
  try {
    const isDarkTheme = document.body.classList.contains('dark');
    
    if (isDarkTheme) {
      // Switch to light mode
      document.body.classList.remove('dark');
      localStorage.setItem(THEME_CONFIG.localStorageKeys.darkMode, 'false');
    } else {
      // Switch to dark mode
      document.body.classList.add('dark');
      localStorage.setItem(THEME_CONFIG.localStorageKeys.darkMode, 'true');
    }
    
    // Update UI
    updateDarkModeUI(!isDarkTheme);
  } catch (error) {
    console.error('Error toggling dark mode:', error);
  }
}
