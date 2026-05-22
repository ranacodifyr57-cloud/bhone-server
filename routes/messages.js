const router = require('express').Router()
const Message = require('../models/Message')
const authMiddleware = require('../middleware/auth')

// GET /api/messages (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 })
    res.json(messages)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/messages/:id (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// PATCH /api/messages/:id/read (mark as read)
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { read: true })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
