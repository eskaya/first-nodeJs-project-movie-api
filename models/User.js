const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minLength: [6, '{PATH} en az 6 karakter olmalı']
        },
        email: {
            type: String,
            required: true,
            unique: [true, '{PATH} alanı unique olmalı']
        }
    },
    {
        versionKey: false
    });

module.exports = mongoose.model('user', UserSchema);
