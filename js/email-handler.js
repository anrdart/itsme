// Email handler using FormSubmit.co
// This file handles all email functionality

// Ensure config.js is loaded (it should be loaded in HTML before this script)
if (typeof FORMSUBMIT_CONFIG === 'undefined') {
    console.error('FORMSUBMIT_CONFIG not found. Make sure config.js is loaded before email-handler.js');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('FormSubmit.co email handler initialized');
});

/**
 * Send an email using FormSubmit.co AJAX API
 * @param {Object} formData - The form data containing name, email, subject, and message
 * @returns {Promise} - Promise that resolves when email is sent
 */
function sendEmail(formData) {
    const { name, email, subject, message } = formData;
    
    // Prepare FormSubmit.co data format
    const formSubmitData = {
        name: name,
        email: email,
        subject: subject,
        message: message,
        _subject: `Portfolio Contact: ${subject}`,
        _template: 'table',
        _captcha: 'false'
    };
    
    return fetch(FORMSUBMIT_CONFIG.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(formSubmitData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('FormSubmit Success:', data);
        return 'OK';
    })
    .catch(error => {
        console.error('FormSubmit Error:', error);
        throw error;
    });
}

/**
 * Create popup dialog for email status
 */
function createEmailPopup() {
    const popupHTML = `
        <div id="email-popup" class="email-popup">
            <div class="email-popup-content">
                <div class="email-popup-header">
                    <h3 id="email-popup-title">Sending Message</h3>
                    <button class="email-popup-close" onclick="closeEmailPopup()">&times;</button>
                </div>
                <div class="email-popup-body">
                    <div id="email-popup-message">Sending your message...</div>
                </div>
                <div class="email-popup-footer">
                    <button id="email-popup-close-btn" class="btn btn-primary" onclick="closeEmailPopup()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    if (!document.getElementById('email-popup')) {
        document.body.insertAdjacentHTML('beforeend', popupHTML);
    }
    
    // Add CSS styles for the popup
    if (!document.getElementById('email-popup-styles')) {
        const style = document.createElement('style');
        style.id = 'email-popup-styles';
        style.textContent = `
            .email-popup {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                animation: fadeIn 0.3s ease-in-out;
            }
            
            .email-popup.active {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .email-popup-content {
                background: var(--bg-color);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 2rem;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                animation: slideIn 0.3s ease-in-out;
            }
            
            .email-popup-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 0.5rem;
            }
            
            .email-popup-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-color);
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.3s;
            }
            
            .email-popup-close:hover {
                background-color: var(--border-color);
            }
            
            .email-popup-body {
                margin-bottom: 1.5rem;
                text-align: center;
            }
            
            .email-popup-footer {
                text-align: center;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .email-success {
                color: #10b981;
                font-weight: 600;
            }
            
            .email-error {
                color: #ef4444;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Show email popup
 */
function showEmailPopup(title, message, isSuccess = false) {
    createEmailPopup();
    const popup = document.getElementById('email-popup');
    const titleEl = document.getElementById('email-popup-title');
    const messageEl = document.getElementById('email-popup-message');
    
    titleEl.textContent = title;
    messageEl.innerHTML = `<p class="${isSuccess ? 'email-success' : 'email-error'}">${message}</p>`;
    
    popup.classList.add('active');
}

/**
 * Close email popup
 */
function closeEmailPopup() {
    const popup = document.getElementById('email-popup');
    if (popup) {
        popup.classList.remove('active');
    }
}

/**
 * Initialize contact form submission handling
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show sending popup
        showEmailPopup('Sending Message', 'Sending your message...');
        
        // Get form values
        const formData = {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            subject: document.getElementById('subject')?.value || 'Portfolio Contact',
            message: document.getElementById('message')?.value || ''
        };
        
        // Send the email
        sendEmail(formData)
            .then(function(response) {
                console.log('Email response:', response);
                if (response === 'OK') {
                    // Optionally show success briefly, then redirect
                    showEmailPopup('Success!', 'Thank you for your message! Redirecting...', true);
                    contactForm.reset();
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 700);
                } else {
                    showEmailPopup('Error', 'There was an error sending your message. Please try again.');
                    console.error('Email sending failed:', response);
                }
            })
            .catch(function(error) {
                showEmailPopup('Error', 'There was an error sending your message. Please try again.');
                console.error('Email sending error:', error);
            });
    });
}

// Initialize the contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', initContactForm);
