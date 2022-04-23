const express = require('express');
const router = express.Router();
const Director = require('../models/Director');
const mongoose = require("mongoose");

/* List Director */
router.get('/', (req, res, next) => {
    const promise = Director.aggregate([
        {
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies'
            }
        },
        {
            $unwind: {
                path: '$movies',
                preserveNullAndEmptyArrays: true //herhangi bir filmle eşleşmeyen dataları da getir
            }
        },
        {
            $group: {
                _id: {
                    _id:'$_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$movies'
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                bio: '$_id.bio',
                movies: '$movies'
            }
        }
    ]);
    promise.then((director) => {
        if (!director)
            next({message: 'The director not found'});
        res.json(director);
    }).catch((err) => {
        res.json(err)
    });
})

/* Create Director */
router.post('/create', (req, res) => {
    const director = new Director(req.body);
    const promise = director.save();
    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err)
    });
});

/* Get Detail */
router.get('/detail/:_id', (req, res, next) => {
    const promise = Director.aggregate([
        {
            $match: {
                '_id': mongoose.Types.ObjectId(req.params._id)
            }
        },
        {
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies'
            }
        },
        {
            $unwind: {
                path: '$movies',
                preserveNullAndEmptyArrays: true //herhangi bir filmle eşleşmeyen dataları da getir
            }
        },
        {
            $group: {
                _id: {
                    _id:'$_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$movies'
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                bio: '$_id.bio',
                movies: '$movies'
            }
        }
    ]);
    promise.then((director) => {
        if (!director)
            next({message: 'The director not found'});
        res.json(director);
    }).catch((err) => {
        res.json(err);
    });
});

/* Update Director */
router.patch('/update/:_id', (req, res, next) => {
    const promise = Director.findByIdAndUpdate(
        req.params._id,
        req.body,
        {
            new: true
        }
    );
    promise.then((data) => {
        if (!req.body)
            next({message: 'body empty'});
        res.json(data)
    }).catch((err) => {
        res.json(err)
    });
});

module.exports = router;


