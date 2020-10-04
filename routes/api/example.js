// This is a generic layout created by Robert Hartley

// Dependencies go here
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// Calling in from Schema
const Product = require("../../models/Product");

// Getting all data from Schema
router.get("/", async (req, res) => {
  try {
    const users = await Product.find().sort({ date: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POSTING SCHEMA
// EDITING SCHEMA
// UPDATING SCHEMA
// DELETING SCHEMA


module.exports = router;