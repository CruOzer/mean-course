const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    }
});

mongoose.model('posts', PostSchema,);
