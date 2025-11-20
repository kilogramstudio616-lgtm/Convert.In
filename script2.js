// script2.js - FULL SCRIPT LENGKAP

// Data mata uang (simulasi data real-time)
const CURRENCIES = [
    { code: 'USD', country: 'US', rate: 16728.00, flag: '🇺🇸' },
    { code: 'EUR', country: 'EU', rate: 19372.34, flag: '🇪🇺' },
    { code: 'JPY', country: 'JP', rate: 107.62, flag: '🇯🇵' },
    { code: 'CHF', country: 'CH', rate: 20951.18, flag: '🇨🇭' },
    { code: 'AUD', country: 'AU', rate: 10883.76, flag: '🇦🇺' },
    { code: 'CAD', country: 'CA', rate: 11937.45, flag: '🇨🇦' },
    { code: 'GBP', country: 'GB', rate: 21200.50, flag: '🇬🇧' },
    { code: 'CNY', country: 'CN', rate: 2300.90, flag: '🇨🇳' },
    { code: 'SGD', country: 'SG', rate: 12550.60, flag: '🇸🇬' },
    { code: 'MYR', country: 'MY', rate: 3500.25, flag: '🇲🇾' },
];

// Variabel untuk menyimpan chart instance global
let currentChart = null;

// =======================================================
// Fungsi Simulasi Data Historis (PENTING: Hanya Simulasi)
// =======================================================
function getHistoricalData(currencyCode, currentRate) {
    const labels = [];
    const data = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        labels.push(`${day}/${month}`);

        let simulatedRate = currentRate + (Math.random() - 0.5) * (currentRate * 0.03); 
        simulatedRate = parseFloat(simulatedRate.toFixed(2));
        data.push(simulatedRate);
    }

    return { labels, data };
}

