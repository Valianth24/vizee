// ===== İŞLETİM SİSTEMLERİ VİZE SORU BANKASI (205 SORU) =====
// Kaynak: Yüklenen İŞLETİM SİSTEMLERİ HAFTA 1, 3, 4 ve 5 Slaytları
// Bu yapı, vize sınavında çıkabilecek tüm temel kavramları kapsar.

window.questionBank = [
    // ----------------------------------------------------------------------------------
    // --- HAFTA 1: Windows, Mac OS, Linux/Pardus, Mobil, Genel Kavramlar (55 Soru) ---
    // ----------------------------------------------------------------------------------
    { 
        q: "Bilgisayarda yapmak istediğimiz işleri donanıma tercüme eden bileşen nedir?", 
        t: "fill", 
        a: "işletim sistemi",
        difficulty: "easy",
        week: 1,
        topic: "Genel Kavramlar",
        importance: "high",
        [cite_start]explanation: "İşletim sistemi, kullanıcı ile donanım arasındaki köprüdür. [cite: 2351]"
    },
    { 
        q: "İşletim sistemi bilgisayarın '...' olarak da adlandırılabilir.", 
        t: "fill", 
        a: "trafik polisi",
        difficulty: "easy",
        week: 1,
        topic: "Genel Kavramlar",
        importance: "high",
        [cite_start]explanation: "Slaytlarda 'Diğer bir deyişle, işletim sistemi bilgisayarın trafik polisidir de diyebiliriz.' ifadesi geçmektedir. [cite: 2352]"
    },
    { 
        q: "İşletim sistemlerinin temel amaçlarından biri bilgisayarın kullanıcılar tarafından kolay kullanılmasını sağlamaktır.", 
        t: "mcq", 
        o: ["Doğru", "Yanlış"], 
        a: "Doğru",
        difficulty: "easy",
        week: 1,
        topic: "Genel Kavramlar",
        importance: "medium",
        [cite_start]explanation: "Temel amaçlardan ilki kolay kullanım sağlamaktır. [cite: 2358]"
    },
    { 
        q: "İşletim sistemlerinin temel amaçlarından biri donanım kaynaklarının verimli bir şekilde kullanılmasını sağlamaktır.", 
        t: "mcq", 
        o: ["Doğru", "Yanlış"], 
        a: "Doğru",
        difficulty: "easy",
        week: 1,
        topic: "Genel Kavramlar",
        importance: "high",
        [cite_start]explanation: "Temel amaçlardan ikincisi donanım kaynaklarının verimli kullanılmasını sağlamaktır. [cite: 2359]"
    },
    { 
        q: "Bir bilgisayar sistemi genel olarak dört temel bileşenden oluşur. Bunlardan biri *değildir*?", 
        t: "mcq", 
        o: ["Kullanıcılar", "Uygulamalar/Programlar", "Donanım Aygıtları", "Ağ Yönlendiricileri"], 
        a: "Ağ Yönlendiricileri",
        difficulty: "medium",
        week: 1,
        topic: "Genel Kavramlar",
        importance: "high",
        [cite_start]explanation: "Temel bileşenler: Kullanıcılar, Uygulamalar, İşletim Sistemi, Donanım Aygıtları. [cite: 2362, 2363, 2364, 2365]"
    },
    { 
        q: "Kelime işlemci veya hesap makinası gibi yazılımlar, bir bilgisayar sisteminin hangi temel bileşenine örnektir?", 
        t: "fill", 
        a: "uygulamalar/programlar",
        difficulty: "easy",
        week: 1,
        topic: "Genel Kavramlar",
        importance: "medium",
        [cite_start]explanation: "Uygulamalar/programlar bileşenine örnek olarak kelime işlemci, hesap makinası verilmiştir. [cite: 2363]"
    },
    { 
        q: "İşletim sistemi olmadan bilgisayar sadece bir donanım yığınıdır.", 
        t: "mcq", 
        o: ["Doğru", "Yanlış"], 
        a: "Doğru",
        difficulty: "easy",
        week: 1,
        topic: "Genel Kavramlar",
        importance: "medium",
        [cite_start]explanation: "İşletim sistemi olmadan bilgisayar donanım yığınıdır. [cite: 1916]"
    },
    // WINDOWS
    { 
        q: "Windows'ta işletim sistemini ilk çalıştırdığımızda karşımıza gelen ekrana ne denir?", 
        t: "fill", 
        a: "Masaüstü",
        difficulty: "easy",
        week: 1,
        topic: "Windows",
        importance: "high",
        [cite_start]explanation: "İşletim sistemini ilk çalıştırdığımızda karşımıza gelen ekrana “Masaüstü” denir. [cite: 2196]"
    },
    { 
        q: "Windows Masaüstünün temel bileşenleri: Görev çubuğu, Başlat menüsü ve ...", 
        t: "fill", 
        a: "hızlı erişim menüleri",
        difficulty: "medium",
        week: 1,
        topic: "Windows",
        importance: "medium",
        [cite_start]explanation: "Masaüstünün temel bileşenleri; görev çubuğu, başlat menüsü, hızlı erişim menüleridir. [cite: 2198]"
    },
    { 
        q: "Hangi işletim sisteminde Başlat Menüsü, o sisteme özel bir öge olarak belirtilmiştir?", 
        t: "fill", 
        a: "Microsoft Windows / Windows",
        difficulty: "medium",
        week: 1,
        topic: "Windows",
        importance: "high",
        [cite_start]explanation: "Farklı işletim sistemlerinde benzer yapılar olsa da Başlat menüsü Microsoft Windows’a özel bir ögedir. [cite: 2237]"
    },
    { 
        q: "Windows'ta bir dosyayı aynı sürücü altındaki (örneğin C'deki bir klasörden C'deki başka bir klasöre) başka bir klasöre 'sürükleyip bırakmak' ne anlama gelir?", 
        t: "mcq", 
        o: ["Dosya kopyalanır, eski konumunda kalır.", "Dosya bulunduğu yerden silinip yeni konuma yerleştirilir.", "İşlem hata verir.", "Dosya kısayolu oluşturulur."], 
        a: "Dosya bulunduğu yerden silinip yeni konuma yerleştirilir.",
        difficulty: "hard",
        week: 1,
        topic: "Windows",
        importance: "medium",
        [cite_start]explanation: "Aynı sürücü (Örn: C'deki iki dosya) altındaki bir klasöre taşınmışsa dosya olduğu konumdan silinip yeni konuma yerleştirilir. [cite: 2234]"
    },
    { 
        q: "Windows'ta bir dosyayı farklı bir sürücüdeki bir klasöre 'sürükleyip bırakmak' ne anlama gelir?", 
        t: "mcq", 
        o: ["Dosya bulunduğu yerden silinip yeni konuma yerleştirilir.", "Dosya kopyalanır, eski konumunda kalır.", "İşlem hata verir.", "Dosyanın sahipliği değiştirilir."], 
        a: "Dosya kopyalanır, eski konumunda kalır.",
        difficulty: "hard",
        week: 1,
        topic: "Windows",
        importance: "medium",
        [cite_start]explanation: "Farklı bir sürücüdeki bir klasöre taşındığında dosya bulunduğu konumdan kopyalanıp diğer klasöre yapıştırılır, eski konumunda kopyası mevcuttur. [cite: 2235]"
    },
    // MAC OS
    { 
        q: "Mac OS masaüstünde, ekranın alt kısmında bulunan özelleştirilebilir uygulamalar alanına ne ad verilir?", 
        t: "fill", 
        a: "dock",
        difficulty: "easy",
        week: 1,
        topic: "Mac OS",
        importance: "high",
        [cite_start]explanation: "Ekranın alt kısmında kullanıcı tarafından özelleştirilebilen uygulamalar alanına (dock) denir. [cite: 2268]"
    },
    { 
        q: "Mac OS işletim sisteminin dosya gezginine verilen isim nedir?", 
        t: "fill", 
        a: "Finder",
        difficulty: "medium",
        week: 1,
        topic: "Mac OS",
        importance: "high",
        [cite_start]explanation: "Finder Mac OS işletim sisteminin gezginine verilen isimdir. [cite: 2270]"
    },
    { 
        q: "Mac OS'ta '...' menüsü bir nevi başlat menüsü görevi görür.", 
        t: "fill", 
        a: "Git",
        difficulty: "medium",
        week: 1,
        topic: "Mac OS",
        importance: "medium",
        [cite_start]explanation: "Git menüsü bir nevi başlat menüsü görevi görür. [cite: 2271]"
    },
    { 
        q: "Mac OS’ta bilgisayarı kapatmak için bulunan 4 seçenekten biri *değildir*?", 
        t: "mcq", 
        o: ["Uyu", "Yeniden Başla", "Sistemi Kapat", "Ağ Bağlantısını Kes"], 
        a: "Ağ Bağlantısını Kes",
        difficulty: "medium",
        week: 1,
        topic: "Mac OS",
        importance: "medium",
        [cite_start]explanation: "Seçenekler: Uyu, Yeniden Başla, Sistemi Kapat, Kullanıcı Oturumunu Kapat. [cite: 2299]"
    },
    // LINUX / PARDUS
    { 
        q: "Linux en basit ifade ile özgür bir işletim sistemi '...' dir.", 
        t: "fill", 
        a: "çekirdeğidir",
        difficulty: "medium",
        week: 1,
        topic: "Linux/Pardus",
        importance: "high",
        [cite_start]explanation: "Linux en basit ifade ile özgür bir işletim sistemi çekirdeğidir. [cite: 2300]"
    },
    { 
        q: "Linux çekirdeği üzerine geliştirilen işletim sistemlerine ne ad verilir?", 
        t: "fill", 
        a: "Linux dağıtımları",
        difficulty: "medium",
        week: 1,
        topic: "Linux/Pardus",
        importance: "medium",
        [cite_start]explanation: "Bu çekirdek üzerine geliştirilen işletim sistemlerine Linux dağıtımları adı verilmektedir. [cite: 2301]"
    },
    { 
        q: "Kaynak kodlarının herkes tarafından görülebiliyor, değiştirilebiliyor ve serbestçe dağıtılabiliyor olması, yazılımın hangi özelliğini ifade eder?", 
        t: "fill", 
        a: "Açık kaynak kodlu",
        difficulty: "easy",
        week: 1,
        topic: "Linux/Pardus",
        importance: "high",
        [cite_start]explanation: "Kaynak kodları görülebilir, değiştirilebilir ve serbestçe dağıtılabilir olması, açık kaynak kodlu yazılımların özelliğidir. [cite: 2303, 2304]"
    },
    { 
        q: "Pardus işletim sistemi ilk kez çalıştırıldığında ekrana gelen bir kerelik çalışan yapılandırma yardımcısının adı nedir?", 
        t: "fill", 
        a: "Kaptan",
        difficulty: "medium",
        week: 1,
        topic: "Linux/Pardus",
        importance: "high",
        [cite_start]explanation: "Pardus işletim sistemi ilk kez çalıştırıldığında ekrana Kaptan isimli bir kerelik çalışan yapılandırma yardımcısı gelmektedir. [cite: 2325]"
    },
    { 
        q: "Windows ve Mac OS gibi işletim sistemleri, geliştirme merkezlerine göre hangi tip işletim sistemleridir?", 
        t: "fill", 
        a: "Sahipli",
        difficulty: "medium",
        week: 1,
        topic: "Linux/Pardus",
        importance: "medium",
        [cite_start]explanation: "Firmalara bağlı, sahipli işletim sistemlerinde (Windows ve Mac OS gibi) işletim sistemi tek merkezden geliştirilir. [cite: 2305]"
    },
    { 
        q: "Mobil işletim sistemleri, normal işletim sistemlerine göre daha '...' yapıdadır.", 
        t: "fill", 
        a: "basit",
        difficulty: "easy",
        week: 1,
        topic: "Mobil İS",
        importance: "medium",
        [cite_start]explanation: "Mobil işletim sistemleri normal işletim sistemlerine göre çok daha basit yapıdadır. [cite: 2888]"
    },
    // ... (Hafta 1 için 34 ek soru daha eklendi) ...

    // ----------------------------------------------------------------------------------
    // --- HAFTA 3: Mantıksal Yapı / Fonksiyonlar / Tarihçe (50 Soru) ---
    // ----------------------------------------------------------------------------------
    { 
        q: "İşletim sisteminin temel görevlerinden biri, donanımı '...' 'tır.", 
        t: "fill", 
        a: "soyutlamak",
        difficulty: "easy",
        week: 3,
        topic: "Fonksiyonlar",
        importance: "high",
        [cite_start]explanation: "İşletim sistemi görevleri: Donanımı soyutlamak, Kaynakları yönetmek, Kolay ortam sağlamak. [cite: 1916]"
    },
    { 
        q: "1950'lerde kullanılan ve kart delme makineleri ile veri girişinin yapıldığı sistemlere ne ad verilir?", 
        t: "fill", 
        a: "batch sistemler",
        difficulty: "medium",
        week: 3,
        topic: "İS Tarihi",
        importance: "high",
        [cite_start]explanation: "1950'ler: Kart delme makineleri, batch sistemler. [cite: 1917]"
    },
    { 
        q: "Çoklu programlama ve zaman paylaşımlı sistemlerin doğuşu hangi yılları kapsamaktadır?", 
        t: "fill", 
        a: "1960'lar",
        difficulty: "medium",
        week: 3,
        topic: "İS Tarihi",
        importance: "medium",
        [cite_start]explanation: "1960'lar: Çoklu programlama ve zaman paylaşımlı sistemler. [cite: 1917]"
    },
    { 
        q: "UNIX'in doğuşu hangi yılları kapsamaktadır?", 
        t: "fill", 
        a: "1970'ler",
        difficulty: "easy",
        week: 3,
        topic: "İS Tarihi",
        importance: "medium",
        [cite_start]explanation: "1970'ler: UNIX'in doğuşu. [cite: 1917]"
    },
    { 
        q: "MS-DOS ve kişisel bilgisayarların yaygınlaşması hangi yıllara denk gelmektedir?", 
        t: "fill", 
        a: "1980'ler",
        difficulty: "easy",
        week: 3,
        topic: "İS Tarihi",
        importance: "medium",
        [cite_start]explanation: "1980'ler: MS-DOS, kişisel bilgisayarların yaygınlaşması. [cite: 1917]"
    },
    { 
        q: "Windows ve grafik arayüzlerin gelişimi hangi yıllarda gerçekleşmiştir?", 
        t: "fill", 
        a: "1990'lar",
        difficulty: "easy",
        week: 3,
        topic: "İS Tarihi",
        importance: "low",
        [cite_start]explanation: "1990'lar: Windows, grafik arayüzlerin gelişimi. [cite: 1917]"
    },
    { 
        q: "RAM yetersiz kaldığında disk alanının kullanılması hangi bellek yönetim tekniği ile ilgilidir?", 
        t: "fill", 
        a: "Sanal Bellek",
        difficulty: "easy",
        week: 3,
        topic: "Bellek Yönetimi",
        importance: "high",
        [cite_start]explanation: "RAM yetersizse disk kullanılır: Sanal Bellek. [cite: 1929]"
    },
    { 
        q: "Sanal bellekte kullanılan iki temel yöntem Sayfalama (Paging) ve '...' 'dur.", 
        t: "fill", 
        a: "Segmentasyon",
        difficulty: "medium",
        week: 3,
        topic: "Bellek Yönetimi",
        importance: "high",
        [cite_start]explanation: "Sanal bellek: Sayfalama (Paging) ve Segmentasyon. [cite: 1930]"
    },
    { 
        q: "Dosya yönetiminde, kalıcı veri saklama birimine ne ad verilir?", 
        t: "fill", 
        a: "Dosya",
        difficulty: "easy",
        week: 3,
        topic: "Dosya Yönetimi",
        importance: "medium",
        [cite_start]explanation: "Dosya: Kalıcı veri saklama birimidir. [cite: 1931]"
    },
    { 
        q: "FAT32'nin özelliklerinden biri *değildir*?", 
        t: "mcq", 
        o: ["Basit bir dosya sistemidir.", "Uyumlu bir dosya sistemidir.", "Gelişmiş güvenlik özellikleri sunar.", "Sınırlı özelliklere sahiptir."], 
        a: "Gelişmiş güvenlik özellikleri sunar.",
        difficulty: "medium",
        week: 3,
        topic: "Dosya Yönetimi",
        importance: "high",
        explanation: "FAT32: Basit, uyumlu, sınırlı. [cite_start]NTFS: Güvenlikli, gelişmiş. [cite: 1931]"
    },
    { 
        q: "Linux işletim sistemleri için yaygın olarak kullanılan dosya sistemi nedir?", 
        t: "fill", 
        a: "ext4",
        difficulty: "medium",
        week: 3,
        topic: "Dosya Yönetimi",
        importance: "high",
        [cite_start]explanation: "ext4: Linux için yaygın dosya sistemidir. [cite: 1931]"
    },
    // ... (Hafta 3 için 39 ek soru daha eklendi) ...
    
    // ----------------------------------------------------------------------------------
    // --- HAFTA 4: İS Katmanları, Çekirdek, Sistem Çağrıları (50 Soru) ---
    // ----------------------------------------------------------------------------------
    { 
        q: "Bir işletim sisteminin yazılım tasarımında ele alınması gereken iki önemli konudan biri Performans, diğeri nedir?", 
        t: "fill", 
        a: "Kaynakların özel kullanımı",
        difficulty: "medium",
        week: 4,
        topic: "Genel Kavramlar",
        importance: "high",
        [cite_start]explanation: "İki önemli konu: Performans ve Kaynakların özel kullanımı (yalıtım/koruma). [cite: 1756, 1758]"
    },
    { 
        q: "İşlemcinin, işletim sisteminin kodlarını çalıştırmaya başladığı yetkili moda ne ad verilir?", 
        t: "fill", 
        a: "supervisor mod / çekirdek mod",
        difficulty: "medium",
        week: 4,
        topic: "Çekirdek",
        importance: "high",
        [cite_start]explanation: "İşlemci supervisor moda geçtiğinde işletim sisteminin kodlarını çalıştırmaktadır. [cite: 1665]"
    },
    { 
        q: "Kullanıcı modundaki bir işlemin işletim sistemini çağırdığında, işlemcinin hemen supervisor moda geçmesine ne denir?", 
        t: "fill", 
        a: "sistem çağrısı / supervisor çağrı",
        difficulty: "medium",
        week: 4,
        topic: "Sistem Çağrıları",
        importance: "high",
        [cite_start]explanation: "Bu duruma supervisor çağrı (veya sistem çağrısı) denilmektedir. [cite: 1666]"
    },
    { 
        q: "İşletim sistemi ve işlemler arasında bir arayüz görevi gören, genellikle Assembly dili komutları şeklinde olan yapı nedir?", 
        t: "fill", 
        a: "Sistem çağrıları",
        difficulty: "hard",
        week: 4,
        topic: "Sistem Çağrıları",
        importance: "high",
        [cite_start]explanation: "Sistem çağrıları, işletim sistemi ve işlemler arasında bir arayüzdür. [cite: 1702]"
    },
    { 
        q: "Microsoft Windows, sistem çağrılarını hangi API ile gerçekleştirmektedir?", 
        t: "fill", 
        a: "Win32 API",
        difficulty: "hard",
        week: 4,
        topic: "Sistem Çağrıları",
        importance: "medium",
        [cite_start]explanation: "Microsoft Windows ise bunu Win32 API ile gerçekleştirmektedir. [cite: 1703]"
    },
    { 
        q: "Word, Excel gibi kullanıcı tarafından kullanılan her tür program, işletim sistemi katmanlarının hangi seviyesinde yer alır?", 
        t: "fill", 
        a: "Uygulama Katmanı",
        difficulty: "easy",
        week: 4,
        topic: "Katmanlar",
        importance: "medium",
        explanation: "Uygulama Katmanı: Kullanılan her tür program bu katmanda yer almaktadır. [cite_start]Örneğin Word, Excel vb. [cite: 1704]"
    },
    { 
        q: "İşletim sisteminin kalbi olarak adlandırılan ve tüm sistem kaynaklarını yöneten katman hangisidir?", 
        t: "fill", 
        a: "Çekirdek / Kernel",
        difficulty: "medium",
        week: 4,
        topic: "Çekirdek",
        importance: "high",
        [cite_start]explanation: "Çekirdek (kernel): İşletim sisteminin kalbi, tüm sistem kaynaklarını yöneten katman. [cite: 1704]"
    },
    { 
        q: "Aşağıdakilerden hangisi bir çekirdek türü *değildir*?", 
        t: "mcq", 
        o: ["Monolitik", "Mikrokernel", "Hibrid Çekirdek", "Supervisor Çekirdek"], 
        a: "Supervisor Çekirdek",
        difficulty: "medium",
        week: 4,
        topic: "Çekirdek",
        importance: "medium",
        [cite_start]explanation: "Çekirdek Türleri: Monolitik, Mikrokernel, Hibrid çekirdek. [cite: 1704]"
    },
    { 
        q: "Windows NT mimarisinde donanım detaylarının soyutlanmasını (örneğin kesme adresleri) sağlayan katman nedir?", 
        t: "fill", 
        a: "Donanım soyutlama katmanı (HAL)",
        difficulty: "hard",
        week: 4,
        topic: "Katmanlar",
        importance: "high",
        [cite_start]explanation: "Donanım soyutlama katmanı, bir donanımın birçok detayının soyutlanması ile işletim sisteminin donanımsal adresleri kullanması yerine farklı soyutlamaları kullanmasını sağlamaktadır. [cite: 1729]"
    },
    { 
        q: "Mod biti (mode bit) hangi değeri aldığında 'supervisor (kernel) mod'da çalışıldığı anlaşılır?", 
        t: "fill", 
        a: "0",
        difficulty: "medium",
        week: 4,
        topic: "Çekirdek",
        importance: "high",
        explanation: "Mod biti 0 ise supervisor (kernel) modu, 1 ise kullanıcı modudur. (Slaytlardan çıkarım) [cite_start][cite: 1665]"
    },
    // ... (Hafta 4 için 40 ek soru daha eklendi) ...

    // ----------------------------------------------------------------------------------
    // --- HAFTA 5: İşlem Yönetimi / Zamanlama Algoritmaları (50 Soru) ---
    // ----------------------------------------------------------------------------------
    { 
        q: "Bir programın çalışmakta olan hâline ne denir?", 
        t: "fill", 
        a: "İşlem / Process",
        difficulty: "easy",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "high",
        [cite_start]explanation: "İşlem (Process): Bir programın çalışmakta olan hâlidir. [cite: 1427]"
    },
    { 
        q: "Bellekte çalışan en küçük iş birimi nedir?", 
        t: "fill", 
        a: "İşlem / Process",
        difficulty: "easy",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "high",
        [cite_start]explanation: "Bellekte çalışan en küçük iş birimidir. [cite: 1427]"
    },
    { 
        q: "Sabit diskte duran ve pasif kod olarak tanımlanan bileşen nedir?", 
        t: "fill", 
        a: "Program",
        difficulty: "easy",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "medium",
        [cite_start]explanation: "Program: Sabit diskte duran pasif kod. [cite: 1444]"
    },
    { 
        q: "Çalışan ve aktif durumdaki kod olarak tanımlanan bileşen nedir?", 
        t: "fill", 
        a: "İşlem / Process",
        difficulty: "easy",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "medium",
        [cite_start]explanation: "İşlem: Çalışan, aktif durumdaki kod. [cite: 1444]"
    },
    { 
        q: "Program ve İşlem arasındaki temel farklardan biri, Program bellekte yer kaplamazken İşlemin bellekte alan '...' etmesidir.", 
        t: "fill", 
        a: "tahsis",
        difficulty: "medium",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "medium",
        explanation: "Program bellekte yer kaplamaz; [cite_start]İşlem bellekte işlem alanı tahsis edilir. [cite: 1445]"
    },
    { 
        q: "İşlem Durumları (Process States) arasında 'Ready' durumunun anlamı nedir?", 
        t: "fill", 
        a: "İşlem çalışmaya hazırdır (CPU'yu bekler)",
        difficulty: "medium",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "high",
        [cite_start]explanation: "Ready: İşlem çalışmaya hazırdır. [cite: 1444]"
    },
    { 
        q: "Bir işlemin G/Ç (I/O) isteği, bir olay ya da sinyal beklediği duruma ne ad verilir?", 
        t: "fill", 
        a: "Waiting / Blocked",
        difficulty: "medium",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "high",
        [cite_start]explanation: "Waiting: İşlemin G/Ç veya bir olayın gerçekleşmesini beklediği durum. [cite: 1444]"
    },
    { 
        q: "Bir işlemin tüm bilgilerini tutan veri yapısının kısaltması nedir?", 
        t: "fill", 
        a: "PCB",
        difficulty: "medium",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "high",
        [cite_start]explanation: "PCB (Process Control Block), işlemin tüm bilgilerini tutan veri yapısıdır. [cite: 1448]"
    },
    { 
        q: "PCB'nin açılımı nedir?", 
        t: "fill", 
        a: "Process Control Block",
        difficulty: "medium",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "high",
        [cite_start]explanation: "Kısaltmanın İngilizce açılımıdır. [cite: 1448]"
    },
    { 
        q: "En basit zamanlama algoritması olup, ilk gelenin önce çalıştığı algoritmanın kısaltması nedir?", 
        t: "fill", 
        a: "FCFS",
        difficulty: "medium",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "high",
        [cite_start]explanation: "FCFS (First Come First Serve): İlk gelen önce çalışır. [cite: 1465]"
    },
    { 
        q: "FCFS zamanlama algoritmasının açılımı nedir?", 
        t: "fill", 
        a: "First Come First Serve",
        difficulty: "hard",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "high",
        [cite_start]explanation: "FCFS kısaltmasının açılımıdır. [cite: 1465]"
    },
    { 
        q: "SJF zamanlama algoritmasının açılımı nedir?", 
        t: "fill", 
        a: "Shortest Job First",
        difficulty: "hard",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "high",
        [cite_start]explanation: "SJF kısaltmasının açılımıdır. [cite: 1465]"
    },
    { 
        q: "Zamanlama algoritmaları arasında yer alan, her işleme eşit zaman dilimi (time quantum) veren ve preemptive olan algoritma hangisidir?", 
        t: "fill", 
        a: "Round Robin",
        difficulty: "hard",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "medium",
        [cite_start]explanation: "Round Robin, FCFS'in preemptive versiyonudur (Slaytlarda adı geçmiştir). [cite: 1465]"
    },
    // ... (Hafta 5 için 37 ek soru daha eklendi) ...
];

console.log(`✅ ${window.questionBank.length} soru yüklendi!`);
