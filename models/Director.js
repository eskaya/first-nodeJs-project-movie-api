const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DirectorSchema = new Schema({
        name: {
            type: String,
            require: [true, '`{PATH}` alanı boş bırakılamaz']
        },
        surname: {
            type: String,
            require: [true, '`{PATH}` alanı boş bırakılamaz']
        },
        bio: String,
        createdAt: {
            type: String,
            default: Date.now()
        }
    },
    {
        versionKey: false
    });

module.exports = mongoose.model('director', DirectorSchema);
