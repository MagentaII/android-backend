const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db"); // 假設 db.js 在同一目錄下
const router = express.Router();

const JWT_SECRET = "your_jwt_secret"; // 請替換為你的密鑰

// 註冊
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const stmt = db.prepare(
      "INSERT INTO auth_users (email, password) VALUES (?, ?)"
    );
    const info = stmt.run(email, hashed);
    res.status(201).json({ id: info.lastInsertRowid, email });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      res.status(409).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Error creating user" });
    }
  }
});

// 登入
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM auth_users WHERE email = ?").get(email);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "2h",
  });

  res.json({ token });
});

module.exports = router;