const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  try {
    const success = signupBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Signup Failed/Incorrect inputs",
      });
    }

    const existingUser = await User.findOne({
      username: req.body.username,
    });

    if (existingUser) {
      return res.status(411).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    const userId = user._id;

    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );

    res.json({
      message: "User created successfully",
      token: token,
    });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;