const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Load models
require('./models/Post');

// Load Routes
const posts = require('./routes/posts');

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
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

// Body-Parser Middleware
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/', (req, res) => {
  res.send('Hello from express');
});


app.use('/api/posts', posts);


module.exports = app;
