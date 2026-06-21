const express = require('express')
const router = express.Router()
const raporService = require('../services/raporService')
const db = require('../services/dbService')

// Tüm raporları listele
// GET /api/raporlar
router.get('/', (req, res) => {
    const raporlar = raporService.raporListesi()
    res.json({
        basarili: true,
        toplam: raporlar.length,
        raporlar
    })
})

// Tüm ERP fonksiyonlarını listele
// GET /api/raporlar/fonksiyonlar
router.get('/fonksiyonlar', (req, res) => {
    const fonksiyonlar = raporService.fonksiyonListesi()
    res.json({
        basarili: true,
        toplam: fonksiyonlar.length,
        fonksiyonlar
    })
})

// Sabit rapor çalıştır
// GET /api/raporlar/R001
// GET /api/raporlar/R001?ai=true  ← AI analizi ekler
router.get('/:kod', async (req, res) => {
    try {
        const { kod } = req.params
        const aiAnaliz = req.query.ai === 'true'
        const sonuc = await raporService.sabitRaporCalistir(kod, aiAnaliz)
        res.json({ basarili: true, ...sonuc })
    } catch (hata) {
        res.status(404).json({ basarili: false, hata: hata.message })
    }
})

// ERP fonksiyonu çalıştır
// GET /api/raporlar/erp/F001
// GET /api/raporlar/erp/F001?ai=true
router.get('/erp/:kod', async (req, res) => {
    try {
        const { kod } = req.params
        const aiAnaliz = req.query.ai === 'true'
        const sonuc = await raporService.erpFonksiyonuCalistir(kod, aiAnaliz)
        res.json({ basarili: true, ...sonuc })
    } catch (hata) {
        res.status(404).json({ basarili: false, hata: hata.message })
    }
})

module.exports = router