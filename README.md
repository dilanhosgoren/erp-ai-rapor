# 🤖 ERP AI Rapor Sistemi

Yerel yapay zeka (Ollama) ile çalışan, Docker tabanlı ERP rapor ve analiz sistemi. Veriler dışarı çıkmaz, internet gerekmez, aylık ücret yoktur.

---

## 🚀 Özellikler

- 💬 **Türkçe AI Sohbet** — "En çok hangi şehirde satış yapıyoruz?" diye sor, cevabı al
- 📊 **100 Sabit Rapor** — Tek tıkla tablo ve grafik
- 🔧 **50 ERP Fonksiyonu** — Parametrik sorgular
- 🤖 **Otomatik AI Analizi** — Her raporu Ollama yorumlar
- 📈 **Dashboard** — "genel durum" yaz, özet kartlar çıkar
- 🔒 **Veri Güvenliği** — Tüm AI işlemleri yerel sunucuda

---

## 🛠️ Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Backend | Node.js + Express |
| Veritabanı | PostgreSQL 16 |
| Yerel AI | Ollama + llama3.2 |
| Konteyner | Docker Compose |
| Arayüz | HTML / CSS / JS |

---

## ⚙️ Kurulum

### Gereksinimler
- [Docker Desktop](https://www.docker.com/products/docker-desktop) kurulu olmalı
- Git kurulu olmalı

### 1. Projeyi klonla
```bash
git clone https://github.com/dilanhosgoren/erp-ai-rapor.git
cd erp-ai-rapor
```

### 2. Projeyi başlat
```bash
docker compose up --build
```

### 3. Ollama modeli indir
```bash
docker exec -it erp-ollama ollama pull llama3.2
```

### 4. Tarayıcıda aç

http://localhost:3000

## 💬 Kullanım Örnekleri

"En çok hangi şehirde satış yapıyoruz?"

"Stok durumuna bak"

"Aylık satış grafiğini göster"

"Genel durum"

"Bu ay kâr ettik mi?"

---

## 🌍 Sunucuya Kurulum

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2
```

`.env` dosyasında:
```env
OLLAMA_URL=http://SUNUCU_IP:11434
```

---

## 📄 Lisans

MIT License — Özgürce kullanabilirsiniz.