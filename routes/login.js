const express = require("express");
const router = express.Router();
const isAuth = require("../configs/authMiddleware.js");
const User = require("../models/user.js");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

router.get("/register", (req, res) => {
  res.render("register", { title: "Registration Page" });
});

router.post(
  "/register",
  [
    body("username").isLength({ min: 5, max: 25 }).escape().trim(),
    body("email").isEmail(),
    body("password")
      .isLength({ min: 8 })
      .custom((value, { req }) => {
        if (value !== req.body.password2) {
          throw new Error("Password confirmation does not match password");
        } else {
          return value;
        }
      })
      .escape(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      const userExists = await User.findOne({ email: req.body.email });
      if (!errors.isEmpty()) {
        res.render("register", { ...req.body, error: errors });
      } else if (userExists) {
        res.render("register", {
          ...req.body,
          error: "User with this email already exists",
        });
      } else {
        const { username, email, password } = req.body;
        const hash = await bcrypt.hash(password, 12);
        const user = await new User({
          username: username,
          email: email,
          salt: hash,
        });
        await user.save();
        res.redirect("/user/login");
      }
    } catch (err) {
      console.log(err);
    }
  }
);

router.get("/login", (req, res) => {
  res.render("login", { title: "Login Page" });
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.redirect("/user/register");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
