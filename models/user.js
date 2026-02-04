const mongoose = require('mongoose');

const validator = require('validator');

const {Schema, model} = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    age:{
        type: Number,
        min:18
    },
    location: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
        unique: true,
        lowercase: true,
        trim: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address " + value);
            }
        }
    },
    gender: {
        type: String,
        required: true,
        lowercase: true,
        validate:(value) => {
            if(!['male', 'female', 'other'].includes(value.toLowerCase())) {
                throw new Error("Gender must be male, female or other");
            };
        }
    },
    about: {
        type: String,
        maxLength: 500,
        default: 'this is about me'
    },
    skills: {
        type: [String],
        default: []
    },
    photoUrl: {
        type: String,
        default: 'https://picsum.photos/id/1/200/300',
        // validate: (value) => {
        //     if (!validator.isURL(value)) {
        //         throw new Error("Invalid URL for photoUrl");
        //     }
        // }
    }
},{timestamps: true});

userSchema.methods.setJWT = function() {
    const user = this;
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1d' });
    return token;
}

userSchema.methods.validatePassword = async function(passwordInput) {
    const user = this;
    const passwordHash = user.password;
    const bcrypt = require("bcrypt");
    const isValidPassword = await bcrypt.compare(passwordInput, passwordHash);
    return isValidPassword;
}

const User = model("User", userSchema);

module.exports = User;
    
    