# SAP ERP KULLANICI EĞİTİMİ VE SİMÜLASYON MODÜLÜ


## 📌 Proje Tanımı

**SAP Digital Manufacturing (SAP DM)** platformunun kullanıcı arayüzü, özellikle yeni kullanıcılar için karmaşık ve öğrenilmesi güç bir yapıya sahiptir. Bu proje, SAP DM’in temel ekranlarına yönelik etkileşimli bir eğitim modülü sunarak kullanıcıların bu sistemi kolay ve etkili şekilde deneyimlemelerini sağlamayı amaçlamaktadır.

Bu modül, üretim yürütme sistemleri (MES) içerisinde yer alan sipariş yönetimi, hata takibi ve teyit işlemleri gibi temel SAP DM işlemlerini simüle etmektedir.

## 🎯 Hedeflenen Problemler

- SAP DM kullanıcı arayüzünün karmaşıklığı nedeniyle yaşanan öğrenme zorluklarını azaltmak
- Yeni kullanıcılar için hızlı adapte olunabilir ve anlaşılır bir eğitim arayüzü sunmak
- Kurumsal SAP eğitimlerini klasik yöntemlerden (PDF, video vs.) daha interaktif hale getirmek
- Kullanıcı performansını anlık geri bildirim ve puanlama ile ölçmek

## 🚀 Özellikler

- ✅ Etkileşimli sürükle-bırak tabanlı görevler
- ✅ Her ekran için ayrı puanlama sistemi (+5 doğru, -2 yanlış)
- ✅ Giriş ekranı ve kullanıcı doğrulama
- ✅ Modül tamamlandığında tebrik ekranı
- ✅ Responsive tasarım (mobil uyumlu)
- ✅ SAP DM ekran yapısına benzer stil ve simülasyonlar
- ✅ Kurumsal renk teması (Rexroth mavi, gri, beyaz)

## 🛠️ Kullanılan Teknolojiler

| Katman | Teknoloji | Açıklama |
|-------|-----------|----------|
| **Frontend** | HTML5 | Yapısal iskelet |
| | CSS3 (Flexbox, Grid) | Renk teması, responsive yapı, animasyonlar |
| | JavaScript (ES6+) | Ekran geçişleri, sürükle-bırak ve puanlama mantığı |
| **Veri Yönetimi** | Local State (JS) | `currentScore`, `completedSteps` gibi değişkenlerle veri takibi |
| **Backend** | ❌ | Uygulama client-side çalışmaktadır |
| **Platform** | Web (Cross-platform) | Chrome, Firefox, Edge destekli |

## 🔧 Kurulum

```bash
git clone https://github.com/kullanici-adi/sap-dm-egitim-modulu.git
cd sap-dm-egitim-modulu
open index.html  # ya da tarayıcıda aç
