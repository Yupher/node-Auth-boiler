const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateLoginInput(data) {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';


 
  if(validator.isEmpty(data.email)){
    errors.email = 'email is requird '
  }
  if(!validator.isEmail(data.email)){
    errors.email = 'email is not valid '
  }


  if(validator.isEmpty(data.password)){
    errors.password = 'password is requird '
  }
  
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
