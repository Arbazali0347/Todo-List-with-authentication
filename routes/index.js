var express = require('express');
var router = express.Router();
const Task = require("../models/task")
const UserModel = require("../models/users");
const passport = require("passport");
const LocalStrategy = require('passport-local');
const { render, route } = require('../app');
passport.use(new LocalStrategy(UserModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home');
});

router.get('/profile', isLoggedIn, async function (req, res, next) {
  const tasks = await Task.find({ userId: req.user._id });
  const user = await UserModel.findOne({ username: req.session.passport.user })
  console.log(tasks.task)
  res.render('todo', { Name: user.username, tasks });
});

router.post("/add-task", isLoggedIn, async (req, res) => {
  const task = new Task({
    task: req.body.usertask,
    userId: req.user._id
  });
  await task.save();
  res.redirect("/profile");
});

router.post("/delete-task/:id", async (req, res) => {
  const taskId = req.params.id;
  console.log(taskId)
  try {
    await Task.findByIdAndDelete(taskId);
    res.redirect("/Profile"); // ya jahan tu dikhata hai list
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).send("Failed to delete task.");
  }
});

router.get('/login-page', function (req, res, next) {
  res.render('login', { Name: 'Express' });
});

router.get('/register-page', function (req, res, next) {
  res.render('register', { title: 'Express' });
});

router.post('/login', passport.authenticate('local', {
  // successRedirect: "/succe",
  failureRedirect: "/login-page"
}), function (req, res, next) {
  res.redirect("/profile");
});

router.post('/register', function (req, res, next) {
  const { name, password, email } = req.body;
  const userdata = new UserModel({
    username: name,
    email: email
  });
  UserModel.register(userdata, password)
    .then(function (registeredUser) {
      req.login(registeredUser, function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect("/profile");
      });
      req.session.userId = registeredUser._id;
    })
    .catch(function (err) {
      console.log("Registration Error:", err);
      res.status(400).send("Registration failed: " + err.message);
    });
});

router.get("/logout", function(req, res, next){
  req.logout(function(err){
    if (err){return (err)}
    res.redirect("/")
  });
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/")
}

module.exports = router;
