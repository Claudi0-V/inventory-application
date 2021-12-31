const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 5,
    max: 25,
  },
  email: {
    type: String,
    min: 10,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
})

const User = mongoose.model("User", UserSchema)

module.exports = User;
