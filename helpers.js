const getUserByEmail = (email, database) => {
  for (let object in database) {
    if (database[object].email === email) {
      return database[object];
    }
  }
  return null;
}

module.exports = { getUserByEmail };