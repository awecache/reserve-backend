const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const moment = require('moment');
const { mysqlPool } = require('../database');
const { getUserWithIdAndPassQuery } = require('../queries');

const router = express.Router();

const TOKEN_SECRET = process.env.TOKEN_SECRET;
const LocalStrategy = require('passport-local').Strategy;

//helper function
const mkAuth = (passport) => {
  return (req, resp, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (null != err || !user) {
        resp.status(401);
        resp.type('application/json');
        resp.json({ error: err });
        return;
      }
      // attach user to the request object
      req.user = user;
      next();
    })(req, resp, next);
  };
};

// configure passport with a strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'username', passwordField: 'password' },
    async (user, password, done) => {
      // perform the authentication
      console.info(`LocalStrategy> username: ${user}, password: ${password}`);
      const conn = await mysqlPool.getConnection();
      try {
        const [result, _] = await conn.query(getUserWithIdAndPassQuery, [
          user,
          password
        ]);
        console.info('>>> result: ', result);
        if (result.length > 0)
          done(null, {
            username: result[0].user_id,
            // avatar: `https://i.pravatar.cc/400?u=${result[0].email}`,
            loginTime: new Date().toString()
          });
        else done('Incorrect login', false);
      } catch (e) {
        done(e, false);
      } finally {
        conn.release();
      }
    }
  )
);

const localStrategyAuth = mkAuth(passport);
router.use(passport.initialize());

router.post(
  '/login',
  // passport middleware to perform login
  // passport.authenticate('local', { session: false }),
  // authenticate with custom error handling
  localStrategyAuth,
  (req, res) => {
    // do something
    console.info(`user: `, req.user);
    // generate JWT token
    const timestamp = moment().unix();
    const token = jwt.sign(
      {
        sub: req.user.username,
        iss: 'reserve_app',
        iat: timestamp,
        //nbf: timestamp + 30,
        exp: timestamp + 60 * 10,
        data: {
          //   avatar: req.user.avatar,
          loginTime: req.user.loginTime
        }
      },
      TOKEN_SECRET
    );

    res.status(200);
    res.type('application/json');
    res.json({ message: `Login in at ${new Date()}`, token });
  }
);

module.exports = router;
