const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
