// Icon Manager - Mengelola visibilitas ikon untuk menghindari tumpang tindih
document.addEventListener('DOMContentLoaded', function() {
  // Daftar semua ikon yang dapat diklik
  const clickableIcons = [
    '.hamburger-btn',
    '.modern-color-picker-toggler',
    '.style-switcher-toggler',
    '.day-night'
  ];
  
  // Daftar menu yang sesuai dengan ikon
  const menus = [
    '.dropdown-menu',
    '.modern-color-picker',
    '.style-switcher',
    null // day-night tidak punya menu dropdown
  ];
  
  // Fungsi untuk menyembunyikan ikon saat menu aktif
  function updateIconsVisibility() {
    // Periksa status setiap menu (apakah aktif/terbuka)
    const activeMenus = menus.map(menuSelector => {
      if (menuSelector === null) return false; // Untuk ikon tanpa menu (seperti day-night)
      const menu = document.querySelector(menuSelector);
      return menu ? menu.classList.contains('open') : false;
    });
    
    // Variabel untuk mengecek apakah ada menu yang aktif
    const isAnyMenuActive = activeMenus.some(isActive => isActive);
    
    // Sembunyikan/tampilkan ikon sesuai status menu
    clickableIcons.forEach((iconSelector, index) => {
      const icons = document.querySelectorAll(iconSelector);
      
      icons.forEach(icon => {
        // Tombol dark/light mode selalu disembunyikan jika ada menu dropdown yang aktif
        if (iconSelector === '.day-night' && isAnyMenuActive) {
          icon.style.opacity = '0';
          icon.style.pointerEvents = 'none';
          icon.style.visibility = 'hidden';
          return;
        }
        
        // Untuk ikon lainnya, gunakan logika sebelumnya
        if (activeMenus.some((isActive, i) => isActive && i !== index)) {
          // Jika ada menu lain yang aktif, sembunyikan ikon ini
          icon.style.opacity = '0';
          icon.style.pointerEvents = 'none';
          icon.style.visibility = 'hidden';
        } else {
          // Tampilkan ikon jika tidak ada menu lain yang aktif
          icon.style.opacity = '1';
          icon.style.pointerEvents = 'auto';
          icon.style.visibility = 'visible';
          
          // Tambahkan efek transisi agar perubahan tampilan halus
          icon.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
        }
      });
    });
  }
  
  // Tambahkan event listener ke setiap ikon
  clickableIcons.forEach((iconSelector, index) => {
    const icons = document.querySelectorAll(iconSelector);
    
    icons.forEach(icon => {
      icon.addEventListener('click', function() {
        setTimeout(updateIconsVisibility, 50); // Delay sedikit untuk memastikan status menu sudah diperbarui
      });
    });
  });
  
  // Tambahkan event listener untuk menutup menu
  document.addEventListener('click', function(e) {
    // Periksa apakah klik di luar menu
    const isOutsideAnyMenu = menus.every(menuSelector => {
      const menu = document.querySelector(menuSelector);
      const menuIcon = document.querySelector(clickableIcons[menus.indexOf(menuSelector)]);
      
      return menu && !menu.contains(e.target) && menuIcon && !menuIcon.contains(e.target);
    });
    
    if (isOutsideAnyMenu) {
      setTimeout(updateIconsVisibility, 50);
    }
  });
  
  // Event listener untuk kemungkinan perubahan DOM
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        if (menus.some(selector => mutation.target.matches(selector))) {
          updateIconsVisibility();
        }
      }
    });
  });
  
  // Mulai pemantauan untuk semua menu
  menus.forEach(menuSelector => {
    const menu = document.querySelector(menuSelector);
    if (menu) {
      observer.observe(menu, { attributes: true });
    }
  });
  
  // Panggil fungsi pada saat halaman dimuat
  updateIconsVisibility();
});
