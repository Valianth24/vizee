/**
 * TESTIFY MY QUIZZES MANAGER
 * Kullanıcının tüm quiz'lerini yönetir
 */

'use strict';

const MyQuizzesManager = {
    quizzes: [],
    currentFilter: 'all',
    
    /**
     * BAŞLAT
     */
    init() {
        console.log('📚 My Quizzes Manager başlatılıyor...');
        this.loadQuizzes();
        this.setupEventListeners();
        console.log('✅ My Quizzes Manager hazır');
    },
    
    /**
     * QUİZLERİ YÜKLE
     */
    loadQuizzes() {
        try {
            // LocalStorage'dan test sonuçlarını al
            const testResults = Utils.getFromStorage(Config.STORAGE_KEYS.USER_DATA, {});
            const activities = Utils.getFromStorage(Config.STORAGE_KEYS.ACTIVITY, []);
            
            // AI tarafından oluşturulan test
            const aiTest = localStorage.getItem('testify_generated_test');
            
            this.quizzes = [];
            
            // AI testini ekle
            if (aiTest) {
                try {
                    const aiTestData = JSON.parse(aiTest);
                    this.quizzes.push({
                        id: aiTestData.id || 'ai_test',
                        title: aiTestData.title || 'AI Test',
                        description: aiTestData.description || 'AI tarafından oluşturuldu',
                        questionCount: aiTestData.questions?.length || 0,
                        type: 'ai',
                        status: 'not-started',
                        createdAt: aiTestData.createdAt || Date.now(),
                        lastAttempt: null,
                        attempts: 0,
                        bestScore: 0
                    });
                } catch (e) {
                    console.warn('AI test parse hatası:', e);
                }
            }
            
            // Geçmiş testlerden quiz'leri oluştur
            activities.filter(a => a.type === 'test_completed').forEach(activity => {
                const existingIndex = this.quizzes.findIndex(q => q.title === activity.data.testTitle);
                
                if (existingIndex !== -1) {
                    // Mevcut quiz'i güncelle
                    const quiz = this.quizzes[existingIndex];
                    quiz.attempts++;
                    quiz.lastAttempt = activity.timestamp;
                    if (activity.data.successRate > quiz.bestScore) {
                        quiz.bestScore = activity.data.successRate;
                    }
                    quiz.status = 'completed';
                } else {
                    // Yeni quiz ekle
                    this.quizzes.push({
                        id: Utils.generateId(),
                        title: activity.data.testTitle || 'Test',
                        description: `${activity.data.totalQuestions || 0} soruluk test`,
                        questionCount: activity.data.totalQuestions || 0,
                        type: 'completed',
                        status: 'completed',
                        createdAt: activity.timestamp,
                        lastAttempt: activity.timestamp,
                        attempts: 1,
                        bestScore: activity.data.successRate || 0
                    });
                }
            });
            
            // Demo quiz'ler ekle (ilk giriş için)
            if (this.quizzes.length === 0) {
                this.addDemoQuizzes();
            }
            
            console.log(`✅ ${this.quizzes.length} quiz yüklendi`);
            
        } catch (error) {
            console.error('Quiz yükleme hatası:', error);
            this.addDemoQuizzes();
        }
    },
    
    /**
     * DEMO QUİZLER EKLE
     */
    addDemoQuizzes() {
        this.quizzes = [
            {
                id: 'demo1',
                title: 'Linux Temel Komutları',
                description: 'Temel Linux terminal komutlarını test et',
                questionCount: 15,
                type: 'demo',
                status: 'not-started',
                createdAt: Date.now() - 86400000,
                lastAttempt: null,
                attempts: 0,
                bestScore: 0
            },
            {
                id: 'demo2',
                title: 'Windows İşletim Sistemi',
                description: 'Windows özellikleri ve yönetimi',
                questionCount: 20,
                type: 'demo',
                status: 'not-started',
                createdAt: Date.now() - 172800000,
                lastAttempt: null,
                attempts: 0,
                bestScore: 0
            },
            {
                id: 'demo3',
                title: 'İşletim Sistemi Temelleri',
                description: 'Genel işletim sistemi kavramları',
                questionCount: 12,
                type: 'demo',
                status: 'not-started',
                createdAt: Date.now() - 259200000,
                lastAttempt: null,
                attempts: 0,
                bestScore: 0
            }
        ];
    },
    
    /**
     * QUİZLERİ GÖSTER
     */
    displayQuizzes(filter = 'all') {
        this.currentFilter = filter;
        const container = document.getElementById('myQuizzesContent');
        
        if (!container) {
            console.error('My Quizzes container bulunamadı');
            return;
        }
        
        // Filtrele
        let filteredQuizzes = this.quizzes;
        
        if (filter !== 'all') {
            filteredQuizzes = this.quizzes.filter(q => {
                if (filter === 'completed') return q.status === 'completed';
                if (filter === 'in-progress') return q.status === 'in-progress';
                if (filter === 'not-started') return q.status === 'not-started';
                if (filter === 'ai') return q.type === 'ai';
                return true;
            });
        }
        
        // HTML oluştur
        container.innerHTML = `
            <div class="quizzes-container">
                <div class="quizzes-header">
                    <h2 class="quizzes-title">📚 Tüm Quizlerim</h2>
                    <div class="quiz-filters">
                        <button class="filter-btn ${filter === 'all' ? 'active' : ''}" 
                                onclick="MyQuizzesManager.displayQuizzes('all')">
                            Tümü (${this.quizzes.length})
                        </button>
                        <button class="filter-btn ${filter === 'ai' ? 'active' : ''}" 
                                onclick="MyQuizzesManager.displayQuizzes('ai')">
                            🤖 AI (${this.quizzes.filter(q => q.type === 'ai').length})
                        </button>
                        <button class="filter-btn ${filter === 'completed' ? 'active' : ''}" 
                                onclick="MyQuizzesManager.displayQuizzes('completed')">
                            ✅ Tamamlanan (${this.quizzes.filter(q => q.status === 'completed').length})
                        </button>
                        <button class="filter-btn ${filter === 'not-started' ? 'active' : ''}" 
                                onclick="MyQuizzesManager.displayQuizzes('not-started')">
                            ⏸️ Başlanmamış (${this.quizzes.filter(q => q.status === 'not-started').length})
                        </button>
                    </div>
                </div>
                
                ${filteredQuizzes.length > 0 ? `
                    <div class="quizzes-grid">
                        ${filteredQuizzes.map(quiz => this.createQuizCard(quiz)).join('')}
                    </div>
                ` : `
                    <div class="quizzes-empty">
                        <div class="quizzes-empty-icon">📝</div>
                        <h3 class="quizzes-empty-title">Henüz quiz yok</h3>
                        <p class="quizzes-empty-desc">
                            ${filter === 'ai' 
                                ? 'AI ile test oluşturmak için Testify AI\'ya git!' 
                                : 'Test çözerek quiz geçmişini oluştur!'}
                        </p>
                        <button class="btn-primary" onclick="TabManager.switchTab('${filter === 'ai' ? 'test' : 'test'}')">
                            ${filter === 'ai' ? '🤖 AI Test Oluştur' : '📝 Test Çöz'}
                        </button>
                    </div>
                `}
            </div>
        `;
    },
    
    /**
     * QUİZ KARTI OLUŞTUR
     */
    createQuizCard(quiz) {
        const statusClass = quiz.status.toLowerCase().replace(' ', '-');
        const statusText = {
            'completed': 'Tamamlandı',
            'in-progress': 'Devam Ediyor',
            'not-started': 'Başlanmadı'
        }[quiz.status] || 'Bilinmiyor';
        
        const typeIcon = {
            'ai': '🤖',
            'demo': '📚',
            'custom': '⚙️',
            'completed': '✅'
        }[quiz.type] || '📝';
        
        return `
            <div class="quiz-card" onclick="MyQuizzesManager.startQuiz('${quiz.id}')">
                <div class="quiz-card-header">
                    <div class="quiz-icon">${typeIcon}</div>
                </div>
                
                <h3 class="quiz-card-title">${Utils.sanitizeHTML(quiz.title)}</h3>
                <p class="quiz-card-desc">${Utils.sanitizeHTML(quiz.description)}</p>
                
                <div class="quiz-stats">
                    <div class="quiz-stat">
                        <span class="quiz-stat-value">${quiz.questionCount}</span>
                        <span class="quiz-stat-label">Soru</span>
                    </div>
                    <div class="quiz-stat">
                        <span class="quiz-stat-value">${quiz.attempts}</span>
                        <span class="quiz-stat-label">Deneme</span>
                    </div>
                    <div class="quiz-stat">
                        <span class="quiz-stat-value">${quiz.bestScore}%</span>
                        <span class="quiz-stat-label">En İyi</span>
                    </div>
                </div>
                
                <div class="quiz-meta">
                    <span class="quiz-date">
                        📅 ${Utils.formatDate(quiz.createdAt)}
                    </span>
                    <span class="quiz-badge ${statusClass}">${statusText}</span>
                </div>
            </div>
        `;
    },
    
    /**
     * QUİZ BAŞLAT
     */
    startQuiz(quizId) {
        const quiz = this.quizzes.find(q => q.id === quizId);
        
        if (!quiz) {
            Utils.showToast('Quiz bulunamadı!', 'error');
            return;
        }
        
        if (quiz.type === 'ai') {
            // AI testini yükle
            const aiTest = localStorage.getItem('testify_generated_test');
            if (aiTest) {
                Utils.showToast(`${quiz.title} yükleniyor...`, 'info');
                // Test Çöz sekmesine git
                TabManager.switchTab('test');
                // Quiz'i otomatik başlat
                setTimeout(() => {
                    if (window.QuizManager) {
                        QuizManager.startQuiz('ai');
                    }
                }, 500);
            } else {
                Utils.showToast('AI testi bulunamadı. Lütfen yeni bir test oluştur.', 'warning');
            }
        } else if (quiz.type === 'demo') {
            // Demo test başlat
            Utils.showToast(`${quiz.title} başlatılıyor...`, 'info');
            TabManager.switchTab('test');
            setTimeout(() => {
                if (window.QuizManager) {
                    QuizManager.startQuiz('practice');
                }
            }, 500);
        } else {
            Utils.showToast('Bu quiz tekrar çözülemez. Yeni test oluştur!', 'info');
        }
    },
    
    /**
     * EVENT LISTENER'LARI KUR
     */
    setupEventListeners() {
        // Tab değişince yenile
        const myQuizzesTab = document.querySelector('[data-tab="my-quizzes"]');
        if (myQuizzesTab) {
            myQuizzesTab.addEventListener('click', () => {
                this.loadQuizzes();
                this.displayQuizzes(this.currentFilter);
            });
        }
    }
};

// Başlat
document.addEventListener('DOMContentLoaded', () => {
    MyQuizzesManager.init();
});

// Export
window.MyQuizzesManager = MyQuizzesManager;
