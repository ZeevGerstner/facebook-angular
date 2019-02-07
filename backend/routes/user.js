const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user')

router.get('/', UserController.getUsers)

router.put('/update', UserController.updateUser)

router.post('/signup', UserController.createUser)

router.post('/login', UserController.userLogin)


module.exports = router
