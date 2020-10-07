const mongoose = require('mongoose')

const userTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  }
}, {
  timestamps: true
})

const UserType = mongoose.model('User_type', userTypeSchema)

module.exports = UserType