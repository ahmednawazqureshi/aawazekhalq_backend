const { Schema, model } = require('mongoose')

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  shortDescription: String,
  description: String,
  images: [String],
  status: { type: String, default: 'In Progress' },
  startDate: Date,
  totalBudget: Number,
  location: String,
  volunteers: Number,
  createdAt: { type: Date, default: Date.now }
})

module.exports = model('Project', ProjectSchema)