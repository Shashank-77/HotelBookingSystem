var mongoose = require('mongoose');

//Creating Mongoose Schema
var nameSchema = new mongoose.Schema({
    name: String,
    age: Number,
    number: String,
    gender: String,
    address: String,
    username: String,
    password: String,
});
var User = module.exports = mongoose.model("User", nameSchema);