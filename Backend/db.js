const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin:admin@cluster0.pcgvjbl.mongodb.net/Transactify")
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB connection error:", err));

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  fisrtName: {
    type: String,
    required: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 50,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = {
  User,
};
