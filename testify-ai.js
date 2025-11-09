/**
 * TESTIFY AI - TEST OLUŞTURUCU v6.0
 * AI test oluşturur, kullanıcı Test Çöz sayfasında çözer
 */

'use strict';

const TestifyAI = {
    config: {
        name: 'Testify Test Oluşturucu',
        version: '6.0',
        apiKey: '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'
    },

    messages: [],
    isGenerating: false,
    generatedTest: null,

    /**
     * MESAJ GÖNDER
     */
    sendMessage(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
        
        const input = document.getElementById('aiInput');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        console.log('📤 Mesaj:', message);
        
        this.addMessage(message, 'user');
        input.value = '';
        input.focus();
        
        this.processMessage(message);
    },

    /**
     * MESAJI İŞLE
     */
    processMessage(message) {
        const msg = message.toLowerCase().trim();
        
        // Selamlaşma
        if (['merhaba', 'selam', 'hey', 'hi'].some(g => msg.includes(g))) {
            this.addMessage(
                "👋 **Merhaba! Ben Testify AI Test Oluşturucu!**\n\n" +
                "Sana özel testler oluşturabilirim!\n\n" +
                "**📝 NASIL KULLANILIR?**\n" +
                "1. Bana konu söyle (örn: \"Benim için biyolojide kalıtım konusu hakkında test oluştur\")\n" +
                "2. Test oluşturunca sana \"Test Çöz\" sayfasına gitmeni söyleyeceğim\n" +
                "3. Oraya gidip testini çöz!\n" +
                "4. Test bitince tekrar buraya gel, yeni test iste!\n\n" +
                "**💡 ÖRNEK KOMUTLAR:**\n" +
                "• \"Linux komutları hakkında test oluştur\"\n" +
                "• \"Windows registry konusunda 10 soru yap\"\n" +
                "• \"İşletim sistemleri genel test\"\n\n" +
                "Haydi başlayalım! 🚀",
                'ai'
            );
            return;
        }
        
        // Test oluşturma isteği
        if (msg.includes('test') || msg.includes('oluştur') || msg.includes('soru')) {
            this.generateTestFromAI(message);
            return;
        }
        
        // Yardım
        if (msg.includes('yardım') || msg.includes('help')) {
            this.addMessage(
                "📚 **YARDIM**\n\n" +
                "**Test oluşturmak için:**\n" +
                "• \"[Konu] hakkında test oluştur\"\n" +
                "• \"[Konu] için 10 soru yap\"\n\n" +
                "**Örnekler:**\n" +
                "• Linux komutları hakkında test oluştur\n" +
                "• Biyoloji kalıtım konusunda 15 soru\n" +
                "• Windows işletim sistemi testi\n\n" +
                "Test oluştuktan sonra **Test Çöz** sekmesine git! 🎯",
                'ai'
            );
            return;
        }
        
        // Varsayılan - test oluştur
        this.generateTestFromAI(message);
    },

    /**
     * AI İLE TEST OLUŞTUR
     */
    async generateTestFromAI(userRequest) {
        if (this.isGenerating) {
            this.addMessage("⏳ Zaten bir test oluşturuluyor, lütfen bekle...", 'ai');
            return;
        }
        
        this.isGenerating = true;
        this.showTypingIndicator();
        
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.config.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: `Sen bir test oluşturma asistanısın. Kullanıcının isteğine göre TEST SORULARI oluşturacaksın.

ÇIKTI FORMATI (SADECE JSON DÖNDÜR, BAŞKA BİR ŞEY YAZMA):
{
  "title": "Test Başlığı",
  "description": "Test açıklaması",
  "questions": [
    {
      "q": "Soru metni",
      "o": ["Şık A", "Şık B", "Şık C", "Şık D"],
      "a": "Doğru cevap (tam metin)",
      "explanation": "Açıklama",
      "difficulty": "easy/medium/hard"
    }
  ]
}

KURALLAR:
- Minimum 10, maksimum 30 soru
- Her soru 4 şıklı olmalı
- "a" alanına doğru cevabın TAM METNİNİ yaz (şık harfi değil)
- Açıklamalar detaylı ve öğretici olsun
- Sadece JSON döndür, başka açıklama yapma`
                        },
                        {
                            role: "user",
                            content: userRequest
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 3000
                })
            });

            const data = await response.json();
            this.hideTypingIndicator();

            if (data.error) {
                throw new Error(data.error.message);
            }

            let aiResponse = data.choices?.[0]?.message?.content;
            
            // JSON'u temizle
            aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            
            // Parse et
            const testData = JSON.parse(aiResponse);
            
            // Validate et
            if (!testData.questions || testData.questions.length === 0) {
                throw new Error('Test soruları oluşturulamadı');
            }
            
            // Kaydet
            this.saveGeneratedTest(testData);
            
            // Başarı mesajı
            this.addMessage(
                `✅ **TEST OLUŞTURULDU!**\n\n` +
                `📋 **${testData.title}**\n` +
                `${testData.description}\n\n` +
                `📊 **Soru Sayısı:** ${testData.questions.length}\n\n` +
                `🎯 **ŞİMDİ NE YAPMALIYIM?**\n` +
                `1. Yukarıdaki **"📝 Test Çöz"** sekmesine tıkla\n` +
                `2. Sayfayı yenile (F5)\n` +
                `3. Test otomatik yüklenecek!\n\n` +
                `Bol şans! 🍀`,
                'ai'
            );
            
            // Test Çöz sekmesine dikkat çek
            this.highlightTestTab();
            
        } catch (error) {
            console.error('❌ Test oluşturma hatası:', error);
            this.hideTypingIndicator();
            
            this.addMessage(
                `❌ **TEST OLUŞTURULAMADI**\n\n` +
                `Hata: ${error.message}\n\n` +
                `Lütfen farklı bir şekilde dene:\n` +
                `• "Linux komutları hakkında test oluştur"\n` +
                `• "Windows registry 15 soru"`,
                'ai'
            );
        } finally {
            this.isGenerating = false;
        }
    },

    /**
     * OLUŞTURULAN TESTİ KAYDET
     */
    saveGeneratedTest(testData) {
        try {
            // localStorage'a kaydet
            localStorage.setItem('testify_generated_test', JSON.stringify({
                ...testData,
                createdAt: Date.now(),
                id: 'ai_' + Date.now()
            }));
            
            console.log('✅ Test kaydedildi:', testData.title);
            
            // Aktivite kaydet
            if (window.StorageManager) {
                window.StorageManager.saveActivity({
                    type: 'test_created',
                    data: {
                        title: testData.title,
                        questionCount: testData.questions.length
                    },
                    timestamp: Date.now()
                });
            }
            
        } catch (error) {
            console.error('❌ Test kaydetme hatası:', error);
        }
    },

    /**
     * TEST ÇÖZ SEKMESİNİ VURGULA
     */
    highlightTestTab() {
        const testTab = document.querySelector('[data-tab="test"]');
        if (testTab) {
            testTab.style.animation = 'pulse 1s ease-in-out 3';
            setTimeout(() => {
                testTab.style.animation = '';
            }, 3000);
        }
    },

    /**
     * MESAJ EKLE
     */
    addMessage(text, sender = 'ai') {
        const chatContainer = document.getElementById('aiChat');
        if (!chatContainer) return;
        
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
    },

    /**
     * MESAJ FORMATLAMA
     */
    formatMessage(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/•/g, '&bull;');
    },

    /**
     * HTML TEMİZLE
     */
    sanitizeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * TYPING INDICATOR
     */
    showTypingIndicator() {
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
                <p style="margin-top: 8px; font-size: 0.85em; color: var(--text-secondary);">
                    Test oluşturuluyor...
                </p>
            </div>
        `;
        
        chatContainer.appendChild(typingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    },

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    },

    /**
     * EVENT LISTENER'LARI KUR
     */
    setupEventListeners() {
        console.log('🔧 Event listener\'lar kuruluyor...');
        
        const input = document.getElementById('aiInput');
        const sendBtn = document.getElementById('aiSendBtn');
        
        if (!input || !sendBtn) {
            console.error('❌ Input veya buton bulunamadı!');
            setTimeout(() => this.setupEventListeners(), 500);
            return;
        }
        
        // Enter tuşu
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                this.sendMessage(e);
            }
        });
        
        // Gönder butonu
        sendBtn.addEventListener('click', (e) => {
            this.sendMessage(e);
        });
        
        console.log('✅ Event listener\'lar kuruldu');
    },

    /**
     * BAŞLAT
     */
    init() {
        console.log('🎓 Testify AI Test Oluşturucu v6.0 başlatılıyor...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
            });
        } else {
            this.setupEventListeners();
        }
        
        setTimeout(() => {
            this.addMessage(
                "👋 **Merhaba! Ben Testify AI Test Oluşturucu!**\n\n" +
                "Sana özel testler oluşturabilirim!\n\n" +
                "**💡 Nasıl çalışır?**\n" +
                "1. Bana istediğin konuyu söyle\n" +
                "2. Test oluştururum\n" +
                "3. \"Test Çöz\" sekmesine git\n" +
                "4. Testini çöz!\n\n" +
                "**Örnek:** \"Linux komutları hakkında test oluştur\"\n\n" +
                "Hazırsan başlayalım! 🚀",
                'ai'
            );
        }, 500);
        
        console.log('✅ Testify AI hazır!');
    }
};

// Başlat
if (!window.TestifyAI) {
    document.addEventListener('DOMContentLoaded', () => {
        TestifyAI.init();
    });
    window.TestifyAI = TestifyAI;
    window.aiChat = TestifyAI;
}

// Yedek çözüm
window.addEventListener('load', () => {
    const sendBtn = document.getElementById('aiSendBtn');
    if (sendBtn && !sendBtn.onclick) {
        sendBtn.onclick = (e) => {
            e.preventDefault();
            TestifyAI.sendMessage(e);
        };
    }
});
