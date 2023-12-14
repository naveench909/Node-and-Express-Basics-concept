// @desc Register a user
// @route GET /api/users/register
// @access public

const asyncHandler = require("express-async-handler");
const User = require("../modals/userModal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const userAvailable = await User.findOne({ email });

  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }

  //Hash Password
  const hashPassword = await bcrypt.hash(password, 10);
  console.log("Hash password", hashPassword);

  const user = await User.create({
    username,
    email,
    password: hashPassword,
  });
  console.log("user created", user);
  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({
    message: "Register the user",
  });
});

// @desc login a user
// @route GET /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const user = await User.findOne({ email });
  // compare password with hashpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    console.log("user", user);
    let accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "50m" }
    );
    res.status(200).json({
      accessToken,
    });
  } else {
    res.status(401);
    throw new Error("User data is not valid");
  }
});

// @desc current information of a user
// @route GET /api/users/current
// @access private
const getCurrentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});
module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
