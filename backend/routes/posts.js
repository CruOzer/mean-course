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
router.post('/', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save()
    .then(p => {
      res.status(201).json({
        message: 'Post added successfully',
        postId: p._id
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
router.put('/:id', (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    _id: req.body.id
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
