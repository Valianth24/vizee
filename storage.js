/**
 * TESTIFY STORAGE MANAGER
 * LocalStorage yönetimi ve veri işlemleri
 */

'use strict';

const StorageManager = {
    /**
     * Kullanıcı verilerini başlatır
     */
    initializeUser() {
        let userData = Utils.getFromStorage(Config.STORAGE_KEYS.USER_DATA);
        
        if (!userData) {
            userData = {
                id: Utils.generateId(),
                username: 'user' + Math.floor(Math.random() * 10000),
                email: '',
                avatar: '',
                createdAt: Date.now(),
                lastLogin: Date.now(),
                stats: {
                    totalTests: 0,
                    totalQuestions: 0,
                    correctAnswers: 0,
                    wrongAnswers: 0,
                    totalTime: 0,
                    xp: 0,
                    level: 1,
                    streak: 0,
                    lastTestDate: null,
                    rank: null
                },
                settings: {
                    theme: Config.THEME.DEFAULT,
                    notifications: {
                        email: true,
                        push: false
                    },
                    privacy: {
                        showInLeaderboard: true,
                        shareProgress: false
                    }
                }
            };
            
            Utils.setToStorage(Config.STORAGE_KEYS.USER_DATA, userData);
        } else {
            // Update last login
            userData.lastLogin = Date.now();
            Utils.setToStorage(Config.STORAGE_KEYS.USER_DATA, userData);
        }
        
        return userData;
    },

    /**
     * Kullanıcı verilerini getirir
     * @returns {Object} - Kullanıcı verisi
     */
    getUserData() {
        return Utils.getFromStorage(Config.STORAGE_KEYS.USER_DATA) || this.initializeUser();
    },

    /**
     * Kullanıcı verilerini günceller
     * @param {Object} updates - Güncellenecek veriler
     * @returns {boolean} - Başarılı mı?
     */
    updateUserData(updates) {
        try {
            const userData = this.getUserData();
            const updatedData = { ...userData, ...updates };
            return Utils.setToStorage(Config.STORAGE_KEYS.USER_DATA, updatedData);
        } catch (error) {
            console.error('Kullanıcı verisi güncelleme hatası:', error);
            return false;
        }
    },

    /**
     * Kullanıcı istatistiklerini günceller
     * @param {Object} stats - İstatistikler
     * @returns {boolean} - Başarılı mı?
     */
    updateUserStats(stats) {
        try {
            const userData = this.getUserData();
            userData.stats = { ...userData.stats, ...stats };
            
            // Level hesaplama
            const newLevel = this.calculateLevel(userData.stats.xp);
            if (newLevel > userData.stats.level) {
                userData.stats.level = newLevel;
                Utils.showToast(`🎉 Level ${newLevel}! Tebrikler!`, 'success');
            }
            
            // Streak hesaplama
            this.updateStreak(userData);
            
            return Utils.setToStorage(Config.STORAGE_KEYS.USER_DATA, userData);
        } catch (error) {
            console.error('İstatistik güncelleme hatası:', error);
            return false;
        }
    },

    /**
     * Level hesaplar
     * @param {number} xp - Toplam XP
     * @returns {number} - Level
     */
    calculateLevel(xp) {
        const base = Config.LEVELING.LEVEL_UP_BASE;
        const multiplier = Config.LEVELING.LEVEL_UP_MULTIPLIER;
        
        let level = 1;
        let requiredXP = base;
        
        while (xp >= requiredXP) {
            level++;
            requiredXP = Math.floor(base * Math.pow(multiplier, level - 1));
        }
        
        return level;
    },

    /**
     * Streak (seri) günceller
     * @param {Object} userData - Kullanıcı verisi
     */
    updateStreak(userData) {
        const today = new Date().setHours(0, 0, 0, 0);
        const lastTestDate = userData.stats.lastTestDate 
            ? new Date(userData.stats.lastTestDate).setHours(0, 0, 0, 0)
            : null;
        
        if (!lastTestDate) {
            userData.stats.streak = 1;
        } else {
            const daysDiff = Math.floor((today - lastTestDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 0) {
                // Aynı gün - değişiklik yok
            } else if (daysDiff === 1) {
                // Ardışık gün - streak artır
                userData.stats.streak++;
            } else {
                // Seri kırıldı
                userData.stats.streak = 1;
            }
        }
        
        userData.stats.lastTestDate = Date.now();
    },

    /**
     * Test sonucunu kaydeder
     * @param {Object} result - Test sonucu
     * @returns {boolean} - Başarılı mı?
     */
    saveTestResult(result) {
        try {
            const userData = this.getUserData();
            
            // İstatistikleri güncelle
            const stats = userData.stats;
            stats.totalTests++;
            stats.totalQuestions += result.totalQuestions;
            stats.correctAnswers += result.correctAnswers;
            stats.wrongAnswers += result.wrongAnswers;
            stats.totalTime += result.time;
            
            // XP hesapla
            let earnedXP = Config.LEVELING.XP_PER_TEST;
            earnedXP += result.correctAnswers * Config.LEVELING.XP_PER_CORRECT;
            
            // Bonus XP
            if (result.successRate >= 80) {
                earnedXP += 20; // Yüksek başarı bonusu
            }
            
            stats.xp += earnedXP;
            
            // Güncelle
            this.updateUserStats(stats);
            
            // Aktivite kaydet
            this.saveActivity({
                type: 'test_completed',
                data: result,
                timestamp: Date.now()
            });
            
            // Leaderboard güncelle
            this.updateLeaderboard();
            
            Utils.showToast(`+${earnedXP} XP kazandın!`, 'success');
            
            return true;
        } catch (error) {
            console.error('Test sonucu kaydetme hatası:', error);
            return false;
        }
    },

    /**
     * Aktivite kaydeder
     * @param {Object} activity - Aktivite
     */
    saveActivity(activity) {
        try {
            let activities = Utils.getFromStorage(Config.STORAGE_KEYS.ACTIVITY, []);
            activities.unshift(activity);
            
            // Son 50 aktiviteyi tut
            if (activities.length > 50) {
                activities = activities.slice(0, 50);
            }
            
            Utils.setToStorage(Config.STORAGE_KEYS.ACTIVITY, activities);
        } catch (error) {
            console.error('Aktivite kaydetme hatası:', error);
        }
    },

    /**
     * Aktiviteleri getirir
     * @param {number} limit - Limit
     * @returns {Array} - Aktiviteler
     */
    getActivities(limit = 10) {
        const activities = Utils.getFromStorage(Config.STORAGE_KEYS.ACTIVITY, []);
        return activities.slice(0, limit);
    },

    /**
     * Not kaydeder
     * @param {Object} note - Not
     * @returns {boolean} - Başarılı mı?
     */
    saveNote(note) {
        try {
            const notes = this.getNotes();
            
            if (note.id) {
                // Güncelleme
                const index = notes.findIndex(n => n.id === note.id);
                if (index !== -1) {
                    notes[index] = { ...notes[index], ...note, updatedAt: Date.now() };
                }
            } else {
                // Yeni not
                note.id = Utils.generateId();
                note.createdAt = Date.now();
                note.updatedAt = Date.now();
                notes.unshift(note);
            }
            
            Utils.setToStorage(Config.STORAGE_KEYS.NOTES, notes);
            Utils.showToast(Config.SUCCESS.SAVED, 'success');
            return true;
        } catch (error) {
            console.error('Not kaydetme hatası:', error);
            Utils.showToast(Config.ERRORS.GENERIC, 'error');
            return false;
        }
    },

    /**
     * Notları getirir
     * @returns {Array} - Notlar
     */
    getNotes() {
        return Utils.getFromStorage(Config.STORAGE_KEYS.NOTES, []);
    },

    /**
     * Not siler
     * @param {string} noteId - Not ID
     * @returns {boolean} - Başarılı mı?
     */
    deleteNote(noteId) {
        try {
            let notes = this.getNotes();
            notes = notes.filter(n => n.id !== noteId);
            Utils.setToStorage(Config.STORAGE_KEYS.NOTES, notes);
            Utils.showToast(Config.SUCCESS.DELETED, 'success');
            return true;
        } catch (error) {
            console.error('Not silme hatası:', error);
            Utils.showToast(Config.ERRORS.GENERIC, 'error');
            return false;
        }
    },

    /**
     * Leaderboard günceller
     */
    updateLeaderboard() {
        try {
            const userData = this.getUserData();
            let leaderboard = Utils.getFromStorage(Config.STORAGE_KEYS.LEADERBOARD, []);
            
            // Kullanıcı varsa güncelle, yoksa ekle
            const existingIndex = leaderboard.findIndex(u => u.id === userData.id);
            
            const entry = {
                id: userData.id,
                username: userData.username,
                xp: userData.stats.xp,
                level: userData.stats.level,
                totalTests: userData.stats.totalTests,
                successRate: userData.stats.totalQuestions > 0 
                    ? Math.round((userData.stats.correctAnswers / userData.stats.totalQuestions) * 100)
                    : 0,
                updatedAt: Date.now()
            };
            
            if (existingIndex !== -1) {
                leaderboard[existingIndex] = entry;
            } else {
                leaderboard.push(entry);
            }
            
            // XP'ye göre sırala
            leaderboard.sort((a, b) => b.xp - a.xp);
            
            // Max entry sayısı ile sınırla
            if (leaderboard.length > Config.LEADERBOARD.MAX_ENTRIES) {
                leaderboard = leaderboard.slice(0, Config.LEADERBOARD.MAX_ENTRIES);
            }
            
            // Sıra numaralarını güncelle
            leaderboard.forEach((entry, index) => {
                entry.rank = index + 1;
            });
            
            Utils.setToStorage(Config.STORAGE_KEYS.LEADERBOARD, leaderboard);
            
            // Kullanıcının sırasını güncelle
            const userEntry = leaderboard.find(u => u.id === userData.id);
            if (userEntry) {
                this.updateUserData({ stats: { ...userData.stats, rank: userEntry.rank } });
            }
        } catch (error) {
            console.error('Leaderboard güncelleme hatası:', error);
        }
    },

    /**
     * Leaderboard getirir
     * @param {number} limit - Limit
     * @returns {Array} - Leaderboard
     */
    getLeaderboard(limit = 100) {
        const leaderboard = Utils.getFromStorage(Config.STORAGE_KEYS.LEADERBOARD, []);
        return leaderboard.slice(0, limit);
    },

    /**
     * Quiz durumunu kaydeder
     * @param {Object} state - Quiz durumu
     */
    saveQuizState(state) {
        Utils.setToStorage(Config.STORAGE_KEYS.QUIZ_STATE, {
            ...state,
            savedAt: Date.now()
        });
    },

    /**
     * Quiz durumunu getirir
     * @returns {Object|null} - Quiz durumu
     */
    getQuizState() {
        const state = Utils.getFromStorage(Config.STORAGE_KEYS.QUIZ_STATE);
        
        // 1 saatten eski durumları temizle
        if (state && Date.now() - state.savedAt > 3600000) {
            this.clearQuizState();
            return null;
        }
        
        return state;
    },

    /**
     * Quiz durumunu temizler
     */
    clearQuizState() {
        Utils.removeFromStorage(Config.STORAGE_KEYS.QUIZ_STATE);
    },

    /**
     * Ayarları kaydeder
     * @param {Object} settings - Ayarlar
     * @returns {boolean} - Başarılı mı?
     */
    saveSettings(settings) {
        try {
            const userData = this.getUserData();
            userData.settings = { ...userData.settings, ...settings };
            return Utils.setToStorage(Config.STORAGE_KEYS.USER_DATA, userData);
        } catch (error) {
            console.error('Ayar kaydetme hatası:', error);
            return false;
        }
    },

    /**
     * Tüm verileri sıfırlar (Dikkatli kullanın!)
     * @returns {Promise<boolean>} - Başarılı mı?
     */
    async resetAllData() {
        const confirmed = await Utils.confirm(
            'Tüm veriler silinecek! Bu işlem geri alınamaz. Emin misiniz?'
        );
        
        if (!confirmed) return false;
        
        try {
            Object.values(Config.STORAGE_KEYS).forEach(key => {
                Utils.removeFromStorage(key);
            });
            
            // Yeni kullanıcı oluştur
            this.initializeUser();
            
            Utils.showToast('Tüm veriler sıfırlandı.', 'success');
            
            // Sayfayı yenile
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
            return true;
        } catch (error) {
            console.error('Veri sıfırlama hatası:', error);
            Utils.showToast(Config.ERRORS.GENERIC, 'error');
            return false;
        }
    },

    /**
     * Verileri dışa aktar (JSON)
     * @returns {string} - JSON string
     */
    exportData() {
        try {
            const data = {
                version: Config.APP_VERSION,
                exportedAt: Date.now(),
                userData: this.getUserData(),
                notes: this.getNotes(),
                activities: this.getActivities(50)
            };
            
            return JSON.stringify(data, null, 2);
        } catch (error) {
            console.error('Veri dışa aktarma hatası:', error);
            return null;
        }
    },

    /**
     * Verileri içe aktar (JSON)
     * @param {string} jsonData - JSON string
     * @returns {boolean} - Başarılı mı?
     */
    async importData(jsonData) {
        const confirmed = await Utils.confirm(
            'Mevcut veriler silinip yeni veriler yüklenecek. Emin misiniz?'
        );
        
        if (!confirmed) return false;
        
        try {
            const data = JSON.parse(jsonData);
            
            // Versiyon kontrolü
            if (data.version !== Config.APP_VERSION) {
                Utils.showToast('Uyumsuz veri versiyonu!', 'warning');
            }
            
            // Verileri yükle
            if (data.userData) {
                Utils.setToStorage(Config.STORAGE_KEYS.USER_DATA, data.userData);
            }
            if (data.notes) {
                Utils.setToStorage(Config.STORAGE_KEYS.NOTES, data.notes);
            }
            if (data.activities) {
                Utils.setToStorage(Config.STORAGE_KEYS.ACTIVITY, data.activities);
            }
            
            Utils.showToast('Veriler başarıyla yüklendi!', 'success');
            
            // Sayfayı yenile
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
            return true;
        } catch (error) {
            console.error('Veri içe aktarma hatası:', error);
            Utils.showToast('Geçersiz veri formatı!', 'error');
            return false;
        }
    }
};

// Export
window.StorageManager = StorageManager;
