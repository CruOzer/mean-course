const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res, next) => {
  // Hash the password
  // The salt indicates how secure the password is.
  // However the higher the number the longer it takes.
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      return user.save()
    })
    .then(result => {
      res.status(201).json({
        message: 'User created',
        result: result
      });
    }).catch(err => {
      res.status(500).json({
        message: 'Invalid authentication credentials.'
      });
    });
}

exports.userLogin = (req, res, next) => {
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
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      res.status(401).json({
        message: 'Invalid authentication credentials.'
      });
    })
}
