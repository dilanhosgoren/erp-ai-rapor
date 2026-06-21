const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const raporRoutes = require('./src/routes/raporRoutes')
const aiRoutes = require('./src/routes/aiRoutes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'src/public')))

app.use('/api/raporlar', raporRoutes)
app.use('/api/ai', aiRoutes)

app.get('/health', (req, res) => {
    res.json({ durum: 'OK', zaman: new Date().toISOString() })
})

app.listen(PORT, () => {
    console.log(`✅ Backend ${PORT} portunda çalışıyor`)
    console.log(`📊 Raporlar: http://localhost:${PORT}/api/raporlar`)
    console.log(`🤖 AI: http://localhost:${PORT}/api/ai/durum`)
})