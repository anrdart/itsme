import './style.css'
import { init3DBackground, update3DTheme } from './3d-background.js'
import { initCursorAnimation } from './cursor-animation.js'

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  // Hide loading screen
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen')
    if (loadingScreen) {
      loadingScreen.style.opacity = '0'
      setTimeout(() => {
        loadingScreen.style.display = 'none'
      }, 500)
    }
  }, 1500)

  // Initialize with saved theme
  const savedTheme = localStorage.getItem('theme') || 'dark'
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode')
  }
  
  init3DBackground(savedTheme)
  initCursorAnimation()
  initTypingAnimation()
  initPortfolio()
})

function initTypingAnimation() {
  const typingText = document.getElementById('typing-text')
  if (!typingText) return

  const texts = [
    'Full Stack Developer',
    'UI/UX Designer',
    'Creative Thinker',
    'Problem Solver'
  ]
  
  let textIndex = 0
  let charIndex = 0
  let isDeleting = false
  
  function type() {
    const currentText = texts[textIndex]
    
    if (isDeleting) {
      typingText.textContent = currentText.substring(0, charIndex - 1)
      charIndex--
    } else {
      typingText.textContent = currentText.substring(0, charIndex + 1)
      charIndex++
    }
    
    let speed = isDeleting ? 100 : 200
    
    if (!isDeleting && charIndex === currentText.length) {
      speed = 2000
      isDeleting = true
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false
      textIndex = (textIndex + 1) % texts.length
    }
    
    setTimeout(type, speed)
  }
  
  type()
}

function initPortfolio() {
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    })
  })

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle')
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      toggleTheme()
    })
  }

  // Mobile theme toggle
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle')
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', () => {
      toggleTheme()
    })
  }

  function toggleTheme() {
    const isLightMode = document.body.classList.toggle('light-mode')
    const newTheme = isLightMode ? 'light' : 'dark'
    localStorage.setItem('theme', newTheme)
    update3DTheme(newTheme)
    
    // Update all theme icons
    document.querySelectorAll('.theme-icon').forEach(icon => {
      icon.textContent = isLightMode ? '☀️' : '🌙'
    })
  }

  // Mobile menu functionality
  initMobileMenu()

  // Contact form handling is now handled by email-handler.js

  // Subtle parallax effect for hero section (prevent overlap)
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset
    const hero = document.querySelector('.hero')
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.1}px)`
    }
  })

  // Initialize animations on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
      }
    })
  }, observerOptions)

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el)
  })

  // Add active class to current section in navigation
  const sections = document.querySelectorAll('section[id]')
  window.addEventListener('scroll', () => {
    let current = ''
    sections.forEach(section => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id')
      }
    })

    // Update desktop navigation
    document.querySelectorAll('.nav-capsule a').forEach(link => {
      link.classList.remove('active')
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active')
      }
    })

    // Update mobile navigation
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.classList.remove('active')
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active')
      }
    })
  })

  function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle')
    const mobileFab = document.getElementById('mobile-fab')
    const closeSidebarBtn = document.getElementById('close-sidebar')
    const sidebar = document.getElementById('mobile-sidebar')
    const overlay = document.getElementById('sidebar-overlay')
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link')

    function openSidebar() {
      sidebar.classList.add('open')
      overlay.classList.add('active')
      if (mobileFab) mobileFab.classList.add('active')
      document.body.style.overflow = 'hidden'
    }

    function closeSidebar() {
      sidebar.classList.remove('open')
      overlay.classList.remove('active')
      if (mobileFab) mobileFab.classList.remove('active')
      document.body.style.overflow = ''
    }

    // Toggle sidebar with floating action button
    if (mobileFab) {
      mobileFab.addEventListener('click', () => {
        if (sidebar.classList.contains('open')) {
          closeSidebar()
        } else {
          openSidebar()
        }
      })
    }

    // Toggle sidebar with header button (if exists)
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', openSidebar)
    }

    if (closeSidebarBtn) {
      closeSidebarBtn.addEventListener('click', closeSidebar)
    }

    if (overlay) {
      overlay.addEventListener('click', closeSidebar)
    }

    // Close sidebar when clicking nav links
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeSidebar()
        
        // Smooth scroll to section
        const target = document.querySelector(link.getAttribute('href'))
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      })
    })

    // Close sidebar on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeSidebar()
      }
    })
  }
}
