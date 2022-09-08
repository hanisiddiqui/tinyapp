const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');

let longURL = "";


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const generateRandomString = () => {
  return Math.random().toString(36).slice(2,8);
}

const getUserByEmail = (email) => {
  for (let object in users) {
    if (users[object].email === email) {
      return users[object];
    }
  }
  return null;
}

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/login", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  res.render("urls_login", { user });
});

app.get("/register", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  res.render("urls_reg", { user });
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  const templateVars = { urls: urlDatabase, user };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  res.render("urls_new", { user });
});

app.get("/urls/:id", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user };
  res.render("urls_show", templateVars);
});

app.post("/register", (req, res) => {
  if(!req.body.email || !req.body.password) {
    // res.send('Error: 400');
    return res.status(400).send("Error: email and password cannot be empty.");
  } 
  if (getUserByEmail(req.body.email) !== null) {
    // res.send('Error: 400');
    return res.status(400).send("Error: Email already exists.");
  }
  userId = generateRandomString();
  users[userId] = {
    id: userId,
    email: req.body.email,
    password: req.body.password,
  };

  res.cookie("user_id", userId);
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  if (getUserByEmail(req.body.email) === null || 
  req.body.password !== getUserByEmail(req.body.email).password) {
    return res.status(403).send("Error: Incorrect email or password.")
  }
  console.log(users);
  const userId = getUserByEmail(req.body.email).id;
  res.cookie("user_id", userId);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  longURL = req.body['longURL'];
  const shortURL = req.params.id;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  longURL = req.body['longURL'];
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`); // Respond with 'Ok' (we will replace this)
});

app.get("/u/:id", (req, res) => {
  res.redirect(longURL);
});