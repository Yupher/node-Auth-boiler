const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const app = express()
require('dotenv')
mongoose.connect('mongodb://localhost:27017/apioatuh', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log('mongodb connected'))
  .catch(e=>console.log('mongodb error: ', e))

app.use(express.urlencoded({extended: true}))
app.use(express.json({extended: false}))

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));

const port = process.env.PORT || '5000'
app.listen(port, ()=> console.log(`server running at port ${port}`) )