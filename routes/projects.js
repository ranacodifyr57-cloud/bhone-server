const router = require('express').Router()
const Project = require('../models/Project')
const authMiddleware = require('../middleware/auth')

// GET /api/projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 })
    res.json(projects)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/projects (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const project = await Project.create(req.body)
    res.status(201).json(project)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/projects/:id (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(project)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/projects/:id (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
