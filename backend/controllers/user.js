const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.createUser = async (req, res, next) => {
  const hash = await bcrypt.hash(req.body.password, 10)
  const user = new User({
    email: req.body.email,
    userName: req.body.userName,
    password: hash
  })
  try {
    const newUser = await user.save()
    res.status(201).json({
      message: 'user created',
      result: newUser
    })
  } catch (err) {
    res.status(500).json({
      message: 'Invalid authentication credentials!'
    })
  }
}

exports.userLogin = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user)
    return res.status(401).json({
      message: 'Auth failed'
    })
  const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)
  if (!isPasswordMatch)
    return res.status(401).json({
      message: 'Invalid authentication credentials!'
    })
  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id
    },
    process.env.JWT_KEY,
    { expiresIn: '1h' }
  )
  res.status(200).json({
    token,
    expiresIn: 3600,
    userId: user._id
  })
}
exports.getUsers = async (req, res, next) => {
  let term
  if (req.query.search) {
    term = req.query.search
    const users = await User.find({ userName: { $regex: term } })
      .select('userName')
    res.status(200).json({
      users
    })
  } else {
    term = req.query.userId
    const user = await User.find({ _id: term })
      .select('userName')
    res.status(200).json({
      user
    })
  }
}

exports.updateUser = async (req, res, next) => {
  let { followedByUserId, followingOnUserId } = req.body
  let action

  await User.findOne({ _id: followedByUserId },
    async (err, user) => {
    if (!user) return res.status(400).send({ message: 'User not found' })
    
    if (user.following.indexOf(followingOnUserId) === -1) action = '$push'
    else action = '$pull'
    
    try {
      await User.findByIdAndUpdate(followedByUserId, {
        [action]: { following: followingOnUserId }
      })
      res.status(200).json({
        message: 'user added to following list'
      })
    } catch (err) {
      res.status(500).send({ message: 'User not found' })
    }

    try {
      await User.findByIdAndUpdate(followingOnUserId, {
        [action]: { followers: followedByUserId }
      })
      res.status(200).json({
        message: 'user added to followers list'
      })
    } catch (err) {
      res.status(500).send({ message: 'User not found' })
    }
  })
}
