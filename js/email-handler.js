// Email handler using SMTP.js
// This file handles all email functionality

/**
 * Send an email using SMTP.js
 * @param {Object} formData - The form data containing name, email, subject, and message
 * @returns {Promise} - Promise that resolves when email is sent
 */
function sendEmail(formData) {
    const { name, email, subject, message } = formData;
    
    // Format email body with HTML
    const emailBody = `
        <strong>Name:</strong> ${name}<br>
        <strong>Email:</strong> ${email}<br>
        <strong>Subject:</strong> ${subject}<br>
        <strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}
    `;
    
    // Use SMTP configuration from config.js
    return Email.send({
        SecureToken: SMTP_CONFIG.secureToken,
        To: SMTP_CONFIG.toEmail,
        From: SMTP_CONFIG.fromEmail,
        Subject: `Portfolio Contact: ${subject}`,
        Body: emailBody
    });
}

/**
 * Initialize contact form submission handling
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const statusMessage = document.getElementById('statusMessage');
    
    if (!contactForm || !statusMessage) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show sending status
        statusMessage.innerHTML = '<p style="color: var(--skin-color);">Mengirim pesan...</p>';
        
        // Get form values
        const formData = {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('sender')?.value || '',
            subject: document.getElementById('subject')?.value || '',
            message: document.getElementById('message')?.value || ''
        };
        
        // Send the email
        sendEmail(formData)
            .then(function(response) {
                console.log('Email response:', response);
                if (response === 'OK') {
                    statusMessage.innerHTML = '<p style="color: green;">Pesan berhasil dikirim! Terima kasih telah menghubungi.</p>';
                    contactForm.reset();
                    setTimeout(() => {
                        statusMessage.innerHTML = '';
                    }, 5000);
                } else {
                    statusMessage.innerHTML = '<p style="color: red;">Terjadi kesalahan. Silakan coba lagi nanti.</p>';
                    console.error('Email sending failed:', response);
                }
            })
            .catch(function(error) {
                statusMessage.innerHTML = '<p style="color: red;">Terjadi kesalahan. Silakan coba lagi nanti.</p>';
                console.error('Email sending error:', error);
            });
    });
}

// Initialize the contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', initContactForm);
