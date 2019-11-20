const jwt = require('jsonwebtoken');
const User = require('../models/user');

/* POST login. */
exports.login = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error("We are not aware of this user.");
            error.statusCode = 403
            throw error;
        }

        user.comparePassword(password, (err, isMatch) => {
            if (err) { return res.status(500).json({ success: false, message: 'Invalid email or password' }); }
            if (isMatch) {
                const accessToken = jwt.sign({ _id: user._id, email: user.email },
                    global.gConfig.JWT_secret,
                    { expiresIn: global.gConfig.JWT_expiry });
                const refreshToken = jwt.sign({ _id: user._id },
                    global.gConfig.JWT_secret,
                    { expiresIn: '15m' });
                return res.status(200).json({
                    success: true, message: 'Success! You are logged in.',
                    data: { accessToken, refreshToken }
                });
            }
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Create a new account.
 */
exports.signup = async (req, res, next) => {
    try {
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            profile: { ...req.body }
        });
        User.findOne({ email: req.body.email }, (err, existingUser) => {
            if (err) { throw new Error("Error in Register. Please try again later.") }
            if (existingUser) {
                return res.status(500).json({ success: false, message: 'Account with that email address already exists.' });
            }
            user.save((err) => {
                if (err) { throw new Error("Error in saving user data. Please try again later.") }
                return res.status(200).json({ success: true, message: 'user register successfully' });
            });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};