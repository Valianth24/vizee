/**
 * TESTIFY MAIN APPLICATION - DÜZELTILMIŞ
 * Error Handling + Performance Optimization
 */

'use strict';

const App = {
    /**
     * Uygulamayı başlatır
     */
    init() {
        try {
            console.log('🎓 Testify başlatılıyor...');
            
            // Storage'ı kontrol et
            this.checkStorage();
            
            // Kullanıcı verilerini yükle
            this.loadUserData();
            
            // Tema yükle
            this.loadTheme();
            
            // Event listener'ları ekle
            this.attachEventListeners();
            
            // Dashboard'ı güncelle
            this.updateDashboard();
            
            // Leaderboard'ı güncelle
            this.updateLeaderboard();
            
            console.log('✅ Testify hazır!');
            
            // Başarılı başlatma bildirimi
            setTimeout(() => {
                Utils.showToast('Testify\'a hoş geldiniz! 🎉', 'success');
            }, 500);
        } catch (error) {
            console.error('❌ Uygulama başlatma hatası:', error);
            Utils.showToast('Uygulama başlatılamadı. Lütfen sayfayı yenileyin.', 'error');
        }
    },

    /**
     * Storage kontrolü
     */
    checkStorage() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.error('Storage hatası:', e);
            Utils.showToast('LocalStorage kullanılamıyor! Veriler kaydedilmeyecek.', 'warning');
            return false;
        }
    },

    /**
     * Kullanıcı verilerini yükler
     */
    loadUserData() {
        try {
            const userData = StorageManager.getUserData();
            
            if (!userData) {
                throw new Error('Kullanıcı verisi bulunamadı');
            }
            
            // Header'daki bilgileri güncelle
            const userAvatar = document.getElementById('userAvatar');
            const streak = document.getElementById('streak');
            const totalPoints = document.getElementById('totalPoints');
            const rank = document.getElementById('rank');
            
            if (userAvatar) {
                userAvatar.textContent = userData.username.charAt(0).toUpperCase();
                userAvatar.title = userData.username;
            }
            
            if (streak) {
                streak.textContent = userData.stats.streak + ' Gün';
                streak.title = 'Günlük seri';
            }
            
            if (totalPoints) {
                totalPoints.textContent = Utils.formatNumber(userData.stats.xp) + ' XP';
                totalPoints.title = userData.stats.xp + ' XP';
            }
            
            if (rank) {
                rank.textContent = userData.stats.rank ? '#' + userData.stats.rank : '#--';
                rank.title = userData.stats.rank ? userData.stats.rank + '. sırada' : 'Henüz sıralama yok';
            }
        } catch (error) {
            console.error('Kullanıcı verisi yükleme hatası:', error);
            Utils.showToast('Kullanıcı bilgileri yüklenemedi', 'error');
        }
    },

    /**
     * Tema yöneticisi
     */
    themeManager: {
        toggle() {
            try {
                const html = document.documentElement;
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                html.setAttribute('data-theme', newTheme);
                
                const themeIcon = document.getElementById('themeIcon');
                if (themeIcon) {
                    themeIcon.textContent = newTheme === 'light' ? '☀️' : '🌙';
                }
                
                // Theme butonunun pressed durumu
                const themeBtn = document.querySelector('.theme-toggle');
                if (themeBtn) {
                    themeBtn.setAttribute('aria-pressed', newTheme === 'dark');
                }
                
                // Temayı kaydet
                Utils.setToStorage(Config.STORAGE_KEYS.THEME, newTheme);
                
                // Bildirim
                Utils.showToast(
                    newTheme === 'dark' ? '🌙 Karanlık mod aktif' : '☀️ Aydınlık mod aktif', 
                    'info'
                );
            } catch (error) {
                console.error('Tema değiştirme hatası:', error);
                Utils.showToast('Tema değiştirilemedi', 'error');
            }
        }
    },

    /**
     * Temayı yükler
     */
    loadTheme() {
        try {
            const savedTheme = Utils.getFromStorage(Config.STORAGE_KEYS.THEME, 'light');
            document.documentElement.setAttribute('data-theme', savedTheme);
            
            const themeIcon = document.getElementById('themeIcon');
            if (themeIcon) {
                themeIcon.textContent = savedTheme === 'light' ? '☀️' : '🌙';
            }
            
            const themeBtn = document.querySelector('.theme-toggle');
            if (themeBtn) {
                themeBtn.setAttribute('aria-pressed', savedTheme === 'dark');
            }
        } catch (error) {
            console.error('Tema yükleme hatası:', error);
        }
    },

    /**
     * Tab navigasyonu - Optimize edilmiş
     */
    switchTab(tabName) {
        try {
            // Tab butonlarını güncelle
            document.querySelectorAll('.nav-tab').forEach(tab => {
                const isActive = tab.dataset.tab === tabName;
                tab.classList.toggle('active', isActive);
                tab.setAttribute('aria-selected', isActive);
            });

            // Tab içeriklerini güncelle
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.toggle('active', content.id === tabName);
            });

            // Tab'a özel yüklemeler - Debounced
            this.loadTabContent(tabName);
        } catch (error) {
            console.error('Tab değiştirme hatası:', error);
            Utils.showToast('Sekme yüklenemedi', 'error');
        }
    },

    /**
     * Tab içeriğini yükler - Debounced
     */
    loadTabContent: Utils.debounce(function(tabName) {
        try {
            switch(tabName) {
                case 'leaderboard':
                    App.updateLeaderboard();
                    break;
                case 'notes':
                    App.updateNotes();
                    break;
                case 'analysis':
                    App.updateAnalysis();
                    break;
                case 'dashboard':
                    App.updateDashboard();
                    break;
            }
        } catch (error) {
            console.error('Tab içerik yükleme hatası:', error);
        }
    }, 150),

    /**
     * Dashboard'ı günceller
     */
    updateDashboard() {
        try {
            const userData = StorageManager.getUserData();
            const stats = userData.stats;

            // İstatistikleri güncelle
            const totalTests = document.getElementById('totalTests');
            const totalQuestions = document.getElementById('totalQuestions');
            const successRate = document.getElementById('successRate');
            const avgTime = document.getElementById('avgTime');

            if (totalTests) totalTests.textContent = stats.totalTests;
            if (totalQuestions) totalQuestions.textContent = stats.totalQuestions;
            
            if (successRate) {
                const rate = stats.totalQuestions > 0 
                    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
                    : 0;
                successRate.textContent = rate + '%';
            }
            
            if (avgTime) {
                const avg = stats.totalTests > 0 
                    ? Math.round(stats.totalTime / stats.totalTests)
                    : 0;
                avgTime.textContent = Utils.formatTime(avg);
            }

            // Son aktiviteleri göster
            this.updateActivityList();
        } catch (error) {
            console.error('Dashboard güncelleme hatası:', error);
            Utils.showToast('Dashboard güncellenemedi', 'error');
        }
    },

    /**
     * Aktivite listesini günceller - Optimize edilmiş
     */
    updateActivityList() {
        try {
            const activities = StorageManager.getActivities(5);
            const activityList = document.getElementById('activityList');
            
            if (!activityList) return;

            if (activities.length === 0) {
                activityList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📊</div>
                        <p>Henüz aktivite yok. Test çözerek başla!</p>
                    </div>
                `;
                return;
            }

            // Fragment kullanarak performance iyileştirmesi
            const fragment = document.createDocumentFragment();
            
            activities.forEach(activity => {
                const div = document.createElement('div');
                div.className = 'activity-item';
                div.style.cssText = 'padding: 15px; background: var(--bg-secondary); border-radius: 8px; margin-bottom: 10px; border: 1px solid var(--border);';
                
                div.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${this.getActivityTitle(activity)}</strong>
                            <p style="margin: 5px 0 0; color: var(--text-secondary); font-size: 0.9rem;">
                                ${this.getActivityDescription(activity)}
                            </p>
                        </div>
                        <small style="color: var(--text-tertiary);">
                            ${Utils.formatDate(activity.timestamp)}
                        </small>
                    </div>
                `;
                
                fragment.appendChild(div);
            });
            
            activityList.innerHTML = '';
            activityList.appendChild(fragment);
        } catch (error) {
            console.error('Aktivite listesi güncelleme hatası:', error);
        }
    },

    /**
     * Aktivite başlığı
     */
    getActivityTitle(activity) {
        const titles = {
            'test_completed': '✅ Test Tamamlandı',
            'note_created': '📝 Not Oluşturuldu',
            'level_up': '🎉 Level Atlandı'
        };
        return titles[activity.type] || 'Aktivite';
    },

    /**
     * Aktivite açıklaması
     */
    getActivityDescription(activity) {
        try {
            switch(activity.type) {
                case 'test_completed':
                    return `${activity.data.correctAnswers}/${activity.data.totalQuestions} doğru - %${activity.data.successRate} başarı`;
                case 'note_created':
                    return activity.data.title || 'Yeni not';
                case 'level_up':
                    return `Level ${activity.data.level}!`;
                default:
                    return '';
            }
        } catch (error) {
            return 'Aktivite bilgisi yüklenemedi';
        }
    },

    /**
     * Leaderboard'ı günceller - Optimize edilmiş
     */
    updateLeaderboard() {
        try {
            const leaderboard = StorageManager.getLeaderboard(100);
            const tbody = document.getElementById('leaderboardBody');
            
            if (!tbody) return;

            if (leaderboard.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="empty-cell">
                            <div class="empty-state">
                                <div class="empty-state-icon">🏆</div>
                                <p>Henüz veri bulunmuyor. İlk sıralamaya girmek için test çöz!</p>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }

            // Fragment kullanarak performance iyileştirmesi
            const fragment = document.createDocumentFragment();
            
            leaderboard.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <span class="rank-badge ${this.getRankClass(user.rank)}">${user.rank}</span>
                    </td>
                    <td>
                        <div class="user-info">
                            <div class="user-avatar-small">${user.username.charAt(0).toUpperCase()}</div>
                            <span>${Utils.sanitizeHTML(user.username)}</span>
                        </div>
                    </td>
                    <td><strong>${Utils.formatNumber(user.xp)} XP</strong></td>
                    <td>${user.totalTests}</td>
                    <td><span style="color: var(--success);">${user.successRate}%</span></td>
                `;
                fragment.appendChild(tr);
            });
            
            tbody.innerHTML = '';
            tbody.appendChild(fragment);
        } catch (error) {
            console.error('Leaderboard güncelleme hatası:', error);
            Utils.showToast('Liderlik tablosu yüklenemedi', 'error');
        }
    },

    /**
     * Rank class
     */
    getRankClass(rank) {
        if (rank === 1) return 'rank-1';
        if (rank === 2) return 'rank-2';
        if (rank === 3) return 'rank-3';
        return 'rank-default';
    },

    /**
     * Notları günceller - Optimize edilmiş
     */
    updateNotes() {
        try {
            const notes = StorageManager.getNotes();
            const notesList = document.getElementById('notesList');
            
            if (!notesList) return;

            if (notes.length === 0) {
                notesList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📚</div>
                        <p>Henüz not eklemedin. "Yeni Not" butonuna tıklayarak başla!</p>
                    </div>
                `;
                return;
            }

            // Fragment kullanarak performance iyileştirmesi
            const fragment = document.createDocumentFragment();
            
            notes.forEach(note => {
                const div = document.createElement('div');
                div.className = 'note-card';
                div.innerHTML = `
                    <h3 class="note-title">${Utils.sanitizeHTML(note.title || 'Başlıksız Not')}</h3>
                    <p class="note-content">${Utils.sanitizeHTML(note.content || '')}</p>
                    <div class="note-meta">
                        <span>${Utils.formatDate(note.createdAt)}</span>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.85rem;" onclick="App.editNote('${note.id}')" aria-label="Notu düzenle">
                                ✏️ Düzenle
                            </button>
                            <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.85rem;" onclick="App.deleteNote('${note.id}')" aria-label="Notu sil">
                                🗑️ Sil
                            </button>
                        </div>
                    </div>
                `;
                fragment.appendChild(div);
            });
            
            notesList.innerHTML = '';
            notesList.appendChild(fragment);
        } catch (error) {
            console.error('Notlar güncelleme hatası:', error);
            Utils.showToast('Notlar yüklenemedi', 'error');
        }
    },

    /**
     * Not ekler
     */
    async addNote() {
        try {
            const title = prompt('Not Başlığı:');
            if (!title) return;

            const content = prompt('Not İçeriği:');
            if (!content) return;

            const note = {
                title: title.trim(),
                content: content.trim()
            };

            if (StorageManager.saveNote(note)) {
                this.updateNotes();
            }
        } catch (error) {
            console.error('Not ekleme hatası:', error);
            Utils.showToast('Not eklenemedi', 'error');
        }
    },

    /**
     * Not düzenler
     */
    async editNote(noteId) {
        try {
            const notes = StorageManager.getNotes();
            const note = notes.find(n => n.id === noteId);
            
            if (!note) {
                Utils.showToast('Not bulunamadı', 'error');
                return;
            }

            const title = prompt('Not Başlığı:', note.title);
            if (title === null) return;

            const content = prompt('Not İçeriği:', note.content);
            if (content === null) return;

            note.title = title.trim();
            note.content = content.trim();

            if (StorageManager.saveNote(note)) {
                this.updateNotes();
            }
        } catch (error) {
            console.error('Not düzenleme hatası:', error);
            Utils.showToast('Not düzenlenemedi', 'error');
        }
    },

    /**
     * Not siler
     */
    async deleteNote(noteId) {
        try {
            const confirmed = await Utils.confirm('Bu notu silmek istediğinizden emin misiniz?');
            
            if (confirmed && StorageManager.deleteNote(noteId)) {
                this.updateNotes();
            }
        } catch (error) {
            console.error('Not silme hatası:', error);
            Utils.showToast('Not silinemedi', 'error');
        }
    },

    /**
     * Analiz sayfasını günceller
     */
    updateAnalysis() {
        try {
            const userData = StorageManager.getUserData();
            const stats = userData.stats;
            const analysisContent = document.getElementById('analysisContent');
            
            if (!analysisContent) return;

            if (stats.totalTests === 0) {
                analysisContent.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📈</div>
                        <p>Analiz için daha fazla test çöz</p>
                    </div>
                `;
                return;
            }

            const successRate = Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
            const avgTime = Math.round(stats.totalTime / stats.totalTests);

            analysisContent.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-value">${successRate}%</div>
                        <div class="stat-label">Ortalama Başarı</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⏱️</div>
                        <div class="stat-value">${Utils.formatTime(avgTime)}</div>
                        <div class="stat-label">Ortalama Süre</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-value">${stats.correctAnswers}</div>
                        <div class="stat-label">Toplam Doğru</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">❌</div>
                        <div class="stat-value">${stats.wrongAnswers}</div>
                        <div class="stat-label">Toplam Yanlış</div>
                    </div>
                </div>
                <div style="margin-top: 30px; padding: 20px; background: var(--bg-secondary); border-radius: 10px; border: 1px solid var(--border);">
                    <h3>📊 Performans Değerlendirmesi</h3>
                    <p style="margin-top: 10px; line-height: 1.6;">
                        ${this.getPerformanceText(successRate)}
                    </p>
                </div>
            `;
        } catch (error) {
            console.error('Analiz güncelleme hatası:', error);
            Utils.showToast('Analiz yüklenemedi', 'error');
        }
    },

    /**
     * Performans metni
     */
    getPerformanceText(successRate) {
        if (successRate >= 90) {
            return '🌟 Mükemmel! Harika bir performans gösteriyorsun. Böyle devam et!';
        } else if (successRate >= 75) {
            return '👏 Çok iyi! Başarılı bir performans. Biraz daha çalışarak daha da iyileştirebilirsin.';
        } else if (successRate >= 60) {
            return '💪 İyi gidiyorsun! Biraz daha pratik yaparsan hedeflerine ulaşabilirsin.';
        } else if (successRate >= 40) {
            return '📚 Daha fazla çalışma gerekiyor. Düzenli pratik yaparak gelişebilirsin.';
        } else {
            return '🎯 Temel konuları tekrar etmen önerilir. Yavaş yavaş ilerlemeye devam et!';
        }
    },

    /**
     * Ayarları kaydeder
     */
    saveSettings(event) {
        event.preventDefault();

        try {
            const form = event.target;
            const username = form.username.value.trim();
            const email = form.email.value.trim();

            // Validasyon
            if (!Utils.validateUsername(username)) {
                Utils.showToast('Geçersiz kullanıcı adı! (3-20 karakter, sadece harf, rakam ve _)', 'error');
                return;
            }

            if (email && !Utils.validateEmail(email)) {
                Utils.showToast('Geçersiz e-posta adresi!', 'error');
                return;
            }

            // Kaydet
            const userData = StorageManager.getUserData();
            userData.username = username;
            userData.email = email;
            userData.settings.notifications = {
                email: form.emailNotif.checked,
                push: form.pushNotif.checked
            };

            if (StorageManager.updateUserData(userData)) {
                Utils.showToast(Config.SUCCESS.SAVED, 'success');
                this.loadUserData();
                this.updateLeaderboard();
            } else {
                throw new Error('Veri kaydedilemedi');
            }
        } catch (error) {
            console.error('Ayar kaydetme hatası:', error);
            Utils.showToast(Config.ERRORS.GENERIC, 'error');
        }
    },

    /**
     * Ayarları sıfırlar
     */
    async resetSettings() {
        try {
            const confirmed = await Utils.confirm('Ayarlar varsayılan değerlere dönecek. Emin misiniz?');
            
            if (!confirmed) return;

            const userData = StorageManager.getUserData();
            const usernameInput = document.getElementById('username');
            const emailInput = document.getElementById('email');
            const emailNotif = document.getElementById('emailNotif');
            const pushNotif = document.getElementById('pushNotif');
            
            if (usernameInput) usernameInput.value = userData.username;
            if (emailInput) emailInput.value = userData.email || '';
            if (emailNotif) emailNotif.checked = true;
            if (pushNotif) pushNotif.checked = false;

            Utils.showToast('Ayarlar sıfırlandı', 'info');
        } catch (error) {
            console.error('Ayar sıfırlama hatası:', error);
            Utils.showToast('Ayarlar sıfırlanamadı', 'error');
        }
    },

    /**
     * Dosya yükleme işlemi
     */
    handleFileUpload(event) {
        try {
            const file = event.target.files[0];
            if (!file) return;

            // Dosya boyutu kontrolü
            if (file.size > Config.FILE_UPLOAD.MAX_SIZE) {
                Utils.showToast(Config.ERRORS.FILE_SIZE, 'error');
                event.target.value = '';
                return;
            }

            // Dosya türü kontrolü
            const ext = file.name.split('.').pop().toLowerCase();
            if (!Config.FILE_UPLOAD.ALLOWED_TYPES.includes(ext)) {
                Utils.showToast(Config.ERRORS.FILE_TYPE, 'error');
                event.target.value = '';
                return;
            }

            // Dosya bilgisini göster
            const fileInfo = document.getElementById('fileInfo');
            if (fileInfo) {
                fileInfo.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>📄</span>
                        <div>
                            <div><strong>${Utils.sanitizeHTML(file.name)}</strong></div>
                            <small style="color: var(--text-secondary);">${Utils.formatFileSize(file.size)}</small>
                        </div>
                    </div>
                `;
            }

            Utils.showToast(Config.SUCCESS.FILE_UPLOADED, 'success');
        } catch (error) {
            console.error('Dosya yükleme hatası:', error);
            Utils.showToast('Dosya yüklenemedi', 'error');
        }
    },

    /**
     * Test oluşturma formu
     */
    handleCreateTest(event) {
        event.preventDefault();

        try {
            const form = event.target;
            const title = form.testTitle.value.trim();
            const category = form.testCategory.value;

            if (!title) {
                Utils.showToast('Test başlığı gerekli!', 'error');
                return;
            }

            if (!category) {
                Utils.showToast('Kategori seçmelisiniz!', 'error');
                return;
            }

            Utils.showToast('Test oluşturma özelliği yakında eklenecek!', 'info');
            
            // Form sıfırla
            form.reset();
            const fileInfo = document.getElementById('fileInfo');
            if (fileInfo) fileInfo.innerHTML = '';
        } catch (error) {
            console.error('Test oluşturma hatası:', error);
            Utils.showToast('Test oluşturulamadı', 'error');
        }
    },

    /**
     * Event listener'ları ekler - Optimize edilmiş
     */
    attachEventListeners() {
        try {
            // Tab navigasyonu - Event delegation
            const navTabs = document.querySelector('.nav-tabs');
            if (navTabs) {
                navTabs.addEventListener('click', (e) => {
                    const tab = e.target.closest('.nav-tab');
                    if (tab && tab.dataset.tab) {
                        this.switchTab(tab.dataset.tab);
                    }
                });
            }

            // Ayarlar formu
            const settingsForm = document.getElementById('settingsForm');
            if (settingsForm) {
                settingsForm.addEventListener('submit', (e) => this.saveSettings(e));
            }

            // Ayarları sıfırla
            const resetBtn = document.getElementById('resetBtn');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => this.resetSettings());
            }

            // Dosya yükleme
            const fileUpload = document.getElementById('fileUpload');
            if (fileUpload) {
                fileUpload.addEventListener('change', (e) => this.handleFileUpload(e));
            }

            // Test oluşturma formu
            const createForm = document.getElementById('createTestForm');
            if (createForm) {
                createForm.addEventListener('submit', (e) => this.handleCreateTest(e));
            }

            // Not ekleme butonu
            const addNoteBtn = document.getElementById('addNoteBtn');
            if (addNoteBtn) {
                addNoteBtn.addEventListener('click', () => this.addNote());
            }

            // Tema değiştir
            window.themeManager = this.themeManager;

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                // Alt + D: Dark mode toggle
                if (e.altKey && e.key === 'd') {
                    e.preventDefault();
                    this.themeManager.toggle();
                }
            });
        } catch (error) {
            console.error('Event listener ekleme hatası:', error);
        }
    }
};

// Uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    try {
        App.init();
    } catch (error) {
        console.error('Fatal error:', error);
        alert('Uygulama başlatılamadı. Lütfen sayfayı yenileyin.');
    }
});

// Error handling - Global
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// Export
window.App = App;
