const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.email2 = !isEmpty(data.email2) ? data.email2 : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (!validator.isLength(data.name, { min: 4, max: 10 })) {
    errors.name =
      "name too short or too long it must be between 4and 10 charecters";
  }

  if(validator.isEmpty(data.name)){
    errors.name = 'name is requird '
  }
  if(validator.isEmpty(data.email)){
    errors.email = 'email is requird '
  }
  if(!validator.isEmail(data.email)){
    errors.email = 'email is not valid '
  }

  if(validator.isEmpty(data.email2)){
    errors.email2 = 'confirm email is requird '
  }
  if(!validator.equals(data.email,data.email2)){
    errors.email2= 'confirm email do not match '
  }
  if(validator.isEmpty(data.password)){
    errors.password = 'password is requird '
  }
  if(validator.isEmpty(data.password2)){
    errors.password2 = 'confirm password is requird '
  }
  if (!validator.isLength(data.password, { min: 5, max: 40 })) {
    errors.password =
      "pasdword must be atleast 5 charecters";
  }

  if(!validator.equals(data.password,data.password2)){
    errors.password2= 'confirm password do not match '
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
