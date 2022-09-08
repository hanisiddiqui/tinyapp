const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const userID = getUserByEmail("user@example.com", testUsers).id;
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert(expectedUserID === userID, `${JSON.stringify(userID)} should equal ${expectedUserID}`);
  });

  it('should return null', function() {
    const user = getUserByEmail("user1223@example.com", testUsers);
    const expectedUserID = null;
    // Write your assert statement here
    assert(expectedUserID === user, `${JSON.stringify(user)} should equal ${expectedUserID}`);
  });
});