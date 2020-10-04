const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// User models
const User = require("../../models/User");

// Just to see list of users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ date: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route      POST api/users
// @desc       Register user
// @access     Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("userName", "Username is required")
      .not()
      .isEmpty()
      .isLength({ min: 2 })
      .withMessage("Username must be atleast 2 letters long")
      .isLength({ max: 16 })
      .withMessage("Username must be within 16 characters"),
    check("email", "please include a valid email").isEmail(),
    check(
      "password",
      "please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, userName, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({
        email
      });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        userName,
        email,
        password
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        // Experation
        { expiresIn: 360000 },
        // Error
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      // Server error
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
