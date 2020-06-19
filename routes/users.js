const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
require('dotenv').config()
const User = require('../models/User')
const validateRegisterInput =require('../validation/register')
const { isAuthenticated, authenticate } = require('../middleware/auth')

// user sign up a user
router.post('/signup', async (req,res)=>{
  const {usernam, email, email2, password, password2} = req.body
  const {errors, isValid} = validateRegisterInput(req.body)
  if(!isValid){
    return res.status(400).json(errors)
  }
  try {
    let user = await User.findOne({email})
    if(user){
      errors.email= 'email already exist'
      return res.status(400).json({errors})
    }
    let newUser = new User({
      name: usernam,
      email,
      password
    })
    bcrypt.genSalt(5, async (err, salt)=>{
      try {
        if (err) throw err
        await bcrypt.hash(newUser.password, salt, async (err, hash)=>{
          if(err) throw err
          newUser.password = hash
          await newUser.save()
          /* res.json(newUser) */
          
          let user = await User.findOne({email})
          let token = jwt.sign({
            iss:'Yupher Inc', //or your name company name ....
            sub: user.id, // what you want to send in the payload to keep things simple I sent user id 
          }, process.env.SECRET_OR_KEY /* replace this with your secret key*/
          ,{expiresIn:604800 /* expires in 7 days (in seconds!!!!) or whatever you like*/ }
          )
          res.json({
            success: true,
            user: user.id,
            token: `Bearer ${token}`})
        })
      } catch (error) {
        console.log(error)
        res.status(500).json(error)
      }
    })
  } catch (error) {
    console.log(error)
  }
  
})

//get all users  private route  you need to be authenticated
router.get('/all', authenticate, async(req,res)=>{
  try {
    let users = await User.find({})
    if(!users) return res.status(404).json({error: 'users not found'})
    res.json(users)
  } catch (error) {
    res.status(500).json(error)
  }
}) 

//get the current logged in user
router.get('/current', authenticate,async(req,res)=>{
  let user = await User.findById(req.user.id)
  if(!user) return res.status(403)
  res.json(user)
})

// get a user by his id  Privat route you need to be authenticated 
router.get('/:id', authenticate, isAuthenticated, async (req,res)=>{
  try {
    let user = await User.findById(req.params.id)
    if(!user) return res.status(404).json({user: 'user not found'})
    res.json(user)
  } catch (error) {
    res.status(500).json(error)
  }
})


module.exports = router