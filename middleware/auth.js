const User = require('../models/User')
const passport = require('passport')

module.exports = {
  authenticate : passport.authenticate('jwt', {session: false}),
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
}