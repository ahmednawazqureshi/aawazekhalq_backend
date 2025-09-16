const { Schema, model } = require('mongoose')

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  date: Date,
  location: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = model('Event', EventSchema)
