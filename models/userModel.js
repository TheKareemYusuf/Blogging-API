const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  firstName: {
    type: String,
    required: [true, "Please enter first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter last name"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
    select: false
  }
});

userSchema.pre("save", async function (next) {
  const user = this;
  const hash = await bcrypt.hash(this.password, 12);

  this.password = hash;

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const User = mongoose.model("User", userSchema)

module.exports = User;

