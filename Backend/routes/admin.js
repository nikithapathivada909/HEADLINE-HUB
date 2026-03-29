const express = require("express");
const router = express.Router();
const pool = require("../db"); // Assuming you're using 
router.get("/get-users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users WHERE role = 'user'");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get-special-users", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT users.id, users.name, users.email, users.role ,special_users.category
      FROM special_users
      JOIN users ON special_users.user_id = users.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching special users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Assign role to user
router.post("/assign-role", async (req, res) => {
  const { user_id, category } = req.body;
  try {
    await pool.query("UPDATE users SET role = 'special_person' WHERE id = $1", [user_id]);
    await pool.query("INSERT INTO special_users (user_id, category) VALUES ($1, $2)", [user_id, category]);
    res.json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update special user's category
router.post("/update-category", async (req, res) => {
  const { user_id, category } = req.body;
  try {
    await pool.query("UPDATE special_users SET category = $1 WHERE user_id = $2", [category, user_id]);
    res.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Revert special user to normal user
router.post("/revert-user", async (req, res) => {
  const { user_id } = req.body;
  try {
    await pool.query("DELETE FROM special_users WHERE user_id = $1", [user_id]);
    await pool.query("UPDATE users SET role = 'user' WHERE id = $1", [user_id]);
    res.json({ message: "User reverted to normal user" });
  } catch (error) {
    console.error("Error reverting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete user (both from users and special_persons table if needed)
router.delete("/remove-user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM special_users WHERE user_id = $1", [id]);
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;