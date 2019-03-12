const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.plugin(uniqueValidator);

mongoose.model('users', UserSchema, );
