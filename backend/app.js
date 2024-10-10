require("dotenv").config();
const express = require("express");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cookieParser = require("cookie-parser");
const app = express();

//  CONNECT DB
connectDb();

// MIDDLEWARE TO PARSE INCOMING REQUEST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTE HANDLING
app.use("/", userRoutes);
app.use("/admin", adminRoutes);

// START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
