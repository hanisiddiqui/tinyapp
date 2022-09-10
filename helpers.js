const getUserByEmail = (email, database) => {
  for (let object in database) {
    if (database[object].email === email) {
      return database[object];
    }
  }
}

const urlsForUser = (userId, database) => {
  let urls = {};
  for (object in database) {
    if (database[object].userID === userId) {
      urls[object] = database[object];
    }
  }
  return urls;
}

const generateRandomString = () => {
  return Math.random().toString(36).slice(2,8);
}

module.exports = { getUserByEmail, urlsForUser, generateRandomString };