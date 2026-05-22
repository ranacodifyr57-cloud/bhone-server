const router = require('express').Router()
const nodemailer = require('nodemailer')
const Message = require('../models/Message')

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, service, budget, message } = req.body
    if (!name || !email || !message) 
      return res.status(400).json({ error: 'Missing required fields' })

    // Save to database
    const msg = await Message.create({ name, email, service, budget, message })

    // Try email separately so it does not crash the whole request
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        })
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `New message from ${name} — Bhone Enterprises`,
          html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Service:</strong> ${service || 'Not specified'}</p>
            <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
            <p><strong>Message:</strong><br>${message}</p>
          `
        })
      }
    } catch (emailErr) {
      console.log('Email skipped:', emailErr.message)
    }

    res.status(201).json({ success: true, id: msg._id })

  } catch (err) {
    console.error('Contact error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router