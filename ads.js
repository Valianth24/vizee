
'use strict';

const AdsManager = {
    config: {
        // Dile göre AdSense ID'leri
        adsenseIds: {
            tr: 'ca-pub-XXXXXXXXX', // Türkiye AdSense
            en: 'ca-pub-YYYYYYYYY', // Global/US AdSense
            de: 'ca-pub-ZZZZZZZZZ', // Almanya AdSense
            es: 'ca-pub-WWWWWWWWW'  // İspanya AdSense
        },
        
        // Dil bazlı CPM değerleri (tahmini)
        cpmByLanguage: {
            en: 5,  // İngilizce = En yüksek CPM
            de: 4,  // Almanca = Yüksek CPM
            es: 3,  // İspanyolca = Orta CPM
            tr: 2.5 // Türkçe = Orta CPM
        },
        
        settings: {
            questionAdInterval: 2,
            enableSidebar: true,
            enableDashboard: true,
            resultsAdCount: 2
        }
    },
    
    currentLanguage: 'tr',
    stats: {
        totalAds: 0,
        impressions: 0,
        sessionStart: Date.now()
    },

    /**
     * DİLİ GÜNCELLE
     */
    updateLanguage(lang) {
        this.currentLanguage = lang;
        console.log(`🌍 Reklam dili güncellendi: ${lang}`);
        
        // Mevcut reklamları temizle
        this.clearAllAds();
        
        // Yeni dile göre reklamları yükle
        setTimeout(() => {
            this.createAllAds();
        }, 500);
    },
    
    /**
     * MEVCUT ADSENSE ID'Yİ AL
     */
    getAdsenseId() {
        return this.adsenseIds[this.currentLanguage] || this.adsenseIds.tr;
    },
    
    /**
     * MEVCUT CPM DEĞERİNİ AL
     */
    getCurrentCPM() {
        return this.config.cpmByLanguage[this.currentLanguage] || 2.5;
    },
    
    /**
     * TÜM REKLAMLARI TEMİZLE
     */
    clearAllAds() {
        document.querySelectorAll('.ad-container').forEach(ad => ad.remove());
        this.stats.totalAds = 0;
        console.log('🧹 Mevcut reklamlar temizlendi');
    },

    /**
     * BAŞLAT
     */
    init() {
        console.log('💰 Multi-language Ads Manager başlatılıyor...');
        
        // Mevcut dili al
        this.currentLanguage = window.i18n ? i18n.currentLanguage : 'tr';
        
        // Google AdSense yükle
        this.loadGoogleAdsense();
        
        // Reklamları oluştur
        setTimeout(() => {
            this.createAllAds();
        }, 1000);
        
        console.log('✅ Ads Manager hazır');
    },

    /**
     * GOOGLE ADSENSE YÜKLE
     */
    loadGoogleAdsense() {
        const adsenseId = this.getAdsenseId();
        
        const script = document.createElement('script');
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`;
        script.onerror = () => console.warn('⚠️ AdSense yüklenemedi');
        
        document.head.appendChild(script);
        console.log('📡 Google AdSense yüklendi:', adsenseId);
    },

    /**
     * TÜM REKLAMLARI OLUŞTUR
     */
    createAllAds() {
        console.log('🎯 Reklamlar oluşturuluyor...');
        
        if (this.config.settings.enableSidebar && window.innerWidth > 768) {
            this.createSidebarAd();
        }
        
        if (this.config.settings.enableDashboard) {
            this.createDashboardTopAd();
            this.createDashboardBottomAd();
        }
        
        console.log(`✅ ${this.stats.totalAds} reklam oluşturuldu`);
    },

    /**
     * SIDEBAR REKLAMI
     */
    createSidebarAd() {
        const sidebar = document.querySelector('.ai-sidebar');
        if (!sidebar) return;
        
        const adsenseId = this.getAdsenseId();
        const adLabel = window.i18n ? i18n.t('adLabel') : 'Sponsorlu';
        
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-container sidebar-ad-sticky';
        adContainer.innerHTML = `
            <div class="ad-label">${adLabel}</div>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="${adsenseId}"
                 data-ad-slot="SLOT1"
                 data-ad-format="vertical"
                 data-full-width-responsive="true"></ins>
        `;
        
        sidebar.appendChild(adContainer);
        this.pushAd(adContainer);
    },

    /**
     * DASHBOARD ÜST REKLAM
     */
    createDashboardTopAd() {
        const dashboard = document.getElementById('dashboardContent');
        if (!dashboard) return;
        
        const adsenseId = this.getAdsenseId();
        const adLabel = window.i18n ? i18n.t('adLabelAlt') : 'Reklam';
        
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-container dashboard-top-ad';
        adContainer.innerHTML = `
            <div class="ad-label">${adLabel}</div>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="${adsenseId}"
                 data-ad-slot="SLOT2"
                 data-ad-format="horizontal"
                 data-full-width-responsive="true"></ins>
        `;
        
        dashboard.insertBefore(adContainer, dashboard.firstChild);
        this.pushAd(adContainer);
    },

    /**
     * DASHBOARD ALT REKLAM
     */
    createDashboardBottomAd() {
        const dashboard = document.getElementById('dashboardContent');
        if (!dashboard) return;
        
        const adsenseId = this.getAdsenseId();
        const adLabel = window.i18n ? i18n.t('adSponsoredContent') : 'Sponsorlu İçerik';
        
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-container dashboard-bottom-ad';
        adContainer.innerHTML = `
            <div class="ad-label">${adLabel}</div>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-format="fluid"
                 data-ad-layout-key="-fb+5w+4e-db+86"
                 data-ad-client="${adsenseId}"
                 data-ad-slot="SLOT3"></ins>
        `;
        
        dashboard.appendChild(adContainer);
        this.pushAd(adContainer);
    },

    /**
     * SORU ARASI REKLAM
     */
    showQuestionAd(questionNumber) {
        if (questionNumber % this.config.settings.questionAdInterval !== 0) return;
        
        const quizContainer = document.querySelector('.question-card');
        if (!quizContainer) return;
        
        const existingAd = document.querySelector('.question-ad');
        if (existingAd) existingAd.remove();
        
        const adsenseId = this.getAdsenseId();
        const adLabel = window.i18n ? i18n.t('adLabel') : 'Sponsorlu';
        
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-container question-ad';
        adContainer.innerHTML = `
            <div class="ad-label">${adLabel}</div>
            <ins class="adsbygoogle"
                 style="display:block; text-align:center;"
                 data-ad-layout="in-article"
                 data-ad-format="fluid"
                 data-ad-client="${adsenseId}"
                 data-ad-slot="SLOT4"></ins>
        `;
        
        quizContainer.parentNode.insertBefore(adContainer, quizContainer.nextSibling);
        this.pushAd(adContainer);
    },

    /**
     * SONUÇ SAYFASI REKLAMLARI
     */
    showResultsAds() {
        const resultsContainer = document.getElementById('resultsPage');
        if (!resultsContainer) return;
        
        this.createResultsTopAd(resultsContainer);
        
        if (this.config.settings.resultsAdCount >= 2) {
            this.createResultsBottomAd(resultsContainer);
        }
    },

    /**
     * SONUÇ ÜST REKLAM
     */
    createResultsTopAd(container) {
        const adsenseId = this.getAdsenseId();
        const adLabel = window.i18n ? i18n.t('adLabelAlt') : 'Reklam';
        
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-container results-top-ad';
        adContainer.innerHTML = `
            <div class="ad-label">${adLabel}</div>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="${adsenseId}"
                 data-ad-slot="SLOT5"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        `;
        
        container.insertBefore(adContainer, container.firstChild);
        this.pushAd(adContainer);
    },

    /**
     * SONUÇ ALT REKLAM
     */
    createResultsBottomAd(container) {
        const adsenseId = this.getAdsenseId();
        const adLabel = window.i18n ? i18n.t('adSponsoredContent') : 'Sponsorlu İçerik';
        
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-container results-bottom-ad';
        adContainer.innerHTML = `
            <div class="ad-label">${adLabel}</div>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-format="autorelaxed"
                 data-ad-client="${adsenseId}"
                 data-ad-slot="SLOT6"></ins>
        `;
        
        container.appendChild(adContainer);
        this.pushAd(adContainer);
    },

    /**
     * REKLAM PUSH
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
     * GELİR İSTATİSTİKLERİ (Dile Göre)
     */
    getStats() {
        const cpm = this.getCurrentCPM();
        const estimatedRevenue = (this.stats.impressions / 1000) * cpm;
        
        return {
            language: this.currentLanguage,
            totalAds: this.stats.totalAds,
            impressions: this.stats.impressions,
            cpm: cpm,
            estimatedRevenue: estimatedRevenue.toFixed(2)
        };
    }
};

// Quiz Manager Entegrasyonu
document.addEventListener('DOMContentLoaded', () => {
    AdsManager.init();
});

if (window.QuizManager) {
    const originalDisplayQuestion = QuizManager.displayQuestion;
    QuizManager.displayQuestion = function() {
        originalDisplayQuestion.call(this);
        AdsManager.showQuestionAd(this.state.currentIndex + 1);
    };
    
    const originalShowResults = QuizManager.showResults;
    QuizManager.showResults = function(results) {
        originalShowResults.call(this, results);
        setTimeout(() => AdsManager.showResultsAds(), 500);
    };
}

window.AdsManager = AdsManager;
