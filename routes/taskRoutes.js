const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const router = express.Router();
const Task = require("../models/Task"); // 假設 Task 模型已經定義

// GET /api/tasks: 取得所有任務 (需驗證)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

// POST /api/tasks: 新增任務 (需驗證)
router.post("/", authenticateToken, async (req, res) => {
  const { title, dueDate } = req.body;
  if (!title) return res.status(400).json({ message: "標題不能為空" });

  try {
    const task = new Task({ userId: req.user.id, title, dueDate });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

// PUT /api/tasks/:id: 更新任務 (需驗證)
router.put("/:id", authenticateToken, async (req, res) => {
  const { title, done, dueDate } = req.body;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },  // 查詢條件
      { title, done, dueDate },                     // 要更新的內容
      { new: true }                                 // 返回更新後的文檔
    );
    if (!updatedTask)
      return res.status(404).json({ message: "任務不存在或無權限" });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

// DELETE /api/tasks/:id: 刪除任務 (需驗證)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!task) return res.status(404).json({ message: "任務不存在或無權限" });
    res.json({ message: "任務已刪除" });
  } catch (error) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

module.exports = router;