document.addEventListener('DOMContentLoaded', function() {
    // Get all the necessary elements
    const emailSupportBtn = document.getElementById('emailSupportBtn');
    const helpCenterBtn = document.getElementById('helpCenterBtn');
    const emailModal = document.getElementById('emailModal');
    const helpCenterModal = document.getElementById('helpCenterModal');
    const closeButtons = document.querySelectorAll('.close-btn');
    const supportForm = document.getElementById('supportForm');

    // Email Support Button Click
    if (emailSupportBtn) {
        emailSupportBtn.addEventListener('click', function() {
            if (emailModal) {
                emailModal.classList.add('active');
            }
        });
    }

    // Help Center Button Click
    if (helpCenterBtn) {
        helpCenterBtn.addEventListener('click', function() {
            if (helpCenterModal) {
                helpCenterModal.classList.add('active');
            }
        });
    }

    // Close Button Click
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    });

    // Support Form Submit
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: this.querySelector('#name').value,
                email: this.querySelector('#email').value,
                subject: this.querySelector('#subject').value,
                message: this.querySelector('#message').value
            };

            // Show success message
            showSuccessMessage('Thank you! Your message has been sent.');

            // Reset form and close modal
            this.reset();
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Help Center Links
    const helpLinks = document.querySelectorAll('.help-link');
    helpLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showSuccessMessage('Loading help article...');
        });
    });

    // Function to show success message
    function showSuccessMessage(message) {
        // Remove any existing success messages
        const existingMessages = document.querySelectorAll('.success-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;

        // Add to document
        document.body.appendChild(successDiv);

        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const emailModal = document.getElementById('emailModal');
    const emailBtn = document.getElementById('emailSupportBtn');
    const closeBtn = document.querySelector('.close-btn');
    const supportForm = document.getElementById('supportForm');

    // Open modal
    if (emailBtn) {
        emailBtn.addEventListener('click', function() {
            emailModal.classList.add('active');
        });
    }

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            emailModal.classList.remove('active');
        });
    }

    // Close when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === emailModal) {
            emailModal.classList.remove('active');
        }
    });

    // Handle form submission
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Message sent successfully!';
            document.body.appendChild(successMessage);

            // Remove success message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);

            // Close modal and reset form
            emailModal.classList.remove('active');
            this.reset();
        });
    }
});




