require("dotenv").config(); // Load environment variables from .env file
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ 已連線到 MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB 連線失敗：", err);
    process.exit(1);
  });

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const takeRoutes = require("./routes/taskRoutes");

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tasks", takeRoutes);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
