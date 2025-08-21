// Handling 404 errors for local development environment
document.addEventListener('DOMContentLoaded', function() {
    // Function to check if a page exists
    function checkPageExists(url, callback) {
        const http = new XMLHttpRequest();
        http.open('HEAD', url);
        http.onreadystatechange = function() {
            if (this.readyState === this.DONE) {
                callback(this.status !== 404);
            }
        };
        http.send();
    }

    // Handle clicks on all internal links
    document.body.addEventListener('click', function(e) {
        // Find the closest anchor tag
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentNode;
            if (!target || target === document.body) break;
        }

        // If we found an anchor and it's internal
        if (target && target.tagName === 'A' && target.href && target.href.startsWith(window.location.origin)) {
            // Skip anchor links (like #home, #about, etc)
            if (target.getAttribute('href').startsWith('#')) return;
            
            // Prevent default navigation
            e.preventDefault();
            
            // Check if the page exists
            checkPageExists(target.href, function(exists) {
                if (exists) {
                    // If it exists, navigate as normal
                    window.location.href = target.href;
                } else {
                    // If it doesn't exist, navigate to 404 page
                    window.location.href = window.location.origin + '/404.html';
                }
            });
        }
    });

    // Handle direct URL navigation (on page load)
    if (!window.location.href.includes('/index.html') && 
        !window.location.href.includes('/404.html') && 
        !window.location.href.includes('/success.html') &&
        !window.location.pathname.endsWith('/')) {
        
        // Check if the current page exists
        checkPageExists(window.location.href, function(exists) {
            if (!exists && !window.location.href.includes('/404.html')) {
                window.location.href = window.location.origin + '/404.html';
            }
        });
    }
});
