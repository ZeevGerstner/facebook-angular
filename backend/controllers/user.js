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
  const val = req.query.search
  const users = await User.find({"userName":{$regex: val}})
  .select('userName')
  console.log(users)
  res.status(200).json({
    users
  })
  
}