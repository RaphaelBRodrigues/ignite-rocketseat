function findByUsername(username, users) {
  const selectedUser = users.find((user) => {
    return user.username.toLowerCase() === username.toLowerCase()
  });

  return selectedUser;
}

module.exports = findByUsername;