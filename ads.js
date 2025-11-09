/**
 * TESTIFY ADS MANAGER - MAXIMUM REVENUE
 * Her pozisyonda en karlı reklam formatları
 */

'use strict';

const AdsManager = {
    config: {
        // BURAYA KENDİ ADSENSE ID'Nİ YAZ
        googleAdsenseId: 'ca-pub-XXXXXXXXXXXXXXXXX',
        
        // REKLAM GÖSTERİM AYARLARI
        settings: {
            // Her kaç soruda bir göster (1 = her soruda, 2 = her 2 soruda)
            questionAdInterval: 2, // Her 2 soruda bir = DAHA FAZLA GELİR
            
            // Sidebar reklamı göster mi?
            enableSidebar: true,
            
            // Dashboard reklamı göster mi?
            enableDashboard: true,
            
            // Mobilde de göster mi?
            enableMobile: true,
            
            // Test başlangıcında göster mi?
            showOnStart: true,
            
            // Sonuç sayfasında kaç reklam?
            resultsAdCount: 2 // 2 reklam = 2x gelir
        }
    },
    
    stats: {
        totalAds: 0,
        impressions: 0,
        sessionStart: Date.now()
    },

    /**
     * BAŞLAT
     */
    init() {
        console.log('💰 Maximum Revenue Ads başlatılıyor...');
        
        // Google AdSense yükle
        this.loadGoogleAdsense();
        
        // Tüm reklam pozisyonlarını oluştur
        setTimeout(() => {
            this.createAllAds();
        }, 1000);
        
        console.log('✅ Ads Manager hazır - Maximum revenue mode');
    },

    /**
     * GOOGLE ADSENSE YÜKLE
     */
    loadGoogleAdsense() {
        const script = document.createElement('script');
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.config.googleAdsenseId}`;
        
        // Hata yakalama
        script.onerror = () => {
            console.warn('⚠️ AdSense yüklenemedi - AdBlock aktif olabilir');
        };
        
        document.head.appendChild(script);
        console.log('📡 Google AdSense script yüklendi');
    },

    /**
     * TÜM REKLAMLARI OLUŞTUR
     */
    createAllAds() {
        console.log('🎯 Tüm reklam pozisyonları oluşturuluyor...');
        
        // 1. Sidebar (Desktop için en karlı)
        if (this.config.settings.enableSidebar && window.innerWidth > 768) {
            this.createSidebarAd();
        }
        
        // 2. Dashboard banner
        if (this.config.settings.enableDashboard) {
            this.createDashboardTopAd();
            this.createDashboardBottomAd();
        }
        
        console.log(`✅ ${this.stats.totalAds} reklam pozisyonu oluşturuldu`);
    },

    /**
     * SIDEBAR REKLAMI (STICKY - EN KARLI)
     */
    createSidebarAd() {
        const sidebar = document.querySelector('.ai-sidebar');
        if (!sidebar) return;
        
        // Reklam konteyneri
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-container sidebar-ad-sticky';
        adContainer.innerHTML = `
            <div class="ad-label">Sponsorlu</div>
            <!-- AdSense Auto Ads - Sticky Sidebar -->
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="${this.config.googleAdsenseId}"
                 data-ad-slot="XXXXXX1"
                 data-ad-format="vertical"
                 data-full-width-responsive="true"></ins>
        `;
        
        sidebar.appendChild(adContainer);
        this.pushAd(adContainer);
        
        console.log('✅ Sidebar reklam eklendi (Sticky)');
    },

    /**
     * DASHBOARD ÜST BANNER (İLK ETKİLEŞİM)
     */
    createDashboardTopAd() {
        const dashboard = document.getElementById('dashboardContent');
        if (!dashboard) return;
        
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-container dashboard-top-ad';
        adContainer.innerHTML = `
            <div class="ad-label">Reklam</div>
            <!-- AdSense Display Ad - Top Banner -->
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="${this.config.googleAdsenseId}"
                 data-ad-slot="XXXXXX2"
                 data-ad-format="horizontal"
                 data-full-width-responsive="true"></ins>
        `;
        
        // En üste ekle
        dashboard.insertBefore(adContainer, dashboard.firstChild);
        this.pushAd(adContainer);
        
        console.log('✅ Dashboard üst banner eklendi');
    },

    /**
     * DASHBOARD ALT BANNER
     */
    createDashboardBottomAd() {
        const dashboard = document.getElementById('dashboardContent');
        if (!dashboard) return;
        
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-container dashboard-bottom-ad';
        adContainer.innerHTML = `
            <div class="ad-label">Sponsorlu İçerik</div>
            <!-- AdSense Native Ad -->
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-format="fluid"
                 data-ad-layout-key="-fb+5w+4e-db+86"
                 data-ad-client="${this.config.googleAdsenseId}"
                 data-ad-slot="XXXXXX3"></ins>
        `;
        
        dashboard.appendChild(adContainer);
        this.pushAd(adContainer);
        
        console.log('✅ Dashboard alt banner eklendi');
    },

    /**
     * SORU ARASI REKLAM (EN SIK GÖSTERME = EN FAZLA GELİR)
     */
    showQuestionAd(questionNumber) {
        // Her N soruda bir göster
        if (questionNumber % this.config.settings.questionAdInterval !== 0) {
            return;
        }
        
        const quizContainer = document.querySelector('.question-card');
        if (!quizContainer) return;
        
        // Mevcut reklamı temizle
        const existingAd = document.querySelector('.question-ad');
        if (existingAd) existingAd.remove();
        
        // Yeni reklam
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-container question-ad';
        adContainer.innerHTML = `
            <div class="ad-label">Sponsorlu</div>
            <!-- AdSense In-Article Ad -->
            <ins class="adsbygoogle"
                 style="display:block; text-align:center;"
                 data-ad-layout="in-article"
                 data-ad-format="fluid"
                 data-ad-client="${this.config.googleAdsenseId}"
                 data-ad-slot="XXXXXX4"></ins>
        `;
        
        // Sorudan sonra ekle
        quizContainer.parentNode.insertBefore(adContainer, quizContainer.nextSibling);
        this.pushAd(adContainer);
        
        console.log(`✅ Soru ${questionNumber} - Reklam gösterildi`);
    },

    /**
     * SONUÇ SAYFASI REKLAMLARI (EN YÜKSEK CPM!)
     */
    showResultsAds() {
        const resultsContainer = document.getElementById('resultsPage');
        if (!resultsContainer) return;
        
        console.log('🎯 Sonuç sayfası reklamları yükleniyor...');
        
        // Reklam 1: Sonuçlardan önce (En karlı pozisyon)
        this.createResultsTopAd(resultsContainer);
        
        // Reklam 2: Sonuçlardan sonra
        if (this.config.settings.resultsAdCount >= 2) {
            this.createResultsBottomAd(resultsContainer);
        }
    },

    /**
     * SONUÇ SAYFASI - ÜST REKLAM
     */
    createResultsTopAd(container) {
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-container results-top-ad';
        adContainer.innerHTML = `
            <div class="ad-label">Reklam</div>
            <!-- AdSense Display - Results Top -->
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="${this.config.googleAdsenseId}"
                 data-ad-slot="XXXXXX5"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        `;
        
        container.insertBefore(adContainer, container.firstChild);
        this.pushAd(adContainer);
        
        console.log('✅ Sonuç sayfası üst reklam');
    },

    /**
     * SONUÇ SAYFASI - ALT REKLAM
     */
    createResultsBottomAd(container) {
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-container results-bottom-ad';
        adContainer.innerHTML = `
            <div class="ad-label">Sponsorlu İçerik</div>
            <!-- AdSense Native - Results Bottom -->
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-format="autorelaxed"
                 data-ad-client="${this.config.googleAdsenseId}"
                 data-ad-slot="XXXXXX6"></ins>
        `;
        
        container.appendChild(adContainer);
        this.pushAd(adContainer);
        
        console.log('✅ Sonuç sayfası alt reklam');
    },

    /**
     * TEST BAŞLANGICI REKLAMI (Full-screen interstitial)
     */
    showTestStartAd() {
        if (!this.config.settings.showOnStart) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'ad-interstitial';
        overlay.innerHTML = `
            <div class="interstitial-content">
                <button class="interstitial-close" onclick="AdsManager.closeInterstitial(this)">
                    ✕ Kapat
                </button>
                <div class="ad-label">Reklam - 5 saniye</div>
                <!-- AdSense Interstitial -->
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="${this.config.googleAdsenseId}"
                     data-ad-slot="XXXXXX7"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.pushAd(overlay);
        
        // 5 saniye sonra kapat butonu aktif
        setTimeout(() => {
            const closeBtn = overlay.querySelector('.interstitial-close');
            if (closeBtn) {
                closeBtn.disabled = false;
                closeBtn.textContent = '✕ Devam Et';
            }
        }, 5000);
        
        console.log('✅ Test başlangıç interstitial reklam');
    },

    /**
     * INTERSTITIAL KAPAT
     */
    closeInterstitial(button) {
        const overlay = button.closest('.ad-interstitial');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => overlay.remove(), 300);
        }
    },

    /**
     * REKLAM PUSH (AdSense'e gönder)
     */
    pushAd(container) {
        try {
            const adElement = container.querySelector('.adsbygoogle');
            if (adElement && !adElement.dataset.adsbygoogleStatus) {
                (adsbygoogle = window.adsbygoogle || []).push({});
                this.stats.totalAds++;
                this.stats.impressions++;
            }
        } catch (e) {
            console.warn('⚠️ Reklam yüklenemedi:', e);
        }
    },

    /**
     * MOBİL REKLAM AYARLARI
     */
    optimizeForMobile() {
        if (window.innerWidth <= 768) {
            console.log('📱 Mobil optimizasyonu aktif');
            
            // Sidebar'ı gizle (mobilde sidebar yok)
            const sidebarAd = document.querySelector('.sidebar-ad-sticky');
            if (sidebarAd) sidebarAd.style.display = 'none';
            
            // Mobil için anchor ad ekle (en karlı mobil format)
            this.createMobileAnchorAd();
        }
    },

    /**
     * MOBİL ANCHOR AD (Ekranın altına yapışık - Yüksek CTR)
     */
    createMobileAnchorAd() {
        const anchorAd = document.createElement('div');
        anchorAd.className = 'ad-anchor-mobile';
        anchorAd.innerHTML = `
            <!-- AdSense Anchor Ad -->
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="${this.config.googleAdsenseId}"
                 data-ad-slot="XXXXXX8"
                 data-ad-format="auto"
                 data-anchor-status="displayed"></ins>
        `;
        
        document.body.appendChild(anchorAd);
        this.pushAd(anchorAd);
        
        console.log('✅ Mobil anchor ad eklendi');
    },

    /**
     * GELİR İSTATİSTİKLERİ
     */
    getStats() {
        const sessionMinutes = (Date.now() - this.stats.sessionStart) / 60000;
        const cpm = 3; // Ortalama CPM $3
        const estimatedRevenue = (this.stats.impressions / 1000) * cpm;
        
        return {
            totalAds: this.stats.totalAds,
            impressions: this.stats.impressions,
            sessionMinutes: Math.round(sessionMinutes),
            estimatedRevenue: estimatedRevenue.toFixed(2)
        };
    }
};

