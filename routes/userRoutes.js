const express = require("express");
const db = require("../db"); // 引入 SQLite 資料庫
const authenticateToken = require("../middlewares/authMiddleware");
const router = express.Router();

// GET：取得所有使用者
router.get("/", authenticateToken, (req, res) => {
  const users = db.prepare("SELECT * FROM users").all();
  res.json(users);
});

// POST：新增使用者
router.post("/", authenticateToken, (req, res) => {
  const { name } = req.body;
  const stmt = db.prepare("INSERT INTO users (name) VALUES (?)");
  const info = stmt.run(name);
  const newUser = { id: info.lastInsertRowid, name };
  res.status(201).json(newUser);
});

// PUT：更新使用者
router.put("/:id", authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  const stmt = db.prepare("UPDATE users SET name = ? WHERE id = ?");
  const info = stmt.run(name, id);

  if (info.changes === 0) {
    res.status(404).json({ message: "User not found" });
  } else {
    res.json({ id, name });
  }
});

// DELETE：刪除使用者
router.delete("/:id", authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const stmt = db.prepare("DELETE FROM users WHERE id = ?");
  const info = stmt.run(id);
  if (info.changes === 0) {
    res.status(404).json({ message: "User not found" });
  } else {
    res.json({ message: `User ${id} deleted` });
  }
});

module.exports = router;
