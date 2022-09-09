const getUserByEmail = (email, database) => {
  for (let object in database) {
    if (database[object].email === email) {
      return database[object];
    }
  }
  return null;
}

const urlsForUser = (userId) => {
  const urls = {};
  for (object in urlDatabase) {
    if (urlDatabase[object].userID === userId) {
      urls[object] = urlDatabase[object];
    }
  }
  return urls;
}

const generateRandomString = () => {
  return Math.random().toString(36).slice(2,8);
}

module.exports = { getUserByEmail, urlsForUser, generateRandomString };