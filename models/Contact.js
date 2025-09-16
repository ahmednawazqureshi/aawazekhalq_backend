const { Schema, model } = require('mongoose')

const ContactSchema = new Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = model('Contact', ContactSchema)
