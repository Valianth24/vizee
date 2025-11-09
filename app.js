/**
 * TESTIFY - MAIN APPLICATION
 * Tüm sistemin koordinasyonu
 */

'use strict';

// ============================================
// TAB MANAGER
// ============================================

const TabManager = {
    currentTab: 'dashboard',
    
    /**
     * TAB DEĞİŞTİR
     */
    switchTab(tabName) {
        console.log(`📑 Tab değiştiriliyor: ${tabName}`);
        
        // Önceki tab'ı kaydet
        this.currentTab = tabName;
        
        // Tüm tab içeriklerini gizle
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Tüm nav butonlarını pasif yap
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Seçili tab butonunu aktif yap
        const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
        }
        
        // İçerik ID'sini belirle
        let contentId = tabName + 'Content';
        
        // Özel durumlar
        if (tabName === 'test') {
            contentId = 'testContent';
            // Test seçim ekranını göster
            this.showTestSelection();
        } else if (tabName === 'my-quizzes') {
            contentId = 'myQuizzesContent';
            // Quizleri yükle
            if (window.MyQuizzesManager) {
                setTimeout(() => {
                    MyQuizzesManager.displayQuizzes();
                }, 100);
            }
        } else if (tabName === 'dashboard') {
            // Dashboard yükle
            if (window.DashboardManager) {
                setTimeout(() => {
                    DashboardManager.loadDashboard();
                }, 100);
            }
        }
        
        // Seçili içeriği göster
        const content = document.getElementById(contentId);
        if (content) {
            content.classList.add('active');
            console.log(`✅ Tab gösteriliyor: ${contentId}`);
        } else {
            console.error(`❌ Tab içeriği bulunamadı: ${contentId}`);
        }
        
        // Smooth scroll
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // LocalStorage'a kaydet
        try {
            localStorage.setItem('testify_last_tab', tabName);
        } catch (e) {
            console.warn('Tab tercihi kaydedilemedi:', e);
        }
    },
    
    /**
     * TEST SEÇİM EKRANINI GÖSTER
     */
    showTestSelection() {
        const testSelection = document.getElementById('testSelection');
        const quizPage = document.getElementById('quizPage');
        const resultsPage = document.getElementById('resultsPage');
        
        if (testSelection) testSelection.classList.add('active');
        if (quizPage) quizPage.classList.remove('active');
        if (resultsPage) resultsPage.classList.remove('active');
    },
    
    /**
     * SON TAB'I YÜKLE
     */
    loadLastTab() {
        try {
            const lastTab = localStorage.getItem('testify_last_tab');
            if (lastTab && lastTab !== 'dashboard') {
                this.switchTab(lastTab);
            }
        } catch (e) {
            console.warn('Son tab yüklenemedi:', e);
        }
    },
    
    /**
     * EVENT LISTENER'LARI KUR
     */
    setupEventListeners() {
        // Nav tab'larına tıklama
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                if (tabName) {
                    this.switchTab(tabName);
                }
            });
            
            // Keyboard navigation
            btn.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const tabName = btn.getAttribute('data-tab');
                    if (tabName) {
                        this.switchTab(tabName);
                    }
                }
            });
        });
        
        console.log('✅ Tab event listeners kuruldu');
    },
    
    /**
     * BAŞLAT
     */
    init() {
        console.log('📑 Tab Manager başlatılıyor...');
        this.setupEventListeners();
        // Son tab'ı yükleme (opsiyonel)
        // this.loadLastTab();
        console.log('✅ Tab Manager hazır');
    }
};

// ============================================
// THEME MANAGER
// ============================================

