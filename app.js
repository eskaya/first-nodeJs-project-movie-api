const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//kullanıcı tarafından post edilen datayı yakalamakta kullanıcaz
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const movieRouter = require('./routes/movie');
const directorRouter = require('./routes/director');

const app = express();
app.use(cors());

//MongoDB Connection
const db = require('./helper/db')();

//verify-token
const verifyToken = require('./middleware/verify-token');

// Config
const config = require('./config');
//api-secret-key
app.set('api_secret_key', config.api_secret_key);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json()); //JSON tipinde gelecek verilerin kullanımı için
app.use(bodyParser.urlencoded({extended: true})); //encoded edilmiş olarak gelen dataların kullanımı için extended:true olarak kullanılmalı

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', verifyToken); // apinin altında çalışan her istekte middleware çalışsın
app.use('/api/movie', movieRouter);
app.use('/api/director', directorRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
