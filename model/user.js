var mongoose = require('mongoose');

//Creating Mongoose Schema
var nameSchema = new mongoose.Schema({
    Firstname: String,
    Lastname: String,
    email: String,
    number: String,
    state: String,
    country: String,
    username: String,
    password: String,
    role: String,
    history: Array
});
var User = module.exports = mongoose.model("User", nameSchema);