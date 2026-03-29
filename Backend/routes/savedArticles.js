
const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// Debug log to confirm this file is loaded
console.log("✅ savedArticlesRoutes file loaded");

// 🔥 Debug log to confirm each route is being registered
router.post("/save-article", authenticateToken, async (req, res) => {
  console.log("📩 [POST] /save-article - Received request", req.body);
  const { title, url } = req.body;
  const userId = req.user.id;

  try {
    await pool.query("INSERT INTO saved_articles (user_id, title, url) VALUES ($1, $2, $3)", [userId, title, url]);
    res.json({ message: "Article saved successfully" });
  } catch (error) {
    console.error("❌ Error in /save-article:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/remove-article", authenticateToken, async (req, res) => {
  console.log("📩 [POST] /remove-article - Received request", req.body);
  const { url } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query("DELETE FROM saved_articles WHERE user_id = $1 AND url = $2", [userId, url]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json({ message: "Article removed successfully" });
  } catch (error) {
    console.error("❌ Error in /remove-article:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get saved articles for a user
router.get("/", authenticateToken, async (req, res) => {
  console.log("📩 [GET] /saved-articles - Fetching for user:", req.user.id);
  const userId = req.user.id;

  try {
    const savedArticles = await pool.query("SELECT title, url FROM saved_articles WHERE user_id = $1", [userId]);
    res.json(savedArticles.rows);
  } catch (error) {
    console.error("❌ Error in /saved-articles:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
