const express = require('express')
const router = express.Router()

const checkAuth = require('../middelware/check-auth')
const extractFile = require('../middelware/file')

const PostsController = require('../controllers/posts')

router.get('', PostsController.getPosts)

router.get('/feed/:userId', PostsController.getPosts)

router.get('/:id', PostsController.getPost)

router.post(
  '',
  checkAuth,
  extractFile,
  PostsController.createPost
)
router.put('/like',checkAuth, PostsController.likePost)

router.put(
  '/:id',
  checkAuth,
  extractFile,
  PostsController.updatePost
)


router.delete('/:id', checkAuth, PostsController.deletePost)

module.exports = router
