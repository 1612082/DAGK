var express = require('express');
var router = express.Router();
var User = require('../db').User;
var jwt = require('jsonwebtoken');

/* Create a user */
const createUser = async ({ email, password }) => {
  return await User.create({ email, password });
};

/* Get a list of all users */
const usersList = async () => {
  return await User.findAll();
};

/* Get a user */
const getUser = async obj => {
  return await User.findOne({
      where: obj
  });
};

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
// });

/* GET all users */
router.get('/', function (req, res) {
  usersList().then(user => res.json(user));
});

/* POST register */
router.post('/user/register', function (req, res, next) {
  const { email, password } = req.body;
  createUser({ email, password }).then(user => res.json({
    user, msg: 'Account has been registered!'
  })
  );
})

/* POST login */
router.post('/user/login', async function (req, res, next) {
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
