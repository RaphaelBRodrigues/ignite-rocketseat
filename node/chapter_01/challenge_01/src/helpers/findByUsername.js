const users = require("../data/users");

function findByUsername(username) {
  const selectedUser = users.find((user) => {
    return user.username.toLowerCase() === username.toLowerCase()
  });

  return selectedUser;
}

module.exports = findByUsername;