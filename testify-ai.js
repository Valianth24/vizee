import React, { useState, useEffect, useRef } from 'react';
import { Send, BookOpen, Brain, Trophy, TrendingUp, BarChart3 } from 'lucide-react';

const TestifyAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    streak: 0,
    level: 1
  });
  const [showStats, setShowStats] = useState(false);
  const chatRef = useRef(null);

  // Soru bankası
  const questionBank = {
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
• HKEY_CLASSES_ROOT (HKCR) → Dosya ilişkilendirmeleri
• HKEY_CURRENT_USER (HKCU) → Aktif kullanıcı ayarları
• HKEY_LOCAL_MACHINE (HKLM) → Sistem geneli ayarlar
• HKEY_USERS (HKU) → Tüm kullanıcı profilleri
• HKEY_CURRENT_CONFIG (HKCC) → Donanım profilleri

💡 GERÇEK HAYAT ÖRNEĞİ:
Bir programı kaldırdıktan sonra hala "Aç" menüsünde görünüyorsa, Registry'de kalmış olabilir.`
      },
      {
        id: 'w2',
        question: "Windows'ta Blue Screen of Death (BSOD) ne anlama gelir?",
        options: [
          "Kritik sistem hatası ve çökme",
          "Ekran koruyucu",
          "Güncelleme bildirimi",
          "Uyku modu"
        ],
        correct: 0,
        difficulty: "medium",
        explanation: `💙 BLUE SCREEN OF DEATH (BSOD) ANALİZİ:

🚨 NEDİR?
Windows'un kritik bir hatayla karşılaştığında gösterdiği mavi hata ekranıdır.

❓ NEDEN OLUR?
1. 🔧 Donanım Sorunları
2. 💿 Bozuk sürücüler
3. 🦠 Virüsler

🔧 ÇÖZÜM YÖNTEMLERİ:
• Güvenli modda başlat (F8)
• Sürücüleri güncelle
• RAM testi yap`
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
• 7 (Sahip) = rwx (Okuma+Yazma+Çalıştırma)
• 5 (Grup) = r-x (Okuma+Çalıştırma)
• 5 (Diğer) = r-x (Okuma+Çalıştırma)

💻 ÖRNEKLER:
chmod 777 → Herkes her şeyi yapabilir (⚠️ Tehlikeli!)
chmod 644 → Sahip: rw-, Diğerleri: r--
chmod 600 → Sadece sahip okuyup yazabilir`
      }
    ],
    memory: [
      {
        id: 'm1',
        question: "Page Fault ne zaman oluşur?",
        options: [
          "İstenen sayfa RAM'de olmayıp disk'te olduğunda",
          "RAM dolduğunda",
          "CPU meşgul olduğunda",
          "Program çöktüğünde"
        ],
        correct: 0,
        difficulty: "hard",
        explanation: `📄 PAGE FAULT DETAYLI ANALİZ:

🔍 PAGE FAULT NEDİR?
CPU'nun erişmek istediği bellek sayfası RAM'de değil, disk'te olduğunda oluşan durum.

📊 TÜRLERİ:
1️⃣ MINOR (SOFT) - Çok hızlı
2️⃣ MAJOR (HARD) - Yavaş (disk erişimi)
3️⃣ INVALID - Program crash

📈 PERFORMANS:
• RAM: ~100 nanosaniye
• Disk: ~10 milisaniye
• 100,000x daha yavaş!`
      }
    ],
    scheduling: [
      {
        id: 's1',
        question: "Convoy Effect hangi zamanlama algoritmasında görülür?",
        options: [
          "FCFS (First Come First Serve)",
          "Round Robin",
          "SJF (Shortest Job First)",
          "Priority Scheduling"
        ],
        correct: 0,
        difficulty: "hard",
        explanation: `🚛 CONVOY EFFECT:

📖 TANIM:
Kısa işlemlerin uzun bir işlemin arkasında beklemesi. FCFS'te görülür.

🎭 ÖRNEK:
🚗🚗🚗🚛🚗🚗 (Kamyon arkasındaki arabalar)

💡 ÇÖZÜM:
• SJF kullan
• Round Robin kullan
• Preemptive scheduling`
      }
    ]
  };

  // Storage'dan veri yükle
  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const loadStats = async () => {
    try {
      const result = await window.storage.get('testify-stats');
      if (result) {
        setStats(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('İlk kullanım - istatistik yok');
    }
  };

  const saveStats = async (newStats) => {
    try {
      await window.storage.set('testify-stats', JSON.stringify(newStats));
      setStats(newStats);
    } catch (error) {
      console.error('İstatistik kaydedilemedi:', error);
    }
  };

  const addMessage = (text, sender = 'ai', type = 'text') => {
    setMessages(prev => [...prev, { 
      text, 
      sender, 
      type,
      timestamp: Date.now() 
    }]);
  };

  const getRandomQuestion = (difficulty = null) => {
    const allQuestions = [
      ...questionBank.windows,
      ...questionBank.linux,
      ...questionBank.memory,
      ...questionBank.scheduling
    ];
    
    const filtered = difficulty 
      ? allQuestions.filter(q => q.difficulty === difficulty)
      : allQuestions;
    
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const showQuestion = (difficulty = null) => {
    const question = getRandomQuestion(difficulty);
    setCurrentQuestion(question);
    
    addMessage(
      `📝 **SORU** (${question.difficulty === 'easy' ? 'Kolay' : question.difficulty === 'medium' ? 'Orta' : 'Zor'})

${question.question}`,
      'ai',
      'question'
    );
  };

  const checkAnswer = (answerIndex) => {
    if (!currentQuestion) return;
    
    const isCorrect = answerIndex === currentQuestion.correct;
    const newStats = { ...stats };
    
    newStats.totalQuestions++;
    
    if (isCorrect) {
      newStats.correctAnswers++;
      newStats.streak++;
      
      // Seviye sistemi
      if (newStats.correctAnswers % 5 === 0) {
        newStats.level++;
      }
      
      addMessage(
        `✅ **DOĞRU!** 🎉

${currentQuestion.explanation}

**İstatistikler:**
• Toplam Soru: ${newStats.totalQuestions}
• Doğru: ${newStats.correctAnswers}
• Başarı: ${Math.round((newStats.correctAnswers / newStats.totalQuestions) * 100)}%
• Seri: ${newStats.streak} 🔥
• Seviye: ${newStats.level}`,
        'ai'
      );
    } else {
      newStats.streak = 0;
      
      addMessage(
        `❌ **YANLIŞ!**

Doğru cevap: **${currentQuestion.options[currentQuestion.correct]}**

${currentQuestion.explanation}

Seri bitti 💔 Ama vazgeçme! Bir sonraki soruyu dene! 💪`,
        'ai'
      );
    }
    
    saveStats(newStats);
    setCurrentQuestion(null);
  };

  const handleAIResponse = async (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    // Komutlar
    if (msg.includes('/stats')) {
      setShowStats(true);
      return;
    }
    
    if (msg.includes('/clear') || msg.includes('temizle')) {
      setMessages([]);
      addMessage("Sohbet temizlendi! Yeni bir başlangıç 🎯", 'ai');
      return;
    }
    
    // Selamlaşma
    if (['merhaba', 'selam', 'hey', 'günaydın'].some(g => msg.includes(g))) {
      addMessage(
        "Merhaba! 👋 Ben Testify, senin eğitim arkadaşın! Bugün hangi konuyu öğrenmek istersin?\n\n" +
        "• **'soru ver'** - Rastgele soru\n" +
        "• **'kolay/orta/zor soru'** - Seviye seç\n" +
        "• **'page fault nedir'** - Konu öğren\n" +
        "• **'/stats'** - İstatistiklerini gör",
        'ai'
      );
      return;
    }
    
    // Soru isteme
    if (msg.includes('soru') || msg.includes('test') || msg.includes('quiz')) {
      let difficulty = null;
      if (msg.includes('kolay')) difficulty = 'easy';
      else if (msg.includes('orta')) difficulty = 'medium';
      else if (msg.includes('zor')) difficulty = 'hard';
      
      showQuestion(difficulty);
      return;
    }
    
    // Konu açıklaması
    if (msg.includes('nedir') || msg.includes('açıkla') || msg.includes('anlat')) {
      if (msg.includes('page fault')) {
        addMessage(questionBank.memory[0].explanation, 'ai');
      } else if (msg.includes('convoy')) {
        addMessage(questionBank.scheduling[0].explanation, 'ai');
      } else if (msg.includes('registry')) {
        addMessage(questionBank.windows[0].explanation, 'ai');
      } else if (msg.includes('bsod')) {
        addMessage(questionBank.windows[1].explanation, 'ai');
      } else if (msg.includes('chmod')) {
        addMessage(questionBank.linux[0].explanation, 'ai');
      } else {
        // Claude API kullan
        await askClaudeAPI(userMessage);
      }
      return;
    }
    
    // Motivasyon
    if (['yapamıyorum', 'zor', 'anlamıyorum', 'bıktım'].some(k => msg.includes(k))) {
      addMessage(
        `💪 **HİÇ PES ETME!**
        
Her uzman bir zamanlar acemiydi. Steve Jobs, Bill Gates... Hepsi senin gibi başladı!

Unutma:
• Hata yapmak öğrenmenin bir parçası
• Her yanlış cevap seni doğruya yaklaştırır
• Küçük adımlar büyük başarılara götürür

Hadi, bir soru daha deneyelim! Bu sefer başaracaksın! 🌟`,
        'ai'
      );
      return;
    }
    
    // Varsayılan: Claude'a sor
    await askClaudeAPI(userMessage);
  };

  const askClaudeAPI = async (question) => {
    try {
      setIsTyping(true);
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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"
        },
        body: JSON.stringify({
          model: "gpt-5-nano",
          messages: [
            { 
              role: "system", 
              content: "Sen Testify AI'sın, bir işletim sistemleri eğitim asistanısın. Emoji kullan, basit ve anlaşılır ol, örnekler ver, kısa ve öz yaz (max 500 kelime)."
            },
            { 
              role: "user", 
              content: question
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;
      
      setIsTyping(false);
      addMessage(aiResponse || "Üzgünüm, yanıt alamadım. Tekrar dener misin?", 'ai');
      
    } catch (error) {
      setIsTyping(false);
      addMessage(
        "⚠️ API bağlantısı kurulamadı. Ancak soru bankasından sana yardımcı olabilirim!\n\n" +
        "Şunu dene:\n• 'Soru ver'\n• 'Registry nedir'\n• 'Page fault açıkla'",
        'ai'
      );
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    addMessage(userMsg, 'user');
    
    // Cevap kontrolü
    if (currentQuestion) {
      const answer = userMsg.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(answer)) {
        checkAnswer(answer.charCodeAt(0) - 65);
        return;
      }
    }
    
    setTimeout(() => handleAIResponse(userMsg), 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                T
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Testify AI</h1>
                <p className="text-sm text-gray-500">İşletim Sistemleri Eğitim Asistanı</p>
              </div>
            </div>
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
            >
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">İstatistikler</span>
            </button>
          </div>
        </div>

        {/* Stats Panel */}
        {showStats && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Performans İstatistiklerin
              </h3>
              <button
                onClick={() => setShowStats(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">{stats.totalQuestions}</div>
                <div className="text-sm opacity-90">Toplam Soru</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold text-green-300">{stats.correctAnswers}</div>
                <div className="text-sm opacity-90">Doğru</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">
                  {stats.totalQuestions > 0 
                    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
                    : 0}%
                </div>
                <div className="text-sm opacity-90">Başarı</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold text-orange-300">{stats.streak} 🔥</div>
                <div className="text-sm opacity-90">Seri</div>
              </div>
            </div>
            <div className="mt-4 bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Seviye {stats.level}</span>
                <span className="text-sm opacity-90">
                  {stats.correctAnswers % 5} / 5 sonraki seviyeye
                </span>
              </div>
              <div className="mt-2 bg-white/20 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${(stats.correctAnswers % 5) * 20}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div ref={chatRef} className="bg-white h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20">
              <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Merhaba! Sana nasıl yardımcı olabilirim?</p>
              <p className="text-sm mt-2">Başlamak için "soru ver" veya "yardım" yaz</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white ml-auto' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {msg.type === 'question' && currentQuestion && (
                  <div className="space-y-3 mt-2">
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <div className="space-y-2">
                      {currentQuestion.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => checkAnswer(i)}
                          className="w-full text-left px-4 py-3 bg-white border-2 border-indigo-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                        >
                          <span className="font-bold text-indigo-600">
                            {String.fromCharCode(65 + i)})
                          </span> {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {msg.type === 'text' && (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-b-2xl shadow-lg p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mesajını yaz... (Enter'a bas veya ⬆️ tuşuna tıkla)"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button onClick={() => { setInput('Soru ver'); handleSend(); }} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
              📝 Soru Ver
            </button>
            <button onClick={() => { setInput('Page fault nedir'); handleSend(); }} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
              📚 Konu Öğren
            </button>
            <button onClick={() => { setInput('/stats'); handleSend(); }} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
              📊 İstatistikler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestifyAI;