const ThemeManager = {
    currentTheme: 'light',
    
    /**
     * TEMA DEĞİŞTİR
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.saveTheme(this.currentTheme);
        
        console.log(`🎨 Tema değiştirildi: ${this.currentTheme}`);
    },
    
    /**
     * TEMA UYGULA
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Theme icon'u güncelle
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
        
        // Theme toggle slider
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            if (theme === 'dark') {
                toggle.classList.add('dark');
            } else {
                toggle.classList.remove('dark');
            }
        }
    },
    
    /**
     * TEMA KAYDET
     */
    saveTheme(theme) {
        try {
            localStorage.setItem('testify_theme', theme);
        } catch (e) {
            console.warn('Tema tercihi kaydedilemedi:', e);
        }
    },
    
    /**
     * TEMA YÜKLE
     */
    loadTheme() {
        try {
            const savedTheme = localStorage.getItem('testify_theme');
            
            if (savedTheme) {
                this.currentTheme = savedTheme;
            } else {
                // Sistem tercihini kontrol et
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                this.currentTheme = prefersDark ? 'dark' : 'light';
            }
            
            this.applyTheme(this.currentTheme);
            console.log(`✅ Tema yüklendi: ${this.currentTheme}`);
            
        } catch (e) {
            console.warn('Tema yüklenemedi:', e);
            this.applyTheme('light');
        }
    },
    
    /**
     * SİSTEM TEMA DEĞİŞİKLİĞİNİ DİNLE
     */
    watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Sadece kullanıcı manuel değiştirmediyse sistem temasını uygula
            const savedTheme = localStorage.getItem('testify_theme');
            if (!savedTheme) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(this.currentTheme);
            }
        });
    },
    
    /**
     * EVENT LISTENER'LARI KUR
     */
    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
            
            // Keyboard support
            themeToggle.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
            
            console.log('✅ Theme toggle event listener kuruldu');
        } else {
            console.warn('⚠️ Theme toggle butonu bulunamadı');
        }
    },
    
    /**
     * BAŞLAT
     */
    init() {
        console.log('🎨 Theme Manager başlatılıyor...');
        this.loadTheme();
        this.setupEventListeners();
        this.watchSystemTheme();
        console.log('✅ Theme Manager hazır');
    }
};

// ============================================
// NOTIFICATION MANAGER
// ============================================

const NotificationManager = {
    
    /**
     * TARAYICI BİLDİRİM İZNİ İSTE
     */
    async requestPermission() {
        if (!('Notification' in window)) {
            console.log('ℹ️ Tarayıcı bildirimleri desteklemiyor');
            return false;
        }
        
        if (Notification.permission === 'granted') {
            return true;
        }
        
        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        
        return false;
    },
    
    /**
     * BİLDİRİM GÖSTER
     */
    show(title, options = {}) {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                icon: 'assets/favicon.png',
                badge: 'assets/favicon.png',
                ...options
            });
            
            // Tıklanınca pencereyi focus et
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
            
            return notification;
        }
    },
    
    /**
     * BAŞLAT
     */
    init() {
        console.log('🔔 Notification Manager başlatılıyor...');
        // İsteğe bağlı: Bildirimi otomatik iste
        // this.requestPermission();
        console.log('✅ Notification Manager hazır');
    }
};

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

const KeyboardShortcuts = {
    shortcuts: {
        'Escape': () => {
            // Modal'ları kapat
            document.querySelectorAll('.modal-overlay').forEach(modal => {
                modal.remove();
            });
            
            // Dropdown'ları kapat
            document.querySelectorAll('.language-dropdown.show').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        },
        'F1': (e) => {
            e.preventDefault();
            TabManager.switchTab('dashboard');
        },
        'F2': (e) => {
            e.preventDefault();
            TabManager.switchTab('test');
        },
        'F3': (e) => {
            e.preventDefault();
            TabManager.switchTab('my-quizzes');
        },
        'F4': (e) => {
            e.preventDefault();
            TabManager.switchTab('create');
        },
        'Alt+T': (e) => {
            e.preventDefault();
            ThemeManager.toggleTheme();
        },
        'Alt+L': (e) => {
            e.preventDefault();
            const langBtn = document.getElementById('langBtn');
            if (langBtn) langBtn.click();
        }
    },
    
    /**
     * EVENT LISTENER KUR
     */
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            let key = e.key;
            
            // Modifier tuşlarını ekle
            if (e.altKey) key = 'Alt+' + key;
            if (e.ctrlKey) key = 'Ctrl+' + key;
            if (e.shiftKey) key = 'Shift+' + key;
            
            // Kısayol varsa çalıştır
            if (this.shortcuts[key]) {
                this.shortcuts[key](e);
            }
        });
        
        console.log('✅ Keyboard shortcuts kuruldu');
    },
    
    /**
     * BAŞLAT
     */
    init() {
        console.log('⌨️ Keyboard Shortcuts başlatılıyor...');
        this.setupEventListeners();
        console.log('✅ Keyboard Shortcuts hazır');
    }
};

// ============================================
// PERFORMANCE MONITOR
// ============================================

