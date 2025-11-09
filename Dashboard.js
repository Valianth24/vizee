/**
 * TESTIFY DASHBOARD MANAGER
 * Dashboard yönetimi ve istatistikler
 */

'use strict';

const DashboardManager = {
    /**
     * Dashboard'u yükler
     */
    loadDashboard() {
        console.log('📊 Dashboard yükleniyor...');
        
        // Kullanıcı verilerini al
        const userData = StorageManager.getUserData();
        
        // İstatistikleri güncelle
        this.updateStats(userData.stats);
        
        // Aktiviteleri yükle
        this.loadActivities();
        
        // Streak kontrolü
        this.checkStreak();
        
        // Header stats güncelle
        this.updateHeaderStats(userData.stats);
        
        console.log('✅ Dashboard yüklendi');
    },

    /**
     * İstatistikleri günceller
     */
    updateStats(stats) {
        // Dashboard stat kartları
        const elements = {
            testsSolved: document.getElementById('testsSolved'),
            successRate: document.getElementById('successRate'),
            totalQuestions: document.getElementById('totalQuestions'),
            avgTime: document.getElementById('avgTime')
        };
        
        if (elements.testsSolved) {
            elements.testsSolved.textContent = stats.totalTests || 0;
        }
        
        if (elements.successRate) {
            const rate = stats.totalQuestions > 0 
                ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
                : 0;
            elements.successRate.textContent = rate + '%';
        }
        
        if (elements.totalQuestions) {
            elements.totalQuestions.textContent = stats.totalQuestions || 0;
        }
        
        if (elements.avgTime) {
            const avgSeconds = stats.totalTests > 0 
                ? Math.round(stats.totalTime / stats.totalTests)
                : 0;
            elements.avgTime.textContent = Utils.formatTime(avgSeconds);
        }
    },

    /**
     * Header istatistiklerini günceller
     */
    updateHeaderStats(stats) {
        const elements = {
            streak: document.getElementById('streak'),
            totalPoints: document.getElementById('totalPoints'),
            rank: document.getElementById('rank')
        };
        
        if (elements.streak) {
            elements.streak.textContent = stats.streak || 0;
        }
        
        if (elements.totalPoints) {
            elements.totalPoints.textContent = Utils.formatNumber(stats.xp || 0);
        }
        
        if (elements.rank) {
            elements.rank.textContent = stats.rank ? `#${stats.rank}` : '#--';
        }
    },

    /**
     * Son aktiviteleri yükler
     */
    loadActivities() {
        const activitiesList = document.getElementById('activitiesList');
        if (!activitiesList) return;
        
        const activities = StorageManager.getActivities(10);
        
        if (activities.length === 0) {
            activitiesList.innerHTML = `
                <div class="empty-state">
                    <span class="empty-state-icon" aria-hidden="true">📊</span>
                    <p data-i18n="noActivities">Henüz aktivite yok. Test çözerek başla!</p>
                </div>
            `;
            return;
        }
        
        activitiesList.innerHTML = '';
        
        activities.forEach(activity => {
            const item = this.createActivityItem(activity);
            activitiesList.appendChild(item);
        });
    },

    /**
     * Aktivite öğesi oluşturur
     */
    createActivityItem(activity) {
        const div = document.createElement('div');
        div.className = 'activity-item';
        
        const icon = this.getActivityIcon(activity.type);
        const text = this.getActivityText(activity);
        const date = Utils.formatDate(activity.timestamp);
        
        div.innerHTML = `
            <div class="activity-icon">${icon}</div>
            <div class="activity-content">
                <p class="activity-text">${Utils.sanitizeHTML(text)}</p>
                <span class="activity-time">${date}</span>
            </div>
        `;
        
        return div;
    },

    /**
     * Aktivite ikonunu getirir
     */
    getActivityIcon(type) {
        const icons = {
            'test_completed': '✅',
            'test_created': '🎯',
            'achievement': '🏆',
            'level_up': '⬆️',
            'note_added': '📝'
        };
        return icons[type] || '📌';
    },

    /**
     * Aktivite metnini oluşturur
     */
    getActivityText(activity) {
        switch(activity.type) {
            case 'test_completed':
                return `Test tamamlandı: ${activity.data.totalQuestions} soru, %${activity.data.successRate} başarı`;
            case 'test_created':
                return `Yeni test oluşturuldu: ${activity.data.title}`;
            case 'achievement':
                return `Başarı kazanıldı: ${activity.data.name}`;
            case 'level_up':
                return `Level atlandı! Yeni level: ${activity.data.level}`;
            case 'note_added':
                return `Not eklendi: ${activity.data.title}`;
            default:
                return 'Aktivite kaydedildi';
        }
    },

    /**
     * Streak kontrolü yapar
     */
    checkStreak() {
        const userData = StorageManager.getUserData();
        const today = new Date().setHours(0, 0, 0, 0);
        const lastTestDate = userData.stats.lastTestDate 
            ? new Date(userData.stats.lastTestDate).setHours(0, 0, 0, 0)
            : null;
        
        if (lastTestDate) {
            const daysDiff = Math.floor((today - lastTestDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff > 1) {
                // Seri kırıldı
                if (userData.stats.streak > 7) {
                    Utils.showToast('💔 Serin kırıldı! Yeni bir başlangıç yap.', 'warning');
                }
            }
        }
    },

    /**
     * Dashboard'u yeniler
     */
    refresh() {
        this.loadDashboard();
        Utils.showToast('Dashboard yenilendi', 'success');
    }
};

// Dashboard'u başlat
document.addEventListener('DOMContentLoaded', () => {
    // İlk yükleme
    setTimeout(() => {
        DashboardManager.loadDashboard();
    }, 100);
    
    // Tab değişimlerinde yenile
    if (window.TabManager) {
        const originalSwitchTab = TabManager.switchTab;
        TabManager.switchTab = function(tabName) {
            originalSwitchTab.call(this, tabName);
            if (tabName === 'dashboard') {
                DashboardManager.loadDashboard();
            }
        };
    }
});

// Export
window.DashboardManager = DashboardManager;
