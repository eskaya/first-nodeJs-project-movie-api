const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const mongoose = require('mongoose');

/* Get movie list */
router.get('/', (req, res) => {
    /* Movie.find({}, (err,data) => {
         res.json(data);
     })
     */

    const promise = Movie.aggregate([
        {
            $lookup: {
                from: 'directors',
                localField: 'director_id',
                foreignField: '_id',
                as: 'director'
            }
        },
        {
            $unwind:{
                path: '$director',
                preserveNullAndEmptyArrays: true
            }
        }
    ]);
    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

router.post('/', (req, res, next) => {
    /*const {title, imdb_score, category, year} = req.body;
    const movie = new Movie({
        title: title,
        imdb_score: imdb_score,
        category: category,
        year: year
    });
     */
    /*
movie.save((err, data) => {
    if(err)
        res.json(err);
    res.json(data);
});
 */

    const movie = new Movie(req.body);
    const promise = movie.save();
    promise.then((data) => {
        res.json({status: 1});
    }).catch((err) => {
        res.json(err);
    });
});

router.get('/:title', (req, res) => {
    /* Movie.findOne({title: req.params.title}, (err,data) => {
        if(err) res.json(err);
        res.json(data);
    }); */
    const promise = Movie.findOne({title: req.params.title});
    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

router.get('/detail/:_id', (req, res, next) => {
    const promise = Movie.aggregate([
        {
            $match: {
                '_id': mongoose.Types.ObjectId(req.params._id)
            }
        },
        {
            $lookup: {
                from: 'directors',
                localField: 'director_id',
                foreignField: '_id',
                as: 'director'
            }
        },
        {
            $unwind:{
                path: '$director',
                preserveNullAndEmptyArrays: true
            }
        }
    ]);
    promise.then((movie) => {
        if (!movie)
            next({message: 'The movie not found'})
        res.json(movie);
    }).catch((err) => {
        res.json(err);
    });
});

router.patch('/update/:_id', (req, res) => {
    const promise = Movie.findByIdAndUpdate(
        req.params._id,
        req.body,
        {
            new: true //güncelleme sonrası güncel datanın gösterilmesi için kullanışlır
        }
    );
    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

router.delete('/delete/:_id', (req, res) => {
    const promise = Movie.findByIdAndDelete(req.params._id);
    promise.then((data) => {
        res.json({status: 1});
    }).catch((err) => {
        res.json(err);
    });
});

router.get('/sort', (req, res, next) => {
    const promise = Movie.aggregate([
        {
            $sort: {imdb_score: -1}
        },
        {
            $limit: 10
        }
    ]);
    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

router.get('/:start_year/:end_year', (req,res,next) => {
    const {start_year, end_year} = req.params;
    const promise = Movie.find(
        {
            // $gte --> büyük veya eşit
            //$lte --> küçük veya eşit
            year:{ '$gte':  parseInt(start_year), '$lte':  parseInt(end_year)}
        }
    );
    promise.then((data) => {
        res.json(data)
    }).catch((err) => {
        res.json(err)
    });
});

module.exports = router;
