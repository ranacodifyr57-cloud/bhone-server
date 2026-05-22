const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  desc:     { type: String, required: true },
  category: { type: String, enum: ['web', 'mobile', 'design'], required: true },
  tech:     [{ type: String }],
  liveUrl:  { type: String },
  githubUrl:{ type: String },
  image:    { type: String },
  featured: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Project', projectSchema)
