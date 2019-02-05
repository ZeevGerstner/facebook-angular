const Post = require('../models/post')

exports.getPosts = async (req, res, next) => {
  const pageSize = +req.query.pageSize
  const page = +req.query.page
  const postQuery = Post.find()
  if (pageSize && page) {
    postQuery.skip(pageSize * (page - 1)).limit(pageSize)
  }
  try {
    const [posts, maxPosts] = await Promise.all([postQuery, Post.count()])
    res.status(200).json({
      message: 'posts fetched!',
      posts,
      maxPosts
    })
  } catch (err) {
    res.status(500).json({
      message: 'Fetching posts failed'
    })
  }
}

exports.createPost = async (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}`
  const post = new Post({
    content: req.body.content,
    imgPath: `${url}/imgs/${req.file.filename}`,
    creator: req.userData.userId
  })
  try {
    const newPost = await post.save()
    res.status(201).json({
      message: 'Post added',
      post: {
        ...newPost,
        id: newPost._id
      }
    })
  } catch (err) {
    res.status(500).json({
      message: 'Failed to Create post'
    })
  }
}

exports.getPost = async (req, res, next) => {
  const postId = req.params.id
  try {
    const post = await Post.findById(postId)
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({
        message: 'post not found!'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: 'Fetching post failed'
    })
  }
}

exports.updatePost = async (req, res, next) => {
  let imgPath = req.body.imgPath
  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}`
    imgPath = `${url}/imgs/${req.file.filename}`
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imgPath,
    creator: req.userData.userId
  })
  const postId = req.params.id
  const creator = req.userData.userId
  try {
    const isUpdated = await Post.updateOne({ _id: postId, creator }, post)
    if (isUpdated.n > 0) {
      res.status(200).json({
        message: 'post update !'
      })
    } else {
      res.status(401).json({
        message: 'Not authorize!'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: `Couldn't update the post`
    })
  }
}

exports.deletePost = async (req, res, next) => {
  const postId = req.params.id
  const creator = req.userData.userId
  try {
    const isDeleted = await Post.deleteOne({ _id: postId, creator })
    if (isDeleted.n > 0) {
      res.status(200).json({
        message: 'post deleted'
      })
    } else {
      res.status(401).json({
        message: 'Not authorize!'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: 'Deleting posts failed'
    })
  }
}
