const express = require("express");
const cors = require("cors");
const path = require('path');

require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const savedArticlesRoutes = require("./routes/savedArticles");
const adminRoutes = require("./routes/admin")

const app = express();
app.use(express.json());
app.use(cors());

console.log("✅ Server is starting...");
console.log("✅ Loading routes...");

// Register routes with explicit logging
app.use("/api/auth", authRoutes);
console.log("➡ Mounted: /api/auth");

app.use("/api/users", userRoutes);
console.log("➡ Mounted: /api/users");

app.use("/api/posts", postRoutes);
console.log("➡ Mounted: /api/posts");

app.use("/api/saved-articles", savedArticlesRoutes);
console.log("➡ Mounted: /api/saved-articles");

app.use("/api/admin",adminRoutes)

// Debugging: List all registered routes
console.log("✅ Registered routes:");
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`➡ ${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`);
  }
});

const PORT = process.env.PORT;
app.use(express.static(path.join(__dirname, '../Frontend/build')));
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
