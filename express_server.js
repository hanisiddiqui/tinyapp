const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
const { getUserByEmail, urlsForUser, generateRandomString } = require("./helpers.js");


app.set("view engine", "ejs");

const urlDatabase = {};
const users = {};

app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1'],

  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.get("/login", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls");
  }

  const userId = req.session.user_id;
  const user = users[userId];

  res.render("urls_login", { user });
});

app.get("/register", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls");
  }

  const userId = req.session.user_id;
  const user = users[userId];

  res.render("urls_reg", { user });
});

app.get("/", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls");
  } 
  else {
    res.redirect("/login");
  }
});

app.get("/u/:id", (req, res) => {
  if (urlDatabase[req.params.id]) {
    return res.redirect(urlDatabase[req.params.id].longURL);
  }
  else {
    res.send('Error: invalid short url');
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    return res.send(`Error: Please <a href="/login">Login</a>`);
  }

  const urls = urlsForUser(req.session.user_id, urlDatabase);
  const userId = req.session.user_id;
  const user = users[userId];
  const templateVars = { urls, user };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }

  const userId = req.session.user_id;
  const user = users[userId];

  res.render("urls_new", { user });
});

app.get("/urls/:id", (req, res) => {
  if (!req.session.user_id) {
    return res.send("Error: not logged in");
  } 
  if (!(req.params.id in urlDatabase)) {
    return res.send("Short URL doesn't exist");
  } 
  if (req.session.user_id !== urlDatabase[req.params.id].userID) {
    return res.send("Error: Do not own this URL");
  } 

  const userId = req.session.user_id;
  const user = users[userId];
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user };

  res.render("urls_show", templateVars);
});

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Error: email and password fields cannot be empty.");
  } 
  if (getUserByEmail(req.body.email, users)) {
    return res.status(400).send("Error: Email already exists.");
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  userId = generateRandomString();
  users[userId] = {
    id: userId,
    email: req.body.email,
    password: hashedPassword,
  };

  req.session.user_id = userId;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  if (!getUserByEmail(req.body.email, users) || 
  !bcrypt.compareSync(req.body.password, getUserByEmail(req.body.email, users).password)) {
    return res.status(403).send("Error: Incorrect email or password.")
  }

  const userId = getUserByEmail(req.body.email, users).id;

  req.session.user_id = userId;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  if (!(req.params.id in urlDatabase)) {
    return res.send("Error: URL does not exist");
  } else if (!req.session.user_id) {
    return res.send("Error: Not logged in");
  } else if (req.session.user_id !== urlDatabase[req.params.id].userID) {
    return res.send("Error: you are not the owner of this URL");
  }

  const newURL = req.body['longURL'];
  const shortURL = req.params.id;

  urlDatabase[shortURL].longURL = newURL;

  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  if (!(req.params.id in urlDatabase)) {
    return res.send("Error: URL does not exist");
  } 
  if (!req.session.user_id) {
    return res.send("Error: Not logged in");
  } 
  if (req.session.user_id !== urlDatabase[req.params.id].userID) {
    return res.send("Error: you are not the owner of this URL");
  }

  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    return res.send("Not logged in, therefore cannot shorten URL");
  }

  const newURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL : newURL,
    userID: req.session.user_id,
  };

  res.redirect(`/urls/${shortURL}`); 
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
