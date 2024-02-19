import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value.length >= 8; 
      },
      message: "Password must be at least 8 characters long",
    },
  },
  
});

const Users = model("Users", userSchema)
export default Users