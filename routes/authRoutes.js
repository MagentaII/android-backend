const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User"); // 假設 User 模型已經定義
const { verifyRefreshToken, generateAccessToken, generateRefreshToken } = require('../utils/token');

const JWT_SECRET = "my_jwt_secret"; // 請替換為你的密鑰

// 註冊
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email 已存在" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashed });

  await user.save();
  // 註冊成功後立即登入，回傳 token
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.status(201).json({ accessToken, refreshToken });
  // res.status(201).json({ message: "註冊成功" });
});

// 登入
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ message: "帳號錯誤" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "密碼錯誤" });

  // 登入成功：回傳 access 與 refresh token
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({ accessToken, refreshToken });

  // const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
  //   expiresIn: "2h",
  // });
  // res.json({ token });
});

// 刷新 Token
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "缺少 refresh token" });

  try {
    const payload = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken({ _id: payload.id });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "refresh token 無效或過期" });
  }
});

module.exports = router;
