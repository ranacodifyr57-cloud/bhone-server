const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 100,
  validate: { xForwardedForHeader: false }
})
app.use('/api/', limiter)

app.use('/api/auth', require('./routes/auth'))
app.use('/api/contact', require('./routes/contact'))
app.use('/api/messages', require('./routes/messages'))
app.use('/api/projects', require('./routes/projects'))

app.get('/api/health', (req, res) => res.json({ status: 'OK', service: 'Bhone Enterprises API' }))

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected')
    const User = require('./models/User')
    const bcrypt = require('bcryptjs')
    await User.deleteMany({})
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)
    await User.create({
      email: process.env.ADMIN_EMAIL,
      password: hash,
      name: 'Muhammad Amir',
      role: 'admin'
    })
    console.log('✅ Admin user created')
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch(err => { console.error('❌ DB Error:', err.message); process.exit(1) })