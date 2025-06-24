const express = require("express");
const db = require("../db");
const authenticateToken = require("../middlewares/authMiddleware");
const router = express.Router();

// GET /api/notes: 取得所有筆記 (需驗證)
router.get("/", authenticateToken, (req, res) => {
  const stmt = db.prepare(
    "SELECT * FROM notes WHERE userId = ? ORDER BY createdAt DESC"
  );
  const notes = stmt.all(req.user.id);
  res.json(notes);
});

// POST /api/notes: 新增筆記 (需驗證)
router.post("/", authenticateToken, (req, res) => {
  const { title, content } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title can not be empty" });
  }

  const stmt = db.prepare(
    "INSERT INTO notes (userId, title, content) VALUES (?, ?, ?)"
  );
  const info = stmt.run(req.user.id, title, content || "");

  // 查出剛剛插入的那筆（包含 createdAt）
  const selectStmt = db.prepare("SELECT * FROM notes WHERE id = ?");
  const note = selectStmt.get(info.lastInsertRowid);

  res.status(201).json(note);
});

// DELETE /api/notes/:id: 刪除筆記 (需驗證)
router.delete("/:id", authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);

  // 確保這筆記錄存在且屬於當前使用者
  const stmt = db.prepare("DELETE FROM notes WHERE id = ? AND userId = ?");
  const info = stmt.run(id, req.user.id);

  if (info.changes === 0) {
    res.status(404).json({ message: "Note not found or not authorized" });
  } else {
    res.json({message: "已刪除筆記: " + id});
  }
});

module.exports = router;
