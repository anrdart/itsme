// Modern Popup Handler
// Handles the modern sending and success popups

// Show the sending popup
function showSendingPopup() {
  const popup = document.getElementById('sendingPopup');
  if (popup) {
    popup.classList.add('active');
    // Start progress bar animation
    const progressBar = popup.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.width = '0%';
      setTimeout(() => {
        progressBar.style.width = '95%';
      }, 100);
    }
  }
}

// Hide the sending popup
function hideSendingPopup() {
  const popup = document.getElementById('sendingPopup');
  if (popup) {
    popup.classList.remove('active');
  }
}

// Show the success popup
function showSuccessPopup() {
  // First hide sending popup if it's visible
  hideSendingPopup();
  
  const popup = document.getElementById('successPopup');
  if (popup) {
    popup.classList.add('active');
    
    // Animate the success icon
    const icon = popup.querySelector('.success-icon');
    if (icon) {
      setTimeout(() => {
        icon.classList.add('active');
      }, 300);
    }
  }
}

// Close the success popup and redirect to home
function closeSuccessPopup() {
  const popup = document.getElementById('successPopup');
  if (popup) {
    // First remove the active class from the icon
    const icon = popup.querySelector('.success-icon');
    if (icon) {
      icon.classList.remove('active');
    }
    
    // Then remove the active class from the popup with a small delay
    setTimeout(() => {
      popup.classList.remove('active');
    }, 100);
    
    // Redirect to home after animation completes
    setTimeout(() => {
      window.location.href = '#home';
      // Also trigger the home link to ensure proper section activation
      const homeLink = document.querySelector('a[href="#home"]');
      if (homeLink) homeLink.click();
    }, 400);
  }
}

// Initialize the form with modern popup handling
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  // Configure form for FormSubmit.co
  setupFormSubmitWithModernPopup(contactForm);
});

// Setup FormSubmit.co with modern popup
function setupFormSubmitWithModernPopup(form) {
  // Basic FormSubmit.co configuration
  form.action = 'https://formsubmit.co/ekalliptus@gmail.com';
  form.method = 'POST';
  
  // Add hidden fields for FormSubmit configuration
  const hiddenFields = [
    { name: '_subject', value: 'Pesan Baru dari Website Portfolio' },
    { name: '_captcha', value: 'false' },
    { name: '_template', value: 'table' },
    { name: '_next', value: window.location.origin + window.location.pathname.replace('index.html', '') + 'success.html' }
  ];
  
  hiddenFields.forEach(field => {
    // Check if field already exists
    if (!form.querySelector(`input[name="${field.name}"]`)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = field.name;
      input.value = field.value;
      form.appendChild(input);
    }
  });
  
  // Add form submission handler with modern popup
  form.addEventListener('submit', function(e) {
    // Show modern sending popup
    showSendingPopup();
    
    // Log form data for debugging
    const formData = new FormData(form);
    const formEntries = {};
    for (let [key, value] of formData.entries()) {
      formEntries[key] = value;
    }
    console.log('Form data being submitted:', formEntries);
    
    // Let the form submit naturally to formsubmit.co
  });
  
  // Check for success parameter in URL
  window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const messageStatus = urlParams.get('message');
    
    if (messageStatus === 'success') {
      // Show modern success popup
      showSuccessPopup();
      
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('message');
      window.history.replaceState({}, document.title, url.toString());
    }
  });
  
  // Reset form when page loads/reloads
  window.addEventListener('pageshow', function() {
    if (form) {
      form.reset();
    }
  });
}
