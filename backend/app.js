const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
// Load models
require('./models/Post');
require('./models/User');

// Load Routes
const posts = require('./routes/posts');
const user = require('./routes/user');

const app = express();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('MongoDB connected...');
  })
  .catch((err) => {
    console.log('MongoDB connection failure: ' + err);
  });

// Allow CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_URL);
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Body-Parser Middleware
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/images', express.static(path.join('backend/images')));
app.use('/', express.static(path.join(__dirname, 'angular')));

app.use('/api/posts', posts);
app.use('/api/user', user);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'angular', 'index.html'));
})
module.exports = app;
