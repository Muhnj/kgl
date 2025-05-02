const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const signupSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    trim: true,
    required: true,
  },
  branch: {
    type: String,
    trim: true,
    default: null, // Allow null for Directors
  },
  username: {
    type: String,
    trim: true,
    required: true,
  },
});

signupSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("Signup", signupSchema);
