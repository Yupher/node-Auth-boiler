const User = require('../models/User')
const passport = require('passport')
const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = {
  authenticate : passport.authenticate('jwt', {session: false}),
  googleAuth: passport.authenticate('google', {session: false}),
  facebookAuth:passport.authenticate('facebook', {session: false}),
  isAuthenticated: async (req, res, next)=>{
    try{
      let user = await User.findById(req.user.id)
      if(!user){
        return res.status(403).json({error: 'please login '})
      }
      next()
    }catch(e){
      res.status(500).json(e)
    }
  },
  jwtSign: id => jwt.sign(
  {
    iss: 'Yupher Inc', //or your name company name ....
    sub: id, // what you want to send in the payload to keep things simple I sent user id
  },
  process.env.SECRET_OR_KEY /* replace this with your secret key*/,
  {
    expiresIn: 604800 /* expires in 7 days (in seconds!!!!) or whatever you like*/,
  }
)
}