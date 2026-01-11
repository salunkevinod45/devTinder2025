const validator = require("validator");

// validate signup data
const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
  return true;
};

const validateLoginData = (req) => {
  const { email } = req.body;
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }
  return true;
};

const validateProfileUpdateData = (req) => {
  const allowedUpdates = [
    "firstName",
    "lastName",
    "about",
    "location",
    "age",
    "gender",
    "skills",
    "photoUrl",
  ];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  return isValidOperation;
};

const validateForgotPasswordData = (req) => {
    const {currentPassword,newPassWord } = req.body;
    if (!currentPassword || !newPassWord) {
      throw new Error("Passwords cannot be empty");
    }

    if(!validator.isStrongPassword(newPassWord)) {
        throw new Error("New password is not strong enough");
    }
    return true;
}

module.exports = {
  validateSignupData,
  validateLoginData,
  validateProfileUpdateData,
  validateForgotPasswordData
};