// =======================================================
// Fungsi untuk Menggambar Diagram Garis (Chart.js)
// =======================================================
function drawRateChart(currencyCode, rateData) {
    const ctx = document.getElementById('rateChart').getContext('2d');
    
    if (currentChart) {
        currentChart.destroy();
    }

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: rateData.labels,
            datasets: [{
                label: `Nilai Tukar 1 ${currencyCode} ke IDR`,
                data: rateData.data,
                borderColor: '#007bff', 
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: '#007bff',
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Nilai (IDR)',
                        color: '#333'
                    },
                    ticks: {
                        callback: function(value) {
                            return 'Rp ' + value.toLocaleString('id-ID');
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tanggal',
                        color: '#333'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += 'Rp ' + context.parsed.y.toLocaleString('id-ID');
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

// =======================================================
// Fungsi untuk Efek Koin Berhamburan
// =======================================================
function triggerCoinExplosion(cardElement) {
    const container = document.createElement('div');
    container.classList.add('coin-effect-container');
    document.body.appendChild(container);

    const rect = cardElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const numberOfCoins = 25; 
    const coinEmoji = ['💰', '🪙', '💵'];

    for (let i = 0; i < numberOfCoins; i++) {
        const coin = document.createElement('span');
        coin.classList.add('coin');
        coin.textContent = coinEmoji[Math.floor(Math.random() * coinEmoji.length)];
        
        coin.style.left = `${centerX + (Math.random() - 0.5) * 50}px`;
        coin.style.top = `${centerY - 20}px`;

        const midX = (Math.random() - 0.5) * 200; 
        const midY = -200 - Math.random() * 100;  

        const endX = midX + (Math.random() - 0.5) * 600; 
        const endY = window.innerHeight * 1.5; 

        const duration = 1.5 + Math.random() * 1.0; 
        const delay = Math.random() * 0.7; 

        coin.style.setProperty('--start-x', `0px`);
        coin.style.setProperty('--start-y', `0px`);
        coin.style.setProperty('--mid-x', `${midX}px`);
        coin.style.setProperty('--mid-y', `${midY}px`);
        coin.style.setProperty('--end-x', `${endX}px`);
        coin.style.setProperty('--end-y', `${endY}px`);
        coin.style.setProperty('--duration', `${duration}s`);
        coin.style.setProperty('--delay', `${delay}s`);

        container.appendChild(coin);
    }

    setTimeout(() => {
        container.remove();
    }, 2500 + 700 + 100); 
}

// =======================================================
// Logika Kartu Mata Uang & Konversi
// =======================================================

function renderCurrencyCards() {
    const container = document.getElementById('currency-cards');
    container.innerHTML = CURRENCIES.map(c => `
        <div class="currency-card" data-code="${c.code}" data-rate="${c.rate}">
            <span class="card-flag">${c.flag}</span> 
            <div class="card-info">
                <h3 class="card-rate-code">${c.code}</h3>
                <p class="card-rate">1 ${c.code} = ${formatCurrency(c.rate)} IDR</p>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.currency-card').forEach(card => {
        card.addEventListener('click', handleCardClick);
    });
}

function handleCardClick(event) {
    const clickedCard = event.currentTarget;
    const code = clickedCard.dataset.code;
    const rate = parseFloat(clickedCard.dataset.rate);

    const expandedContainer = document.getElementById('expanded-converter');
    
    if (expandedContainer && expandedContainer.dataset.activeCode === code) {
        closeConverter(expandedContainer); 
    } else {
        triggerCoinExplosion(clickedCard);
        
        if (expandedContainer) {
            closeConverter(expandedContainer, () => {
                openConverter(clickedCard, code, rate);
            });
        } else {
            openConverter(clickedCard, code, rate);
        }
    }
}

function closeConverter(container, callback = null) {
    const TRANSITION_DURATION = 700; 
    const activeCode = container.dataset.activeCode;
    
    const originalCard = document.querySelector(`.currency-card[data-code="${activeCode}"]`);
    if (originalCard) {
        originalCard.classList.remove('active');
    }

    container.classList.remove('visible');
    
    setTimeout(() => {
        container.remove();
        
        document.querySelectorAll('.currency-card').forEach(card => {
            card.classList.remove('hidden');
        });
        
        if (currentChart) {
            currentChart.destroy();
            currentChart = null;
        }

        if (callback) {
            callback();
        }
    }, TRANSITION_DURATION); 
}

function openConverter(clickedCard, code, rate) {
    document.querySelectorAll('.currency-card').forEach(card => {
        if (card !== clickedCard) {
            card.classList.add('hidden');
        } else {
            card.classList.remove('hidden'); 
        }
    });

    clickedCard.classList.add('active');
    
    const newContainer = document.createElement('div');
    newContainer.id = 'expanded-converter';
    newContainer.classList.add('expanded-content-container');
    newContainer.dataset.activeCode = code; 

    const formHTML = `
        <div class="converter-form-area">
            <h2>Konversi ${code} ↔ IDR</h2>
            <div class="input-group">
                <label for="amount">Jumlah:</label>
                <input type="number" id="amount" value="1" min="0" step="0.01">
            </div>
            <div class="input-group">
                <label for="currency-select">Konversi Dari:</label>
                <select id="currency-select">
                    <option value="${code}">${code}</option>
                    <option value="IDR">IDR</option>
                </select>
            </div>
            <p class="result" id="conversion-result">1.00 ${code} = ${formatCurrency(rate)} IDR</p>
        </div>
    `;
    
    const chartHTML = `
        <div class="chart-area">
            <h3 id="chart-area-title">Tren Nilai Tukar ${code}/IDR (30 Hari Terakhir)</h3>
            <canvas id="rateChart"></canvas>
        </div>
    `;

    newContainer.innerHTML = formHTML + chartHTML;
    clickedCard.parentNode.insertBefore(newContainer, clickedCard.nextSibling);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
             newContainer.classList.add('visible'); 
        });
    });

    const historicalData = getHistoricalData(code, rate);
    setTimeout(() => {
        drawRateChart(code, historicalData);
    }, 100);

    setupConversionListeners(code, rate);
}

function setupConversionListeners(code, rate) {
    const amountInput = document.getElementById('amount');
    const currencySelect = document.getElementById('currency-select');
    
    const updateConversion = () => {
        const amount = parseFloat(amountInput.value) || 0;
        const fromCurrency = currencySelect.value;
        const resultElement = document.getElementById('conversion-result');
        
        let resultText = '';
        
        if (fromCurrency === code) {
            const result = amount * rate;
            resultText = `${amount.toFixed(2)} ${code} = ${formatCurrency(result)} IDR`;
        } else {
            if (rate > 0) {
                const result = amount / rate;
                resultText = `${formatCurrency(amount, 'IDR')} = ${result.toFixed(2)} ${code}`;
            } else {
                resultText = "Nilai tukar tidak valid.";
            }
        }
        
        resultElement.textContent = resultText;
    };

    amountInput.addEventListener('input', updateConversion);
    currencySelect.addEventListener('change', updateConversion);
    updateConversion(); 
}

function formatCurrency(number, unit = 'IDR') {
    if (unit === 'IDR') {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 2 }).format(number).replace('IDR', '').trim();
    }
    return number.toLocaleString('id-ID', { minimumFractionDigits: 2 });
}

// =======================================================
// Logika Penutupan Global (Klik di luar)
// =======================================================

function setupGlobalCloseListener() {
    document.addEventListener('click', (event) => {
        const expandedContainer = document.getElementById('expanded-converter');
        
        if (expandedContainer) {
            const clickedCard = document.querySelector(`.currency-card.active`);
            
            const isClickOutsideConverter = !expandedContainer.contains(event.target);
            const isClickOutsideActiveCard = !clickedCard.contains(event.target);
            
            // Tambahan: Pastikan klik bukan pada elemen-elemen di dalam converter
            const isClickOnConverterControls = event.target.closest('.converter-form-area');

            if (isClickOutsideConverter && isClickOutsideActiveCard && !isClickOnConverterControls) {
                closeConverter(expandedContainer);
            }
        }
    });
}


// =======================================================
// Logika Menu, Profile Dropdown, dan Pembukaan Slide
// =======================================================

/**
 * Menampilkan atau menyembunyikan menu geser dan overlay.
 */
function toggleSlideMenu(menuId, open = true) {
    const menu = document.getElementById(menuId);
    const overlay = document.getElementById('overlay');
    
    if (menu && overlay) {
        if (open) {
            menu.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        } else {
            menu.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

function setupMenuToggles() {
    // A. LOGIKA UNTUK PROFILE DROPDOWN (Area yang bermasalah)
    const profileToggle = document.getElementById('profile-toggle');
    const profileDropdown = document.getElementById('profile-dropdown');

    if (profileToggle && profileDropdown) {
        // Memicu toggle kelas 'open' saat tombol profile diklik
        profileToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // MENCEGAH KLIK INI DITANGKAP OLEH document.addEventListener di bawah
            profileDropdown.classList.toggle('open');
        });

        // Menutup dropdown jika klik di luar
        document.addEventListener('click', (e) => {
             // Pastikan klik TIDAK terjadi pada tombol toggle dan TIDAK di dalam dropdown
            if (!profileToggle.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('open');
            }
        });
    }


    // B. LOGIKA UNTUK SLIDE MENUS (Tujuan/Tentang)
    // 1. Tautan Navigasi Utama (Header)
    document.getElementById('nav-tujuan').addEventListener('click', (e) => {
        e.preventDefault();
        toggleSlideMenu('menu-tujuan');
    });

    document.getElementById('nav-tentang').addEventListener('click', (e) => {
        e.preventDefault();
        toggleSlideMenu('menu-tentang');
    });

    // 2. Tautan Footer
    document.getElementById('footer-tujuan').addEventListener('click', (e) => {
        e.preventDefault();
        toggleSlideMenu('menu-tujuan');
    });

    document.getElementById('footer-tentang').addEventListener('click', (e) => {
        e.preventDefault();
        toggleSlideMenu('menu-tentang');
    });

    // 3. Tombol Tutup (X)
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const menuId = `menu-${e.currentTarget.dataset.menu}`;
            toggleSlideMenu(menuId, false);
        });
    });

    // 4. Overlay untuk menutup menu
    document.getElementById('overlay').addEventListener('click', () => {
        const openMenu = document.querySelector('.slide-menu.open');
        if (openMenu) {
            toggleSlideMenu(openMenu.id, false);
        }
    });
}


// =======================================================
// PANGGILAN FUNGSI UTAMA (INIT)
// Pastikan bagian ini berada di paling bawah script
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    // Semua fungsi harus dipanggil di sini setelah DOM siap
    renderCurrencyCards(); 
    setupGlobalCloseListener();
    setupMenuToggles(); // <-- Ini memuat logika Profile Dropdown
});