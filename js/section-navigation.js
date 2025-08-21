// Enhanced section navigation with proper tab highlighting
document.addEventListener('DOMContentLoaded', function() {
    // Handle More About Me button click
    const moreAboutBtn = document.getElementById('more-about-btn');
    if (moreAboutBtn) {
        moreAboutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section
            const targetSection = document.querySelector('#about');
            
            // Remove 'active' class from all sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Add 'active' class to target section
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Scroll to the section with smooth animation
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update the URL hash to reflect the current section
                window.history.pushState(null, null, '#about');
                
                // For compatibility with any navigation highlighting scripts
                // Simulate a click on the about navigation link if it exists
                const aboutNavLink = document.querySelector('a.link-item.about');
                if (aboutNavLink) {
                    setTimeout(() => {
                        aboutNavLink.click();
                    }, 500);
                }
            }
        });
    }
    
    // General function to handle all section links
    document.querySelectorAll('a.link-item').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Remove 'active' class from all sections
                    document.querySelectorAll('.section').forEach(section => {
                        section.classList.remove('active');
                    });
                    
                    // Add 'active' class to target section
                    targetSection.classList.add('active');
                    
                    // Scroll to the section with smooth animation
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update the URL hash
                    window.history.pushState(null, null, '#' + targetId);
                    
                    // Highlight the proper navigation link
                    document.querySelectorAll('a.link-item').forEach(navLink => {
                        navLink.classList.remove('active');
                        
                        // Extract section name from the class list
                        const classes = navLink.classList;
                        let sectionClass = null;
                        for (const cls of classes) {
                            if (['home', 'about', 'services', 'portfolio', 'contact'].includes(cls)) {
                                sectionClass = cls;
                                break;
                            }
                        }
                        
                        if (sectionClass === targetId) {
                            navLink.classList.add('active');
                        }
                    });
                }
            }
        });
    });
    
    // Handle initial section display based on URL hash
    function handleInitialSection() {
        const hash = window.location.hash;
        if (hash) {
            const targetSection = document.querySelector(hash);
            if (targetSection) {
                document.querySelectorAll('.section').forEach(section => {
                    section.classList.remove('active');
                });
                
                targetSection.classList.add('active');
                
                // Highlight the corresponding navigation link
                const sectionId = hash.substring(1);
                document.querySelectorAll('a.link-item').forEach(link => {
                    link.classList.remove('active');
                    
                    // Extract section name from the class list
                    const classes = link.classList;
                    let sectionClass = null;
                    for (const cls of classes) {
                        if (['home', 'about', 'services', 'portfolio', 'contact'].includes(cls)) {
                            sectionClass = cls;
                            break;
                        }
                    }
                    
                    if (sectionClass === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        }
    }
    
    // Run on page load
    handleInitialSection();
    
    // Run when the hash changes
    window.addEventListener('hashchange', handleInitialSection);
});
