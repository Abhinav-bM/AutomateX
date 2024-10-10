const Admin = require("../../models/adminModel");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwtUtils");

// LOGIN POST
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await Admin.findOne({ email });

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

module.exports = { login };
