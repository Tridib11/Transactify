const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

//Singup

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

    return res.json({
      message: "User created successfully",
      token: token,
    });
  } catch (err) {
    res.status(411).json({
      message: "Error while Signup",
    });
  }
});

//Singin

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/singin", async (req, res) => {
  try {
    const success = signinBody.safeParse(req.body.username);
    if (!success) {
      return res.status(411).json({
        message: "Signin Failed/Incorrect inputs",
      });
    }

    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });

    const userId = user._id;
    if (user) {
      const token = jwt.sign(
        {
          userId,
        },
        JWT_SECRET
      );

      return res.json({
        token: token,
      });
    }
  } catch (err) {
    res.status(411).json({
      message: "Error while logging in",
    });
  }
});

module.exports = router;
