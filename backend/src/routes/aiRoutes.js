const express = require('express')
const router = express.Router()
const ollama = require('../services/ollamaService')
const db = require('../services/dbService')

// Ollama sağlık kontrolü
// GET /api/ai/durum
router.get('/durum', async (req, res) => {
    const durum = await ollama.saglikKontrol()
    res.json({ basarili: true, ...durum })
})

// Serbest soru sor
// POST /api/ai/sor
// Body: { "soru": "En çok hangi şehirde satış yapıyoruz?" }
router.post('/sor', async (req, res) => {
    try {
        const { soru } = req.body
        if (!soru) {
            return res.status(400).json({
                basarili: false,
                hata: 'Soru alanı boş olamaz'
            })
        }

        // Veritabanından özet veri çek
        const satisOzeti = await db.aylikSatisOzeti()
        const enCokSatan = await db.enCokSatanUrunler(5)
        const sehirler = await db.sehreGoreSatislar()

        const prompt = `
Sen bir ERP sistemi analistisin. Türkçe cevap ver. Kısa ve net ol.

Mevcut ERP verileri:
- Aylık satış özeti: ${JSON.stringify(satisOzeti)}
- En çok satan 5 ürün: ${JSON.stringify(enCokSatan)}
- Şehre göre satışlar: ${JSON.stringify(sehirler)}

Kullanıcı sorusu: ${soru}

Cevap:
`
        const cevap = await ollama.sor(prompt)
        res.json({ basarili: true, soru, cevap })
    } catch (hata) {
        res.status(500).json({ basarili: false, hata: hata.message })
    }
})

// Belirli bir tabloyu analiz ettir
// POST /api/ai/analiz
// Body: { "tablo": "satislar" }
router.post('/analiz', async (req, res) => {
    try {
        const { tablo } = req.body
        let veri

        const tablolar = {
            'satislar': () => db.satislariGetir(),
            'musteriler': () => db.musterileriGetir(),
            'urunler': () => db.urunleriGetir(),
            'personel': () => db.personelGetir()
        }

        if (!tablolar[tablo]) {
            return res.status(400).json({
                basarili: false,
                hata: `Geçerli tablolar: ${Object.keys(tablolar).join(', ')}`
            })
        }

        veri = await tablolar[tablo]()
        const analiz = await ollama.veriAnaliz(tablo, veri)

        res.json({ basarili: true, tablo, kayitSayisi: veri.length, analiz })
    } catch (hata) {
        res.status(500).json({ basarili: false, hata: hata.message })
    }
})

module.exports = router