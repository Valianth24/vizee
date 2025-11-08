/**
 * TESTIFY QUIZ MANAGER
 * Test çözme sistemi - Tam çalışır halde
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
        isReviewing: false
    },

    /**
     * Quiz'i başlatır
     * @param {string} mode - Quiz modu (practice, exam, ai, custom)
     */
    startQuiz(mode) {
        try {
            // Mevcut sorular.js dosyanızdan soruları al
            if (!window.questionBank || !Array.isArray(window.questionBank)) {
                Utils.showToast('Sorular yüklenemedi!', 'error');
                console.error('questionBank bulunamadı!');
                return;
            }

            // State'i sıfırla
            this.state = {
                currentMode: mode,
                questions: [],
                currentIndex: 0,
                answers: [],
                startTime: Date.now(),
                timerInterval: null,
                elapsedSeconds: 0,
                isReviewing: false
            };

            // Soruları hazırla
            const allQuestions = [...window.questionBank];
            this.state.questions = Utils.shuffleArray(allQuestions).slice(0, 10);

            // Her soru için cevap dizisi oluştur
            this.state.answers = new Array(this.state.questions.length).fill(null);

            // Sayfaları değiştir
            document.getElementById('testSelection').classList.remove('active');
            document.getElementById('quizPage').classList.add('active');

            // Timer'ı başlat
            this.startTimer();

            // İlk soruyu göster
            this.displayQuestion();

            Utils.showToast('Test başladı! Bol şans!', 'success');
        } catch (error) {
            console.error('Quiz başlatma hatası:', error);
            Utils.showToast('Test başlatılamadı!', 'error');
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
        const question = this.state.questions[this.state.currentIndex];
        if (!question) return;

        // Soru numarası ve toplam
        document.getElementById('currentQuestion').textContent = this.state.currentIndex + 1;
        document.getElementById('totalQuestionsQuiz').textContent = this.state.questions.length;

        // Progress bar
        const progress = ((this.state.currentIndex + 1) / this.state.questions.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('progressFill').parentElement.setAttribute('aria-valuenow', progress);

        // Soru metni
        const questionTextEl = document.getElementById('questionText');
        questionTextEl.textContent = question.q;

        // Seçenekleri göster
        this.displayOptions(question);

        // Butonları güncelle
        this.updateButtons();
    },

    /**
     * Seçenekleri gösterir
     * @param {Object} question - Soru
     */
    displayOptions(question) {
        const optionsList = document.getElementById('optionsList');
        optionsList.innerHTML = '';

        const letters = ['A', 'B', 'C', 'D', 'E'];

        question.o.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option-item';
            optionDiv.setAttribute('role', 'radio');
            optionDiv.setAttribute('aria-checked', 'false');
            optionDiv.setAttribute('tabindex', '0');
            
            // Seçilmiş mi kontrol et
            if (this.state.answers[this.state.currentIndex] === index) {
                optionDiv.classList.add('selected');
                optionDiv.setAttribute('aria-checked', 'true');
            }

            // Review modundaysa doğru/yanlış göster
            if (this.state.isReviewing) {
                optionDiv.classList.add('disabled');
                const correctAnswer = question.a;
                
                if (option === correctAnswer) {
                    optionDiv.classList.add('correct');
                }
                
                if (this.state.answers[this.state.currentIndex] === index && option !== correctAnswer) {
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
    },

    /**
     * Seçenek seçer
     * @param {number} index - Seçenek index
     */
    selectOption(index) {
        if (this.state.isReviewing) return;

        // Cevabı kaydet
        this.state.answers[this.state.currentIndex] = index;

        // UI'ı güncelle
        document.querySelectorAll('.option-item').forEach((item, idx) => {
            if (idx === index) {
                item.classList.add('selected');
                item.setAttribute('aria-checked', 'true');
            } else {
                item.classList.remove('selected');
                item.setAttribute('aria-checked', 'false');
            }
        });
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
        }

        // Sonraki/Bitir butonu
        const isLastQuestion = this.state.currentIndex === this.state.questions.length - 1;
        
        if (nextBtn) {
            nextBtn.style.display = isLastQuestion ? 'none' : 'inline-flex';
        }
        
        if (submitBtn) {
            submitBtn.style.display = isLastQuestion ? 'inline-flex' : 'none';
        }
    },

    /**
     * Sonraki soruya geçer
     */
    nextQuestion() {
        if (this.state.currentIndex < this.state.questions.length - 1) {
            this.state.currentIndex++;
            this.displayQuestion();
        }
    },

    /**
     * Önceki soruya gider
     */
    previousQuestion() {
        if (this.state.currentIndex > 0) {
            this.state.currentIndex--;
            this.displayQuestion();
        }
    },

    /**
     * Testi bitirir
     */
    async finishQuiz() {
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

        // Sonuç sayfasını göster
        this.showResults(results);
    },

    /**
     * Sonuçları hesaplar
     * @returns {Object} - Sonuçlar
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
            timestamp: Date.now()
        };
    },

    /**
     * Sonuçları gösterir
     * @param {Object} results - Sonuçlar
     */
    showResults(results) {
        // Sayfaları değiştir
        document.getElementById('quizPage').classList.remove('active');
        document.getElementById('resultsPage').classList.add('active');

        // Sonuçları göster
        document.getElementById('finalScore').textContent = 
            `${results.correctAnswers}/${results.totalQuestions}`;
        
        document.getElementById('correctAnswers').textContent = results.correctAnswers;
        document.getElementById('wrongAnswers').textContent = results.wrongAnswers;
        document.getElementById('successPercent').textContent = results.successRate + '%';
        document.getElementById('totalTimeResult').textContent = Utils.formatTime(results.time);

        // İkon değiştir
        const resultsIcon = document.querySelector('.results-icon');
        if (results.successRate >= 80) {
            resultsIcon.textContent = '🏆';
        } else if (results.successRate >= 60) {
            resultsIcon.textContent = '👏';
        } else {
            resultsIcon.textContent = '💪';
        }
    },

    /**
     * Cevapları inceler
     */
    reviewAnswers() {
        this.state.isReviewing = true;
        this.state.currentIndex = 0;

        // Quiz sayfasına dön
        document.getElementById('resultsPage').classList.remove('active');
        document.getElementById('quizPage').classList.add('active');

        // İlk soruyu göster
        this.displayQuestion();

        // Butonları güncelle
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (prevBtn) prevBtn.style.display = 'inline-flex';
        if (nextBtn) nextBtn.style.display = 'inline-flex';
        if (submitBtn) submitBtn.style.display = 'none';

        Utils.showToast('İnceleme modu - Doğru cevaplar yeşil renkte', 'info');
    },

    /**
     * Yeni quiz başlatır
     */
    newQuiz() {
        // State'i temizle
        this.stopTimer();
        
        // Sayfalara geri dön
        document.getElementById('resultsPage').classList.remove('active');
        document.getElementById('quizPage').classList.remove('active');
        document.getElementById('testSelection').classList.add('active');
    },

    /**
     * Quiz'den çıkar
     */
    exitQuiz() {
        if (this.state.timerInterval) {
            this.stopTimer();
        }

        // Test selection'a dön
        document.getElementById('quizPage').classList.remove('active');
        document.getElementById('resultsPage').classList.remove('active');
        document.getElementById('testSelection').classList.add('active');
    }
};

// Event Listeners - Butonlar için
document.addEventListener('DOMContentLoaded', () => {
    // Test mode kartlarına tıklama
    const testCards = document.querySelectorAll('.test-option-card');
    testCards.forEach((card, index) => {
        const modes = ['practice', 'exam', 'ai', 'custom'];
        card.addEventListener('click', () => {
            QuizManager.startQuiz(modes[index]);
        });

        // Keyboard support
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                QuizManager.startQuiz(modes[index]);
            }
        });
    });

    // Previous butonu
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => QuizManager.previousQuestion());
    }

    // Next butonu
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => QuizManager.nextQuestion());
    }

    // Submit butonu
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => QuizManager.finishQuiz());
    }

    // Review butonu
    const reviewBtn = document.getElementById('reviewBtn');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', () => QuizManager.reviewAnswers());
    }

    // New quiz butonu
    const newQuizBtn = document.getElementById('newQuizBtn');
    if (newQuizBtn) {
        newQuizBtn.addEventListener('click', () => QuizManager.newQuiz());
    }
});

// Export
window.QuizManager = QuizManager;