const PerformanceMonitor = {
    
    /**
     * PERFORMANS METRİKLERİNİ GÖSTER
     */
    logMetrics() {
        if (!window.performance) return;
        
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;
        
        console.log('📊 Performance Metrics:');
        console.log(`  - Sayfa yükleme: ${pageLoadTime}ms`);
        console.log(`  - Bağlantı: ${connectTime}ms`);
        console.log(`  - Render: ${renderTime}ms`);
    },
    
    /**
     * BAŞLAT
     */
    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.logMetrics();
            }, 0);
        });
    }
};

// ============================================
// ERROR HANDLER
// ============================================

const ErrorHandler = {
    
    /**
     * GLOBAL HATA YAKALAYICI
     */
    setupGlobalErrorHandler() {
        window.addEventListener('error', (event) => {
            console.error('💥 Global Error:', event.error);
            
            // Kullanıcıya göster (production'da kapat)
            if (window.Utils) {
                Utils.showToast('Bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
            }
            
            // Analytics'e gönder (opsiyonel)
            // this.sendToAnalytics(event.error);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('💥 Unhandled Promise Rejection:', event.reason);
            
            if (window.Utils) {
                Utils.showToast('Beklenmeyen bir hata oluştu.', 'error');
            }
        });
        
        console.log('✅ Global error handler kuruldu');
    },
    
    /**
     * BAŞLAT
     */
    init() {
        console.log('🛡️ Error Handler başlatılıyor...');
        this.setupGlobalErrorHandler();
        console.log('✅ Error Handler hazır');
    }
};

// ============================================
// SERVICE WORKER (PWA için)
// ============================================

const ServiceWorkerManager = {
    
    /**
     * SERVICE WORKER KAYDET
     */
    async register() {
        if (!('serviceWorker' in navigator)) {
            console.log('ℹ️ Service Worker desteklenmiyor');
            return;
        }
        
        try {
            // Service worker dosyası oluşturulduktan sonra aktif et
            // const registration = await navigator.serviceWorker.register('/sw.js');
            // console.log('✅ Service Worker kaydedildi:', registration);
        } catch (error) {
            console.warn('⚠️ Service Worker kaydedilemedi:', error);
        }
    },
    
    /**
     * BAŞLAT
     */
    init() {
        console.log('📱 Service Worker Manager başlatılıyor...');
        // this.register();
        console.log('ℹ️ Service Worker şu an devre dışı');
    }
};

// ============================================
// ANALYTICS (İsteğe bağlı)
// ============================================

const Analytics = {
    
    /**
     * SAYFA GÖRÜNTÜLENME
     */
    trackPageView(pageName) {
        console.log(`📊 Page View: ${pageName}`);
        
        // Google Analytics
        if (window.gtag) {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_path: `/${pageName}`
            });
        }
    },
    
    /**
     * EVENT TAKIP
     */
    trackEvent(category, action, label, value) {
        console.log(`📊 Event: ${category} - ${action} - ${label}`);
        
        // Google Analytics
        if (window.gtag) {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }
    },
    
    /**
     * BAŞLAT
     */
    init() {
        console.log('📊 Analytics başlatılıyor...');
        // Analytics kodunu buraya ekle
        console.log('ℹ️ Analytics şu an devre dışı');
    }
};

// ============================================
// ONLINE/OFFLINE DETECTOR
// ============================================

const ConnectionMonitor = {
    
    /**
     * BAĞLANTI DURUMUNU KONTROL ET
     */
    checkConnection() {
        if (navigator.onLine) {
            console.log('🟢 Çevrimiçi');
            if (window.Utils) {
                Utils.showToast('İnternet bağlantısı tekrar kuruldu', 'success', 3000);
            }
        } else {
            console.log('🔴 Çevrimdışı');
            if (window.Utils) {
                Utils.showToast('İnternet bağlantısı yok!', 'warning', 5000);
            }
        }
    },
    
    /**
     * EVENT LISTENER'LARI KUR
     */
    setupEventListeners() {
        window.addEventListener('online', () => {
            this.checkConnection();
        });
        
        window.addEventListener('offline', () => {
            this.checkConnection();
        });
        
        console.log('✅ Connection monitor kuruldu');
    },
    
    /**
     * BAŞLAT
     */
    init() {
        console.log('🌐 Connection Monitor başlatılıyor...');
        this.setupEventListeners();
        console.log('✅ Connection Monitor hazır');
    }
};

// ============================================
// AUTO SAVE (İsteğe bağlı)
// ============================================

