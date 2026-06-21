const { Pool } = require('pg')

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})

const db = {
    // Bağlantı testi
    async baglantiTest() {
        const sonuc = await pool.query('SELECT NOW() as zaman')
        return sonuc.rows[0]
    },

    // Tüm müşterileri getir
    async musterileriGetir() {
        const sonuc = await pool.query(
            'SELECT * FROM musteriler ORDER BY olusturma_tarihi DESC'
        )
        return sonuc.rows
    },

    // Tüm ürünleri getir
    async urunleriGetir() {
        const sonuc = await pool.query(
            'SELECT * FROM urunler ORDER BY kategori, ad'
        )
        return sonuc.rows
    },

    // Tüm satışları getir
    async satislariGetir() {
        const sonuc = await pool.query(`
      SELECT 
        s.id,
        m.ad as musteri_adi,
        m.sehir,
        u.ad as urun_adi,
        u.kategori,
        s.miktar,
        s.toplam_tutar,
        s.satis_tarihi,
        s.durum
      FROM satislar s
      JOIN musteriler m ON s.musteri_id = m.id
      JOIN urunler u ON s.urun_id = u.id
      ORDER BY s.satis_tarihi DESC
    `)
        return sonuc.rows
    },

    // Aylık satış özeti
    async aylikSatisOzeti() {
        const sonuc = await pool.query(`
      SELECT 
        TO_CHAR(satis_tarihi, 'YYYY-MM') as ay,
        COUNT(*) as satis_adedi,
        SUM(toplam_tutar) as toplam_ciro,
        AVG(toplam_tutar) as ortalama_satis
      FROM satislar
      GROUP BY TO_CHAR(satis_tarihi, 'YYYY-MM')
      ORDER BY ay DESC
    `)
        return sonuc.rows
    },

    // En çok satan ürünler
    async enCokSatanUrunler(limit = 5) {
        const sonuc = await pool.query(`
      SELECT 
        u.ad as urun_adi,
        u.kategori,
        SUM(s.miktar) as toplam_satis_adedi,
        SUM(s.toplam_tutar) as toplam_ciro
      FROM satislar s
      JOIN urunler u ON s.urun_id = u.id
      GROUP BY u.id, u.ad, u.kategori
      ORDER BY toplam_ciro DESC
      LIMIT $1
    `, [limit])
        return sonuc.rows
    },

    // Şehre göre satışlar
    async sehreGoreSatislar() {
        const sonuc = await pool.query(`
      SELECT 
        m.sehir,
        COUNT(s.id) as satis_adedi,
        SUM(s.toplam_tutar) as toplam_ciro
      FROM satislar s
      JOIN musteriler m ON s.musteri_id = m.id
      GROUP BY m.sehir
      ORDER BY toplam_ciro DESC
    `)
        return sonuc.rows
    },

    // Personel listesi
    async personelGetir() {
        const sonuc = await pool.query(
            'SELECT * FROM personel ORDER BY departman, ad'
        )
        return sonuc.rows
    },

    // Departmana göre maaş özeti
    async departmanMaasOzeti() {
        const sonuc = await pool.query(`
      SELECT 
        departman,
        COUNT(*) as personel_sayisi,
        AVG(maas) as ortalama_maas,
        SUM(maas) as toplam_maas
      FROM personel
      GROUP BY departman
      ORDER BY toplam_maas DESC
    `)
        return sonuc.rows
    },

    // Düşük stoklu ürünler
    async dusukStokUrunler(esik = 30) {
        const sonuc = await pool.query(
            'SELECT * FROM urunler WHERE stok_miktari < $1 ORDER BY stok_miktari ASC',
            [esik]
        )
        return sonuc.rows
    },

    // Parametrik sorgu — rapor adına göre çalışır
    async parametrikRapor(raporAdi, parametreler = {}) {
        const sorgular = {
            'musteri-listesi': 'SELECT * FROM musteriler ORDER BY ad',
            'urun-listesi': 'SELECT * FROM urunler ORDER BY kategori',
            'satis-listesi': `
        SELECT s.*, m.ad as musteri, u.ad as urun
        FROM satislar s
        JOIN musteriler m ON s.musteri_id = m.id
        JOIN urunler u ON s.urun_id = u.id
        ORDER BY s.satis_tarihi DESC
      `,
            'stok-durumu': 'SELECT * FROM urunler ORDER BY stok_miktari ASC',
            'personel-listesi': 'SELECT * FROM personel ORDER BY departman'
        }

        const sorgu = sorgular[raporAdi]
        if (!sorgu) throw new Error(`"${raporAdi}" raporu bulunamadı`)

        const sonuc = await pool.query(sorgu)
        return sonuc.rows
    }
}

module.exports = db