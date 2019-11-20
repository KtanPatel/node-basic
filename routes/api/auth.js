var express = require('express');
var router = express.Router();
const auth = require('../../controllers/auth')

router.post('/login', auth.login);
router.post('/signup', auth.signup);

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express Auth' });
});

module.exports = router;