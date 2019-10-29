const User = require('./db').User;
const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

//----------------------------------------------------------------------------------------
passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        //Save the information provided by the user to the the database
        const user = await UserModel.create({ email, password });
        //Send the user information to the next middleware
        return done(null, user);
    } catch (error) {
        done(error);
    }
}));

//Create a passport middleware to handle User login
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        //Find the user associated with the email provided by the user
        const user = await UserModel.findOne({ email });
        if (!user) {
            //If the user isn't found in the database, return a message
            return done(null, false, { message: 'User not found' });
        }
        //Validate password and make sure it matches with the corresponding hash stored in the database
        //If the passwords match, it returns a value of true.
        const validate = await user.isValidPassword(password);
        if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
        }
        //Send the user information to the next middleware
        return done(null, user, { message: 'Logged in Successfully' });
    } catch (error) {
        return done(error);
    }
}));


passport.use(new JWTStrategy({
    secretOrKey: '1612175',
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, cb) => {
    try {
        return cb(null, token.user);
    } catch (err) {
        cb(err);
    }
}));

passport.use(new JWTStrategy({
    //secret we used to sign our JWT
    secretOrKey: '1612175',
    //we expect the user to send the token as a query paramater with the name 'secret_token'
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
    try {
        //Pass the user details to the next middleware
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}));

//-----------------------------------------------------------------------------------
// passport.use(new LocalStrategy({
//     email: 'email',
//     password: 'password'
// },
//     function (email, password, cb) {
//         return UserModel.findOne({ email, password }).then(user => {
//             if (!user) {
//                 return cb(null, false, { messgae: 'Incorrect email or password!' });
//             }
//             return cb(null, user, { message: 'Logged in successfully' });
//         }).catch(err => cb(err));
//     }
// ));

// passport.use(new JWTStrategy({
//     jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//     secretOrKey: '1612175'
// },
//     function (jwtPayload, cb) {
//         console.log(jwtPayload);
//         return UserModel.findOneById(jwtPayload.email).then(user => {
//             return cb(null, user);
//         }).catch(err => {
//             return cb(err);
//         });
//     }
// ));