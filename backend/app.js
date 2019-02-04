const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

//POSTS ROUTES
const postsRoutes = require('./routes/posts')
const postsUrl = '/api/posts'

//USER ROUTES
const userRoutes = require('./routes/user')
const userUrl = '/api/user'

const app = express()

//connecting mongo
mongoose
  .connect(`mongodb://zeevgg:${process.env.MLAB_PW}@ds211275.mlab.com:11275/mean_db`)
  .then(() => console.log('connected to db'))
  .catch(() => console.log('connection failed'))

//parse body params
app.use(bodyParser.json())
//parse url
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/imgs', express.static(path.join('imgs')))

//handel cors
app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With,Content-Type,Accept, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  })
  next()
})

//using posts routes
app.use(postsUrl, postsRoutes)
//using user routes
app.use(userUrl, userRoutes)

module.exports = app
