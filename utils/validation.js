const validator = require('validator');

const validateSignupData = (req) =>{
    const { firstName,lastName, email } = req.body;

    if(!firstName || !lastName) {
        throw new Error("Name is not valid");
    } else if(!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    }
    return true;
}

module.exports = {
    validateSignupData
}