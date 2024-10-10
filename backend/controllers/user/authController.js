const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwtUtils");

// REGISTER NEW USER
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("a;fsdj", req.body);

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ name, email, password });
    await user.save();

    // GENERATE TOKENS
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN POST
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // GENERATE TOKENS
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  //   res.json({ accessToken, refreshToken }); // use it when doing front-end

  // Set tokens in cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({ message: "Login successful" });
};

const refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  });
};

const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
  });

  // Clear the refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
  });
  // DO IT ON FRONT END
  res.status(200).json({ message: "Logged out" });
};

module.exports = { login, refreshToken, logout, createUser };
