const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema({
  method:{
    type: String,
    enum:['local', 'google', 'facebook']
  },
  local:{
    password:String,
  },
  googleID: String,
  facebookID: String,
  username: String,
  email: String,
  date:{
    type: Date,
    default: Date.now
  }
})

module.exports =  mongoose.model('user', userSchema)