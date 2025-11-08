/**
 * TESTIFY AI - ADVANCED TEST GENERATION SYSTEM
 * Test oluşturma, soru analizi ve akıllı test yönetimi
 */

'use strict';

const TestifyAI = {
    // API Configuration
    config: {
        apiKey: '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',
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4-turbo-preview',
        maxTokens: 4000,
        temperature: 0.7
    },

    // State Management
    state: {
        isGenerating: false,
        conversationHistory: [],
        currentRequest: null,
        generatedTests: []
    },

    /**
     * AI'ı başlatır
     */
    init() {
        console.log('🤖 Testify AI başlatılıyor...');
        this.attachEventListeners();
        this.loadConversationHistory();
        console.log('✅ Testify AI hazır!');
    },

    /**
     * Event listener'ları ekler
     */
    attachEventListeners() {
        const sendBtn = document.getElementById('aiSendBtn');
        const input = document.getElementById('aiInput');
        const form = input?.closest('form');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleUserMessage();
            });
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleUserMessage();
                }
            });
        }

        // Hoş geldin mesajı
        setTimeout(() => {
            this.addAIMessage(`Merhaba! Ben Testify AI.

**Test Oluşturma Sistemi Aktif**

📝 Sana nasıl test oluşturabilirim?

**Örnekler:**
- "İşletim sistemleri hakkında 10 soruluk bir test oluştur"
- "Bellek yönetimi konusunda zor seviye 5 soru"
- "HAFTA 3 konularından karma bir test"
- "Process scheduling üzerine test"

Hazır mısın?`);
        }, 500);
    },

    /**
     * Kullanıcı mesajını işler
     */
    async handleUserMessage() {
        const input = document.getElementById('aiInput');
        const message = input?.value.trim();

        if (!message) return;

        // Input'u temizle
        input.value = '';

        // Kullanıcı mesajını göster
        this.addUserMessage(message);

        // AI'dan cevap al
        await this.processUserRequest(message);
    },

    /**
     * Kullanıcı isteğini işler ve AI'dan cevap alır
     */
    async processUserRequest(userMessage) {
        try {
            this.state.isGenerating = true;
            this.showTypingIndicator();

            // Conversation history'ye ekle
            this.state.conversationHistory.push({
                role: 'user',
                content: userMessage
            });

            // Test oluşturma isteği mi kontrol et
            const isTestRequest = this.isTestGenerationRequest(userMessage);

            if (isTestRequest) {
                await this.handleTestGeneration(userMessage);
            } else {
                await this.handleGeneralQuery(userMessage);
            }

            this.state.isGenerating = false;
            this.hideTypingIndicator();

            // History'yi kaydet
            this.saveConversationHistory();

        } catch (error) {
            console.error('AI işlem hatası:', error);
            this.state.isGenerating = false;
            this.hideTypingIndicator();
            
            this.addAIMessage(`⚠️ Bir hata oluştu: ${error.message}

Lütfen tekrar deneyin.`);
        }
    },

    /**
     * Test oluşturma isteği mi kontrol eder
     */
    isTestGenerationRequest(message) {
        const keywords = [
            'test oluştur', 'test yap', 'soru oluştur', 'quiz oluştur',
            'test hazırla', 'sorular oluştur', 'test istiyorum',
            'create test', 'generate test', 'make test'
        ];

        const lowerMessage = message.toLowerCase();
        return keywords.some(keyword => lowerMessage.includes(keyword));
    },

    /**
     * Test oluşturma işlemini yönetir
     */
    async handleTestGeneration(userMessage) {
        try {
            // 1. Kullanıcı isteğini analiz et
            const analysisPrompt = this.buildAnalysisPrompt(userMessage);
            const analysis = await this.callOpenAI(analysisPrompt);

            // 2. Test parametrelerini çıkar
            const testParams = this.parseTestParameters(analysis);

            // 3. Soruları oluştur
            const generationPrompt = this.buildGenerationPrompt(testParams);
            const generatedContent = await this.callOpenAI(generationPrompt);

            // 4. Soruları parse et
            const questions = this.parseGeneratedQuestions(generatedContent);

            if (questions.length === 0) {
                throw new Error('Sorular oluşturulamadı');
            }

            // 5. Testi kaydet
            const testId = this.saveGeneratedTest(testParams, questions);

            // 6. Kullanıcıya göster
            this.displayGeneratedTest(testId, testParams, questions);

        } catch (error) {
            console.error('Test oluşturma hatası:', error);
            this.addAIMessage(`❌ Test oluşturulurken hata oluştu: ${error.message}

Lütfen isteğinizi daha detaylı belirtir misiniz?

**Örnek:** "İşletim sistemleri temel kavramları üzerine 10 soruluk orta seviye test oluştur"`);
        }
    },

    /**
     * Analiz prompt'u oluşturur
     */
    buildAnalysisPrompt(userMessage) {
        return `Kullanıcının test oluşturma isteğini analiz et ve şu parametreleri JSON formatında döndür:

Kullanıcı İsteği: "${userMessage}"

Mevcut Konular: İşletim Sistemleri, Windows, Mac OS, Linux/Pardus, Mobil İşletim Sistemleri, Bellek Yönetimi, Dosya Yönetimi, İşlem Yönetimi, Zamanlama Algoritmaları, Deadlock

Döndürmen gereken JSON formatı:
{
  "questionCount": <sayı, varsayılan 10>,
  "difficulty": "<easy|medium|hard|mixed, varsayılan mixed>",
  "topics": ["<konu1>", "<konu2>", ...],
  "weeks": [<hafta numaraları>],
  "specificRequirements": "<özel istekler>"
}

Sadece JSON döndür, başka açıklama yazma.`;
    },

    /**
     * Test parametrelerini parse eder
     */
    parseTestParameters(aiResponse) {
        try {
            // JSON'u çıkar
            let jsonStr = aiResponse;
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonStr = jsonMatch[0];
            }

            const params = JSON.parse(jsonStr);

            // Varsayılan değerler
            return {
                questionCount: params.questionCount || 10,
                difficulty: params.difficulty || 'mixed',
                topics: params.topics || ['Genel'],
                weeks: params.weeks || [],
                specificRequirements: params.specificRequirements || ''
            };
        } catch (error) {
            console.error('Parametre parse hatası:', error);
            // Varsayılan değerler döndür
            return {
                questionCount: 10,
                difficulty: 'mixed',
                topics: ['Genel'],
                weeks: [],
                specificRequirements: ''
            };
        }
    },

    /**
     * Soru oluşturma prompt'u hazırlar
     */
    buildGenerationPrompt(params) {
        // Mevcut soru bankasından örnek al
        const exampleQuestions = this.getExampleQuestions(params);

        return `Sen bir İşletim Sistemleri eğitim uzmanısın. Aşağıdaki parametrelere göre test soruları oluştur:

**Parametreler:**
- Soru Sayısı: ${params.questionCount}
- Zorluk: ${params.difficulty}
- Konular: ${params.topics.join(', ')}
${params.weeks.length > 0 ? `- Haftalar: ${params.weeks.join(', ')}` : ''}
${params.specificRequirements ? `- Özel İstekler: ${params.specificRequirements}` : ''}

**Mevcut Soru Formatı (örnek):**
${exampleQuestions}

**ÖNEMLİ KURALLAR:**
1. Her soru şu JSON formatında olmalı:
{
  "q": "Soru metni",
  "o": ["Seçenek A", "Seçenek B", "Seçenek C", "Seçenek D"],
  "a": "Doğru cevap",
  "explanation": "Detaylı açıklama",
  "difficulty": "easy|medium|hard",
  "topic": "Konu",
  "week": hafta_numarası
}

2. 4 seçenekli çoktan seçmeli sorular
3. Her soru için detaylı açıklama ekle
4. Açıklamada neden doğru olduğunu anlat
5. Türkçe karakter kullan
6. Akademik ve profesyonel dil
7. Sorular birbirinden farklı olmalı
8. Doğru cevap seçeneklerden biri olmalı

**Döndüreceğin Format:**
\`\`\`json
[
  {
    "q": "...",
    "o": [...],
    "a": "...",
    "explanation": "...",
    "difficulty": "...",
    "topic": "...",
    "week": ...
  },
  ...
]
\`\`\`

Şimdi ${params.questionCount} adet soru oluştur. SADECE JSON array döndür, başka hiçbir şey yazma.`;
    },

    /**
     * Örnek sorular getirir
     */
    getExampleQuestions(params) {
        if (!window.questionBank || window.questionBank.length === 0) {
            return 'Örnek soru yok';
        }

        // Rastgele 2 örnek soru al
        const examples = Utils.shuffleArray(window.questionBank).slice(0, 2);
        
        return examples.map(q => JSON.stringify({
            q: q.q,
            o: q.o,
            a: q.a,
            explanation: q.explanation,
            difficulty: q.difficulty,
            topic: q.topic,
            week: q.week
        }, null, 2)).join('\n\n');
    },

    /**
     * OpenAI API'yi çağırır
     */
    async callOpenAI(prompt) {
        const response = await fetch(this.config.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model,
                messages: [
                    {
                        role: 'system',
                        content: 'Sen İşletim Sistemleri konusunda uzman bir eğitim asistanısın. Test soruları oluşturma ve akademik içerik üretme konusunda profesyonelsin.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: this.config.maxTokens,
                temperature: this.config.temperature
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API hatası');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    },

    /**
     * Oluşturulan soruları parse eder
     */
    parseGeneratedQuestions(content) {
        try {
            // JSON array'i bul
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error('JSON bulunamadı');
            }

            const questions = JSON.parse(jsonMatch[0]);

            // Validate
            if (!Array.isArray(questions)) {
                throw new Error('Geçersiz format');
            }

            // Her soruyu kontrol et
            const validQuestions = questions.filter(q => {
                return q.q && 
                       Array.isArray(q.o) && 
                       q.o.length === 4 && 
                       q.a && 
                       q.o.includes(q.a);
            });

            return validQuestions;

        } catch (error) {
            console.error('Soru parse hatası:', error);
            console.log('AI Response:', content);
            throw new Error('Sorular işlenemedi: ' + error.message);
        }
    },

    /**
     * Oluşturulan testi kaydeder
     */
    saveGeneratedTest(params, questions) {
        const testId = 'ai_test_' + Date.now();
        
        const test = {
            id: testId,
            name: this.generateTestName(params),
            params: params,
            questions: questions,
            createdAt: Date.now(),
            isAIGenerated: true
        };

        this.state.generatedTests.push(test);

        // LocalStorage'a kaydet
        const savedTests = Utils.getFromStorage('ai_generated_tests', []);
        savedTests.push(test);
        Utils.setToStorage('ai_generated_tests', savedTests);

        return testId;
    },

    /**
     * Test adı oluşturur
     */
    generateTestName(params) {
        const topic = params.topics[0] || 'Genel';
        const difficulty = {
            'easy': 'Kolay',
            'medium': 'Orta',
            'hard': 'Zor',
            'mixed': 'Karma'
        }[params.difficulty] || 'Karma';

        return `${topic} - ${difficulty} Seviye (${params.questionCount} Soru)`;
    },

    /**
     * Oluşturulan testi kullanıcıya gösterir
     */
    displayGeneratedTest(testId, params, questions) {
        const messageHTML = `✅ **Test Başarıyla Oluşturuldu!**

📊 **Test Bilgileri:**
- Soru Sayısı: ${params.questionCount}
- Zorluk: ${params.difficulty}
- Konular: ${params.topics.join(', ')}

📝 **Örnek Sorular:**
${questions.slice(0, 2).map((q, i) => `
${i + 1}. ${q.q}
   A) ${q.o[0]}
   B) ${q.o[1]}
   ✓ Doğru: ${q.a}
`).join('\n')}

<button class="btn btn-primary" onclick="TestifyAI.startAITest('${testId}')" style="margin-top: 15px; width: 100%;">
🚀 Teste Başla
</button>

<button class="btn btn-secondary" onclick="TestifyAI.previewTest('${testId}')" style="margin-top: 10px; width: 100%;">
👁️ Tüm Soruları Gör
</button>`;

        this.addAIMessage(messageHTML);
    },

    /**
     * AI testi başlatır
     */
    startAITest(testId) {
        const test = this.state.generatedTests.find(t => t.id === testId);
        
        if (!test) {
            Utils.showToast('Test bulunamadı!', 'error');
            return;
        }

        // QuizManager'a soruları yükle
        if (window.QuizManager) {
            // Geçici olarak questionBank'i değiştir
            const originalQuestions = window.questionBank;
            window.questionBank = test.questions;

            // Quiz'i başlat
            QuizManager.startQuiz('ai');

            // questionBank'i geri yükle (quiz bittiğinde)
            setTimeout(() => {
                window.questionBank = originalQuestions;
            }, 1000);

            Utils.showToast(`${test.name} başlatıldı!`, 'success');
        } else {
            Utils.showToast('Quiz sistemi bulunamadı!', 'error');
        }
    },

    /**
     * Test önizlemesi gösterir
     */
    previewTest(testId) {
        const test = this.state.generatedTests.find(t => t.id === testId);
        
        if (!test) {
            Utils.showToast('Test bulunamadı!', 'error');
            return;
        }

        const previewHTML = `📋 **${test.name}**

${test.questions.map((q, i) => `
**${i + 1}. ${q.q}**

A) ${q.o[0]}
B) ${q.o[1]}
C) ${q.o[2]}
D) ${q.o[3]}

