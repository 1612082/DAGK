var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var passport = require('passport');
var User = require('../db').User;

/* Get a user */
const getUser = async obj => {
    return await User.findOne({
        where: obj
    });
};

// router.post('/user/login', function (req, res, next) {
//     passport.authenticate('local', { session: false }, (err, user, info) => {
//         user = req.body;
//         console.log(err);
//         if (err || !user) {
//             console.log(user);
//             return res.status(400).json({
//                 message: 'something went wrong',
//                 user: user
//             });
//         }
//         req.login(user, { session: false }, (err) => {
//             if (err) {
//                 res.send(err);
//             }

//             const token = jwt.sign(user, '1612175');
//             return res.json({ user, token });
//         });
//     })(req, res);
// });

router.post('/login', async function (req, res, next) {
    const { email, password } = req.body;
    if (email && password) {
        var user = await getUser({ email });
        if (!user) {
            res.status(401).json({ msg: 'No user found', user });
        }
        if (user.password === password) {
            var payload = { email: user.email };
            var token = jwt.sign({user: payload}, '1612175');
            return res.json({ user, token });
        } else {
            res.status(401).json({ msg: 'Wrong password' });
        }
    } else {
        res.status(401).json({msg: 'No email or password'});
    }
});

module.exports = router;