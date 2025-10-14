/**
 * Projects Show More/Less Functionality
 * Handles expanding and collapsing hidden projects
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShowMore);
  } else {
    initShowMore();
  }

  function initShowMore() {
    const showMoreBtn = document.getElementById('projects-show-more');
    const hiddenProjects = document.querySelectorAll('.project-card.hidden-project');
    
    if (!showMoreBtn || hiddenProjects.length === 0) {
      // If no hidden projects, hide the button
      if (showMoreBtn) {
        showMoreBtn.parentElement.style.display = 'none';
      }
      return;
    }

    // Add click event listener
    showMoreBtn.addEventListener('click', function() {
      const isExpanded = this.classList.contains('expanded');
      const textElement = this.querySelector('.show-more-text');
      
      if (isExpanded) {
        // Collapse: Hide projects
        hiddenProjects.forEach(function(project) {
          project.classList.add('hidden-project');
          // Smooth collapse animation
          project.style.animation = 'fadeOut 0.3s ease-out';
        });
        
        this.classList.remove('expanded');
        textElement.textContent = 'Show More Projects';
        this.setAttribute('aria-expanded', 'false');
        
        // Scroll back to projects section smoothly
        setTimeout(function() {
          const projectsSection = document.getElementById('projects');
          if (projectsSection) {
            const offset = 100; // Offset for fixed header
            const elementPosition = projectsSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
        
      } else {
        // Expand: Show projects
        hiddenProjects.forEach(function(project, index) {
          setTimeout(function() {
            project.classList.remove('hidden-project');
            project.style.animation = 'fadeIn 0.4s ease-in';
            
            // Trigger animate-on-scroll if available
            if (project.classList.contains('animate-on-scroll')) {
              project.classList.add('animate-in');
            }
          }, index * 100); // Stagger animation
        });
        
        this.classList.add('expanded');
        textElement.textContent = 'Show Less Projects';
        this.setAttribute('aria-expanded', 'true');
      }
    });

    // Add CSS animations dynamically
    if (!document.getElementById('projects-show-more-animations')) {
      const style = document.createElement('style');
      style.id = 'projects-show-more-animations';
      style.textContent = `
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Handle keyboard accessibility
  document.addEventListener('keydown', function(e) {
    const showMoreBtn = document.getElementById('projects-show-more');
    if (showMoreBtn && document.activeElement === showMoreBtn) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showMoreBtn.click();
      }
    }
  });

})();
