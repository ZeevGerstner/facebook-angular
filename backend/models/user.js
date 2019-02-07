const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  followers: {
    type: [mongoose.Schema.Types.objectId],
    ref: 'User'
  },
  following: {
    type: [mongoose.Schema.Types.objectId],
    ref: 'User'
  }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
