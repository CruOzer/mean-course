const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const postsController = require('../controllers/posts');

// Get all posts
router.get('/', postsController.getPosts);

// Get one post
router.get('/:id', postsController.getPost);

// Add a post
router.post('/', checkAuth, extractFile, postsController.addPost);

// Delete post
router.delete('/:id', checkAuth, postsController.deletePost);

// Update post
router.put('/:id', checkAuth, extractFile, postsController.updatePost);

module.exports = router;
