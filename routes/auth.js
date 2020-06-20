const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

require('dotenv').config();
const User = require('../models/User');
const validateLoginInput = require('../validation/login');
const passport = require('passport');
const { jwtSign, googleAuth, facebookAuth } = require('../middleware/auth');

//user login via local strategy
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) return res.status(400).json(errors);
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      errors.email = 'email does not exist please signup';
      return res.status(404).json(errors);
    }
    let isMatch = await bcrypt.compare(password, user.local.password);
    if (!isMatch) {
      errors.password = 'password incorrect'
      return res.status(401).json(errors);
    }
    let token = jwtSign(user.id)
    res.json({ success: true,user: user.id, token: `Bearer ${token}` });
  } catch (error) {
    res.status(500).json(error);
  }
});

//user login via google OAuth
router.post('/google', googleAuth, async(req,res)=>{
  let token = jwtSign(req.user.id)
  res.json({user: req.user.id, token: `Bearer ${token}`})
})
//usere login via facebook OAuth
router.post('/facebook',facebookAuth, (req,res)=>{
  let token = jwtSign(req.user.id)
  res.json({user: req.user.id, token: `Bearer ${token}`})
})

module.exports = router;
