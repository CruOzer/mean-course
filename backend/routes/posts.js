const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  const posts = [{
    id: "asdsdgdfkg",
    title: "First Server Side post",
    content: "Lorem Ipsum"
  }, {
    id: "sgmuioerdgh",
    title: "Second Server Side post",
    content: "Lorem Ipsum 2"
  }]
  res.status(200).json({
    message: 'Get successfully!',
    posts: posts
  });
});


router.post('/', (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added succesfully'
  });
});
module.exports = router;
