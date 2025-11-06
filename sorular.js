import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Check, X, BarChart3, Filter, RotateCcw, BookOpen } from 'lucide-react';

// Soru bankası
const questionBank = [
    // HAFTA 1: Windows, Mac OS, Linux/Pardus, Mobil, Genel Kavramlar (55 Soru)
    { 
        q: "Bilgisayarda yapmak istediğimiz işleri donanıma tercüme eden bileşen nedir?", 
        t: "fill", 
        a: "işletim sistemi",
        difficulty: "easy",
        week: 1,
        topic: "Genel Kavramlar",
        importance: "high",
        explanation: "İşletim sistemi, kullanıcı ile donanım arasındaki köprüdür. Kullanıcının komutlarını donanımın anlayacağı şekilde çevirir."
    },
    { 
        q: "İşletim sistemi bilgisayarın '...' olarak da adlandırılabilir.", 
        t: "fill", 
        a: "trafik polisi",
        difficulty: "easy",
        week: 1,
        topic: "Genel Kavramlar",
        importance: "high",
        explanation: "İşletim sistemi, tüm sistem kaynaklarını koordine eder ve trafiği yönetir, tıpkı bir trafik polisi gibi."
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
        explanation: "İşletim sisteminin temel amaçlarından ilki, bilgisayarın kolay kullanılmasını sağlamaktır."
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
        explanation: "İşletim sisteminin temel amaçlarından ikincisi, donanım kaynaklarının verimli kullanılmasını sağlamaktır."
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
        explanation: "Dört temel bileşen: Kullanıcılar, Uygulamalar/Programlar, İşletim Sistemi ve Donanım Aygıtlarıdır."
    },
    { 
        q: "Kelime işlemci veya hesap makinası gibi yazılımlar, bir bilgisayar sisteminin hangi temel bileşenine örnektir?", 
        t: "fill", 
        a: "uygulamalar",
        difficulty: "easy",
        week: 1,
        topic: "Genel Kavramlar",
        importance: "medium",
        explanation: "Kelime işlemci ve hesap makinası gibi yazılımlar, Uygulamalar/Programlar bileşenine örnektir."
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
        explanation: "İşletim sistemi olmadan bilgisayar, hiçbir işlev gösteremeyen bir donanım yığınından ibarettir."
    },
    { 
        q: "Microsoft firması tarafından geliştirilen işletim sistemi hangisidir?", 
        t: "fill", 
        a: "Windows",
        difficulty: "easy",
        week: 1,
        topic: "Windows",
        importance: "low"
    },
    { 
        q: "Apple firması tarafından geliştirilen işletim sistemi hangisidir?", 
        t: "fill", 
        a: "Mac OS",
        difficulty: "easy",
        week: 1,
        topic: "Mac OS",
        importance: "low"
    },
    { 
        q: "Windows'ta işletim sistemini ilk çalıştırdığımızda karşımıza gelen ekrana ne denir?", 
        t: "fill", 
        a: "Masaüstü",
        difficulty: "easy",
        week: 1,
        topic: "Windows",
        importance: "high",
        explanation: "İşletim sistemini ilk çalıştırdığımızda karşımıza gelen ekrana 'Masaüstü' denir."
    },
    { 
        q: "Windows Masaüstünün temel bileşenleri: Görev çubuğu, Başlat menüsü ve ...", 
        t: "fill", 
        a: "hızlı erişim menüleri",
        difficulty: "medium",
        week: 1,
        topic: "Windows",
        importance: "medium",
        explanation: "Masaüstünün temel bileşenleri: görev çubuğu, başlat menüsü ve hızlı erişim menüleridir."
    },
    { 
        q: "Hangi işletim sisteminde Başlat Menüsü, o sisteme özel bir öge olarak belirtilmiştir?", 
        t: "fill", 
        a: "Windows",
        difficulty: "medium",
        week: 1,
        topic: "Windows",
        importance: "high",
        explanation: "Başlat menüsü Microsoft Windows'a özel bir ögedir."
    },
    { 
        q: "Windows'ta bir dosyayı aynı sürücü altındaki başka bir klasöre 'sürükleyip bırakmak' ne anlama gelir?", 
        t: "mcq", 
        o: ["Dosya kopyalanır, eski konumunda kalır.", "Dosya bulunduğu yerden silinip yeni konuma yerleştirilir.", "İşlem hata verir.", "Dosya kısayolu oluşturulur."], 
        a: "Dosya bulunduğu yerden silinip yeni konuma yerleştirilir.",
        difficulty: "hard",
        week: 1,
        topic: "Windows",
        importance: "medium",
        explanation: "Aynı sürücü içinde sürükle-bırak işlemi yapıldığında dosya taşınır (eski konumdan silinir)."
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
        explanation: "Farklı sürücüler arasında sürükle-bırak işlemi yapıldığında dosya kopyalanır, orijinal dosya yerinde kalır."
    },
    { 
        q: "Windows işletim sisteminde dosya ve klasörleri yönetmek için kullanılan araç nedir?", 
        t: "fill", 
        a: "Dosya Gezgini",
        difficulty: "easy",
        week: 1,
        topic: "Windows",
        importance: "high",
        explanation: "Windows'ta Dosya Gezgini (File Explorer), dosya ve klasörlerin yönetimi için kullanılır."
    },
    { 
        q: "Mac OS masaüstünde, ekranın alt kısmında bulunan özelleştirilebilir uygulamalar alanına ne ad verilir?", 
        t: "fill", 
        a: "dock",
        difficulty: "easy",
        week: 1,
        topic: "Mac OS",
        importance: "high",
        explanation: "Ekranın alt kısmında kullanıcı tarafından özelleştirilebilen uygulamalar alanına 'dock' denir."
    },
    { 
        q: "Mac OS işletim sisteminin dosya gezginine verilen isim nedir?", 
        t: "fill", 
        a: "Finder",
        difficulty: "medium",
        week: 1,
        topic: "Mac OS",
        importance: "high",
        explanation: "Finder, Mac OS işletim sisteminin dosya gezginidir."
    },
    { 
        q: "Mac OS'ta '...' menüsü bir nevi başlat menüsü görevi görür.", 
        t: "fill", 
        a: "Git",
        difficulty: "medium",
        week: 1,
        topic: "Mac OS",
        importance: "medium",
        explanation: "Git menüsü, Mac OS'ta bir nevi başlat menüsü görevi görür."
    },
    { 
        q: "Mac OS'ta bilgisayarı kapatmak için bulunan 4 seçenekten biri *değildir*?", 
        t: "mcq", 
        o: ["Uyu", "Yeniden Başla", "Sistemi Kapat", "Ağ Bağlantısını Kes"], 
        a: "Ağ Bağlantısını Kes",
        difficulty: "medium",
        week: 1,
        topic: "Mac OS",
        importance: "medium",
        explanation: "Mac OS'ta kapatma seçenekleri: Uyu, Yeniden Başla, Sistemi Kapat, Kullanıcı Oturumunu Kapat."
    },
    { 
        q: "Linux en basit ifade ile özgür bir işletim sistemi '...' dir.", 
        t: "fill", 
        a: "çekirdeğidir",
        difficulty: "medium",
        week: 1,
        topic: "Linux/Pardus",
        importance: "high",
        explanation: "Linux, en basit ifadeyle özgür bir işletim sistemi çekirdeğidir."
    },
    { 
        q: "Linux çekirdeği üzerine geliştirilen işletim sistemlerine ne ad verilir?", 
        t: "fill", 
        a: "Linux dağıtımları",
        difficulty: "medium",
        week: 1,
        topic: "Linux/Pardus",
        importance: "medium",
        explanation: "Linux çekirdeği üzerine geliştirilen işletim sistemlerine 'Linux dağıtımları' adı verilir."
    },
    { 
        q: "Kaynak kodlarının herkes tarafından görülebiliyor, değiştirilebiliyor ve serbestçe dağıtılabiliyor olması, yazılımın hangi özelliğini ifade eder?", 
        t: "fill", 
        a: "Açık kaynak kodlu",
        difficulty: "easy",
        week: 1,
        topic: "Linux/Pardus",
        importance: "high",
        explanation: "Kaynak kodlarının görülebilir, değiştirilebilir ve dağıtılabilir olması, 'açık kaynak kodlu' yazılımların özelliğidir."
    },
    { 
        q: "Pardus işletim sistemi ilk kez çalıştırıldığında ekrana gelen bir kerelik çalışan yapılandırma yardımcısının adı nedir?", 
        t: "fill", 
        a: "Kaptan",
        difficulty: "medium",
        week: 1,
        topic: "Linux/Pardus",
        importance: "high",
        explanation: "Pardus'ta ilk çalıştırmada 'Kaptan' isimli yapılandırma yardımcısı çalışır."
    },
    { 
        q: "Pardus, hangi kurum bünyesinde geliştirilmeye başlanmıştır?", 
        t: "fill", 
        a: "TÜBİTAK",
        difficulty: "medium",
        week: 1,
        topic: "Linux/Pardus",
        importance: "medium",
        explanation: "Pardus, TÜBİTAK bünyesinde geliştirilen yerli ve milli işletim sistemidir."
    },
    { 
        q: "Pardus'un ilk sürümü hangi yıl yayınlanmıştır?", 
        t: "fill", 
        a: "2005",
        difficulty: "medium",
        week: 1,
        topic: "Linux/Pardus",
        importance: "low",
        explanation: "Pardus'un ilk sürümü 2005 yılında yayınlanmıştır."
    },
    { 
        q: "Windows ve Mac OS gibi işletim sistemleri, geliştirme merkezlerine göre hangi tip işletim sistemleridir?", 
        t: "fill", 
        a: "Sahipli",
        difficulty: "medium",
        week: 1,
        topic: "Linux/Pardus",
        importance: "medium",
        explanation: "Windows ve Mac OS gibi işletim sistemleri, firmalara bağlı sahipli işletim sistemleridir."
    },
    { 
        q: "Mobil işletim sistemleri, normal işletim sistemlerine göre daha '...' yapıdadır.", 
        t: "fill", 
        a: "basit",
        difficulty: "easy",
        week: 1,
        topic: "Mobil İS",
        importance: "medium",
        explanation: "Mobil işletim sistemleri, masaüstü işletim sistemlerine göre daha basit yapıdadır."
    },
    { 
        q: "Android işletim sistemi hangi çekirdek üzerine kurulmuştur?", 
        t: "fill", 
        a: "Linux",
        difficulty: "medium",
        week: 1,
        topic: "Mobil İS",
        importance: "high",
        explanation: "Android, Linux çekirdeği üzerine kurulu bir mobil işletim sistemidir."
    },
    { 
        q: "Apple'ın mobil cihazları için geliştirdiği işletim sisteminin adı nedir?", 
        t: "fill", 
        a: "iOS",
        difficulty: "easy",
        week: 1,
        topic: "Mobil İS",
        importance: "medium",
        explanation: "iOS, Apple tarafından iPhone ve iPad için geliştirilmiş mobil işletim sistemidir."
    },
    // HAFTA 3: Mantıksal Yapı / Fonksiyonlar / Tarihçe
    { 
        q: "İşletim sisteminin temel görevlerinden biri, donanımı '...' 'tır.", 
        t: "fill", 
        a: "soyutlamak",
        difficulty: "easy",
        week: 3,
        topic: "Fonksiyonlar",
        importance: "high",
        explanation: "İşletim sisteminin görevleri: Donanımı soyutlamak, kaynakları yönetmek, kolay ortam sağlamak."
    },
    { 
        q: "İşletim sisteminin hangi görevi, kullanıcıların donanım detayları ile ilgilenmesini gereksiz kılar?", 
        t: "fill", 
        a: "Donanımı soyutlamak",
        difficulty: "medium",
        week: 3,
        topic: "Fonksiyonlar",
        importance: "high",
        explanation: "Donanım soyutlama sayesinde kullanıcılar donanım detayları ile uğraşmak zorunda kalmaz."
    },
    { 
        q: "CPU, RAM, disk gibi kaynakların adil dağıtımını yapan işletim sistemi görevine ne denir?", 
        t: "fill", 
        a: "Kaynak yönetimi",
        difficulty: "easy",
        week: 3,
        topic: "Fonksiyonlar",
        importance: "high",
        explanation: "Kaynak yönetimi, CPU, RAM, disk gibi kaynakların işlemler arasında adil dağıtımını sağlar."
    },
    { 
        q: "1950'lerde kullanılan ve kart delme makineleri ile veri girişinin yapıldığı sistemlere ne ad verilir?", 
        t: "fill", 
        a: "batch sistemler",
        difficulty: "medium",
        week: 3,
        topic: "İS Tarihi",
        importance: "high",
        explanation: "1950'lerde kart delme makineleri ile batch (toplu işlem) sistemler kullanılırdı."
    },
    { 
        q: "Çoklu programlama ve zaman paylaşımlı sistemlerin doğuşu hangi yılları kapsamaktadır?", 
        t: "fill", 
        a: "1960'lar",
        difficulty: "medium",
        week: 3,
        topic: "İS Tarihi",
        importance: "medium",
        explanation: "1960'larda çoklu programlama ve zaman paylaşımlı sistemler geliştirildi."
    },
    { 
        q: "UNIX'in doğuşu hangi yılları kapsamaktadır?", 
        t: "fill", 
        a: "1970'ler",
        difficulty: "easy",
        week: 3,
        topic: "İS Tarihi",
        importance: "medium",
        explanation: "UNIX işletim sistemi 1970'lerde geliştirildi."
    },
    { 
        q: "MS-DOS ve kişisel bilgisayarların yaygınlaşması hangi yıllara denk gelmektedir?", 
        t: "fill", 
        a: "1980'ler",
        difficulty: "easy",
        week: 3,
        topic: "İS Tarihi",
        importance: "medium",
        explanation: "1980'lerde MS-DOS ve kişisel bilgisayarlar yaygınlaştı."
    },
    { 
        q: "Windows ve grafik arayüzlerin gelişimi hangi yıllarda gerçekleşmiştir?", 
        t: "fill", 
        a: "1990'lar",
        difficulty: "easy",
        week: 3,
        topic: "İS Tarihi",
        importance: "low",
        explanation: "1990'larda Windows ve grafik arayüzler gelişim gösterdi."
    },
    { 
        q: "RAM yetersiz kaldığında disk alanının kullanılması hangi bellek yönetim tekniği ile ilgilidir?", 
        t: "fill", 
        a: "Sanal Bellek",
        difficulty: "easy",
        week: 3,
        topic: "Bellek Yönetimi",
        importance: "high",
        explanation: "Sanal bellek, RAM yetersiz kaldığında disk alanını kullanarak bellek genişletir."
    },
    { 
        q: "Sanal bellekte kullanılan iki temel yöntem Sayfalama (Paging) ve '...' 'dur.", 
        t: "fill", 
        a: "Segmentasyon",
        difficulty: "medium",
        week: 3,
        topic: "Bellek Yönetimi",
        importance: "high",
        explanation: "Sanal bellek iki temel yöntem kullanır: Sayfalama (Paging) ve Segmentasyon."
    },
    { 
        q: "Mantıksal adresi fiziksel adrese dönüştüren birime ne denir?", 
        t: "fill", 
        a: "MMU",
        difficulty: "hard",
        week: 3,
        topic: "Bellek Yönetimi",
        importance: "high",
        explanation: "MMU (Memory Management Unit), sanal bellek sisteminde mantıksal adresleri fiziksel adreslere çevirir."
    },
    { 
        q: "MMU'nun açılımı nedir?", 
        t: "fill", 
        a: "Memory Management Unit",
        difficulty: "hard",
        week: 3,
        topic: "Bellek Yönetimi",
        importance: "medium",
        explanation: "MMU, Memory Management Unit (Bellek Yönetim Birimi) anlamına gelir."
    },
    { 
        q: "Dosya yönetiminde, kalıcı veri saklama birimine ne ad verilir?", 
        t: "fill", 
        a: "Dosya",
        difficulty: "easy",
        week: 3,
        topic: "Dosya Yönetimi",
        importance: "medium",
        explanation: "Dosya, kalıcı veri saklama birimidir."
    },
    { 
        q: "FAT32, NTFS, ext4 neye örnektir?", 
        t: "fill", 
        a: "Dosya Sistemleri",
        difficulty: "medium",
        week: 3,
        topic: "Dosya Yönetimi",
        importance: "high",
        explanation: "FAT32, NTFS, ext4 farklı dosya sistemlerine örnektir."
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
        explanation: "FAT32 basit ve uyumludur ancak güvenlik özellikleri sınırlıdır. NTFS gelişmiş güvenlik sunar."
    },
    { 
        q: "Linux işletim sistemleri için yaygın olarak kullanılan dosya sistemi nedir?", 
        t: "fill", 
        a: "ext4",
        difficulty: "medium",
        week: 3,
        topic: "Dosya Yönetimi",
        importance: "high",
        explanation: "ext4, Linux sistemlerde yaygın olarak kullanılan dosya sistemidir."
    },
    { 
        q: "Windows'un modern dosya sistemi hangisidir?", 
        t: "fill", 
        a: "NTFS",
        difficulty: "easy",
        week: 3,
        topic: "Dosya Yönetimi",
        importance: "high",
        explanation: "NTFS (New Technology File System), Windows'un modern ve gelişmiş dosya sistemidir."
    },
    { 
        q: "RAID 0'ın avantajı '...' 'dır.", 
        t: "fill", 
        a: "Hız",
        difficulty: "medium",
        week: 3,
        topic: "Disk Yönetimi",
        importance: "medium",
        explanation: "RAID 0, striping yaparak veri okuma/yazma hızını artırır ancak yedekleme yapmaz."
    },
    { 
        q: "Aynalama (mirroring) yapan RAID teknolojisi hangisidir?", 
        t: "fill", 
        a: "RAID 1",
        difficulty: "medium",
        week: 3,
        topic: "Disk Yönetimi",
        importance: "high",
        explanation: "RAID 1, verileri iki diske aynalayarak (mirroring) yedekleme sağlar."
    },
    { 
        q: "RAID teknolojisinin temel amacı nedir?", 
        t: "mcq", 
        o: ["Sadece hız artırmak", "Sadece veri güvenliği sağlamak", "Hem hız hem veri güvenliği sağlamak", "Disk alanından tasarruf etmek"], 
        a: "Hem hız hem veri güvenliği sağlamak",
        difficulty: "medium",
        week: 3,
        topic: "Disk Yönetimi",
        importance: "medium",
        explanation: "RAID teknolojisi, farklı seviyelerde hem performans hem de veri güvenliği sağlamayı amaçlar."
    },
    { 
        q: "Klavye, fare, yazıcı gibi donanımların yönetiminden hangi işletim sistemi bileşeni sorumludur?", 
        t: "fill", 
        a: "Giriş/Çıkış yönetimi",
        difficulty: "easy",
        week: 3,
        topic: "G/Ç Yönetimi",
        importance: "medium",
        explanation: "Giriş/Çıkış (I/O) yönetimi, tüm donanım aygıtlarının işletim sistemi tarafından kontrol edilmesini sağlar."
    },
    { 
        q: "Donanım ile işletim sistemi arasındaki arayüzü sağlayan yazılımlara ne denir?", 
        t: "fill", 
        a: "Sürücüler",
        difficulty: "easy",
        week: 3,
        topic: "G/Ç Yönetimi",
        importance: "high",
        explanation: "Sürücüler (drivers), donanım ile işletim sistemi arasında iletişim sağlar."
    },
    { 
        q: "İşletim sisteminin, kullanıcıların ve işlemlerin kaynaklara erişimini kontrol etme görevine ne denir?", 
        t: "fill", 
        a: "Güvenlik ve koruma",
        difficulty: "medium",
        week: 3,
        topic: "Güvenlik",
        importance: "high",
        explanation: "İşletim sistemi, güvenlik ve koruma mekanizmaları ile kaynaklara erişimi kontrol eder."
    },
    { 
        q: "Bir kullanıcının sisteme giriş yaparken kimliğinin doğrulanması işlemine ne denir?", 
        t: "fill", 
        a: "Kimlik doğrulama",
        difficulty: "easy",
        week: 3,
        topic: "Güvenlik",
        importance: "high",
        explanation: "Kimlik doğrulama (authentication), kullanıcının kim olduğunu doğrulama işlemidir."
    },
    // HAFTA 4: İS Katmanları, Çekirdek, Sistem Çağrıları
    { 
        q: "Bir işletim sisteminin yazılım tasarımında ele alınması gereken iki önemli konudan biri Performans, diğeri nedir?", 
        t: "fill", 
        a: "Kaynakların özel kullanımı",
        difficulty: "medium",
        week: 4,
        topic: "Genel Kavramlar",
        importance: "high",
        explanation: "İşletim sistemi tasarımında iki önemli konu: Performans ve Kaynakların özel kullanımı (yalıtım/koruma)."
    },
    { 
        q: "İşlemcinin, işletim sisteminin kodlarını çalıştırmaya başladığı yetkili moda ne ad verilir?", 
        t: "fill", 
        a: "supervisor mod",
        difficulty: "medium",
        week: 4,
        topic: "Çekirdek",
        importance: "high",
        explanation: "Supervisor mod (veya kernel mod), işletim sisteminin tüm kaynaklara erişebildiği yetkili çalışma modudur."
    },
    { 
        q: "Kullanıcı modundaki bir işlemin işletim sistemini çağırdığında, işlemcinin hemen supervisor moda geçmesine ne denir?", 
        t: "fill", 
        a: "sistem çağrısı",
        difficulty: "medium",
        week: 4,
        topic: "Sistem Çağrıları",
        importance: "high",
        explanation: "Sistem çağrısı (system call), kullanıcı modundan kernel moduna geçişi sağlar."
    },
    { 
        q: "İşlemcide, bir programın çalışma yeteneğini gösteren bite ne denir?", 
        t: "fill", 
        a: "mod biti",
        difficulty: "medium",
        week: 4,
        topic: "Çekirdek",
        importance: "high",
        explanation: "Mod biti, programın kullanıcı modunda mı yoksa kernel modunda mı çalıştığını belirler."
    },
    { 
        q: "Mod biti (mode bit) hangi değeri aldığında 'supervisor (kernel) mod'da çalışıldığı anlaşılır?", 
        t: "fill", 
        a: "0",
        difficulty: "medium",
        week: 4,
        topic: "Çekirdek",
        importance: "high",
        explanation: "Mod biti 0 ise supervisor (kernel) modu, 1 ise kullanıcı modudur."
    },
    { 
        q: "İşletim sistemi programları '...' modda çalışır.", 
        t: "fill", 
        a: "supervisor",
        difficulty: "medium",
        week: 4,
        topic: "Çekirdek",
        importance: "high",
        explanation: "İşletim sistemi programları, tüm kaynaklara erişebilmek için supervisor modda çalışır."
    },
    { 
        q: "İşletim sistemi ve işlemler arasında bir arayüz görevi gören, genellikle Assembly dili komutları şeklinde olan yapı nedir?", 
        t: "fill", 
        a: "Sistem çağrıları",
        difficulty: "hard",
        week: 4,
        topic: "Sistem Çağrıları",
        importance: "high",
        explanation: "Sistem çağrıları, işlemler ile işletim sistemi arasında düşük seviyeli arayüz sağlar."
    },
    { 
        q: "Microsoft Windows, sistem çağrılarını hangi API ile gerçekleştirmektedir?", 
        t: "fill", 
        a: "Win32 API",
        difficulty: "hard",
        week: 4,
        topic: "Sistem Çağrıları",
        importance: "medium",
        explanation: "Microsoft Windows, sistem çağrılarını Win32 API üzerinden gerçekleştirir."
    },
    { 
        q: "UNIX/Linux sistemlerinde sistem çağrıları hangi dilde yazılmıştır?", 
        t: "fill", 
        a: "C",
        difficulty: "medium",
        week: 4,
        topic: "Sistem Çağrıları",
        importance: "medium",
        explanation: "UNIX/Linux sistem çağrıları genellikle C dili ile yazılmıştır."
    },
    { 
        q: "Dosya okuma/yazma, işlem oluşturma gibi işlemler hangi mekanizma ile yapılır?", 
        t: "fill", 
        a: "Sistem çağrıları",
        difficulty: "medium",
        week: 4,
        topic: "Sistem Çağrıları",
        importance: "high",
        explanation: "Sistem çağrıları, dosya işlemleri, işlem yönetimi gibi işletim sistemi hizmetlerine erişim sağlar."
    },
    { 
        q: "Word, Excel gibi kullanıcı tarafından kullanılan her tür program, işletim sistemi katmanlarının hangi seviyesinde yer alır?", 
        t: "fill", 
        a: "Uygulama Katmanı",
        difficulty: "easy",
        week: 4,
        topic: "Katmanlar",
        importance: "medium",
        explanation: "Uygulama Katmanı, kullanıcıların doğrudan kullandığı programların bulunduğu en üst katmandır."
    },
    { 
        q: "İşletim sisteminin kalbi olarak adlandırılan ve tüm sistem kaynaklarını yöneten katman hangisidir?", 
        t: "fill", 
        a: "Çekirdek",
        difficulty: "medium",
        week: 4,
        topic: "Çekirdek",
        importance: "high",
        explanation: "Çekirdek (kernel), işletim sisteminin kalbi olarak tüm sistem kaynaklarını yönetir."
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
        explanation: "Çekirdek türleri: Monolitik, Mikrokernel ve Hibrid çekirdektir."
    },
    { 
        q: "Tüm yazılımlar ve sürücülerin işletim sistemi çekirdeğinde yer aldığı çekirdek tipine ne denir?", 
        t: "fill", 
        a: "Monolitik çekirdek",
        difficulty: "hard",
        week: 4,
        topic: "Çekirdek",
        importance: "high",
        explanation: "Monolitik çekirdeklerde tüm sistem servisleri çekirdek içindedir. Hızlıdır ama bir hata tüm sistemi etkileyebilir."
    },
    { 
        q: "Unix, ne tür bir çekirdeğe örnektir?", 
        t: "fill", 
        a: "Monolitik",
        difficulty: "medium",
        week: 4,
        topic: "Çekirdek",
        importance: "medium",
        explanation: "Unix, monolitik çekirdek yapısına sahip bir işletim sistemidir."
    },
    { 
        q: "Sadece en önemli işletim sistemi fonksiyonlarının bulunduğu küçük boyutlu çekirdeklere ne denir?", 
        t: "fill", 
        a: "mikrokernel",
        difficulty: "hard",
        week: 4,
        topic: "Çekirdek",
        importance: "high",
        explanation: "Mikrokernel (microkernel), sadece temel işletim sistemi fonksiyonlarını içeren minimal çekirdek yapısıdır."
    },
    { 
        q: "Mikrokernellerde, sürücüler ve dosya sistemleri çekirdeğin dışında '...' olarak çalışır.", 
        t: "fill", 
        a: "kullanıcı seviyesinde",
        difficulty: "hard",
        week: 4,
        topic: "Çekirdek",
        importance: "medium",
        explanation: "Mikrokernellerde birçok servis kullanıcı seviyesinde çalışır, bu da daha güvenli ama daha yavaştır."
    },
    { 
        q: "Monolitik ve mikrokernel yapılarının avantajlarını birleştiren çekirdek tipine ne denir?", 
        t: "fill", 
        a: "Hibrid çekirdek",
        difficulty: "medium",
        week: 4,
        topic: "Çekirdek",
        importance: "medium",
        explanation: "Hibrid çekirdekler, monolitik ve mikrokernel yaklaşımlarının avantajlarını birleştirir."
    },
    { 
        q: "Windows NT mimarisinde donanım detaylarının soyutlanmasını sağlayan katman nedir?", 
        t: "fill", 
        a: "HAL",
        difficulty: "hard",
        week: 4,
        topic: "Katmanlar",
        importance: "high",
        explanation: "HAL (Hardware Abstraction Layer), donanım detaylarını soyutlayarak işletim sisteminin taşınabilirliğini artırır."
    },
    { 
        q: "HAL'in açılımı nedir?", 
        t: "fill", 
        a: "Hardware Abstraction Layer",
        difficulty: "hard",
        week: 4,
        topic: "Katmanlar",
        importance: "medium",
        explanation: "HAL, Hardware Abstraction Layer (Donanım Soyutlama Katmanı) anlamına gelir."
    },
    { 
        q: "Windows'ta çekirdek modu ve kullanıcı modu arasındaki iletişimi hangi katman sağlar?", 
        t: "fill", 
        a: "Executive",
        difficulty: "hard",
        week: 4,
        topic: "Katmanlar",
        importance: "medium",
        explanation: "Executive katmanı, Windows'ta üst düzey sistem hizmetlerini sağlar."
    },
    { 
        q: "Donanım tarafından oluşturulan ve işlemciyi durduran sinyallere ne denir?", 
        t: "fill", 
        a: "Kesme",
        difficulty: "medium",
        week: 4,
        topic: "Kesme ve Tuzak",
        importance: "high",
        explanation: "Kesme (interrupt), donanım tarafından işlemciye gönderilen acil durum sinyalidir."
    },
    { 
        q: "Yazılım tarafından oluşturulan hata veya sistem çağrısı durumlarına ne denir?", 
        t: "fill", 
        a: "Tuzak",
        difficulty: "medium",
        week: 4,
        topic: "Kesme ve Tuzak",
        importance: "high",
        explanation: "Tuzak (trap), yazılım kaynaklı istisnai durumlarda oluşur (örn: sıfıra bölme hatası)."
    },
    // HAFTA 5: İşlem Yönetimi / Zamanlama Algoritmaları
    { 
        q: "Bir programın çalışmakta olan hâline ne denir?", 
        t: "fill", 
        a: "İşlem",
        difficulty: "easy",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "high",
        explanation: "İşlem (Process), belleğe yüklenmiş ve çalışmakta olan programdır."
    },
    { 
        q: "Bellekte çalışan en küçük iş birimi nedir?", 
        t: "fill", 
        a: "İşlem",
        difficulty: "easy",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "high",
        explanation: "İşlem, bellekte çalışan en küçük bağımsız iş birimidir."
    },
    { 
        q: "Sabit diskte duran ve pasif kod olarak tanımlanan bileşen nedir?", 
        t: "fill", 
        a: "Program",
        difficulty: "easy",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "medium",
        explanation: "Program, diskte saklanan pasif koddur; çalıştırıldığında işlem haline gelir."
    },
    { 
        q: "Çalışan ve aktif durumdaki kod olarak tanımlanan bileşen nedir?", 
        t: "fill", 
        a: "İşlem",
        difficulty: "easy",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "medium",
        explanation: "İşlem, bellekte aktif olarak çalışan koddur."
    },
    { 
        q: "Program ve İşlem arasındaki temel farklardan biri, Program bellekte yer kaplamazken İşlemin bellekte alan '...' etmesidir.", 
        t: "fill", 
        a: "tahsis",
        difficulty: "medium",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "medium",
        explanation: "İşlem çalıştığında bellekte kendine alan tahsis eder, program ise diskte pasif olarak durur."
    },
    { 
        q: "İşlem Durumları (Process States) arasında 'Ready' durumunun anlamı nedir?", 
        t: "fill", 
        a: "İşlem çalışmaya hazırdır",
        difficulty: "medium",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "high",
        explanation: "Ready durumundaki işlem CPU'yu beklemektedir; zamanlayıcı tarafından seçilirse Running durumuna geçer."
    },
    { 
        q: "Bir işlemin CPU'da aktif olarak çalıştığı duruma ne denir?", 
        t: "fill", 
        a: "Running",
        difficulty: "easy",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "high",
        explanation: "Running durumunda işlem CPU'da komutlarını çalıştırmaktadır."
    },
    { 
        q: "Bir işlemin G/Ç (I/O) isteği, bir olay ya da sinyal beklediği duruma ne ad verilir?", 
        t: "fill", 
        a: "Waiting",
        difficulty: "medium",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "high",
        explanation: "Waiting (veya Blocked) durumunda işlem, G/Ç veya bir olayın gerçekleşmesini bekler."
    },
    { 
        q: "Bir işlem çalışmasını tamamladığında hangi duruma geçer?", 
        t: "fill", 
        a: "Terminated",
        difficulty: "easy",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "medium",
        explanation: "Terminated durumunda işlem çalışmasını tamamlamış ve sonlandırılmıştır."
    },
    { 
        q: "Bir işlemin tüm bilgilerini tutan veri yapısının kısaltması nedir?", 
        t: "fill", 
        a: "PCB",
        difficulty: "medium",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "high",
        explanation: "PCB (Process Control Block), işlemin durum bilgileri, CPU register değerleri, bellek bilgileri gibi tüm bilgileri içerir."
    },
    { 
        q: "PCB'nin açılımı nedir?", 
        t: "fill", 
        a: "Process Control Block",
        difficulty: "medium",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "high",
        explanation: "PCB, Process Control Block (İşlem Kontrol Bloğu) anlamına gelir."
    },
    { 
        q: "Aşağıdakilerden hangisi PCB içinde tutulan bilgilerden biri *değildir*?", 
        t: "mcq", 
        o: ["İşlem kimliği (PID)", "Program sayacı", "CPU register bilgileri", "Kullanıcının adı ve soyadı"], 
        a: "Kullanıcının adı ve soyadı",
        difficulty: "medium",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "medium",
        explanation: "PCB'de işlem durumu, PID, program sayacı, registerlar, bellek bilgileri vb. tutulur; kullanıcı kişisel bilgileri tutulmaz."
    },
    { 
        q: "Her işleme verilen benzersiz sayısal tanımlayıcıya ne denir?", 
        t: "fill", 
        a: "PID",
        difficulty: "easy",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "high",
        explanation: "PID (Process ID), her işlemi benzersiz şekilde tanımlayan sayısal kimliktir."
    },
    { 
        q: "PID'nin açılımı nedir?", 
        t: "fill", 
        a: "Process ID",
        difficulty: "medium",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "medium",
        explanation: "PID, Process ID (İşlem Kimliği) anlamına gelir."
    },
    { 
        q: "En basit zamanlama algoritması olup, ilk gelenin önce çalıştığı algoritmanın kısaltması nedir?", 
        t: "fill", 
        a: "FCFS",
        difficulty: "medium",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "high",
        explanation: "FCFS (First Come First Serve), işlemleri geliş sırasına göre çalıştıran en basit algoritmadır."
    },
    { 
        q: "FCFS zamanlama algoritmasının açılımı nedir?", 
        t: "fill", 
        a: "First Come First Serve",
        difficulty: "hard",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "high",
        explanation: "FCFS, First Come First Serve (İlk Gelen İlk Servis Edilir) anlamına gelir."
    },
    { 
        q: "SJF zamanlama algoritmasının açılımı nedir?", 
        t: "fill", 
        a: "Shortest Job First",
        difficulty: "hard",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "high",
        explanation: "SJF, Shortest Job First (En Kısa İş Önce) anlamına gelir."
    },
    { 
        q: "Zamanlama algoritmaları arasında yer alan, her işleme eşit zaman dilimi veren algoritma hangisidir?", 
        t: "fill", 
        a: "Round Robin",
        difficulty: "hard",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "medium",
        explanation: "Round Robin, her işleme sabit zaman dilimi (time quantum) vererek sırayla çalıştırır."
    },
    { 
        q: "Round Robin algoritmasında her işleme verilen sabit zaman dilimine ne denir?", 
        t: "fill", 
        a: "time quantum",
        difficulty: "hard",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "medium",
        explanation: "Time quantum (zaman dilimi), Round Robin'de her işlemin CPU'yu kullanabileceği süreyi belirler."
    },
    { 
        q: "Bir işlemin çalışması tamamlanmadan CPU'dan alınması durumuna ne denir?", 
        t: "fill", 
        a: "Preemption",
        difficulty: "hard",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "high",
        explanation: "Preemption (önalım), bir işlemin çalışmasının zorla durdurulması ve başka işleme geçilmesidir."
    },
    { 
        q: "FCFS algoritması preemptive midir?", 
        t: "mcq", 
        o: ["Evet", "Hayır"], 
        a: "Hayır",
        difficulty: "medium",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "high",
        explanation: "FCFS non-preemptive'dir; işlem bitene kadar CPU'yu bırakmaz."
    },
    { 
        q: "Round Robin algoritması preemptive midir?", 
        t: "mcq", 
        o: ["Evet", "Hayır"], 
        a: "Evet",
        difficulty: "medium",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "high",
        explanation: "Round Robin preemptive'dir; time quantum bittiğinde işlem CPU'dan alınır."
    },
    { 
        q: "SJF algoritmasının dezavantajı nedir?", 
        t: "mcq", 
        o: ["Karmaşık hesaplama gerektirir", "Uzun işlemler açlık (starvation) yaşayabilir", "Preemptive değildir", "Sadece tek CPU'da çalışır"], 
        a: "Uzun işlemler açlık (starvation) yaşayabilir",
        difficulty: "hard",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "high",
        explanation: "SJF'de kısa işlemler öncelikli olduğundan, uzun işlemler sürekli ertelenebilir (starvation)."
    },
    { 
        q: "Bir işlemden diğerine geçiş sırasında CPU'nun durum bilgilerini kaydetme ve yükleme işlemine ne denir?", 
        t: "fill", 
        a: "Context Switch",
        difficulty: "hard",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "high",
        explanation: "Context Switch, CPU'nun bir işlemden diğerine geçerken durum bilgilerini kaydetme ve yükleme işlemidir."
    },
    { 
        q: "Context Switch sırasında CPU üretken iş yapmaz, bu duruma ne denir?", 
        t: "fill", 
        a: "Overhead",
        difficulty: "hard",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "medium",
        explanation: "Context Switch overhead'i, sistem performansını düşürür çünkü bu sürede yararlı iş yapılmaz."
    },
    { 
        q: "UNIX/Linux sistemlerinde yeni işlem oluşturmak için kullanılan sistem çağrısı nedir?", 
        t: "fill", 
        a: "fork",
        difficulty: "hard",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "high",
        explanation: "fork() sistem çağrısı, mevcut işlemin bir kopyasını oluşturarak yeni işlem yaratır."
    },
    { 
        q: "Bir işlemi sonlandırmak için kullanılan sistem çağrısı nedir?", 
        t: "fill", 
        a: "exit",
        difficulty: "medium",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "medium",
        explanation: "exit() sistem çağrısı, işlemi sonlandırır ve kaynaklarını serbest bırakır."
    },
    { 
        q: "İşlemler arası iletişime ne denir?", 
        t: "fill", 
        a: "IPC",
        difficulty: "medium",
        week: 5,
        topic: "İşlem İletişimi",
        importance: "high",
        explanation: "IPC (Inter-Process Communication), işlemlerin birbiriyle veri alışverişi yapmasını sağlar."
    },
    { 
        q: "IPC'nin açılımı nedir?", 
        t: "fill", 
        a: "Inter-Process Communication",
        difficulty: "hard",
        week: 5,
        topic: "İşlem İletişimi",
        importance: "medium",
        explanation: "IPC, Inter-Process Communication (İşlemler Arası İletişim) anlamına gelir."
    },
    { 
        q: "Aşağıdakilerden hangisi bir IPC mekanizması *değildir*?", 
        t: "mcq", 
        o: ["Paylaşılan Bellek", "Mesaj Kuyrukları", "Pipe", "Cache Bellek"], 
        a: "Cache Bellek",
        difficulty: "medium",
        week: 5,
        topic: "İşlem İletişimi",
        importance: "medium",
        explanation: "IPC mekanizmaları: Paylaşılan bellek, mesaj kuyrukları, pipe, socket vb. Cache bellek IPC mekanizması değildir."
    },
    { 
        q: "Bir işlem içinde çalışan ve CPU tarafından zamanlanan en küçük birime ne denir?", 
        t: "fill", 
        a: "Thread",
        difficulty: "medium",
        week: 5,
        topic: "Thread",
        importance: "high",
        explanation: "Thread (iş parçacığı), bir işlem içinde paralel çalışabilen hafif yürütme birimidir."
    },
    { 
        q: "Thread'lerin aynı işlem içindeki diğer thread'lerle paylaştığı kaynak nedir?", 
        t: "mcq", 
        o: ["Stack", "Registerlar", "Program Counter", "Kod ve Veri Segmenti"], 
        a: "Kod ve Veri Segmenti",
        difficulty: "hard",
        week: 5,
        topic: "Thread",
        importance: "high",
        explanation: "Aynı işlemdeki thread'ler kod, veri ve heap'i paylaşır; ancak her birinin kendi stack ve register'ları vardır."
    },
    { 
        q: "Çok çekirdekli sistemlerde thread'lerin gerçekten paralel çalışması durumuna ne denir?", 
        t: "fill", 
        a: "Paralellik",
        difficulty: "medium",
        week: 5,
        topic: "Thread",
        importance: "medium",
        explanation: "Çok çekirdekli sistemlerde thread'ler aynı anda farklı çekirdeklerde çalışabilir (gerçek paralellik)."
    },
    { 
        q: "Birden fazla işlem veya thread'in paylaşılan kaynağa eşzamanlı erişimde oluşan problemlere ne denir?", 
        t: "fill", 
        a: "Race Condition",
        difficulty: "hard",
        week: 5,
        topic: "Senkronizasyon",
        importance: "high",
        explanation: "Race condition, paylaşılan kaynağa eşzamanlı erişimde tutarsızlıklara yol açan durumdur."
    },
    { 
        q: "Paylaşılan kaynağa aynı anda sadece bir işlemin erişebilmesini sağlayan kod bölgesine ne denir?", 
        t: "fill", 
        a: "Critical Section",
        difficulty: "hard",
        week: 5,
        topic: "Senkronizasyon",
        importance: "high",
        explanation: "Critical section (kritik bölge), paylaşılan kaynağa erişen kod bölümüdür ve korunması gerekir."
    },
    { 
        q: "Kritik bölgeyi korumak için kullanılan ve sadece bir işlemin kaynağa erişmesini sağlayan mekanizmaya ne denir?", 
        t: "fill", 
        a: "Mutex",
        difficulty: "hard",
        week: 5,
        topic: "Senkronizasyon",
        importance: "high",
        explanation: "Mutex (Mutual Exclusion), kritik bölgeye tek bir işlemin girmesini sağlayan kilitleme mekanizmasıdır."
    },
    { 
        q: "Senkronizasyon için kullanılan ve sayaç mantığıyla çalışan yapıya ne denir?", 
        t: "fill", 
        a: "Semaphore",
        difficulty: "hard",
        week: 5,
        topic: "Senkronizasyon",
        importance: "high",
        explanation: "Semaphore, sayaç kullanarak birden fazla işlemin senkronize edilmesini sağlar."
    },
    { 
        q: "İki veya daha fazla işlemin birbirini beklemesi ve hiçbirinin ilerleyememesi durumuna ne denir?", 
        t: "fill", 
        a: "Deadlock",
        difficulty: "medium",
        week: 5,
        topic: "Deadlock",
        importance: "high",
        explanation: "Deadlock (kilitlenme), işlemlerin birbirlerinin kaynaklarını bekleyerek sonsuz döngüye girmesidir."
    },
    { 
        q: "Öncelik tabanlı zamanlamada, düşük öncelikli işlemlerin sürekli ertelenmesi durumuna ne denir?", 
        t: "fill", 
        a: "Starvation",
        difficulty: "hard",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "medium",
        explanation: "Starvation (açlık), düşük öncelikli işlemlerin sürekli ertelenerek hiç CPU alamama durumudur."
    },
    { 
        q: "Starvation problemini çözmek için zamanla işlem önceliğini artırma tekniğine ne denir?", 
        t: "fill", 
        a: "Aging",
        difficulty: "hard",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "medium",
        explanation: "Aging, bekleyen işlemlerin önceliğini zamanla artırarak starvation'ı önler."
    },
    { 
        q: "Bir işlemin sistemde toplam geçirdiği süreye (bekleme + çalışma) ne denir?", 
        t: "fill", 
        a: "Turnaround Time",
        difficulty: "hard",
        week: 5,
        topic: "Performans",
        importance: "medium",
        explanation: "Turnaround time, işlemin gelişinden tamamlanmasına kadar geçen toplam süredir."
    },
    { 
        q: "Bir işlemin hazır kuyruğunda beklediği süreye ne denir?", 
        t: "fill", 
        a: "Waiting Time",
        difficulty: "medium",
        week: 5,
        topic: "Performans",
        importance: "medium",
        explanation: "Waiting time, işlemin ready kuyruğunda CPU'yu beklediği toplam süredir."
    },
    { 
        q: "Bir işlemin ilk kez CPU'ya atanana kadar geçen süreye ne denir?", 
        t: "fill", 
        a: "Response Time",
        difficulty: "hard",
        week: 5,
        topic: "Performans",
        importance: "medium",
        explanation: "Response time, işlemin sisteme girmesinden ilk kez CPU almasına kadar geçen süredir."
    },
    { 
        q: "CPU'nun yararlı iş yaptığı sürenin toplam süreye oranına ne denir?", 
        t: "fill", 
        a: "CPU Utilization",
        difficulty: "medium",
        week: 5,
        topic: "Performans",
        importance: "high",
        explanation: "CPU Utilization (CPU kullanım oranı), CPU'nun ne kadar verimli kullanıldığını gösterir."
    },
    { 
        q: "Birim zamanda tamamlanan işlem sayısına ne denir?", 
        t: "fill", 
        a: "Throughput",
        difficulty: "medium",
        week: 5,
        topic: "Performans",
        importance: "medium",
        explanation: "Throughput (verim), sistemin birim zamanda kaç işlem tamamladığını gösterir."
    },
    { 
        q: "Birden fazla CPU veya çekirdeğe sahip sistemlere ne denir?", 
        t: "fill", 
        a: "Multiprocessor",
        difficulty: "medium",
        week: 5,
        topic: "Çok İşlemcili Sistemler",
        importance: "medium",
        explanation: "Multiprocessor (çok işlemcili) sistemlerde birden fazla CPU paralel çalışır."
    },
    { 
        q: "Çok çekirdekli sistemlerde her işlemcinin kendi yerel belleği olduğu ve ağ üzerinden iletişim kurduğu yapıya ne denir?", 
        t: "fill", 
        a: "Distributed System",
        difficulty: "hard",
        week: 5,
        topic: "Çok İşlemcili Sistemler",
        importance: "low",
        explanation: "Distributed sistemlerde işlemciler fiziksel olarak ayrı ve ağ üzerinden haberleşir."
    },
    { 
        q: "Belirli süre kısıtlamaları içinde görevleri tamamlaması gereken sistemlere ne denir?", 
        t: "fill", 
        a: "Real-Time System",
        difficulty: "medium",
        week: 5,
        topic: "Gerçek Zamanlı Sistemler",
        importance: "low",
        explanation: "Real-time sistemlerde görevler belirli zaman sınırları içinde tamamlanmalıdır (örn: uçak kontrol sistemleri)."
    },
    { 
        q: "İşletim sisteminin kaynak yönetimi görevlerinden biri *değildir*?", 
        t: "mcq", 
        o: ["CPU zamanını dağıtmak", "Bellek tahsis etmek", "Dosya sistemini yönetmek", "Kullanıcı arayüzü tasarlamak"], 
        a: "Kullanıcı arayüzü tasarlamak",
        difficulty: "medium",
        week: 3,
        topic: "Fonksiyonlar",
        importance: "medium",
        explanation: "Kaynak yönetimi CPU, bellek, disk gibi donanım kaynaklarının yönetimini içerir; arayüz tasarımı kullanıcı deneyimi ile ilgilidir."
    },
    { 
        q: "Bir işletim sisteminin çoklu görev (multitasking) yapabilmesi için hangi özellik gereklidir?", 
        t: "mcq", 
        o: ["Sadece çok çekirdekli CPU", "Zamanlama mekanizması", "Grafik arayüz", "Ağ bağlantısı"], 
        a: "Zamanlama mekanizması",
        difficulty: "medium",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "high",
        explanation: "Multitasking için zamanlayıcı gereklidir; tek çekirdekli CPU'da bile zaman paylaşımı ile yapılabilir."
    },
    { 
        q: "Pardus işletim sisteminde paket yönetimi için kullanılan araç nedir?", 
        t: "fill", 
        a: "PiSi",
        difficulty: "hard",
        week: 1,
        topic: "Linux/Pardus",
        importance: "low",
        explanation: "PiSi (Packages Installed Successfully as Intended), Pardus'un paket yöneticisidir."
    },
    { 
        q: "Linux sistemlerde root kullanıcısının UID (User ID) değeri nedir?", 
        t: "fill", 
        a: "0",
        difficulty: "hard",
        week: 1,
        topic: "Linux/Pardus",
        importance: "low",
        explanation: "Root kullanıcısı (sistem yöneticisi) her zaman 0 UID'sine sahiptir."
    },
    { 
        q: "Windows'ta sistem dosyalarının bulunduğu ana dizin hangisidir?", 
        t: "fill", 
        a: "C:\\Windows",
        difficulty: "medium",
        week: 1,
        topic: "Windows",
        importance: "low",
        explanation: "Varsayılan olarak Windows sistem dosyaları C:\\Windows dizininde bulunur."
    },
    { 
        q: "Mac OS'un temelini oluşturan UNIX tabanlı işletim sistemi nedir?", 
        t: "fill", 
        a: "Darwin",
        difficulty: "hard",
        week: 1,
        topic: "Mac OS",
        importance: "low",
        explanation: "Darwin, Mac OS X'in açık kaynak kodlu UNIX çekirdeğidir."
    },
    { 
        q: "Bir dosya sisteminde dizin yapısının en üst noktasına ne denir?", 
        t: "fill", 
        a: "Root",
        difficulty: "easy",
        week: 3,
        topic: "Dosya Yönetimi",
        importance: "medium",
        explanation: "Root dizini, dosya sisteminin en üst seviyesidir (Linux'ta /, Windows'ta C:\\)."
    },
    { 
        q: "Sanal bellek kullanıldığında diskte kullanılan alana ne ad verilir?", 
        t: "fill", 
        a: "Swap",
        difficulty: "medium",
        week: 3,
        topic: "Bellek Yönetimi",
        importance: "high",
        explanation: "Swap alanı, RAM yetersiz kaldığında diskte kullanılan sanal bellek alanıdır."
    },
    { 
        q: "Bir işlemin bellek alanı hangi bölümlerden oluşur?", 
        t: "mcq", 
        o: ["Sadece kod ve veri", "Kod, veri, heap ve stack", "Sadece heap ve stack", "Sadece kod"], 
        a: "Kod, veri, heap ve stack",
        difficulty: "hard",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "high",
        explanation: "İşlem bellek alanı dört ana bölümden oluşur: kod (text), veri (data), heap (dinamik bellek) ve stack (yerel değişkenler)."
    },
    { 
        q: "UNIX/Linux sistemlerinde bir işlemin önceliğini değiştirmek için kullanılan komut nedir?", 
        t: "fill", 
        a: "nice",
        difficulty: "hard",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "low",
        explanation: "nice komutu, işlem önceliğini ayarlamak için kullanılır."
    },
    { 
        q: "Windows'ta çalışan işlemleri görmek için kullanılan araç nedir?", 
        t: "fill", 
        a: "Task Manager",
        difficulty: "easy",
        week: 1,
        topic: "Windows",
        importance: "low",
        explanation: "Task Manager (Görev Yöneticisi), çalışan işlemleri, CPU ve bellek kullanımını gösterir."
    },
    { 
        q: "Bir işlemin CPU'da çalışırken kesintiye uğraması ve daha yüksek öncelikli işleme geçilmesi durumuna ne denir?", 
        t: "fill", 
        a: "Preemptive scheduling",
        difficulty: "hard",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "high",
        explanation: "Preemptive scheduling'de işlemci, çalışan işlemi durdurarak daha yüksek öncelikli işleme geçebilir."
    },
    { 
        q: "İşletim sisteminin donanım ve yazılım arasındaki konumunu belirten kavram nedir?", 
        t: "fill", 
        a: "Ara katman",
        difficulty: "medium",
        week: 3,
        topic: "Fonksiyonlar",
        importance: "high",
        explanation: "İşletim sistemi, kullanıcı/uygulama ile donanım arasında ara katman (middleware) görevi görür."
    },
    { 
        q: "Çoklu işlemci sistemlerde işlemciler arasında yük dengelemesi yapan bileşene ne denir?", 
        t: "fill", 
        a: "Scheduler",
        difficulty: "hard",
        week: 5,
        topic: "Zamanlama Algoritmaları",
        importance: "medium",
        explanation: "Scheduler (zamanlayıcı), işlemleri işlemcilere dağıtarak yük dengelemesi yapar."
    },
    { 
        q: "Bir işlemin bellekteki başlangıç adresini tutan register nedir?", 
        t: "fill", 
        a: "Base register",
        difficulty: "hard",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "medium",
        explanation: "Base register, işlemin bellek alanının başlangıç adresini tutar."
    },
    { 
        q: "İşletim sisteminin boot (açılış) sürecinde ilk çalışan program nedir?", 
        t: "fill", 
        a: "Bootloader",
        difficulty: "medium",
        week: 3,
        topic: "İS Tarihi",
        importance: "low",
        explanation: "Bootloader, bilgisayar açılırken işletim sistemini belleğe yükleyen ilk programdır."
    },
    { 
        q: "Windows'ta kayıt defterini düzenlemek için kullanılan araç nedir?", 
        t: "fill", 
        a: "regedit",
        difficulty: "hard",
        week: 1,
        topic: "Windows",
        importance: "low",
        explanation: "Regedit, Windows kayıt defterini (registry) düzenlemek için kullanılan araçtır."
    },
    { 
        q: "Mac OS'ta terminal uygulamasının adı nedir?", 
        t: "fill", 
        a: "Terminal",
        difficulty: "easy",
        week: 1,
        topic: "Mac OS",
        importance: "low",
        explanation: "Mac OS'ta Terminal uygulaması, komut satırı arayüzü sağlar."
    },
    { 
        q: "Linux'ta dosya izinlerini değiştirmek için kullanılan komut nedir?", 
        t: "fill", 
        a: "chmod",
        difficulty: "medium",
        week: 1,
        topic: "Linux/Pardus",
        importance: "medium",
        explanation: "chmod (change mode) komutu, dosya ve dizinlerin erişim izinlerini değiştirir."
    },
    { 
        q: "Çok kullanıcılı sistemlerde kullanıcı kimlik doğrulaması yapan işletim sistemi bileşeni nedir?", 
        t: "fill", 
        a: "Authentication system",
        difficulty: "medium",
        week: 3,
        topic: "Güvenlik",
        importance: "high",
        explanation: "Authentication system, kullanıcıların kimlik doğrulamasını yaparak sisteme erişimi kontrol eder."
    },
    { 
        q: "Bir işlemin çocuk işlem yaratması durumunda, çocuk işlemin kaynakları kimden alır?", 
        t: "mcq", 
        o: ["İşletim sisteminden direkt", "Ebeveyn işlemden", "Diğer işlemlerden", "Disk alanından"], 
        a: "Ebeveyn işlemden",
        difficulty: "medium",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "medium",
        explanation: "Çocuk işlem, ebeveyn işlemin kaynaklarını kullanır veya işletim sistemi yeni kaynaklar tahsis eder."
    },
    { 
        q: "İşletim sisteminin çekirdek kodunun güncellenmesi için sistem genellikle ne yapmalıdır?", 
        t: "mcq", 
        o: ["Sadece uygulama yeniden başlatılır", "Sistem yeniden başlatılmalıdır", "Otomatik güncellenir", "Hiçbir şey yapmaya gerek yoktur"], 
        a: "Sistem yeniden başlatılmalıdır",
        difficulty: "easy",
        week: 4,
        topic: "Çekirdek",
        importance: "low",
        explanation: "Çekirdek güncellemelerinden sonra değişikliklerin geçerli olması için sistem genellikle yeniden başlatılmalıdır."
    },
    { 
        q: "Bir işlemin beklemeden dolayı CPU kullanmadığı duruma ne denir?", 
        t: "fill", 
        a: "Idle",
        difficulty: "easy",
        week: 5,
        topic: "İşlem Yönetimi",
        importance: "low",
        explanation: "Idle durumunda sistem veya işlem beklemede olup CPU kullanmaz."
    },
    { 
        q: "Windows'ta disk bölümlerini yönetmek için kullanılan araç nedir?", 
        t: "fill", 
        a: "Disk Management",
        difficulty: "medium",
        week: 1,
        topic: "Windows",
        importance: "low",
        explanation: "Disk Management aracı, disk bölümlerini oluşturma, silme ve yönetme işlemlerini yapar."
    }
];
console.log(`✅ ${window.questionBank.length} soru yüklendi!`);
