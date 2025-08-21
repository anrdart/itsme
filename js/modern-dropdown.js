// Modern Dropdown Menu Functionality

// Fungsi untuk menginisialisasi dropdown menu
function initDropdown() {
  // Pastikan elemen ada sebelum mencoba mengakses mereka
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  
  if (!hamburgerBtn || !dropdownMenu) {
    console.error('Dropdown menu elements not found!');
    return; // Keluar jika elemen tidak ditemukan
  }
  
  const menuLinks = document.querySelectorAll('.dropdown-menu .link-item');
  
  // Reset hamburger button untuk menghindari konflik event listener
  const newHamburgerBtn = hamburgerBtn.cloneNode(true);
  hamburgerBtn.parentNode.replaceChild(newHamburgerBtn, hamburgerBtn);
  const refreshedHamburgerBtn = document.querySelector('.hamburger-btn');
  
  // Toggle dropdown menu
  refreshedHamburgerBtn.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent click from propagating to document
    refreshedHamburgerBtn.classList.toggle('active');
    dropdownMenu.classList.toggle('open');
  });
  
  // Navigasi dan close menu when clicking on a link
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default anchor behavior
      
      // Simpan referensi ke tombol hamburger dan dropdown menu
      const btn = document.querySelector('.hamburger-btn');
      const menu = document.querySelector('.dropdown-menu');
      
      // Tutup dropdown menu
      btn.classList.remove('active');
      menu.classList.remove('open');
      
      // Ambil target section dari href
      const targetHash = this.getAttribute('href');
      
      // Scroll ke section yang dituju dengan smooth scroll
      setTimeout(() => {
        // Nonaktifkan section yang aktif saat ini
        const currentActive = document.querySelector('.section.active');
        if (currentActive) {
          currentActive.classList.remove('active');
          currentActive.classList.add('hide');
        }
        
        // Aktifkan section baru
        const targetSection = document.querySelector(targetHash);
        if (targetSection) {
          targetSection.classList.add('active');
          targetSection.classList.remove('hide');
          
          // Scroll ke section tersebut
          targetSection.scrollIntoView({ behavior: 'smooth' });
          
          // Update URL hash
          window.location.hash = targetHash;
          
          // Update active class pada menu
          const allMenuLinks = document.querySelectorAll('.dropdown-menu .link-item');
          allMenuLinks.forEach(item => {
            item.classList.remove('active', 'inner-shadow');
            item.classList.add('outer-shadow', 'hover-in-shadow');
          });
          
          // Cari link yang sesuai dengan section
          const activeLink = document.querySelector(`.dropdown-menu .link-item[href="${targetHash}"]`);
          if (activeLink) {
            activeLink.classList.add('active', 'inner-shadow');
            activeLink.classList.remove('outer-shadow', 'hover-in-shadow');
          }
        }
      }, 300); // Delay sedikit untuk memastikan dropdown sudah tertutup
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    const btn = document.querySelector('.hamburger-btn');
    const menu = document.querySelector('.dropdown-menu');
    
    // Periksa apakah klik di CV dropdown area
    const cvDropdown = document.querySelector('.cv-dropdown');
    const cvDropdownBtn = document.querySelector('.cv-dropdown-btn');
    
    // Jangan tutup menu jika klik di area CV dropdown
    if (cvDropdown && (cvDropdown.contains(e.target) || (cvDropdownBtn && cvDropdownBtn.contains(e.target)))) {
      return;
    }
    
    if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
      btn.classList.remove('active');
      menu.classList.remove('open');
    }
  });
  
  // Highlight active menu item based on current section
  function setActiveMenuItem() {
    const sections = document.querySelectorAll('.section');
    const links = document.querySelectorAll('.dropdown-menu .link-item');
    
    sections.forEach(section => {
      if (section.classList.contains('active')) {
        const id = section.getAttribute('id');
        
        // Remove active class from all menu items
        links.forEach(link => {
          link.classList.remove('active', 'inner-shadow');
          link.classList.add('outer-shadow', 'hover-in-shadow');
        });
        
        // Add active class to current menu item
        const activeLink = document.querySelector(`.dropdown-menu .link-item[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('active', 'inner-shadow');
          activeLink.classList.remove('outer-shadow', 'hover-in-shadow');
        }
      }
    });
  }
  
  // Update active menu item on page load and when switching sections
  window.addEventListener('load', setActiveMenuItem);
  
  document.addEventListener('sectionChange', setActiveMenuItem);
}

// Inisialisasi dropdown menu saat dokumen siap
document.addEventListener('DOMContentLoaded', initDropdown);

// Reinisialisasi dropdown menu setelah navigasi
window.addEventListener('hashchange', function() {
  // Berikan waktu singkat untuk memastikan DOM sudah diperbarui
  setTimeout(initDropdown, 100);
});
