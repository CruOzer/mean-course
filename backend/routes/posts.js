const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('posts');
const multer = require('multer');

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
  Post.find({})
    .then(posts => {
      res.status(200).json({
        message: 'Get successfully!',
        posts: posts
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
router.post('/', multer({
  storage: storage
}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });
  console.log(post);
  post.save()
    .then(p => {
      res.status(201).json({
        message: 'Post added successfully',
        post: {
          ...p,
          id: p._id
        }
      });
    })
    .catch((err) => console.log(err));
});


// Delete post
router.delete('/:id', (req, res) => {
  Post.deleteOne({
      _id: req.params.id
    })
    .then(() => {
      res.status(200).json({
        message: 'Post deleted successfully'
      });
    })
    .catch(err => console.log(err));
});

// Update post
router.put('/:id', multer({
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
    _id: req.params.id
  });
  Post.updateOne({
      _id: req.params.id
    }, post)
    .then(result => {
      res.status(200).json({
        message: 'Post updated successfully'
      });
    })
    .catch(err => console.log(err));
});
module.exports = router;
