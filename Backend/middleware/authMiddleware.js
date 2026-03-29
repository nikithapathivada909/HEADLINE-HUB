
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // ✅ Make sure `req.user.id` is set
    next();
  } catch (err) {
    console.error("❌ Invalid Token:", err.message);
    res.status(403).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = authenticateToken;
