var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const _ = require('lodash');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');

var indexRouter = require('./routes/index');

// config variables
const config = require('./config/config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';

const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

// global config 
global.gConfig = finalConfig;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

// file storage location
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/images')
  },
  filename: (req, file, callback) => {
    callback(null, new Date().getTime() + '-' + file.originalname)
  },
})

// Image type filter
const fileFilter = (req, file, callback) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    callback(null, true)
  } else {
    callback(null, false)
  }
}

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

// image path url
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/', indexRouter);

// mongoose db connection
mongoose.connect(global.gConfig.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.info(`DB connected Successfully on ${global.gConfig.URI}`);
  })
  .catch(() => {
    console.error('DB connection failed');
  })

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
