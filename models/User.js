const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema({
  method:{
    type: String
  },
  name: String,
  email: String,
  password:String,
  date:{
    type: Date,
    default: Date.now
  }
})

module.exports =  mongoose.model('user', userSchema)