const users = require('../data/users.js')

function checkExistsUserAccount(req, res, next) {
  const { username } = req.headers;
  const user = users.find((user) => user.username.toLowerCase() === username.toLowerCase());

  if (!!user) {
    req.user = user;
    return next();
  }
  return res.status(404).json({
    error: 'User does not exists'
  })
}

module.exports = checkExistsUserAccount; 