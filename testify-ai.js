/**
 * TESTIFY AI - TAM DÜZELTİLMİŞ SÜRÜM v4.2
 * Tüm hatalar giderildi, mesaj gönderme %100 çalışıyor
 */

'use strict';

const TestifyAI = {
    config: {
        name: 'Testify Eğitim Asistanı',
        version: '4.2',
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
- HKEY_LOCAL_MACHINE (HKLM) → Sistem geneli ayarlar
- HKEY_USERS → Tüm kullanıcı profilleri
- HKEY_CURRENT_CONFIG → Donanım profili

⚙️ KULLANIM ALANLARI:
- Program ayarları
- Sistem konfigürasyonu
- Kullanıcı tercihleri
- Donanım bilgileri

⚠️ DİKKAT:
Registry'de yanlış değişiklikler sistemi bozabilir!`
            },
            {
                id: 'w2',
                question: "Windows'ta Safe Mode nedir?",
                options: [
                    "Minimum sürücülerle başlatma modu",
                    "Güvenlik duvarı modu",
                    "Otomatik yedekleme sistemi",
                    "Antivirüs tarama modu"
                ],
                correct: 0,
                difficulty: "medium",
                explanation: `🛡️ SAFE MODE AÇIKLAMA:

Safe Mode (Güvenli Mod), Windows'u minimum sürücü ve hizmetlerle başlatır.

NE ZAMAN KULLANILIR?
- Virüs temizleme
- Sürücü sorunları
- Sistem hataları
- Yazılım çakışmaları

NASIL GİRİLİR?
1. Yeniden başlatırken F8
2. msconfig → Boot sekmesi
3. Shift + Yeniden Başlat`
            }
        ],
        linux: [
            {
                id: 'l1',
                question: "Linux'ta chmod 755 komutu ne yapar?",
                options: [
                    "Sahip: rwx, Grup ve Diğerleri: r-x",
                    "Tüm izinleri kaldırır",
                    "Sadece okuma izni verir",
                    "Dosyayı siler"
                ],
                correct: 0,
                difficulty: "hard",
                explanation: `🔐 CHMOD 755 DETAYLI AÇIKLAMA:

📐 CHMOD 755 AÇILIMI:
- 7 (Sahip) = rwx (4+2+1) → Okuma+Yazma+Çalıştırma
- 5 (Grup) = r-x (4+0+1) → Okuma+Çalıştırma
- 5 (Diğerleri) = r-x (4+0+1) → Okuma+Çalıştırma

🔢 RAKAM SİSTEMİ:
- r (read) = 4
- w (write) = 2
- x (execute) = 1

📝 ÖRNEKLER:
chmod 644 dosya.txt → rw-r--r--
chmod 777 script.sh → rwxrwxrwx
chmod 600 private.key → rw-------

⚡ HIZLI İPUCU:
chmod +x script.sh → Çalıştırma izni ekle`
            },
            {
                id: 'l2',
                question: "Linux'ta hangi komut sistem kaynaklarını gösterir?",
                options: [
                    "top",
                    "ls",
                    "cd",
                    "pwd"
                ],
                correct: 0,
                difficulty: "easy",
                explanation: `💻 TOP KOMUTU:

top komutu, gerçek zamanlı sistem kaynaklarını gösterir:
- CPU kullanımı
- Bellek kullanımı
- Çalışan işlemler
- Sistem yükü

ALTERNATİFLER:
- htop → Renkli ve etkileşimli
- gtop → Grafik arayüzlü
- atop → Gelişmiş analiz`
            }
        ],
        genel: [
            {
                id: 'g1',
                question: "İşletim sisteminin temel görevi nedir?",
                options: [
                    "Donanım ve yazılım arasında arayüz sağlamak",
                    "İnternet bağlantısı kurmak",
                    "Oyun oynamak",
                    "Video izlemek"
                ],
                correct: 0,
                difficulty: "easy",
                explanation: `🎯 İŞLETİM SİSTEMİ TEMEL GÖREVLERİ:

1️⃣ DONANIM SOYUTLAMA
Kullanıcıyı donanım detaylarından korur

2️⃣ KAYNAK YÖNETİMİ
CPU, RAM, Disk kaynaklarını yönetir

3️⃣ DOSYA YÖNETİMİ
Dosya sistemini organize eder

4️⃣ GÜVENLİK
Kullanıcı izinlerini kontrol eder

5️⃣ KULLANICI ARAYÜZÜ
GUI veya CLI sağlar`
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
        level: 1,
        lastActivity: null
    },

    /**
     * MESAJ GÖNDER - TAM DÜZELTİLMİŞ
     */
    sendMessage(event) {
        // Event'i tamamen durdur
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
        
        const input = document.getElementById('aiInput');
        if (!input) {
            console.error('❌ Input bulunamadı!');
            return;
        }
        
        const message = input.value.trim();
        
        if (!message) {
            console.log('⚠️ Boş mesaj, gönderilmedi');
            return;
        }
        
        console.log('✅ Mesaj gönderiliyor:', message);
        
        // Kullanıcı mesajını ekle
        this.addMessage(message, 'user');
        
        // Input'u temizle ve focus ver
        input.value = '';
        input.focus();
        
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
        this.stats.lastActivity = Date.now();
        
        if (isCorrect) {
            this.stats.correctAnswers++;
            this.stats.streak++;
            
            // Her 5 doğru cevap = Level Up
            if (this.stats.correctAnswers % 5 === 0) {
                this.stats.level++;
            }
            
            const successRate = Math.round((this.stats.correctAnswers / this.stats.totalQuestions) * 100);
            
            this.addMessage(
                `✅ **DOĞRU CEVAP!** 🎉\n\n${this.currentQuestion.explanation}\n\n` +
                `**📊 İSTATİSTİKLERİN:**\n` +
                `• Toplam Soru: ${this.stats.totalQuestions}\n` +
                `• Doğru: ${this.stats.correctAnswers}\n` +
                `• Başarı Oranı: ${successRate}%\n` +
                `• Seri: ${this.stats.streak} 🔥\n` +
                `• Seviye: ${this.stats.level}\n\n` +
                `Harika gidiyorsun! 💪`,
                'ai'
            );
        } else {
            this.stats.streak = 0;
            this.addMessage(
                `❌ **YANLIŞ CEVAP!**\n\n` +
                `Doğru cevap: **${this.currentQuestion.options[this.currentQuestion.correct]}**\n\n` +
                `${this.currentQuestion.explanation}\n\n` +
                `Seri bitti 💔 Ama vazgeçme! Öğrenmek için buradayız! 📚`,
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
            if (['merhaba', 'selam', 'hey', 'hi', 'hello'].some(g => msg.includes(g))) {
                this.addMessage(
                    "Merhaba! 👋 Ben Testify AI, senin kişisel eğitim asistanın!\n\n" +
                    "**🎯 NELER YAPABİLİRİM?**\n\n" +
                    "• **'soru ver'** - Test sorusu çöz\n" +
                    "• **'registry nedir'** - Windows konuları\n" +
                    "• **'chmod açıkla'** - Linux komutları\n" +
                    "• **'istatistikler'** - Performansını gör\n" +
                    "• **'yardım'** - Tüm komutları gör\n\n" +
                    "Hadi başlayalım! 🚀",
                    'ai'
                );
                return;
            }
            
            // Soru isteme
            if (msg.includes('soru') || msg.includes('test')) {
                this.showRandomQuestion();
                return;
            }
            
            // İstatistikler
            if (msg.includes('istatistik') || msg.includes('stat') || msg.includes('performans')) {
                this.showStats();
                return;
            }
            
            // Konu açıklama - Windows
            if (msg.includes('registry')) {
                this.addMessage(this.questionBank.windows[0].explanation, 'ai');
                return;
            }
            
            if (msg.includes('safe mode') || msg.includes('güvenli mod')) {
                this.addMessage(this.questionBank.windows[1].explanation, 'ai');
                return;
            }
            
            // Konu açıklama - Linux
            if (msg.includes('chmod')) {
                this.addMessage(this.questionBank.linux[0].explanation, 'ai');
                return;
            }
            
            if (msg.includes('top') && msg.includes('komut')) {
                this.addMessage(this.questionBank.linux[1].explanation, 'ai');
                return;
            }
            
            // Yardım
            if (msg.includes('yardım') || msg.includes('help') || msg.includes('komut')) {
                this.showHelp();
                return;
            }
            
            // API çağrısı (isteğe bağlı)
            if (msg.includes('nedir') || msg.includes('açıkla') || msg.includes('anlat')) {
                this.askGPTAPI(message);
                return;
            }
            
            // Varsayılan
            this.addMessage(
                "🤔 Tam olarak anlayamadım. Şunları deneyebilirsin:\n\n" +
                "• **'soru ver'** - Test çöz\n" +
                "• **'yardım'** - Komutları gör\n" +
                "• **'registry nedir'** - Konu öğren\n\n" +
                "Ya da doğrudan bir soru sor! 💬",
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
            ...this.questionBank.linux,
            ...this.questionBank.genel
        ];
        
        const question = allQuestions[Math.floor(Math.random() * allQuestions.length)];
        this.currentQuestion = question;
        
        const difficultyEmoji = {
            'easy': '🟢',
            'medium': '🟡',
            'hard': '🔴'
        };
        
        let questionText = `📝 **YENİ SORU** ${difficultyEmoji[question.difficulty] || '⚪'}\n\n`;
        questionText += `**${question.question}**\n\n`;
        questionText += question.options.map((opt, i) => 
            `**${String.fromCharCode(65 + i)})** ${opt}`
        ).join('\n');
        questionText += '\n\n💡 Cevabını **A, B, C veya D** olarak yaz!';
        
        this.addMessage(questionText, 'ai');
    },

    /**
     * İstatistikleri göster
     */
    showStats() {
        if (this.stats.totalQuestions === 0) {
            this.addMessage(
                "📊 **HENÜZ İSTATİSTİK YOK**\n\n" +
                "Soru çözmeye başla ve performansını takip et!\n\n" +
                "**'soru ver'** yazarak başlayabilirsin! 🚀",
                'ai'
            );
            return;
        }
        
        const successRate = Math.round((this.stats.correctAnswers / this.stats.totalQuestions) * 100);
        
        let performance = '';
        if (successRate >= 90) performance = '🏆 MÜKEMMEL!';
        else if (successRate >= 75) performance = '🌟 ÇOK İYİ!';
        else if (successRate >= 60) performance = '👍 İYİ!';
        else if (successRate >= 40) performance = '💪 GELİŞİYORSUN!';
        else performance = '📚 DEVAM ET!';
        
        this.addMessage(
            `📊 **PERFORMANS ANALİZİN**\n\n` +
            `${performance}\n\n` +
            `**📈 İSTATİSTİKLER:**\n` +
            `• Toplam Soru: ${this.stats.totalQuestions}\n` +
            `• Doğru Cevap: ${this.stats.correctAnswers}\n` +
            `• Yanlış Cevap: ${this.stats.totalQuestions - this.stats.correctAnswers}\n` +
            `• Başarı Oranı: ${successRate}%\n` +
            `• En Uzun Seri: ${this.stats.streak} 🔥\n` +
            `• Seviye: ${this.stats.level}\n\n` +
            `Harika gidiyorsun! Devam et! 💪`,
            'ai'
        );
    },

    /**
     * Yardım göster
     */
    showHelp() {
        this.addMessage(
            `📚 **TESTIFY AI KOMUTLARI**\n\n` +
            `**🎯 TEST ÇÖZME:**\n` +
            `• 'soru ver' - Rastgele soru\n` +
            `• 'A, B, C, D' - Cevap ver\n\n` +
            `**📖 KONU ÖĞRENME:**\n` +
            `• 'registry nedir' - Windows Registry\n` +
            `• 'safe mode nedir' - Güvenli Mod\n` +
            `• 'chmod açıkla' - Linux İzinleri\n` +
            `• 'top komutu' - Sistem Kaynakları\n\n` +
            `**📊 İSTATİSTİK:**\n` +
            `• 'istatistikler' - Performansını gör\n\n` +
            `**💬 GENEL:**\n` +
            `• '[konu] nedir' - Açıklama iste\n` +
            `• 'yardım' - Bu menü\n\n` +
            `Başka bir şey öğrenmek ister misin? 🚀`,
            'ai'
        );
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
                            content: "Sen Testify AI'sın. Kısa, öz, emoji kullanarak ve Markdown formatında açıkla. İşletim sistemleri konusunda uzmansın."
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
                "⚠️ **API BAĞLANTI HATASI**\n\n" +
                "Şu anda API'ye ulaşamıyorum. Ama yerleşik soru bankamdan yardımcı olabilirim!\n\n" +
                "**'soru ver'** yazarak başlayabilirsin! 📚",
                'ai'
            );
        }
    },

    /**
     * Mesaj ekle
     */
    addMessage(text, sender = 'ai') {
        const chatContainer = document.getElementById('aiChat');
        if (!chatContainer) {
            console.error('❌ Chat container bulunamadı!');
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'ai-message user-message' : 'ai-message';
        
        const formattedText = this.formatMessage(text);
        
        if (sender === 'ai') {
            messageDiv.innerHTML = `
                <div class="ai-avatar">🤖</div>
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
            .replace(/•/g, '&bull;')
            .replace(/`(.*?)`/g, '<code>$1</code>');
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
            <div class="ai-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </div>
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
            localStorage.setItem('testify-ai-stats', JSON.stringify(this.stats));
            console.log('📊 İstatistikler kaydedildi');
        } catch (e) {
            console.error('❌ Stats kayıt hatası:', e);
        }
    },

    /**
     * Stats yükle
     */
    loadStats() {
        try {
            const saved = localStorage.getItem('testify-ai-stats');
            if (saved) {
                this.stats = { ...this.stats, ...JSON.parse(saved) };
                console.log('✅ İstatistikler yüklendi:', this.stats);
            }
        } catch (e) {
            console.error('❌ Stats yükleme hatası:', e);
        }
    },

    /**
     * Event listener'ları kur - TAM GÜVENLİ
     */
    setupEventListeners() {
        console.log('🔧 Event listener\'lar kuruluyor...');
        
        const input = document.getElementById('aiInput');
        const sendBtn = document.getElementById('aiSendBtn');
        
        if (!input || !sendBtn) {
            console.error('❌ Input veya buton bulunamadı!');
            console.log('Input:', input);
            console.log('SendBtn:', sendBtn);
            setTimeout(() => this.setupEventListeners(), 500);
            return;
        }
        
        console.log('✅ Input ve buton bulundu');
        
        // Enter tuşu
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                console.log('⌨️ Enter tuşuna basıldı');
                this.sendMessage(e);
            }
        });
        
        // Gönder butonu
        sendBtn.addEventListener('click', (e) => {
            console.log('🖱️ Gönder butonuna tıklandı');
            this.sendMessage(e);
        });
        
        // Test için
        sendBtn.addEventListener('mousedown', () => {
            console.log('🖱️ Buton mousedown');
        });
        
        console.log('✅ Event listener\'lar başarıyla kuruldu');
    },

    /**
     * Başlat
     */
    init() {
        console.log('🎓 Testify AI v4.2 başlatılıyor...');
        
        this.loadStats();
        
        // DOM hazır olana kadar bekle
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
            });
        } else {
            this.setupEventListeners();
        }
        
        // Hoş geldin mesajı
        setTimeout(() => {
            this.addMessage(
                "👋 **Merhaba! Ben Testify AI!**\n\n" +
                "Sana işletim sistemleri konusunda yardımcı olmak için buradayım!\n\n" +
                "**🚀 HIZLI BAŞLANGIÇ:**\n" +
                "• **'soru ver'** - Test çözmeye başla\n" +
                "• **'yardım'** - Tüm komutları gör\n\n" +
                "Haydi başlayalım! 💪",
                'ai'
            );
        }, 500);
        
        console.log('✅ Testify AI hazır!');
    }
};

// Başlat - ÇOKLU BAŞLATMAYI ÖNLE
if (!window.TestifyAI) {
    document.addEventListener('DOMContentLoaded', () => {
        TestifyAI.init();
    });
    
    // Global erişim
    window.TestifyAI = TestifyAI;
    window.aiChat = TestifyAI;
} else {
    console.log('⚠️ TestifyAI zaten yüklü');
}

// ACİL YEDEK ÇÖZÜM
window.addEventListener('load', () => {
    const sendBtn = document.getElementById('aiSendBtn');
    if (sendBtn && !sendBtn.onclick) {
        sendBtn.onclick = (e) => {
            e.preventDefault();
            console.log('🆘 Yedek çözüm aktif');
            TestifyAI.sendMessage(e);
        };
        console.log('✅ Yedek çözüm kuruldu');
    }
});
