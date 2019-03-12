const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('posts');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

// Allow just these file types
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg'
}
// Where to store the images and how the images are named
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type');
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

// Get all posts
router.get('/', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let fetchedPosts;
  // Build the query
  let postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery.then(documents => {
      fetchedPosts = documents;
      return Post.count();

    }).then(count => {
      res.status(200).json({
        message: 'Get successfully!',
        maxPosts: count,
        posts: fetchedPosts
      });
    })
    .catch(err => console.log(err));
});

// Get one post
router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json({
          message: 'Get successfully!',
          post: post
        });
      } else {
        res.status(404).json({
          message: "Post not found"
        });
      }
    })
    .catch(err => console.log(err));
});

// Add a post
router.post('/', checkAuth, multer({
  storage: storage
}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.id
  });
  console.log(post);
  post.save()
    .then(p => {
      res.status(201).json({
        message: 'Post added successfully.',
        post: {
          ...p,
          id: p._id
        }
      });
    })
    .catch((err) => console.log(err));
});


// Delete post
router.delete('/:id', checkAuth, (req, res) => {
  Post.deleteOne({
      _id: req.params.id,
      creator: req.userData.id
    })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: 'Post deleted successfully.'
        });
      } else {
        res.status(401).json({
          message: 'Not authorized.'
        });
      }
    })
    .catch(err => console.log(err));
});

// Update post
router.put('/:id', checkAuth, multer({
  storage: storage
}).single('image'), (req, res) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    _id: req.params.id,
    creator: req.userData.id
  });
  Post.updateOne({
      _id: req.params.id,
      creator: req.userData.id
    }, post)
    .then(result => {
      if (result.nModified > 0) {
        res.status(200).json({
          message: 'Post updated successfully.'
        });
      } else {
        res.status(401).json({
          message: 'Not authorized.'
        });
      }
    })
    .catch(err => console.log(err));
});
module.exports = router;
