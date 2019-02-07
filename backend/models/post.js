const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  imgPath: {
    type: String,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date
  }
})

module.exports = mongoose.model('Post', postSchema)
