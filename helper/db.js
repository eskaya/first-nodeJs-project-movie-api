const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb://localhost/movie-app');

    mongoose.connection.on('open', () => {
        console.log('MongoDB: Connection..');
    });

    mongoose.connection.on('error', (err) => {
        console.log('MongoDB:Error', err);
    });

    mongoose.Promise = global.Promise;
}
