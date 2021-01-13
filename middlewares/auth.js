const jwt = require('jsonwebtoken');

const TOKEN_SECRET = process.env.TOKEN_SECRET;

const auth = (req, resp, next) => {
  // check if the request has Authorization header
  const auth = req.get('Authorization');
  if (null == auth) {
    resp.status(403);
    resp.json({ message: 'Missing Authorization header' });
    return;
  }
  // Bearer authorization
  // Bearer <token>
  const terms = auth.split(' ');

  if (
    terms.length > 2 ||
    (terms.length === 2 && terms[0].trim().toLowerCase() !== 'bearer')
  ) {
    resp.status(403);
    resp.json({ message: 'Incorrect Authorization' });
    return;
  }

  let token = terms[0];
  if (terms.length === 2) {
    token = terms[1];
  }

  try {
    // verify token
    const verified = jwt.verify(token, TOKEN_SECRET);
    console.info(`Verified token: `, verified);
    req.token = verified;
    next();
  } catch (e) {
    resp.status(403);
    resp.json({ message: 'Incorrect token', error: e });
    return;
  }
};

module.exports = auth;
