// Ultra-simple tab switcher that works with any HTML structure
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tab switcher loaded');
    
    // Set up tab functionality
    function setupTabs() {
        // Get all tab buttons
        const tabButtons = document.querySelectorAll('.tab-item');
        console.log('Found tab buttons:', tabButtons.length);
        
        // Add click event to each tab button
        tabButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                // Get target content ID from data-target attribute
                const targetId = this.getAttribute('data-target');
                console.log('Tab clicked:', targetId);
                
                // Remove active class from all tabs
                tabButtons.forEach(function(btn) {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(function(content) {
                    content.classList.remove('active');
                });
                
                // Show target content
                const targetContent = document.querySelector(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                    console.log('Activated content:', targetId);
                }
            });
        });
        
        // Activate default tab (first tab)
        const defaultTab = document.querySelector('.tab-item');
        if (defaultTab) {
            defaultTab.click();
            console.log('Activated default tab');
        }
    }
    
    // Set up tabs when DOM is loaded
    setupTabs();
    
    // Also set up tabs when window is fully loaded
    window.addEventListener('load', function() {
        console.log('Window loaded, setting up tabs again');
        setupTabs();
    });
});
