const users = require("../data/users");

function findIndexByUsername(username) {
  return users.findIndex((user) => {
    return user.username.toLowerCase() === username.toLowerCase();
  })
}

module.exports = findIndexByUsername