const { Schema, model } = require('mongoose')

const AdminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'admin' }
})

module.exports = model('Admin', AdminSchema)
