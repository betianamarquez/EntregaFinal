const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({

  first_name: {
    type: String,
    required: true
  },

  last_name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  age: {
    type: Number,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  resetPasswordToken: {
    type: String,
    default: null
  },

  resetPasswordExpires: {
    type: Date,
    default: null
  },

  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart"
  },

  role: {
    type: String,
    default: "user"
  }

});

userSchema.methods.hashPassword = function () {
  return bcrypt.hashSync(
    this.password,
    bcrypt.genSaltSync(10)
  );
};

const User = mongoose.model("User", userSchema);

module.exports = User;