// ============================================
// QUIZ MANAGER ENTEGRASYONU
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Ads Manager'ı başlat
    AdsManager.init();
    
    // Mobil optimizasyon
    AdsManager.optimizeForMobile();
});

// Quiz.js ile entegrasyon
if (window.QuizManager) {
    // Test başlatıldığında
    const originalStartQuiz = QuizManager.startQuiz;
    QuizManager.startQuiz = function(mode) {
        originalStartQuiz.call(this, mode);
        
        // Test başlangıç reklamı (opsiyonel)
        if (AdsManager.config.settings.showOnStart) {
            setTimeout(() => {
                AdsManager.showTestStartAd();
            }, 500);
        }
    };
    
    // Her soru gösteriminde
    const originalDisplayQuestion = QuizManager.displayQuestion;
    QuizManager.displayQuestion = function() {
        originalDisplayQuestion.call(this);
        
        // Soru arası reklam
        AdsManager.showQuestionAd(this.state.currentIndex + 1);
    };
    
    // Sonuç sayfasında
    const originalShowResults = QuizManager.showResults;
    QuizManager.showResults = function(results) {
        originalShowResults.call(this, results);
        
        // Sonuç sayfası reklamları (en karlı!)
        setTimeout(() => {
            AdsManager.showResultsAds();
        }, 500);
    };
}

// Sayfa değişimlerinde reklam güncelle
window.addEventListener('resize', () => {
    AdsManager.optimizeForMobile();
});

// Export
window.AdsManager = AdsManager;

console.log('💰 Testify Ads Manager yüklendi - Maximum Revenue Mode');
