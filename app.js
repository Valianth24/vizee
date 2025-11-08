/**
 * TESTIFY MAIN APPLICATION
 * Tüm özellikleri çalışır hale getiren ana uygulama
 */

'use strict';

const App = {
    /**
     * Uygulamayı başlatır
     */
    init() {
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
    },

    /**
     * Storage kontrolü
     */
    checkStorage() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
        } catch (e) {
            Utils.showToast('LocalStorage kullanılamıyor! Veriler kaydedilmeyecek.', 'warning');
            console.error('Storage hatası:', e);
        }
    },

    /**
     * Kullanıcı verilerini yükler
     */
    loadUserData() {
        try {
            const userData = StorageManager.getUserData();
            
            // Header'daki bilgileri güncelle
            document.getElementById('userAvatar').textContent = 
                userData.username.charAt(0).toUpperCase();
            document.getElementById('streak').textContent = 
                userData.stats.streak + ' Gün';
            document.getElementById('totalPoints').textContent = 
                userData.stats.xp + ' XP';
            document.getElementById('rank').textContent = 
                userData.stats.rank ? '#' + userData.stats.rank : '#--';
        } catch (error) {
            console.error('Kullanıcı verisi yükleme hatası:', error);
        }
    },

    /**
     * Tema yöneticisi
     */
    themeManager: {
        toggle() {
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
            
            Utils.setToStorage(Config.STORAGE_KEYS.THEME, newTheme);
        }
    },

    /**
     * Temayı yükler
     */
    loadTheme() {
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
    },

    /**
     * Tab navigasyonu
     */
    switchTab(tabName) {
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

        // Tab'a özel yüklemeler
        switch(tabName) {
            case 'leaderboard':
                this.updateLeaderboard();
                break;
            case 'notes':
                this.updateNotes();
                break;
            case 'analysis':
                this.updateAnalysis();
                break;
        }
    },

    /**
     * Dashboard'ı günceller
     */
    updateDashboard() {
        const userData = StorageManager.getUserData();
        const stats = userData.stats;

        document.getElementById('totalTests').textContent = stats.totalTests;
        document.getElementById('totalQuestions').textContent = stats.totalQuestions;
        
        const successRate = stats.totalQuestions > 0 
            ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
            : 0;
        document.getElementById('successRate').textContent = successRate + '%';
        
        const avgTime = stats.totalTests > 0 
            ? Math.round(stats.totalTime / stats.totalTests)
            : 0;
        document.getElementById('avgTime').textContent = avgTime + 's';

        // Son aktiviteleri göster
        this.updateActivityList();
    },

    /**
     * Aktivite listesini günceller
     */
    updateActivityList() {
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

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item" style="padding: 15px; background: var(--bg-secondary); border-radius: 8px; margin-bottom: 10px;">
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
            </div>
        `).join('');
    },

    /**
     * Aktivite başlığı
     */
    getActivityTitle(activity) {
        switch(activity.type) {
            case 'test_completed':
                return '✅ Test Tamamlandı';
            case 'note_created':
                return '📝 Not Oluşturuldu';
            case 'level_up':
                return '🎉 Level Atlandı';
            default:
                return 'Aktivite';
        }
    },

    /**
     * Aktivite açıklaması
     */
    getActivityDescription(activity) {
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
    },

    /**
     * Leaderboard'ı günceller
     */
    updateLeaderboard() {
        const leaderboard = StorageManager.getLeaderboard(100);
        const tbody = document.getElementById('leaderboardBody');
        
        if (!tbody) return;

        if (leaderboard.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-cell">Henüz veri bulunmuyor</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = leaderboard.map(user => `
            <tr>
                <td>
                    <span class="rank-badge ${this.getRankClass(user.rank)}">${user.rank}</span>
                </td>
                <td>
                    <div class="user-info">
                        <div class="user-avatar-small">${user.username.charAt(0).toUpperCase()}</div>
                        <span>${Utils.sanitizeHTML(user.username)}</span>
                    </div>
                </td>
                <td><strong>${user.xp} XP</strong></td>
                <td>${user.totalTests}</td>
                <td><span style="color: var(--success);">${user.successRate}%</span></td>
            </tr>
        `).join('');
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
     * Notları günceller
     */
    updateNotes() {
        const notes = StorageManager.getNotes();
        const notesList = document.getElementById('notesList');
        
        if (!notesList) return;

        if (notes.length === 0) {
            notesList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📚</div>
                    <p>Henüz not eklemedin</p>
                </div>
            `;
            return;
        }

        notesList.innerHTML = notes.map(note => `
            <div class="note-card">
                <h3 class="note-title">${Utils.sanitizeHTML(note.title || 'Başlıksız Not')}</h3>
                <p class="note-content">${Utils.sanitizeHTML(note.content || '')}</p>
                <div class="note-meta">
                    <span>${Utils.formatDate(note.createdAt)}</span>
                    <div>
                        <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.85rem;" onclick="App.editNote('${note.id}')">
                            Düzenle
                        </button>
                        <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.85rem;" onclick="App.deleteNote('${note.id}')">
                            Sil
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    /**
     * Not ekler
     */
    async addNote() {
        const title = prompt('Not Başlığı:');
        if (!title) return;

        const content = prompt('Not İçeriği:');
        if (!content) return;

        const note = {
            title: title,
            content: content
        };

        if (StorageManager.saveNote(note)) {
            this.updateNotes();
        }
    },

    /**
     * Not düzenler
     */
    async editNote(noteId) {
        const notes = StorageManager.getNotes();
        const note = notes.find(n => n.id === noteId);
        
        if (!note) return;

        const title = prompt('Not Başlığı:', note.title);
        if (title === null) return;

        const content = prompt('Not İçeriği:', note.content);
        if (content === null) return;

        note.title = title;
        note.content = content;

        if (StorageManager.saveNote(note)) {
            this.updateNotes();
        }
    },

    /**
     * Not siler
     */
    async deleteNote(noteId) {
        const confirmed = await Utils.confirm('Bu notu silmek istediğinizden emin misiniz?');
        
        if (confirmed && StorageManager.deleteNote(noteId)) {
            this.updateNotes();
        }
    },

    /**
     * Analiz sayfasını günceller
     */
    updateAnalysis() {
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
            <div style="margin-top: 30px; padding: 20px; background: var(--bg-secondary); border-radius: 10px;">
                <h3>Performans Değerlendirmesi</h3>
                <p style="margin-top: 10px; line-height: 1.6;">
                    ${this.getPerformanceText(successRate)}
                </p>
            </div>
        `;
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
        const settings = {
            username: username,
            email: email,
            notifications: {
                email: form.emailNotif.checked,
                push: form.pushNotif.checked
            }
        };

        const userData = StorageManager.getUserData();
        userData.username = username;
        userData.email = email;
        userData.settings.notifications = settings.notifications;

        if (StorageManager.updateUserData(userData)) {
            Utils.showToast(Config.SUCCESS.SAVED, 'success');
            this.loadUserData();
        } else {
            Utils.showToast(Config.ERRORS.GENERIC, 'error');
        }
    },

    /**
     * Ayarları sıfırlar
     */
    async resetSettings() {
        const confirmed = await Utils.confirm('Ayarlar varsayılan değerlere dönecek. Emin misiniz?');
        
        if (!confirmed) return;

        const userData = StorageManager.getUserData();
        document.getElementById('username').value = userData.username;
        document.getElementById('email').value = userData.email || '';
        document.getElementById('emailNotif').checked = true;
        document.getElementById('pushNotif').checked = false;

        Utils.showToast('Ayarlar sıfırlandı', 'info');
    },

    /**
     * Dosya yükleme işlemi
     */
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Dosya boyutu kontrolü
        if (file.size > Config.FILE_UPLOAD.MAX_SIZE) {
            Utils.showToast(Config.ERRORS.FILE_SIZE, 'error');
            return;
        }

        // Dosya türü kontrolü
        const ext = file.name.split('.').pop().toLowerCase();
        if (!Config.FILE_UPLOAD.ALLOWED_TYPES.includes(ext)) {
            Utils.showToast(Config.ERRORS.FILE_TYPE, 'error');
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
    },

    /**
     * Test oluşturma formu
     */
    handleCreateTest(event) {
        event.preventDefault();

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
        document.getElementById('fileInfo').innerHTML = '';
    },

    /**
     * Event listener'ları ekler
     */
    attachEventListeners() {
        // Tab navigasyonu
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

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
    }
};

// Uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export
window.App = App;
