var express = require('express');
var router = express.Router();
const authRouter = require('./auth');
const userRouter = require('./user');

router.use('/auth', authRouter);
router.use('/user', userRouter);

router.get('/', function (req, res, next) {
    res.render('index', { title: 'API' });
});

module.exports = router;