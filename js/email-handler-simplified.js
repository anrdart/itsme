// Email handler using FormSubmit.co service with enhanced popup functionality

// Utility functions for popup management
function showSuccessPopup() {
    const popup = document.getElementById('successPopup');
    if (popup) {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
    }
}

function closePopup() {
    const popup = document.getElementById('successPopup');
    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    }
}

function redirectToHome() {
    closePopup();
    window.location.href = '#home';
    // Also trigger the home link to ensure proper section activation
    const homeLink = document.querySelector('a[href="#home"]');
    if (homeLink) homeLink.click();
}

function showStatusMessage(message) {
    const statusPopup = document.getElementById('statusMessagePopup');
    const statusText = document.getElementById('statusText');
    
    if (statusPopup && statusText) {
        statusText.textContent = message;
        statusPopup.classList.add('active');
        
        // Auto-hide after 5 seconds unless explicitly kept open
        if (message !== 'Mengirim pesan...') {
            setTimeout(() => {
                statusPopup.classList.remove('active');
            }, 2500);
        }
    }
}

function hideStatusMessage() {
    const statusPopup = document.getElementById('statusMessagePopup');
    if (statusPopup) {
        statusPopup.classList.remove('active');
    }
}

// Initialize the contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // Setup the contact form to submit to formsubmit.co
    contactForm.action = 'https://formsubmit.co/ekalliptus@gmail.com';
    contactForm.method = 'POST';
    
    // Add hidden fields for formsubmit configuration
    const hiddenFields = [
        { name: '_subject', value: 'Pesan Baru dari Website Portfolio' },
        { name: '_captcha', value: 'false' },
        { name: '_template', value: 'table' },
        { name: '_next', value: window.location.origin + window.location.pathname.replace('index.html', '') + 'success.html' }
    ];
    
    hiddenFields.forEach(field => {
        // Check if the field already exists to avoid duplicates
        if (!contactForm.querySelector(`input[name="${field.name}"]`)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = field.name;
            input.value = field.value;
            contactForm.appendChild(input);
        }
    });
    
    // Check for success message in URL
    window.addEventListener('load', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const messageStatus = urlParams.get('message');
        
        if (messageStatus === 'success') {
            // Show success popup instead of simple message
            showSuccessPopup();
            
            // Clean up URL
            const url = new URL(window.location.href);
            url.searchParams.delete('message');
            window.history.replaceState({}, document.title, url.toString());
        }
    });
    
    // Display sending message when form is submitted and reset form
    contactForm.addEventListener('submit', function(e) {
        showStatusMessage('Mengirim pesan...');
        
        // Store form data for debugging in case there's an issue
        const formData = new FormData(contactForm);
        const formEntries = {};
        for (let [key, value] of formData.entries()) {
            formEntries[key] = value;
        }
        console.log('Form data being submitted:', formEntries);
        
        // We'll let the form submit naturally to formsubmit.co
        // The form will be reset when the user returns from success.html
    });
    
    // Reset the form when the page loads/reloads
    window.addEventListener('pageshow', function() {
        if (contactForm) {
            contactForm.reset();
        }
    });
});

// Make these functions globally available
window.closePopup = closePopup;
window.redirectToHome = redirectToHome;
