const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');
const validateLoginInput = require('../validation/login');

//user login via local strategy
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) return res.status(400).json(errors);
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      errors.email = 'email does not exist please signup';
      return res.status(404).json(errors);
    }
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      errors.password = 'password incorrect'
      return res.status(401).json(errors);
    }
    let token = jwt.sign(
      {
        iss: 'Yupher Inc', //or your name company name ....
        sub: user.id, // what you want to send in the payload to keep things simple I sent user id
      },
      process.env.SECRET_OR_KEY /* replace this with your secret key*/,
      {
        expiresIn: 604800 /* expires in 7 days (in seconds!!!!) or whatever you like*/,
      }
    );
    res.json({ success: true,user: user.id, token: `Bearer ${token}` });
  } catch (error) {
    res.status(500).json(error);
  }
});

//user login via google OAuth

//usere login via facebook OAuth

module.exports = router;
