var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

//mongoose.connect("mongodb://localhost:27017/task-manager");
mongoose.connect("mongodb+srv://shiva:shivaPassword@cluster0.qm2oy.mongodb.net/task-manager?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});


// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ');
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

require('./user');