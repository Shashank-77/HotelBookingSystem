var mongoose = require('mongoose');

//Creating Mongoose Schema
var hotelSchema = new mongoose.Schema({
    username: String,
    name: String,
    Address: String,
    Rooms: Array,
    Contacts: Array,
    images: Array,
    Guarantees: Array,
    description: String,
});
var Hotel = module.exports = mongoose.model("Hotel", hotelSchema);
