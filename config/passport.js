const JwtStrategy = require('passport-jwt').Strategy;
const googleStrategy = require('passport-google-token').Strategy
const facebookStrategy = require('passport-facebook-token')
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
  //jwt strategy
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
  // google strategy
  passport.use('google', new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET
  }, async(accessToken, refreshToken, profile, done)=>{
    /* console.log(profile._json) */
    let{id, email, name} = profile._json
    try {
     let user = await User.findOne({googleID: id})
     if(user){
       return done(null, user)
     }
     let userEmail = await User.findOne({email})
     if(userEmail) return done(null, userEmail)
     let newUser = new User({
       method: 'google',
       googleID: id,
       email,
       username: name
     }) 
     await newUser.save()
     done(null,newUser)
   } catch (error) {
     done(error, false)
   }
  }))

  //facebook strategy
  passport.use('facebook', new facebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
  },async(accessToken, refreshToken, profile, done)=>{
    let{id, email, name} = profile._json
    try {
      let user = await User.findOne({facebookID: id})
      if(user){
        return done(null,user)
      }
      let userEmail = await User.findOne({email})
      if(userEmail){
        return done(null, userEmail)
      }
      let newUser = new User({
        method: 'facebook',
        facebookID: id,
        username: name,
        email
      })
      await newUser.save()
      done(null, newUser)
    } catch (error) {
      done(error, false)
    }
  }))
}


