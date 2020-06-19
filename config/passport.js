const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config()
const passport = require('passport');
const options = {
  jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_OR_KEY
}
module.exports = passport =>{
  passport.use(
    new JwtStrategy(options, async (payload, done)=>{
      try {
        let user = await User.findById(payload.sub)
        if(user) return done(null, user)
        return done(null,false)
      } catch (error) {
        done(error, false)
      }
      
    })
  )
}


