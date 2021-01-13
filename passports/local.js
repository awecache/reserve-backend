const { mysqlPool } = require('../database');
const { getUserWithIdAndPassQuery } = require('../queries');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//helper function
const mkAuth = (passport) => {
  return (req, resp, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err || !user) {
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

module.exports = localStrategyAuth;
