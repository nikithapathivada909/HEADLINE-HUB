const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// Get all posts
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, description, content, url, image, published_at, source_name, source_url, is_draft FROM posts ORDER BY published_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new post
router.post("/", authenticateToken, async (req, res) => {
  const { title, description, content, url, image, source_name, source_url, is_draft } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO posts (title, description, content, url, image, published_at, source_name, source_url, is_draft, user_id) VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8, $9) RETURNING *",
      [title, description, content, url, image, source_name, source_url, is_draft, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a post
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, content, url, image, source_name, source_url, is_draft } = req.body;
  try {
    const result = await pool.query(
      "UPDATE posts SET title=$1, description=$2, content=$3, url=$4, image=$5, source_name=$6, source_url=$7, is_draft=$8 WHERE id=$9 AND user_id=$10 RETURNING *",
      [title, description, content, url, image, source_name, source_url, is_draft, id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized to edit this post" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a post
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM posts WHERE id=$1 AND user_id=$2 RETURNING *", [id, req.user.id]);
    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized to delete this post" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Publish a draft post
router.put("/:id/publish", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE posts SET is_draft=false WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized to publish this post" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error publishing post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
