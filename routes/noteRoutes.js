const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const router = express.Router();
const Note = require("../models/Note"); // 假設 Note 模型已經定義

// GET /api/notes: 取得所有筆記 (需驗證)
router.get("/", authenticateToken, async (req, res) => {
  const notes = await Note.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(notes);
});

// POST /api/notes: 新增筆記 (需驗證)
router.post("/", authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ message: "標題不能為空" });

  const note = new Note({ userId: req.user.id, title, content });
  await note.save();
  res.status(201).json(note);
});

// DELETE /api/notes/:id: 刪除筆記 (需驗證)
router.delete("/:id", authenticateToken, async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!note) return res.status(404).json({ message: "筆記不存在或無權限" });
  res.json({ message: "筆記已刪除" });
});

module.exports = router;
