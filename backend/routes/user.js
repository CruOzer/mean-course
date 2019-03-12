const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('users');
const jwt = require('jsonwebtoken');


router.post('/signup', (req, res, next) => {
  // Hash the password
  // The salt indicates how secure the password is.
  // However the higher the number the longer it takes.
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save().then(result => {
        res.status(201).json({
          message: 'User created',
          result: result
        });
      }).catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      })
    })
    .catch(err => console.log(err));
});


router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      // Does the user exist
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed. User does not exist'
        })
      }
      // Validate password
      fetchedUser = user
      return bcrypt.compare(req.body.password, user.password)
    })
    // Get result of comparison
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Auth failed. Password is not valid'
        })
      }
      // Authentication successful
      // Create webtoken
      const token = jwt.sign({
        email: fetchedUser.email,
        userId: fetchedUser._id
      }, process.env.PRIVATE_TOKEN, {
        expiresIn: '1h'
      });
      res.status(200).json({
        token: token
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Auth failed.' + err
      })
    })
});

module.exports = router;
