const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_jwt_secret"; // 應與 auth.js 中的密鑰相同

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // Authorization: Bearer <token>
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "未提供 token" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token 驗證失敗：', err.message);
      return res.status(403).json({ message: "Token 驗證失敗" });
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
