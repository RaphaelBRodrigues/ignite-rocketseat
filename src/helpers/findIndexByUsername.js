function findIndexByUsername(username, users) {
  return users.findIndex((user) => {
    return user.username.toLowerCase() === username.toLowerCase();
  })
}

module.exports = findIndexByUsername