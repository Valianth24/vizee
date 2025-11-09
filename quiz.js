/**
 * TESTIFY QUIZ MANAGER - TAM TAMAMLANMIŞ SÜRÜM
 * AI Test Desteği + Tüm Özellikler
 */

'use strict';

const QuizManager = {
    // Quiz durumu
    state: {
        currentMode: null,
        questions: [],
        currentIndex: 0,
        answers: [],
        startTime: null,
        timerInterval: null,
        elapsedSeconds: 0,
        isReviewing: false,
        testTitle: null,
        testDescription: null
    },

    /**
     * AI TARAFINDAN OLUŞTURULAN TESTİ YÜKLE
     */
    loadAIGeneratedTest() {
        try {
            const aiTest = localStorage.getItem('testify_generated_test');
            if (!aiTest) {
                console.log('ℹ️ AI testi bulunamadı');
                return null;
            }
            
            const testData = JSON.parse(aiTest);
            
            // Süresi dolmuş mu kontrol et (24 saat)
            if (testData.expiresAt && Date.now() > testData.expiresAt) {
                console.log('⏰ AI testi süresi dolmuş');
                localStorage.removeItem('testify_generated_test');
                return null;
            }
            
            console.log('✅ AI testi yüklendi:', testData.title);
            console.log('📊 Soru sayısı:', testData.questions.length);
            return testData;
            
        } catch (error) {
            console.error('❌ AI test yükleme hatası:', error);
            return null;
        }
    },

    /**
     * Quiz'i başlatır - AI TEST DESTEĞİ İLE
     */
    startQuiz(mode) {
        try {
            // Önce AI testi var mı kontrol et
            const aiTest = this.loadAIGeneratedTest();
            
            if (aiTest && aiTest.questions && aiTest.questions.length > 0) {
                console.log('🤖 AI testi kullanılıyor');
                
                // AI testini kullan
                this.state = {
                    currentMode: 'ai',
                    questions: aiTest.questions,
                    currentIndex: 0,
                    answers: [],
                    startTime: Date.now(),
                    timerInterval: null,
                    elapsedSeconds: 0,
                    isReviewing: false,
                    testTitle: aiTest.title,
                    testDescription: aiTest.description
                };
                
                this.state.answers = new Array(aiTest.questions.length).fill(null);
                
                // AI testini kullandıktan sonra sil (tek kullanımlık)
                // localStorage.removeItem('testify_generated_test'); // İsterseniz silebilirsiniz
                
                // Bildirim göster
                Utils.showToast(`🤖 AI Testi: ${aiTest.title} - ${aiTest.questions.length} soru`, 'info', 4000);
                
            } else {
                console.log('📚 Varsayılan sorular kullanılıyor');
                
                // Soru bankası kontrolü
                if (!window.questionBank || !Array.isArray(window.questionBank)) {
                    Utils.showToast('Soru bankası yüklenemedi!', 'error');
                    console.error('questionBank bulunamadı!');
                    return;
                }

                if (window.questionBank.length === 0) {
                    Utils.showToast('Soru bankası boş!', 'error');
                    return;
                }

                // Tüm soruları karıştır ve al
                const allQuestions = [...window.questionBank];
                
                this.state = {
                    currentMode: mode,
                    questions: Utils.shuffleArray(allQuestions),
                    currentIndex: 0,
                    answers: [],
                    startTime: Date.now(),
                    timerInterval: null,
                    elapsedSeconds: 0,
                    isReviewing: false,
                    testTitle: null,
                    testDescription: null
                };
                
                this.state.answers = new Array(this.state.questions.length).fill(null);
            }

            console.log(`✅ ${this.state.questions.length} soru yüklendi`);

            // Sayfaları değiştir
            const testSelection = document.getElementById('testSelection');
            const quizPage = document.getElementById('quizPage');
            
            if (!testSelection || !quizPage) {
                throw new Error('Quiz sayfaları bulunamadı');
            }

            testSelection.classList.remove('active');
            quizPage.classList.add('active');

            // Timer'ı başlat
            this.startTimer();

            // İlk soruyu göster
            this.displayQuestion();

            // Quiz durumunu kaydet
            this.saveState();

            const questionCount = this.state.questions.length;
            Utils.showToast(`Test başladı! ${questionCount} soru - Bol şans!`, 'success');
            
        } catch (error) {
            console.error('Quiz başlatma hatası:', error);
            Utils.showToast('Test başlatılamadı: ' + error.message, 'error');
        }
    },

    /**
     * Quiz durumunu kaydeder
     */
    saveState() {
        try {
            StorageManager.saveQuizState({
                currentMode: this.state.currentMode,
                currentIndex: this.state.currentIndex,
                answers: this.state.answers,
                startTime: this.state.startTime,
                elapsedSeconds: this.state.elapsedSeconds,
                questionCount: this.state.questions.length
            });
        } catch (error) {
            console.warn('Quiz durumu kaydedilemedi:', error);
        }
    },

    /**
     * Timer'ı başlatır
     */
    startTimer() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
        }

        this.state.timerInterval = setInterval(() => {
            this.state.elapsedSeconds++;
            this.updateTimerDisplay();
            
            // Her 10 saniyede bir state'i kaydet
            if (this.state.elapsedSeconds % 10 === 0) {
                this.saveState();
            }
        }, 1000);
    },

    /**
     * Timer'ı durdurur
     */
    stopTimer() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
            this.state.timerInterval = null;
        }
    },

    /**
     * Timer'ı günceller
     */
    updateTimerDisplay() {
        const timerEl = document.getElementById('quizTimer');
        if (timerEl) {
            timerEl.textContent = Utils.formatTime(this.state.elapsedSeconds);
        }
    },

    /**
     * Soruyu gösterir
     */
    displayQuestion() {
        try {
            const question = this.state.questions[this.state.currentIndex];
            if (!question) {
                throw new Error('Soru bulunamadı');
            }

            // Soru numarası ve toplam
            const currentQuestionEl = document.getElementById('currentQuestion');
            const totalQuestionsEl = document.getElementById('totalQuestionsQuiz');
            
            if (currentQuestionEl) {
                currentQuestionEl.textContent = this.state.currentIndex + 1;
            }
            if (totalQuestionsEl) {
                totalQuestionsEl.textContent = this.state.questions.length;
            }

            // Progress bar
            const progress = ((this.state.currentIndex + 1) / this.state.questions.length) * 100;
            const progressFill = document.getElementById('progressFill');
            if (progressFill) {
                progressFill.style.width = progress + '%';
                const progressBar = progressFill.parentElement;
                if (progressBar) {
                    progressBar.setAttribute('aria-valuenow', Math.round(progress));
                }
            }

            // Soru metni
            const questionTextEl = document.getElementById('questionText');
            if (questionTextEl) {
                questionTextEl.textContent = question.q;
            }

            // Seçenekleri göster
            this.displayOptions(question);

            // Butonları güncelle
            this.updateButtons();
        } catch (error) {
            console.error('Soru gösterme hatası:', error);
            Utils.showToast('Soru gösterilemedi', 'error');
        }
    },

    /**
     * Seçenekleri gösterir
     */
    displayOptions(question) {
        const optionsList = document.getElementById('optionsList');
        if (!optionsList) return;

        optionsList.innerHTML = '';

        const letters = ['A', 'B', 'C', 'D', 'E'];

        question.o.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option-item';
            optionDiv.setAttribute('role', 'radio');
            optionDiv.setAttribute('aria-checked', 'false');
            optionDiv.setAttribute('tabindex', '0');
            
            // Seçilmiş mi kontrol et
            const isSelected = this.state.answers[this.state.currentIndex] === index;
            if (isSelected) {
                optionDiv.classList.add('selected');
                optionDiv.setAttribute('aria-checked', 'true');
            }

            // Review modundaysa doğru/yanlış göster
            if (this.state.isReviewing) {
                optionDiv.classList.add('disabled');
                const correctAnswer = question.a;
                const isCorrect = option === correctAnswer;
                const isUserAnswer = isSelected;
                
                if (isCorrect) {
                    optionDiv.classList.add('correct');
                }
                
                if (isUserAnswer && !isCorrect) {
                    optionDiv.classList.add('incorrect');
                }
            }

            optionDiv.innerHTML = `
                <span class="option-letter">${letters[index]}</span>
                <span>${Utils.sanitizeHTML(option)}</span>
            `;

            // Click event
            if (!this.state.isReviewing) {
                optionDiv.addEventListener('click', () => this.selectOption(index));
                optionDiv.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.selectOption(index);
                    }
                });
            }

            optionsList.appendChild(optionDiv);
        });

        // Review modunda açıklama göster
        if (this.state.isReviewing && question.explanation) {
            const explanationDiv = document.createElement('div');
            explanationDiv.className = 'question-explanation';
            explanationDiv.innerHTML = `
                <div class="explanation-header">
                    <span class="explanation-icon">💡</span>
                    <strong>Açıklama:</strong>
                </div>
                <p>${Utils.sanitizeHTML(question.explanation)}</p>
            `;
            optionsList.appendChild(explanationDiv);
        }
    },

    /**
     * Seçenek seçer - ANINDA DOĞRU/YANLIŞ GÖSTER
     */
    selectOption(index) {
        if (this.state.isReviewing) return;

        try {
            const question = this.state.questions[this.state.currentIndex];
            const selectedOption = question.o[index];
            const correctAnswer = question.a;
            const isCorrect = selectedOption === correctAnswer;

            // Cevabı kaydet
            this.state.answers[this.state.currentIndex] = index;

            // Tüm seçenekleri disable et
            document.querySelectorAll('.option-item').forEach((item, idx) => {
                item.classList.add('disabled');
                item.style.pointerEvents = 'none';
                
                // Doğru cevabı yeşil yap
                if (question.o[idx] === correctAnswer) {
                    item.classList.add('correct');
                }
                
                // Yanlış seçimi kırmızı yap
                if (idx === index && !isCorrect) {
                    item.classList.add('incorrect');
                }
                
                if (idx === index) {
                    item.classList.add('selected');
                    item.setAttribute('aria-checked', 'true');
                } else {
                    item.classList.remove('selected');
                    item.setAttribute('aria-checked', 'false');
                }
            });

            // Açıklamayı göster
            this.showExplanation(question, isCorrect);

            // State'i kaydet
            this.saveState();
        } catch (error) {
            console.error('Seçenek seçme hatası:', error);
        }
    },

    /**
     * Açıklamayı gösterir
     */
    showExplanation(question, isCorrect) {
        // Eski açıklamayı kaldır
        const oldExplanation = document.querySelector('.question-explanation');
        if (oldExplanation) {
            oldExplanation.remove();
        }

        // Açıklama yoksa çık
        if (!question.explanation) return;

        const optionsList = document.getElementById('optionsList');
        if (!optionsList) return;

        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'question-explanation';
        explanationDiv.style.cssText = 'margin-top: 20px; padding: 15px; background: var(--bg-tertiary); border-left: 4px solid var(--info); border-radius: 8px; animation: slideIn 0.3s ease-out;';
        
        const statusIcon = isCorrect ? '✅' : '❌';
        const statusText = isCorrect ? 'Doğru!' : 'Yanlış!';
        const statusColor = isCorrect ? 'var(--success)' : 'var(--danger)';
        
        explanationDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="font-size: 1.2rem;">${statusIcon}</span>
                <strong style="color: ${statusColor}; font-size: 1.1rem;">${statusText}</strong>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 8px; margin-top: 10px;">
                <span style="font-size: 1.2rem;">💡</span>
                <div>
                    <strong style="color: var(--info);">Açıklama:</strong>
                    <p style="color: var(--text-secondary); line-height: 1.6; margin: 5px 0 0;">${Utils.sanitizeHTML(question.explanation)}</p>
                </div>
            </div>
        `;
        
        optionsList.appendChild(explanationDiv);
    },

    /**
     * Butonları günceller
     */
    updateButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        // Önceki butonu
        if (prevBtn) {
            prevBtn.disabled = this.state.currentIndex === 0;
            prevBtn.style.display = this.state.isReviewing || this.state.currentIndex > 0 ? 'inline-flex' : 'none';
        }

        // Sonraki/Bitir butonu
        const isLastQuestion = this.state.currentIndex === this.state.questions.length - 1;
        
        if (nextBtn) {
            if (this.state.isReviewing) {
                nextBtn.style.display = isLastQuestion ? 'none' : 'inline-flex';
                nextBtn.textContent = 'Sonraki Soru →';
            } else {
                nextBtn.style.display = isLastQuestion ? 'none' : 'inline-flex';
            }
        }
        
        if (submitBtn) {
            submitBtn.style.display = isLastQuestion && !this.state.isReviewing ? 'inline-flex' : 'none';
        }
    },

    /**
     * Sonraki soruya geçer
     */
    nextQuestion() {
        if (this.state.currentIndex < this.state.questions.length - 1) {
            this.state.currentIndex++;
            this.displayQuestion();
            this.saveState();
            
            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    /**
     * Önceki soruya gider
     */
    previousQuestion() {
        if (this.state.currentIndex > 0) {
            this.state.currentIndex--;
            this.displayQuestion();
            this.saveState();
            
            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    /**
     * Testi bitirir
     */
    async finishQuiz() {
        try {
            // Cevaplanmamış sorular var mı kontrol et
            const unanswered = this.state.answers.filter(a => a === null).length;
            
            if (unanswered > 0) {
                const confirmed = await Utils.confirm(
                    `${unanswered} soru cevaplanmadı. Testi bitirmek istediğinizden emin misiniz?`
                );
                
                if (!confirmed) return;
            }

            // Timer'ı durdur
            this.stopTimer();

            // Sonuçları hesapla
            const results = this.calculateResults();

            // Sonuçları kaydet
            StorageManager.saveTestResult(results);

            // Quiz state'i temizle
            StorageManager.clearQuizState();

            // AI testini de sil (kullanıldı)
            localStorage.removeItem('testify_generated_test');

            // Sonuç sayfasını göster
            this.showResults(results);
        } catch (error) {
            console.error('Quiz bitirme hatası:', error);
            Utils.showToast('Test bitirilemedi', 'error');
        }
    },

    /**
     * Sonuçları hesaplar
     */
    calculateResults() {
        let correct = 0;
        let wrong = 0;

        this.state.questions.forEach((question, index) => {
            const userAnswer = this.state.answers[index];
            
            if (userAnswer !== null) {
                const selectedOption = question.o[userAnswer];
                if (selectedOption === question.a) {
                    correct++;
                } else {
                    wrong++;
                }
            }
        });

        const unanswered = this.state.questions.length - (correct + wrong);
        const successRate = this.state.questions.length > 0 
            ? Math.round((correct / this.state.questions.length) * 100) 
            : 0;

        return {
            mode: this.state.currentMode,
            totalQuestions: this.state.questions.length,
            correctAnswers: correct,
            wrongAnswers: wrong,
            unanswered: unanswered,
            successRate: successRate,
            time: this.state.elapsedSeconds,
            timestamp: Date.now(),
            testTitle: this.state.testTitle
        };
    },

    /**
     * Sonuçları gösterir
     */
    showResults(results) {
        try {
            // Sayfaları değiştir
            const quizPage = document.getElementById('quizPage');
            const resultsPage = document.getElementById('resultsPage');
            
            if (!quizPage || !resultsPage) {
                throw new Error('Sonuç sayfası bulunamadı');
            }

            quizPage.classList.remove('active');
            resultsPage.classList.add('active');

            // Sonuçları göster
            const finalScore = document.getElementById('finalScore');
            const correctAnswers = document.getElementById('correctAnswers');
            const wrongAnswers = document.getElementById('wrongAnswers');
            const successPercent = document.getElementById('successPercent');
            const totalTimeResult = document.getElementById('totalTimeResult');

            if (finalScore) finalScore.textContent = `${results.correctAnswers}/${results.totalQuestions}`;
            if (correctAnswers) correctAnswers.textContent = results.correctAnswers;
            if (wrongAnswers) wrongAnswers.textContent = results.wrongAnswers;
            if (successPercent) successPercent.textContent = results.successRate + '%';
            if (totalTimeResult) totalTimeResult.textContent = Utils.formatTime(results.time);

            // İkon değiştir
            const resultsIcon = document.querySelector('.results-icon');
            if (resultsIcon) {
                if (results.successRate >= 90) {
                    resultsIcon.textContent = '🏆';
                } else if (results.successRate >= 75) {
                    resultsIcon.textContent = '🎉';
                } else if (results.successRate >= 60) {
                    resultsIcon.textContent = '👏';
                } else if (results.successRate >= 40) {
                    resultsIcon.textContent = '💪';
                } else {
                    resultsIcon.textContent = '📚';
                }
            }

            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Sonuç gösterme hatası:', error);
            Utils.showToast('Sonuçlar gösterilemedi', 'error');
        }
    },

    /**
     * Cevapları inceler
     */
    reviewAnswers() {
        try {
            this.state.isReviewing = true;
            this.state.currentIndex = 0;

            // Quiz sayfasına dön
            const resultsPage = document.getElementById('resultsPage');
            const quizPage = document.getElementById('quizPage');
            
            if (!resultsPage || !quizPage) {
                throw new Error('Quiz sayfası bulunamadı');
            }

            resultsPage.classList.remove('active');
            quizPage.classList.add('active');

            // İlk soruyu göster
            this.displayQuestion();

            // Butonları güncelle
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const submitBtn = document.getElementById('submitBtn');

            if (prevBtn) prevBtn.style.display = 'inline-flex';
            if (nextBtn) nextBtn.style.display = 'inline-flex';
            if (submitBtn) submitBtn.style.display = 'none';

            Utils.showToast('İnceleme modu - Açıklamaları okuyabilirsiniz', 'info');
            
            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('İnceleme modu hatası:', error);
            Utils.showToast('İnceleme modu başlatılamadı', 'error');
        }
    },

    /**
     * Yeni quiz başlatır
     */
    newQuiz() {
        try {
            // State'i temizle
            this.stopTimer();
            
            // Sayfalara geri dön
            const resultsPage = document.getElementById('resultsPage');
            const quizPage = document.getElementById('quizPage');
            const testSelection = document.getElementById('testSelection');
            
            if (resultsPage) resultsPage.classList.remove('active');
            if (quizPage) quizPage.classList.remove('active');
            if (testSelection) testSelection.classList.add('active');

            // State'i sıfırla
            this.state = {
                currentMode: null,
                questions: [],
                currentIndex: 0,
                answers: [],
                startTime: null,
                timerInterval: null,
                elapsedSeconds: 0,
                isReviewing: false,
                testTitle: null,
                testDescription: null
            };

            // AI testini temizle
            localStorage.removeItem('testify_generated_test');

            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Yeni quiz başlatma hatası:', error);
            Utils.showToast('Yeni test başlatılamadı', 'error');
        }
    },

    /**
     * Quiz'den çıkar
     */
    async exitQuiz() {
        const confirmed = await Utils.confirm(
            'Testi bırakmak istediğinize emin misiniz? İlerlemeniz kaydedilmeyecek.'
        );
        
        if (!confirmed) return;

        try {
            this.stopTimer();
            StorageManager.clearQuizState();
            
            // Test selection'a dön
            const quizPage = document.getElementById('quizPage');
            const resultsPage = document.getElementById('resultsPage');
            const testSelection = document.getElementById('testSelection');
            
            if (quizPage) quizPage.classList.remove('active');
            if (resultsPage) resultsPage.classList.remove('active');
            if (testSelection) testSelection.classList.add('active');

            Utils.showToast('Test iptal edildi', 'info');
        } catch (error) {
            console.error('Quiz çıkış hatası:', error);
        }
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Test mode kartlarına tıklama
    const testOptions = document.querySelector('.test-options');
    if (testOptions) {
        const modes = ['practice', 'exam', 'ai', 'custom'];
        
        testOptions.addEventListener('click', (e) => {
            const card = e.target.closest('.test-option-card');
            if (card) {
                const index = Array.from(testOptions.children).indexOf(card);
                if (index !== -1 && modes[index]) {
                    QuizManager.startQuiz(modes[index]);
                }
            }
        });

        // Keyboard support
        testOptions.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const card = e.target.closest('.test-option-card');
                if (card) {
                    e.preventDefault();
                    const index = Array.from(testOptions.children).indexOf(card);
                    if (index !== -1 && modes[index]) {
                        QuizManager.startQuiz(modes[index]);
                    }
                }
            }
        });
    }

    // Navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const reviewBtn = document.getElementById('reviewBtn');
    const newQuizBtn = document.getElementById('newQuizBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => QuizManager.previousQuestion());
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => QuizManager.nextQuestion());
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', () => QuizManager.finishQuiz());
    }

    if (reviewBtn) {
        reviewBtn.addEventListener('click', () => QuizManager.reviewAnswers());
    }

    if (newQuizBtn) {
        newQuizBtn.addEventListener('click', () => QuizManager.newQuiz());
    }

    // Kaydedilmiş quiz state'i yükle
    const savedState = StorageManager.getQuizState();
    if (savedState && savedState.questionCount > 0) {
        setTimeout(async () => {
            const continueQuiz = await Utils.confirm(
                'Yarım kalan bir testiniz var. Devam etmek ister misiniz?'
            );
            
            if (continueQuiz) {
                Utils.showToast('Devam etme özelliği yakında eklenecek', 'info');
            } else {
                StorageManager.clearQuizState();
            }
        }, 1000);
    }
});

// Sayfa kapatılırken uyarı
window.addEventListener('beforeunload', (e) => {
    if (QuizManager.state.questions.length > 0 && !QuizManager.state.isReviewing) {
        e.preventDefault();
        e.returnValue = 'Test devam ediyor. Çıkmak istediğinize emin misiniz?';
    }
});

// Export
window.QuizManager = QuizManager;
