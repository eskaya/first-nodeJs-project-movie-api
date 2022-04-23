const mongoose = require('mongoose');
const {version} = require("nodemon/lib/utils");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
        title: {
            type: String,
            required: true
        },
        category: {
            type: String
        },
        country: {
            type: String
        },
        year: {
            type: Number
        },
        imdb_score: {
            type: Number
        },
        createdAt: {
            type: String,
            default: Date.now()
        },
        director_id: {
            type: Schema.Types.ObjectId
        }
    },
    {
        versionKey: false
    });

module.exports = mongoose.model('movie', MovieSchema);