const AutoSave = {
    interval: null,
    
    /**
     * OTOMATİK KAYDETMEYI BAŞLAT
     */
    start() {
        // Her 30 saniyede bir kaydet
        this.interval = setInterval(() => {
            if (window.QuizManager && QuizManager.state.questions.length > 0) {
                QuizManager.saveState();
                console.log('💾 Otomatik kaydedildi');
            }
        }, 30000);
    },
    
    /**
     * DURDUR
     */
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },
    
    /**
     * BAŞLAT
     */
    init() {
        console.log('💾 Auto Save başlatılıyor...');
        this.start();
        console.log('✅ Auto Save hazır (30s interval)');
    }
};

// ============================================
// APP INITIALIZATION
// ============================================

const App = {
    version: '1.0.0',
    
    /**
     * UYGULAMAYI BAŞLAT
     */
    init() {
        console.log('');
        console.log('🎓 =======================================');
        console.log('   TESTIFY - AI Destekli Test Platformu');
        console.log(`   Version: ${this.version}`);
        console.log('🎓 =======================================');
        console.log('');
        
        // Modülleri başlat
        ThemeManager.init();
        TabManager.init();
        NotificationManager.init();
        KeyboardShortcuts.init();
        ErrorHandler.init();
        ServiceWorkerManager.init();
        Analytics.init();
        ConnectionMonitor.init();
        AutoSave.init();
        PerformanceMonitor.init();
        
        // Sayfa yüklendikten sonra
        this.onPageLoad();
        
        console.log('');
        console.log('✅ Testify başarıyla başlatıldı!');
        console.log('');
    },
    
    /**
     * SAYFA YÜKLEME SONRASI
     */
    onPageLoad() {
        window.addEventListener('load', () => {
            // Loading ekranını gizle (varsa)
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 300);
            }
            
            // İlk aktivasyonları yap
            this.initialActivations();
        });
    },
    
    /**
     * İLK AKTİVASYONLAR
     */
    initialActivations() {
        // Dashboard'ı yükle
        if (window.DashboardManager) {
            DashboardManager.loadDashboard();
        }
        
        // Hoş geldin mesajı (ilk giriş)
        const isFirstVisit = !localStorage.getItem('testify_visited');
        if (isFirstVisit) {
            localStorage.setItem('testify_visited', 'true');
            
            setTimeout(() => {
                if (window.Utils) {
                    Utils.showToast('🎓 Testify\'a hoş geldiniz! Haydi test çözmeye başlayalım!', 'success', 5000);
                }
            }, 1000);
        }
    }
};

// ============================================
// WINDOW GLOBAL EXPORTS
// ============================================

window.App = App;
window.TabManager = TabManager;
window.ThemeManager = ThemeManager;
window.NotificationManager = NotificationManager;
window.KeyboardShortcuts = KeyboardShortcuts;
window.PerformanceMonitor = PerformanceMonitor;
window.ErrorHandler = ErrorHandler;
window.ServiceWorkerManager = ServiceWorkerManager;
window.Analytics = Analytics;
window.ConnectionMonitor = ConnectionMonitor;
window.AutoSave = AutoSave;

// ============================================
// AUTO START
// ============================================

// Sayfa yüklendiğinde otomatik başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });
} else {
    App.init();
}

// ============================================
// DEBUG MODE (Development için)
// ============================================

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 DEBUG MODE ACTIVE');
    
    // Debug komutları
    window.debug = {
        switchTab: (tab) => TabManager.switchTab(tab),
        toggleTheme: () => ThemeManager.toggleTheme(),
        clearData: () => {
            localStorage.clear();
            sessionStorage.clear();
            console.log('🗑️ Tüm veriler temizlendi');
            location.reload();
        },
        generateTestData: () => {
            // Test verisi oluştur
            if (window.StorageManager) {
                for (let i = 0; i < 5; i++) {
                    StorageManager.saveTestResult({
                        mode: 'practice',
                        totalQuestions: 10,
                        correctAnswers: Math.floor(Math.random() * 10),
                        wrongAnswers: Math.floor(Math.random() * 5),
                        unanswered: 0,
                        successRate: Math.floor(Math.random() * 100),
                        time: Math.floor(Math.random() * 600),
                        timestamp: Date.now() - (i * 86400000)
                    });
                }
                console.log('✅ Test verisi oluşturuldu');
                if (window.DashboardManager) {
                    DashboardManager.loadDashboard();
                }
            }
        },
        stats: () => {
            if (window.AdsManager) {
                console.log('📊 Ads Stats:', AdsManager.getStats());
            }
        },
        version: () => {
            console.log(`Testify v${App.version}`);
        }
    };
    
    console.log('💡 Debug komutları kullanılabilir: window.debug');
}
