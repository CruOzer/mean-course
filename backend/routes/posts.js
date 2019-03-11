const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('posts');

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

// Add a post
router.post('/', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save()
    .then(p => {
      console.log('Inside Save');
      res.status(201).json({
        message: 'Post added successfully',
        post: p
      });
    })
    .catch((err) => console.log(err));
});

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
module.exports = router;
