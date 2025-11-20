// script1.js - FULL SCRIPT DENGAN PERBAIKAN PROFILE DROPDOWN

// Elemen DOM
const overlay = document.getElementById('overlay');

// Elemen Navigasi dan Profile
const navTujuan = document.getElementById('nav-tujuan');
const navTentang = document.getElementById('nav-tentang');
const menuTujuan = document.getElementById('menu-tujuan');
const menuTentang = document.getElementById('menu-tentang');
const closeBtns = document.querySelectorAll('.close-btn');

const profileToggle = document.getElementById('profile-toggle');
const profileDropdown = document.getElementById('profile-dropdown');

// ==========================================================
// 1. Logika Menu Slide-out (Tujuan/Tentang)
// ==========================================================

/**
 * Mengontrol tampilan menu slide-out (Tujuan/Tentang)
 * @param {HTMLElement} menuElement - Elemen menu slide-out
 * @param {boolean} show - Status buka/tutup
 * @param {HTMLElement} navElement - Elemen navigasi yang sesuai (opsional)
 */
function toggleMenu(menuElement, show, navElement = null) {
    const navTujuanRef = document.getElementById('nav-tujuan');
    const navTentangRef = document.getElementById('nav-tentang');
    
    // Hapus kelas aktif dari SEMUA nav Tujuan/Tentang
    if (navTujuanRef) navTujuanRef.classList.remove('nav-active-blue');
    if (navTentangRef) navTentangRef.classList.remove('nav-active-blue');
    
    // Logika buka/tutup
    if (show) {
        menuElement.classList.add('open');
        overlay.classList.add('active');
        // Tutup dropdown jika menu dibuka
        if (profileDropdown) profileDropdown.classList.remove('open'); 
        document.body.style.overflow = 'hidden'; // Mencegah scroll
        
        if (navElement) {
            navElement.classList.add('nav-active-blue');
        }
    } else {
        menuElement.classList.remove('open');
        
        // Hapus overlay hanya jika TIDAK ADA elemen yang terbuka
        const isOpen = (el) => el && el.classList.contains('open');
        
        if (!isOpen(menuTujuan) && !isOpen(menuTentang) && !isOpen(profileDropdown)) {
             overlay.classList.remove('active');
             document.body.style.overflow = ''; // Izinkan scroll
        }
    }
}

// ==========================================================
// 2. Logika Profile Dropdown (Perbaikan Utama)
// ==========================================================

function setupProfileToggle() {
    if (!profileToggle || !profileDropdown) return;
    
    // Aksi saat Profile Toggle diklik
    profileToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // PENTING: Mencegah klik menyebar ke document.body
        
        // Tutup semua slide-menu jika ada yang terbuka
        toggleMenu(menuTujuan, false);
        toggleMenu(menuTentang, false);

        // Toggle kelas 'open' pada dropdown
        profileDropdown.classList.toggle('open');

        // Mengatur overlay dan scroll body
        if (profileDropdown.classList.contains('open')) {
            document.body.style.overflow = 'hidden'; 
        } else {
            // Hapus overlay hanya jika menu lain tidak terbuka
            if (!menuTujuan.classList.contains('open') && !menuTentang.classList.contains('open')) {
                 overlay.classList.remove('active');
                 document.body.style.overflow = '';
            }
        }
    });

    // Aksi menutup dropdown saat klik di luar
    document.body.addEventListener('click', (e) => {
        // Jika dropdown terbuka DAN klik bukan pada toggle DAN bukan di dalam dropdown
        if (profileDropdown.classList.contains('open') && 
            !profileToggle.contains(e.target) && 
            !profileDropdown.contains(e.target)) {
            
            profileDropdown.classList.remove('open');
            
            // Hapus overlay
             if (!menuTujuan.classList.contains('open') && !menuTentang.classList.contains('open')) {
                 overlay.classList.remove('active');
                 document.body.style.overflow = '';
            }
        }
    });
}

// ==========================================================
// 3. Panggil Event Listeners
// ==========================================================

function initializeApp() {
    
    // Event Listeners untuk Menu Tujuan/Tentang
    if (navTujuan && menuTujuan) {
        navTujuan.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMenu(menuTentang, false);
            toggleMenu(menuTujuan, true, navTujuan);
        });
    }

    if (navTentang && menuTentang) {
        navTentang.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMenu(menuTujuan, false);
            toggleMenu(menuTentang, true, navTentang);
        });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const menuType = btn.dataset.menu;
            if (menuType === 'tujuan') {
                toggleMenu(menuTujuan, false, navTujuan); 
            } else if (menuType === 'tentang') {
                toggleMenu(menuTentang, false, navTentang);
            }
        });
    });

    // Tutup SEMUA saat Overlay diklik
    overlay.addEventListener('click', () => {
        toggleMenu(menuTujuan, false, navTujuan);
        toggleMenu(menuTentang, false, navTentang);
        
        if (profileDropdown && profileDropdown.classList.contains('open')) {
            profileDropdown.classList.remove('open');
            document.body.style.overflow = ''; // Izinkan scroll
            overlay.classList.remove('active'); // Pastikan overlay hilang
        }
    });

    // PANGGIL LOGIKA PROFILE DROPDOWN
    setupProfileToggle();
}

// ==========================================================
// 4. Inisialisasi Utama
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    // Tambahkan kelas 'loaded' untuk memicu transisi CSS
    document.body.classList.add('loaded');
    
    // Panggil semua inisialisasi fungsional
    initializeApp(); 
});