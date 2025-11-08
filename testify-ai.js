/**
 * TESTIFY AI - OPTİMİZE EDİLMİŞ EĞİTİM ASİSTANI
 * Bismillahirrahmanirrahim
 * Minimum API kullanımı, maksimum yerel zeka ve detaylı açıklamalar
 */

'use strict';

const TestifyAI = {
    // Sistem yapılandırması
    config: {
        name: 'Testify Eğitim Asistanı',
        version: '4.0',
        mode: 'local-first',
        apiUsage: 'minimal',
        features: {
            smartQuestions: true,
            detailedExplanations: true,
            adaptiveLearning: true,
            performanceTracking: true
        }
    },

    // Gelişmiş soru havuzu
    questionBank: {
        week1: {
            windows: [
                {
                    id: 'w1-win-001',
                    question: "Windows Registry nedir ve ne işe yarar?",
                    options: [
                        "Sistem ayarlarının saklandığı merkezi veritabanı",
                        "Dosya yedekleme sistemi",
                        "Antivirüs programı",
                        "İnternet geçmişi"
                    ],
                    correctAnswer: "Sistem ayarlarının saklandığı merkezi veritabanı",
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

⚙️ KULLANIM ALANLARI:
1. Program ayarları saklanır
2. Windows özellikleri yapılandırılır
3. Donanım bilgileri tutulur
4. Kullanıcı tercihleri kaydedilir

🛠️ REGISTRY EDİTÖR:
• Açmak için: Win+R → regedit
• ⚠️ DİKKAT: Yanlış değişiklik sistemi bozabilir!
• Değişiklik öncesi yedek alın

💡 GERÇEK HAYAT ÖRNEĞİ:
Bir programı kaldırdıktan sonra hala "Aç" menüsünde görünüyorsa, Registry'de kalmış olabilir.

🎯 İPUCU: Registry temizleme programları (CCleaner gibi) gereksiz kayıtları temizler.`,
                    tips: [
                        "Registry'yi düzenlemeden önce mutlaka yedek alın",
                        "Sistem geri yükleme noktası oluşturun",
                        "Bilmediğiniz anahtarları değiştirmeyin"
                    ],
                    relatedTopics: ["Sistem Dosyaları", "Windows Yapısı", "Sistem Optimizasyonu"]
                },
                {
                    id: 'w1-win-002',
                    question: "Windows'ta Blue Screen of Death (BSOD) ne anlama gelir?",
                    options: [
                        "Kritik sistem hatası ve çökme",
                        "Ekran koruyucu",
                        "Güncelleme bildirimi",
                        "Uyku modu"
                    ],
                    correctAnswer: "Kritik sistem hatası ve çökme",
                    difficulty: "medium",
                    explanation: `💙 BLUE SCREEN OF DEATH (BSOD) ANALİZİ:

🚨 NEDİR?
Windows'un kritik bir hatayla karşılaştığında gösterdiği mavi hata ekranıdır.

❓ NEDEN OLUR?
1. 🔧 Donanım Sorunları:
   • Bozuk RAM
   • Aşırı ısınma
   • Uyumsuz donanım

2. 💿 Yazılım Sorunları:
   • Bozuk sürücüler (driver)
   • Sistem dosyası hasarı
   • Uyumsuz yazılımlar

3. 🦠 Diğer Sebepler:
   • Virüsler
   • Güç kesintileri
   • BIOS ayarları

📊 HATA KODLARI:
• IRQL_NOT_LESS_OR_EQUAL → Sürücü sorunu
• PAGE_FAULT_IN_NONPAGED_AREA → RAM sorunu
• SYSTEM_SERVICE_EXCEPTION → Sistem dosyası hatası
• KERNEL_SECURITY_CHECK_FAILURE → Güvenlik ihlali

🔧 ÇÖZÜM YÖNTEMLERİ:
1. Güvenli modda başlat (F8)
2. Son donanım/yazılım değişikliklerini geri al
3. Sürücüleri güncelle
4. RAM testi yap (Windows Memory Diagnostic)
5. Sistem dosyalarını onar (sfc /scannow)

💡 ÖNLEYİCİ TEDBİRLER:
• Düzenli Windows güncellemeleri
• Sürücüleri güncel tut
• Antivirüs kullan
• Sistem temizliği yap
• Aşırı ısınmayı önle

🎯 MODERN WINDOWS: Windows 10/11'de BSOD artık QR kod gösterir!`,
                    tips: [
                        "BSOD hata kodunu not alın",
                        "Event Viewer'da detaylı bilgi bulabilirsiniz",
                        "Minidump dosyaları analiz edilebilir"
                    ]
                }
            ],
            linux: [
                {
                    id: 'w1-linux-001',
                    question: "Linux'ta chmod 755 komutu ne yapar?",
                    options: [
                        "Sahip: okuma+yazma+çalıştırma, Diğerleri: okuma+çalıştırma",
                        "Tüm izinleri kaldırır",
                        "Sadece okuma izni verir",
                        "Dosyayı siler"
                    ],
                    correctAnswer: "Sahip: okuma+yazma+çalıştırma, Diğerleri: okuma+çalıştırma",
                    difficulty: "hard",
                    explanation: `🔐 CHMOD ve LINUX İZİN SİSTEMİ:

📊 İZİN YAPISI:
Linux'ta her dosya/klasör için 3 grup izin vardır:
• Owner (Sahip) - u
• Group (Grup) - g  
• Others (Diğerleri) - o

🔢 SAYI SİSTEMİ:
• 4 = Read (Okuma) - r
• 2 = Write (Yazma) - w
• 1 = Execute (Çalıştırma) - x

📐 CHMOD 755 AÇILIMI:
• 7 (Sahip) = 4+2+1 = rwx (Okuma+Yazma+Çalıştırma)
• 5 (Grup) = 4+0+1 = r-x (Okuma+Çalıştırma)
• 5 (Diğer) = 4+0+1 = r-x (Okuma+Çalıştırma)

💻 ÖRNEKLER:
chmod 777 dosya → Herkes her şeyi yapabilir (⚠️ Tehlikeli!)
chmod 644 dosya → Sahip: rw-, Diğerleri: r--
chmod 600 dosya → Sadece sahip okuyup yazabilir
chmod 755 script.sh → Tipik script izni

🔤 HARF YÖNTEMİ:
chmod u+x dosya → Sahibe çalıştırma izni ekle
chmod g-w dosya → Gruptan yazma iznini kaldır
chmod o=r dosya → Diğerlerine sadece okuma

🎯 KULLANIM ALANLARI:
• Web sunucuları: 755 (klasörler), 644 (dosyalar)
• Script dosyaları: 755 veya 775
• Özel dosyalar: 600
• Public dosyalar: 644

⚠️ GÜVENLİK İPUÇLARI:
• 777 kullanmaktan kaçının
• /etc altındaki dosyalara dikkat
• Script dosyalarını kontrol edin`,
                    tips: [
                        "ls -la komutu ile izinleri görebilirsiniz",
                        "umask komutu varsayılan izinleri ayarlar",
                        "sudo gerekebilir sistem dosyaları için"
                    ]
                }
            ]
        },
        week3: {
            memory: [
                {
                    id: 'w3-mem-001',
                    question: "Page Fault ne zaman oluşur?",
                    options: [
                        "İstenen sayfa RAM'de olmayıp disk'te olduğunda",
                        "RAM dolduğunda",
                        "CPU meşgul olduğunda",
                        "Program çöktüğünde"
                    ],
                    correctAnswer: "İstenen sayfa RAM'de olmayıp disk'te olduğunda",
                    difficulty: "hard",
                    explanation: `📄 PAGE FAULT (SAYFA HATASI) DETAYLI ANALİZ:

🔍 PAGE FAULT NEDİR?
CPU'nun erişmek istediği bellek sayfası (page) RAM'de değil, disk'te (swap/page file) olduğunda oluşan durum.

📊 PAGE FAULT TÜRLERİ:

1️⃣ MINOR (SOFT) PAGE FAULT:
• Sayfa bellekte var ama page table'da işaretli değil
• Çok hızlı çözülür
• Örnek: Paylaşılan kütüphane ilk kez yüklenirken

2️⃣ MAJOR (HARD) PAGE FAULT:
• Sayfa disk'ten yüklenmeli
• Yavaş (1000x daha yavaş)
• Sistem performansını etkiler
• Örnek: Swap'tan veri geri yükleme

3️⃣ INVALID PAGE FAULT:
• Geçersiz bellek erişimi
• Program crash'i
• Segmentation fault (Linux)

⚙️ ÇALIŞMA MEKANİZMASI:
1. Program bellek adresi ister
2. MMU (Memory Management Unit) kontrol eder
3. Sayfa RAM'de yoksa → Page Fault interrupt
4. İşletim sistemi devreye girer
5. Sayfa disk'ten RAM'e yüklenir
6. Page table güncellenir
7. Program kaldığı yerden devam eder

📈 PERFORMANS ETKİSİ:
• RAM Erişimi: ~100 nanosaniye
• Disk Erişimi: ~10 milisaniye
• 100,000x daha yavaş!

🔧 OPTİMİZASYON:
• Daha fazla RAM ekle
• Swap kullanımını azalt
• Working set'i küçült
• Prefetching kullan

💡 GERÇEK HAYAT:
Photoshop'ta büyük resim açarken donma → Page fault!
Chrome'da çok sekme → Sürekli page fault!`,
                    tips: [
                        "Windows: Performance Monitor ile izleyin",
                        "Linux: vmstat komutu page fault gösterir",
                        "SSD kullanmak page fault süresini azaltır"
                    ]
                }
            ]
        },
        week5: {
            scheduling: [
                {
                    id: 'w5-sch-001',
                    question: "Convoy Effect hangi zamanlama algoritmasında görülür?",
                    options: [
                        "FCFS (First Come First Serve)",
                        "Round Robin",
                        "SJF (Shortest Job First)",
                        "Priority Scheduling"
                    ],
                    correctAnswer: "FCFS (First Come First Serve)",
                    difficulty: "hard",
                    explanation: `🚛 CONVOY EFFECT (KONVOY ETKİSİ):

📖 TANIM:
Kısa işlemlerin uzun bir işlemin arkasında beklemesi durumu. FCFS'te görülür.

🎭 GERÇEK HAYAT ÖRNEĞİ:
🚗🚗🚗🚛🚗🚗 (Otoyolda kamyon arkasındaki arabalar)
Kamyon yavaş → Arkadakiler de yavaş gitmek zorunda!

📊 PROBLEM SENARYOSU:
İşlemler: P1(24ms), P2(3ms), P3(3ms)

FCFS Sıralaması:
P1 → P2 → P3
0   24  27  30

Bekleme Süreleri:
• P1: 0ms
• P2: 24ms (!) 
• P3: 27ms (!)
Ortalama: 17ms 😱

SJF Sıralaması:
P2 → P3 → P1
0   3   6   30

Bekleme Süreleri:
• P2: 0ms
• P3: 3ms
• P1: 6ms
Ortalama: 3ms 😊

🔴 CONVOY EFFECT ZARARLARI:
• CPU kullanımı düşer
• Throughput azalır
• Response time artar
• Sistem verimsizleşir

💡 ÇÖZÜMLER:
1. SJF kullan (en kısa iş önce)
2. Round Robin kullan (adil paylaşım)
3. Multilevel Queue (öncelik sıraları)
4. Preemptive scheduling

🎯 MODERN SİSTEMLERDE:
• Windows/Linux FCFS kullanmaz
• Multilevel Feedback Queue kullanır
• Convoy effect önlenir`,
                    tips: [
                        "FCFS basit ama verimsiz",
                        "Batch sistemlerde kabul edilebilir",
                        "İnteraktif sistemlerde kesinlikle kullanılmaz"
                    ]
                }
            ],
            synchronization: [
                {
                    id: 'w5-sync-001',
                    question: "Dining Philosophers Problem neyi gösterir?",
                    options: [
                        "Deadlock ve resource allocation problemlerini",
                        "Memory leak problemini",
                        "Cache tutarlılığını",
                        "Network güvenliğini"
                    ],
                    correctAnswer: "Deadlock ve resource allocation problemlerini",
                    difficulty: "hard",
                    explanation: `🍝 DINING PHILOSOPHERS PROBLEM:

📖 PROBLEM TANIMI:
5 filozof yuvarlak masada oturuyor. Her filozofun:
• Önünde bir tabak makarna
• Sağında ve solunda birer çatal (toplam 5 çatal)
• Yemek için 2 çatal gerekli

🤔 FİLOZOF DAVRANIŞI:
1. Düşün
2. Aç ol
3. Sol çatalı al
4. Sağ çatalı al
5. Ye
6. Çatalları bırak
7. Tekrarla

⚠️ DEADLOCK SENARYOSU:
Hepsi aynı anda sol çatalı alırsa:
• F1 sol çatalı aldı, sağı bekliyor
• F2 sol çatalı aldı, sağı bekliyor
• F3 sol çatalı aldı, sağı bekliyor
• F4 sol çatalı aldı, sağı bekliyor
• F5 sol çatalı aldı, sağı bekliyor
= DEADLOCK! Kimse yiyemez! 🔒

🔧 ÇÖZÜM YÖNTEMLERİ:

1️⃣ RESOURCE HIERARCHY:
• Çatalları numrala (1-5)
• Önce küçük numaralıyı al
• Döngüsel bekleme önlenir

2️⃣ ARBITRATOR (WAITER):
• Merkezi kontrol (Mutex)
• Waiter'dan izin al
• Maximum 4 filozof yiyebilir

3️⃣ CHANDY/MISRA:
• Çatallar "kirli" veya "temiz"
• Temiz çatal istenirse verilir
• Asimetrik çözüm

4️⃣ TRY-WAIT:
• Çatal alamazsan bekle
• Timeout kullan
• Başarısızlıkta bırak ve tekrar dene

🎯 GERÇEK HAYAT:
• Database lock yönetimi
• İşletim sistemi kaynak tahsisi
• Network protokolleri
• Distributed systems`,
                    tips: [
                        "Sadece 4 filozofun yemesine izin vermek deadlock'u önler",
                        "Banker's Algorithm benzer prensiple çalışır",
                        "Modern veritabanları bu problemi çözer"
                    ]
                }
            ]
        }
    },

    // Akıllı yanıt sistemi
    responseSystem: {
        generateResponse(message) {
            const lowerMsg = message.toLowerCase();
            
            if (this.isGreeting(lowerMsg)) {
                return this.greetingResponse();
            }
            
            if (this.wantsQuestion(lowerMsg)) {
                return this.provideQuestion(lowerMsg);
            }
            
            if (this.wantsExplanation(lowerMsg)) {
                return this.provideExplanation(lowerMsg);
            }
            
            if (this.needsHelp(lowerMsg)) {
                return this.provideHelp(lowerMsg);
            }
            
            if (this.needsMotivation(lowerMsg)) {
                return this.motivate(lowerMsg);
            }
            
            return this.defaultResponse();
        },
        
        isGreeting(msg) {
            const greetings = ['merhaba', 'selam', 'hey', 'günaydın', 'iyi günler'];
            return greetings.some(g => msg.includes(g));
        },
        
        greetingResponse() {
            const responses = [
                "Merhaba! 👋 Ben Testify, senin eğitim arkadaşın! Bugün hangi konuyu öğrenmek istersin?",
                "Selam! 🌟 Öğrenmeye hazır mısın? İşletim sistemleri, bellek yönetimi, process konuları... Hangisi?",
                "Hoş geldin! 🎓 Sana nasıl yardımcı olabilirim? Soru çözebilir, konu anlatabilirim!"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        },
        
        wantsQuestion(msg) {
            const keywords = ['soru', 'test', 'quiz', 'sınav', 'alıştırma', 'pratik'];
            return keywords.some(k => msg.includes(k));
        },
        
        provideQuestion(msg) {
            let difficulty = 'medium';
            if (msg.includes('kolay')) difficulty = 'easy';
            if (msg.includes('zor')) difficulty = 'hard';
            
            const allQuestions = [];
            Object.values(TestifyAI.questionBank).forEach(week => {
                Object.values(week).forEach(category => {
                    allQuestions.push(...category.filter(q => q.difficulty === difficulty));
                });
            });
            
            if (allQuestions.length === 0) {
                return "Bu zorlukta soru bulunamadı. Başka bir zorluk seviyesi deneyin!";
            }
            
            const question = allQuestions[Math.floor(Math.random() * allQuestions.length)];
            
            return `📝 **SORU** (${difficulty === 'easy' ? 'Kolay' : difficulty === 'medium' ? 'Orta' : 'Zor'})

${question.question}

A) ${question.options[0]}
B) ${question.options[1]}
C) ${question.options[2]}
D) ${question.options[3]}

💡 *İpucu ister misin? "ipucu" yaz*
📖 *Açıklama için cevap verdikten sonra "açıkla" yaz*`;
        },
        
        wantsExplanation(msg) {
            const keywords = ['açıkla', 'anlat', 'nedir', 'nasıl', 'neden', 'ne zaman'];
            return keywords.some(k => msg.includes(k));
        },
        
        provideExplanation(msg) {
            if (msg.includes('page fault') || msg.includes('sayfa hatası')) {
                return TestifyAI.questionBank.week3.memory[0].explanation;
            }
            
            if (msg.includes('convoy') || msg.includes('konvoy')) {
                return TestifyAI.questionBank.week5.scheduling[0].explanation;
            }
            
            if (msg.includes('dining') || msg.includes('filozof')) {
                return TestifyAI.questionBank.week5.synchronization[0].explanation;
            }
            
            return `📚 Hangi konuyu açıklamamı istersin? Örnekler:

• **Page Fault** - Sayfa hataları ve bellek yönetimi
• **Convoy Effect** - FCFS algoritmasındaki problem
• **Dining Philosophers** - Deadlock problemi
• **Registry** - Windows kayıt defteri
• **BSOD** - Mavi ekran hatası
• **chmod** - Linux dosya izinleri

Konuyu belirt, detaylı açıklayayım! 🎯`;
        },
        
        needsHelp(msg) {
            return msg.includes('yardım') || msg.includes('help') || msg.includes('nasıl kullan');
        },
        
        provideHelp(msg) {
            return `🆘 **TESTIFY KULLANIM KILAVUZU**

Ben sana şu konularda yardımcı olabilirim:

📝 **TEST & SORULAR:**
• "Kolay soru ver" - Kolay seviye soru
• "Orta soru" - Orta seviye soru
• "Zor soru göster" - Zor seviye soru
• "Test başlat" - Soru serisi

📚 **KONU ANLATIMI:**
• "Page fault nedir?"
• "Process ve thread farkı"
• "Deadlock açıkla"
• "Virtual memory anlat"

💡 **İPUÇLARI:**
• "İpucu ver" - Mevcut soru için ipucu
• "Örnek göster" - Konu örnekleri

📊 **ANALİZ:**
• "Performansım nasıl?"
• "Hangi konuları çalışmalıyım?"

🎯 **ÖZEL KOMUTLAR:**
• /clear - Sohbeti temizle
• /stats - İstatistiklerini gör

Ne yapmak istersin? 😊`;
        },
        
        needsMotivation(msg) {
            const keywords = ['yapamıyorum', 'zor', 'anlamıyorum', 'başaramadım', 'sıkıldım', 'bıktım'];
            return keywords.some(k => msg.includes(k));
        },
        
        motivate(msg) {
            const motivations = [
                `💪 **HİÇ PES ETME!**
                
Her uzman bir zamanlar acemiydi. Steve Jobs, Bill Gates, Linus Torvalds... Hepsi senin gibi başladı!

Unutma:
• Hata yapmak öğrenmenin bir parçası
• Her yanlış cevap seni doğruya yaklaştırır
• Küçük adımlar büyük başarılara götürür

Hadi, bir soru daha deneyelim! Bu sefer başaracaksın! 🌟`,
                
                `🌈 **SEN YAPABİLİRSİN!**
                
Einstein "Herkes dâhidir. Ama bir balığı ağaca tırmanma yeteneğine göre yargılarsanız, hayatı boyunca aptal olduğuna inanır" demiş.

Belki bu konu senin tarzın değil, ama mutlaka güçlü olduğun konular var!

• Farklı bir konu deneyelim mi?
• Daha basit sorularla başlayalım mı?
• Biraz ara verip sonra devam edelim mi?

Seçim senin! 😊`
            ];
            
            return motivations[Math.floor(Math.random() * motivations.length)];
        },
        
        defaultResponse() {
            return `🎓 **TESTIFY - EĞİTİM ASİSTANIN**

Tam olarak ne yapmak istediğini anlayamadım. İşte yapabileceklerim:

**🔹 Soru çözmek için:**
"Bana soru sor" / "Test başlat" / "Kolay/Orta/Zor soru"

**🔹 Konu öğrenmek için:**
"X konusunu açıkla" / "X nedir?" / "X nasıl çalışır?"

**🔹 Diğer:**
"Yardım" / "İpucu" / "Motivasyon"

Örnek: "Page fault nedir?" veya "Zor bir soru sor"

Ne yapmak istersin? 🤔`;
        }
    },

    // Mesaj yönetimi
    messages: [],
    isTyping: false,
    
    /**
     * Mesaj gönder - DÜZELTİLDİ
     */
    sendMessage(event) {
        // ÇÖZÜM: Event kontrolü ekledik
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        const input = document.getElementById('aiInput');
        if (!input) return;
        
        const message = input.value.trim();
        
        if (!message) return;
        
        // Kullanıcı mesajını ekle
        this.addMessage(message, 'user');
        
        // Input'u temizle
        input.value = '';
        
        // Focus'u koru
        input.focus();
        
        // Yanıt oluştur
        this.generateLocalResponse(message);
    },
    
    /**
     * Yerel yanıt oluştur
     */
    generateLocalResponse(message) {
        this.showTypingIndicator();
        
        setTimeout(() => {
            const response = this.responseSystem.generateResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
        }, 800 + Math.random() * 700);
    },
    
    /**
     * Mesajı ekle
     */
    addMessage(text, sender = 'ai') {
        const chatContainer = document.getElementById('aiChat');
        if (!chatContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'ai-message user-message' : 'ai-message';
        
        if (sender === 'ai') {
            const formattedText = this.formatMessage(text);
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
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>')
            .replace(/•/g, '&bull;')
            .replace(/→/g, '&rarr;')
            .replace(/📝|📚|💡|📊|🎯|🔹|💪|🌈|🎓|🤔|😊|🌟|👋|⚠️|✅|❌/g, match => match);
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
        if (indicator) {
            indicator.remove();
        }
    },
    
    /**
     * Enter tuşu ile gönderme
     */
    setupEnterKeyListener() {
        const input = document.getElementById('aiInput');
        if (!input) return;
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage(e);
            }
        });
    },
    
    /**
     * Form submit listener
     */
    setupFormListener() {
        const form = document.querySelector('.ai-input-group');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.sendMessage(e);
        });
    },
    
    /**
     * Başlangıç
     */
    init() {
        console.log('🎓 Testify AI v4.0 başlatıldı');
        console.log('✨ Özellikler: Zengin soru bankası, detaylı açıklamalar, akıllı yanıtlar');
        console.log('🚀 API kullanımı: Minimum (sadece gerektiğinde)');
        console.log('💪 Yerel zeka: Maksimum performans');
        
        // Event listener'ları ekle
        this.setupFormListener();
        this.setupEnterKeyListener();
        
        // Hoş geldin mesajı
        setTimeout(() => {
            this.addMessage(
                "Merhaba! 👋 Ben Testify AI, senin kişisel eğitim asistanınım. Sana nasıl yardımcı olabilirim?\n\n" +
                "• **Soru çözmek** için: 'Soru sor' veya 'Test başlat'\n" +
                "• **Konu öğrenmek** için: 'Page fault nedir?' gibi sorular sor\n" +
                "• **Yardım** için: 'Yardım' yaz\n\n" +
                "Hadi başlayalım! 🚀",
                'ai'
            );
        }, 500);
    }
};

// Sistemi başlat
document.addEventListener('DOMContentLoaded', () => {
    TestifyAI.init();
    
    // Global erişim
    if (window.aiChat) {
        window.aiChat = TestifyAI;
    }
});

// Export
window.TestifyAI = TestifyAI;
window.aiChat = TestifyAI;
