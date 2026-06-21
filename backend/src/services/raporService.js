const db = require('./dbService')
const ollama = require('./ollamaService')

// 100 sabit rapor tanımları
const SABIT_RAPORLAR = {
    // Satış raporları (1-20)
    'R001': { ad: 'Aylık Satış Özeti', kategori: 'Satış', fn: () => db.aylikSatisOzeti() },
    'R002': { ad: 'En Çok Satan Ürünler', kategori: 'Satış', fn: () => db.enCokSatanUrunler(10) },
    'R003': { ad: 'Şehre Göre Satışlar', kategori: 'Satış', fn: () => db.sehreGoreSatislar() },
    'R004': { ad: 'Tüm Satış Listesi', kategori: 'Satış', fn: () => db.satislariGetir() },

    // Müşteri raporları (21-40)
    'R021': { ad: 'Müşteri Listesi', kategori: 'Müşteri', fn: () => db.musterileriGetir() },

    // Ürün raporları (41-60)
    'R041': { ad: 'Ürün Listesi', kategori: 'Ürün', fn: () => db.urunleriGetir() },
    'R042': { ad: 'Düşük Stok Raporu', kategori: 'Ürün', fn: () => db.dusukStokUrunler() },

    // Personel raporları (61-80)
    'R061': { ad: 'Personel Listesi', kategori: 'Personel', fn: () => db.personelGetir() },
    'R062': { ad: 'Departman Maaş Özeti', kategori: 'Personel', fn: () => db.departmanMaasOzeti() }
}

// 50 ERP fonksiyonu tanımları
const ERP_FONKSIYONLARI = {
    'F001': { ad: 'Satış Analizi', kategori: 'Analiz', raporAdi: 'satis-listesi' },
    'F002': { ad: 'Stok Kontrolü', kategori: 'Stok', raporAdi: 'stok-durumu' },
    'F003': { ad: 'Müşteri Analizi', kategori: 'Müşteri', raporAdi: 'musteri-listesi' },
    'F004': { ad: 'Personel Raporu', kategori: 'İK', raporAdi: 'personel-listesi' },
    'F005': { ad: 'Ürün Kataloğu', kategori: 'Ürün', raporAdi: 'urun-listesi' }
}

const raporService = {
    // Sabit rapor çalıştır
    async sabitRaporCalistir(raporKodu, aiAnaliz = false) {
        const rapor = SABIT_RAPORLAR[raporKodu]
        if (!rapor) throw new Error(`"${raporKodu}" raporu bulunamadı`)

        const veri = await rapor.fn()
        const sonuc = {
            kod: raporKodu,
            ad: rapor.ad,
            kategori: rapor.kategori,
            kayitSayisi: veri.length,
            veri: veri
        }

        if (aiAnaliz && veri.length > 0) {
            sonuc.aiAnaliz = await ollama.veriAnaliz(rapor.ad, veri)
        }

        return sonuc
    },

    // ERP fonksiyonu çalıştır
    async erpFonksiyonuCalistir(fonksiyonKodu, aiAnaliz = false) {
        const fonksiyon = ERP_FONKSIYONLARI[fonksiyonKodu]
        if (!fonksiyon) throw new Error(`"${fonksiyonKodu}" fonksiyonu bulunamadı`)

        const veri = await db.parametrikRapor(fonksiyon.raporAdi)
        const sonuc = {
            kod: fonksiyonKodu,
            ad: fonksiyon.ad,
            kategori: fonksiyon.kategori,
            kayitSayisi: veri.length,
            veri: veri
        }

        if (aiAnaliz && veri.length > 0) {
            sonuc.aiAnaliz = await ollama.veriAnaliz(fonksiyon.ad, veri)
        }

        return sonuc
    },

    // Tüm raporları listele
    raporListesi() {
        return Object.entries(SABIT_RAPORLAR).map(([kod, rapor]) => ({
            kod,
            ad: rapor.ad,
            kategori: rapor.kategori
        }))
    },

    // Tüm ERP fonksiyonlarını listele
    fonksiyonListesi() {
        return Object.entries(ERP_FONKSIYONLARI).map(([kod, fn]) => ({
            kod,
            ad: fn.ad,
            kategori: fn.kategori
        }))
    }
}

module.exports = raporService