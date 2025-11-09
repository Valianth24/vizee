/**
 * TESTIFY AI - DÜZELTİLMİŞ SÜRÜM
 * Form submit sorunu çözüldü
 */

'use strict';

const TestifyAI = {
    config: {
        name: 'Testify Eğitim Asistanı',
        version: '4.1',
        mode: 'local-first',
        apiUsage: 'minimal'
    },

    questionBank: {
        windows: [
            {
                id: 'w1',
                question: "Windows Registry nedir ve ne işe yarar?",
                options: [
                    "Sistem ayarlarının saklandığı merkezi veritabanı",
                    "Dosya yedekleme sistemi",
                    "Antivirüs programı",
                    "İnternet geçmişi"
                ],
                correct: 0,
                difficulty: "hard",
                explanation: `📚 WINDOWS REGISTRY DETAYLI AÇIKLAMA:

🔍 NEDİR?
Windows Registry, tüm sistem ve program ayarlarının saklandığı hiyerarşik veritabanıdır.

📂 YAPI:
- HKEY_CLASSES_ROOT (HKCR) → Dosya ilişkilendirmeleri
- HKEY_CURRENT_USER (HKCU) → Aktif kullanıcı ayarları
- HKEY_LOCAL_MACHINE (HKLM) → Sistem geneli ayarlar`
            }
        ],
        linux: [
            {
                id: 'l1',
                question: "Linux'ta chmod 755 komutu ne yapar?",
                options: [
                    "Sahip: okuma+yazma+çalıştırma, Diğerleri: okuma+çalıştırma",
                    "Tüm izinleri kaldırır",
                    "Sadece okuma izni verir",
                    "Dosyayı siler"
                ],
                correct: 0,
                difficulty: "hard",
                explanation: `🔐 CHMOD 755 AÇILIMI:

📐 CHMOD 755:
- 7 (Sahip) = rwx (Okuma+Yazma+Çalıştırma)
- 5 (Grup) = r-x (Okuma+Çalıştırma)`
            }
        ]
    },

    messages: [],
    isTyping: false,
    currentQuestion: null,
    stats: {
        totalQuestions: 0,
        correctAnswers: 0,
        streak: 0,
        level: 1
    },

    /**
     * MESAJ GÖNDER - DÜZELTİLMİŞ
     */
    sendMessage(event) {
        // ÖNEMLİ: Event'i her zaman durdur
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        const input = document.getElementById('aiInput');
        if (!input) {
            console.error('Input bulunamadı!');
            return;
        }
        
        const message = input.value.trim();
        
        if (!message) {
            console.log('Boş mesaj, gönderilmedi');
            return;
        }
        
        console.log('Mesaj gönderiliyor:', message);
        
        // Kullanıcı mesajını ekle
        this.addMessage(message, 'user');
        
        // Input'u temizle
        input.value = '';
        
        // Cevap kontrolü
        if (this.currentQuestion) {
            const answer = message.toUpperCase();
            if (['A', 'B', 'C', 'D'].includes(answer)) {
                this.checkAnswer(answer.charCodeAt(0) - 65);
                return;
            }
        }
        
        // Yanıt oluştur
        this.generateLocalResponse(message);
    },

    /**
     * Cevap kontrol
     */
    checkAnswer(answerIndex) {
        if (!this.currentQuestion) return;
        
        const isCorrect = answerIndex === this.currentQuestion.correct;
        this.stats.totalQuestions++;
        
        if (isCorrect) {
            this.stats.correctAnswers++;
            this.stats.streak++;
            
            if (this.stats.correctAnswers % 5 === 0) {
                this.stats.level++;
            }
            
            this.addMessage(
                `✅ **DOĞRU!** 🎉\n\n${this.currentQuestion.explanation}\n\n` +
                `**İstatistikler:**\n` +
                `• Toplam Soru: ${this.stats.totalQuestions}\n` +
                `• Doğru: ${this.stats.correctAnswers}\n` +
                `• Başarı: ${Math.round((this.stats.correctAnswers / this.stats.totalQuestions) * 100)}%\n` +
                `• Seri: ${this.stats.streak} 🔥\n` +
                `• Seviye: ${this.stats.level}`,
                'ai'
            );
        } else {
            this.stats.streak = 0;
            this.addMessage(
                `❌ **YANLIŞ!**\n\n` +
                `Doğru cevap: **${this.currentQuestion.options[this.currentQuestion.correct]}**\n\n` +
                `${this.currentQuestion.explanation}\n\n` +
                `Seri bitti 💔 Ama vazgeçme!`,
                'ai'
            );
        }
        
        this.saveStats();
        this.currentQuestion = null;
    },

    /**
     * Yerel yanıt oluştur
     */
    generateLocalResponse(message) {
        const msg = message.toLowerCase();
        
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            
            // Selamlaşma
            if (['merhaba', 'selam', 'hey'].some(g => msg.includes(g))) {
                this.addMessage(
                    "Merhaba! 👋 Ben Testify AI. Sana nasıl yardımcı olabilirim?\n\n" +
                    "• 'soru ver' - Test sorusu\n" +
                    "• 'registry nedir' - Konu öğren\n" +
                    "• 'chmod açıkla' - Detaylı açıklama",
                    'ai'
                );
                return;
            }
            
            // Soru isteme
            if (msg.includes('soru')) {
                this.showRandomQuestion();
                return;
            }
            
            // Konu açıklama
            if (msg.includes('registry')) {
                this.addMessage(this.questionBank.windows[0].explanation, 'ai');
                return;
            }
            
            if (msg.includes('chmod')) {
                this.addMessage(this.questionBank.linux[0].explanation, 'ai');
                return;
            }
            
            // API çağrısı (isteğe bağlı)
            if (msg.includes('nedir') || msg.includes('açıkla')) {
                this.askGPTAPI(message);
                return;
            }
            
            // Varsayılan
            this.addMessage(
                "Tam olarak anlayamadım. Şunları deneyebilirsin:\n\n" +
                "• 'Soru ver'\n" +
                "• 'Registry nedir'\n" +
                "• 'chmod açıkla'",
                'ai'
            );
        }, 800);
    },

    /**
     * Rastgele soru göster
     */
    showRandomQuestion() {
        const allQuestions = [
            ...this.questionBank.windows,
            ...this.questionBank.linux
        ];
        
        const question = allQuestions[Math.floor(Math.random() * allQuestions.length)];
        this.currentQuestion = question;
        
        let questionText = `📝 **SORU**\n\n${question.question}\n\n`;
        questionText += question.options.map((opt, i) => 
            `${String.fromCharCode(65 + i)}) ${opt}`
        ).join('\n');
        
        this.addMessage(questionText, 'ai');
    },

    /**
     * GPT API çağrısı
     */
    async askGPTAPI(question) {
        try {
            this.showTypingIndicator();
            
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer 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"
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { 
                            role: "system", 
                            content: "Sen Testify AI'sın. Kısa, öz ve emoji kullanarak açıkla."
                        },
                        { 
                            role: "user", 
                            content: question
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            
            this.hideTypingIndicator();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            const aiResponse = data.choices?.[0]?.message?.content;
            this.addMessage(aiResponse || "Yanıt alınamadı.", 'ai');
            
        } catch (error) {
            console.error('API Hatası:', error);
            this.hideTypingIndicator();
            this.addMessage(
                "⚠️ API bağlantı hatası. Soru bankasından yardımcı olabilirim!",
                'ai'
            );
        }
    },

    /**
     * Mesaj ekle
     */
    addMessage(text, sender = 'ai') {
        const chatContainer = document.getElementById('aiChat');
        if (!chatContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'ai-message user-message' : 'ai-message';
        
        const formattedText = this.formatMessage(text);
        
        if (sender === 'ai') {
            messageDiv.innerHTML = `
                <div class="ai-avatar">T</div>
                <div class="message-content">${formattedText}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">${this.sanitizeHTML(text)}</div>
            `;
        }
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        this.messages.push({ text, sender, timestamp: Date.now() });
    },

    /**
     * Mesaj formatlama
     */
    formatMessage(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/•/g, '&bull;');
    },

    /**
     * HTML temizle
     */
    sanitizeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Typing indicator
     */
    showTypingIndicator() {
        this.isTyping = true;
        const chatContainer = document.getElementById('aiChat');
        if (!chatContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="ai-avatar">T</div>
            <div class="message-content">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        `;
        
        chatContainer.appendChild(typingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    },

    hideTypingIndicator() {
        this.isTyping = false;
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    },

    /**
     * Stats kaydet
     */
    saveStats() {
        try {
            localStorage.setItem('testify-stats', JSON.stringify(this.stats));
        } catch (e) {
            console.error('Stats kayıt hatası:', e);
        }
    },

    /**
     * Stats yükle
     */
    loadStats() {
        try {
            const saved = localStorage.getItem('testify-stats');
            if (saved) {
                this.stats = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Stats yükleme hatası:', e);
        }
    },

    /**
     * Event listener'ları kur - DÜZELTİLMİŞ
     */
    setupEventListeners() {
        console.log('Event listener\'lar kuruluyor...');
        
        const input = document.getElementById('aiInput');
        const sendBtn = document.getElementById('aiSendBtn');
        
        if (!input || !sendBtn) {
            console.error('Input veya buton bulunamadı!');
            return;
        }
        
        // Enter tuşu
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                console.log('Enter tuşuna basıldı');
                this.sendMessage(e);
            }
        });
        
        // Gönder butonu
        sendBtn.addEventListener('click', (e) => {
            console.log('Gönder butonuna tıklandı');
            this.sendMessage(e);
        });
        
        console.log('Event listener\'lar başarıyla kuruldu');
    },

    /**
     * Başlat
     */
    init() {
        console.log('🎓 Testify AI v4.1 başlatılıyor...');
        
        this.loadStats();
        this.setupEventListeners();
        
        setTimeout(() => {
            this.addMessage(
                "Merhaba! 👋 Ben Testify AI. Sana nasıl yardımcı olabilirim?\n\n" +
                "• 'Soru ver' - Test sorusu\n" +
                "• 'Registry nedir' - Konu öğren\n" +
                "• 'chmod açıkla' - Linux izinleri",
                'ai'
            );
        }, 500);
        
        console.log('✅ Testify AI hazır!');
    }
};

// Başlat
document.addEventListener('DOMContentLoaded', () => {
    TestifyAI.init();
});

// Global erişim
window.TestifyAI = TestifyAI;
window.aiChat = TestifyAI;
