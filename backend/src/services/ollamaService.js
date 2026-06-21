const axios = require('axios')

const ollamaService = {
    // Ollama'ya soru sor
    async sor(prompt) {
        const response = await axios.post(
            `${process.env.OLLAMA_URL}/api/generate`,
            {
                model: process.env.OLLAMA_MODEL,
                prompt: prompt,
                stream: false
            },
            { timeout: 120000 }
        )
        return response.data.response
    },

    // Veriyi analiz ettir
    async veriAnaliz(raporAdi, veri) {
        const prompt = `
Sen bir ERP sistemi analistisin. Türkçe cevap ver.
Rapor adı: ${raporAdi}
Aşağıdaki veriyi analiz et ve kısa bir özet sun:

${JSON.stringify(veri, null, 2)}

Lütfen şunları belirt:
- Genel durum değerlendirmesi
- Öne çıkan 3 önemli bulgu
- 1-2 öneri
`
        return await this.sor(prompt)
    },

    // Ollama çalışıyor mu kontrol et
    async saglikKontrol() {
        try {
            const response = await axios.get(
                `${process.env.OLLAMA_URL}/api/tags`,
                { timeout: 5000 }
            )
            return {
                durum: 'aktif',
                modeller: response.data.models?.map(m => m.name) || []
            }
        } catch (hata) {
            return { durum: 'pasif', hata: hata.message }
        }
    }
}

module.exports = ollamaService