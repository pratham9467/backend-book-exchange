const express = require("express");
const authRoute = express.Router();
const fs = require("fs");
const path = require("path");
const USERS_FILE = path.join(__dirname, "../data/user.json");

authRoute.post("/register", (req, res) => {
  try {
    const { name, mobile, email, password, role } = req.body;

    if (!name || !mobile || !email || !password || !role) {
      throw new Error("Missing required fields");
    }
    const usersData = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));

    // Check if user already exists
    const userExists = usersData.find((user) => user.email === email);
    if (userExists) {
      throw new Error("User already exists with this email");
    }

    const newUser = {
      id: Date.now(),
      name,
      mobile,
      email,
      password,
      role,
    };

    usersData.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersData, null, 2));

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.log("Error:", err.message);
    return res.status(400).json(err.message);
  }
});

// POST /login
authRoute.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const usersData = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));

    const user = usersData.find((user) => user.email === email && user.password === password);

    if (!user) {
      throw new Error("Invalid credentials.");
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.log("Error:", err.message);
    return res.status(400).json(err.message);
  }
});

module.exports = authRoute;
