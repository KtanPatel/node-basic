var express = require('express');
var router = express.Router();
const user = require('../../controllers/user');
const { fileUpload } = require('../../middleware/fileUpload');
const { authentication, authorization } = require('../../middleware/auth');

// router.use(authentication); // secure all below routes?, uncomment this line

router.get('/profile', authentication, user.profile);
router.put(
    '/profile',
    authentication,
    fileUpload('profile', ["image"], [{ name: "image", maxCount: 1 }]),
    user.updateProfile
);

router.post('/list', authentication, authorization("admin"), user.list);

module.exports = router;