✅ Doğru Cevap: ${q.a}
💡 Açıklama: ${q.explanation}

---
`).join('\n')}`;

        this.addAIMessage(previewHTML);
    },

    /**
     * Genel sorguları işler
     */
    async handleGeneralQuery(userMessage) {
        const prompt = `Kullanıcı sorusu: "${userMessage}"

Sen bir test oluşturma asistanısın. Kullanıcıya kısa ve net bir şekilde cevap ver.

**Konuşma Kuralları:**
1. Kısa ve öz cevaplar
2. Gerekirse test oluşturma önerileri sun
3. Profesyonel dil kullan
4. Markdown formatında yaz

Cevabın:`;

        const response = await this.callOpenAI(prompt);
        this.addAIMessage(response);
    },

    /**
     * Kullanıcı mesajını chat'e ekler
     */
    addUserMessage(message) {
        const chatContainer = document.getElementById('aiChat');
        if (!chatContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                ${Utils.sanitizeHTML(message)}
            </div>
            <div class="ai-avatar" style="background: var(--primary);">
                ${document.getElementById('userAvatar')?.textContent || 'U'}
            </div>
        `;

        chatContainer.appendChild(messageDiv);
        this.scrollToBottom();
    },

    /**
     * AI mesajını chat'e ekler
     */
    addAIMessage(message) {
        const chatContainer = document.getElementById('aiChat');
        if (!chatContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message';
        
        // Markdown'ı HTML'e çevir (basit)
        const htmlContent = this.markdownToHTML(message);
        
        messageDiv.innerHTML = `
            <div class="ai-avatar">🤖</div>
            <div class="message-content">
                ${htmlContent}
            </div>
        `;

        chatContainer.appendChild(messageDiv);
        this.scrollToBottom();

        // Conversation history'ye ekle
        this.state.conversationHistory.push({
            role: 'assistant',
            content: message
        });
    },

    /**
     * Basit markdown to HTML converter
     */
    markdownToHTML(text) {
        return text
            // Bold
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            // Lists
            .replace(/^• (.+)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            // Line breaks
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
    },

    /**
     * Typing indicator gösterir
     */
    showTypingIndicator() {
        const chatContainer = document.getElementById('aiChat');
        if (!chatContainer) return;

        const indicator = document.createElement('div');
        indicator.id = 'typingIndicator';
        indicator.className = 'ai-message';
        indicator.innerHTML = `
            <div class="ai-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        chatContainer.appendChild(indicator);
        this.scrollToBottom();
    },

    /**
     * Typing indicator'ı gizler
     */
    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    },

    /**
     * Chat'i en alta kaydırır
     */
    scrollToBottom() {
        const chatContainer = document.getElementById('aiChat');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    },

    /**
     * Conversation history'yi kaydeder
     */
    saveConversationHistory() {
        try {
            // Son 50 mesajı tut
            const recentHistory = this.state.conversationHistory.slice(-50);
            Utils.setToStorage('ai_conversation_history', recentHistory);
        } catch (error) {
            console.warn('History kaydetme hatası:', error);
        }
    },

    /**
     * Conversation history'yi yükler
     */
    loadConversationHistory() {
        try {
            const history = Utils.getFromStorage('ai_conversation_history', []);
            this.state.conversationHistory = history;
        } catch (error) {
            console.warn('History yükleme hatası:', error);
            this.state.conversationHistory = [];
        }
    },

    /**
     * Chat'i temizler
     */
    clearChat() {
        const chatContainer = document.getElementById('aiChat');
        if (chatContainer) {
            chatContainer.innerHTML = '';
        }
        this.state.conversationHistory = [];
        this.saveConversationHistory();
    }
};

// Typing indicator CSS'i ekle
const style = document.createElement('style');
style.textContent = `
    .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 10px;
    }
    
    .typing-indicator span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--primary);
        animation: typing 1.4s infinite;
    }
    
    .typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typing {
        0%, 60%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
        }
        30% {
            opacity: 1;
            transform: scale(1.2);
        }
    }

    .message-content ul {
        margin: 10px 0;
        padding-left: 20px;
    }

    .message-content li {
        margin: 5px 0;
        line-height: 1.5;
    }

    .message-content strong {
        color: var(--primary);
        font-weight: 600;
    }
`;
document.head.appendChild(style);

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    TestifyAI.init();
});

// Export
window.TestifyAI = TestifyAI;
