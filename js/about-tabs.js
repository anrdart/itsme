// Simple Tab Navigation Script
window.addEventListener('load', function() {
    console.log('Tab script loaded');
    
    // Get all tab buttons and content sections
    const tabs = document.querySelectorAll('.tab-item');
    const contents = document.querySelectorAll('.tab-content');
    
    console.log('Found tabs:', tabs.length);
    console.log('Found contents:', contents.length);
    
    // Show the default tab (Skills)
    document.querySelector('.skills').style.display = 'block';
    
    // Add click handlers to all tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Get the target content
            const target = this.getAttribute('data-target');
            console.log('Clicked tab for:', target);
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all content sections
            contents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Show the target content
            const targetContent = document.querySelector(target);
            if (targetContent) {
                targetContent.style.display = 'block';
                console.log('Displaying content for:', target);
            }
        });
    });
    
    // Activate the Skills tab by default
    const defaultTab = document.querySelector('.tab-item[data-target=".skills"]');
    if (defaultTab) {
        defaultTab.classList.add('active');
    }
    
    // Direct DOM manipulation to ensure contents are properly displayed
    setTimeout(function() {
        // Force hide all non-skills tabs
        document.querySelectorAll('.tab-content:not(.skills)').forEach(el => {
            el.style.display = 'none';
        });
        
        // Force show skills tab
        const skillsContent = document.querySelector('.skills');
        if (skillsContent) {
            skillsContent.style.display = 'block';
            console.log('Forced skills tab to display');
        }
    }, 100);
});
