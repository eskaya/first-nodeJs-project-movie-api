const express = require('express');
const router = express.Router();
//Models
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {title: 'Express'});
});

router.post('/register', (req, res, next) => {
    const {username, password, email} = req.body;

    // şifreleme
    bcrypt.hash(password, 10).then((hash) => {

        const user = new User({
            username,
            password: hash,
            email
        });
        const promise = user.save();
        promise.then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json(err);
        });
    })
});

router.post('/authenticate', (req, res) => {
    const {username, password} = req.body;

    User.findOne({username}, (err, user) => {
        if (err)
            throw err;
        if (!user) {
            res.json({
                status: false,
                message: 'Authentication failed, user not found.'
            })
        } else {
            // 1.parametre --> kullanıcının girdiği parola
            // 2.parametre olarak --> database e var olan paralo
            bcrypt.compare(password, user.password).then((result) => { // burada result true- false döner
                    if (!result) {
                        res.json({
                            status: false,
                            message: 'Authentication failed, wrong password'
                        });
                    } else {
                        // token oluşturma
                        const payload = {
                            username
                        };
                        // 1.parametre olarak payload, 2.parametre olarak secret_key, 3.parametre olarak süre
                        const token = jwt.sign(payload, req.app.get('api_secret_key'), {
                            expiresIn: 720 //12 saat
                        });
                        res.json({
                            status: true,
                            token: token
                        });
                    }
                }
            )
        }
    })
})

module.exports = router;

