const express = require('express');

const posts = require('./routes/posts');

const app = express();

app.use((req, res, next) => {
  console.log('First middleware');
  next();
});


app.get('/', (req, res) => {
  res.send('Hello from express');
});


app.use('/api/posts', posts);


module.exports = app;
