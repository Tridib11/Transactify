const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware/authMiddleware");
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

//Updation

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});
router.put("/", authMiddleware, async (req, res) => {
  try {
    const success = updateBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Updation Failed",
      });
    }

    await User.updateOne({ _id: req.userId }, req.body);
    res.json({
      message: "Updation Successfull",
    });
  } catch (err) {
    console.log(err);
  }
});


//Filter logic for filtering the names


router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        fisrtName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
