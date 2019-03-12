const mongoose = require('mongoose');
const Post = mongoose.model('posts');

exports.getPosts = (req, res, next) => {
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
    .catch(err => res.status(500).json({
      message: 'Fetching posts failed.'
    }));
}

exports.getPost = (req, res, next) => {
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
    .catch(err => res.status(500).json({
      message: 'Fetching post failed.'
    }));
}


exports.updatePost = (req, res, next) => {
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
      if (result.n > 0) {
        res.status(200).json({
          message: 'Post updated successfully.'
        });
      } else {
        res.status(401).json({
          message: 'Not authorized.'
        });
      }
    })
    .catch(err => res.status(500).json({
      message: 'Updating the post failed.'
    }));
}



exports.deletePost = (req, res, next) => {
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
    .catch(err => res.status(500).json({
      message: 'Deleting a post failed.'
    }));
}


exports.addPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.id
  });
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
    .catch((err) => res.status(500).json({
      message: 'Creating a post failed.'
    }));
}
