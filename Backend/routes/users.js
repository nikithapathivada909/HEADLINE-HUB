const express = require("express");
const pool = require("../db");
const bcrypt = require("bcryptjs");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Get All Users (Only Admins)
router.get("/", authenticateToken, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Only Admins can view users." });
    }

    try {
        const users = await pool.query("SELECT id, name, email, role FROM users");
        res.json(users.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// const express = require("express");
// const router = express.Router();
// const pool = require("../db"); // PostgreSQL connection

// Route to get saved articles for a user
router.get("/saved-articles", async (req, res) => {
    const userId = req.headers["userid"]; // Get userId from headers

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        // Fetch only id, url, and title
        const result = await pool.query(
            "SELECT id, url, title FROM saved_articles WHERE user_id = $1",
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("❌ Error fetching saved articles:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});



router.put("/change-username", authenticateToken, async (req, res) => {
    const userId = req.user.id; // Get user ID from token
    const { newUsername } = req.body;

    if (!newUsername) {
        return res.status(400).json({ error: "New username is required" });
    }

    try {
        await pool.query("UPDATE users SET name = $1 WHERE id = $2", [newUsername, userId]);
        res.json({ message: "Username updated successfully" });
    } catch (error) {
        console.error("❌ Error updating username:", error.message);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Route to Change Password
router.put("/change-password", authenticateToken, async (req, res) => {
    const userId = req.user.id; // Get user ID from token
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Both current and new passwords are required" });
    }

    try {
        // Get user's current password hash
        const userQuery = await pool.query("SELECT password_hash FROM users WHERE id = $1", [userId]);
        const user = userQuery.rows[0];

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if current password matches
        const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in the database
        await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [hashedPassword, userId]);

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("❌ Error updating password:", error.message);
        res.status(500).json({ error: "Server error" });
    }
});


router.delete("/saved-articles/:id", async (req, res) => {
    const { id } = req.params; // Extract article ID from URL
    const userId = req.headers.userid; // Get user ID from headers

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        // 🛑 Delete only if the article belongs to the user
        const result = await pool.query(
            "DELETE FROM saved_articles WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Article not found or doesn't belong to user" });
        }

        res.json({ message: "Article removed successfully" });
    } catch (err) {
        console.error("❌ Error deleting saved article:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/user-info/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const userQuery = await pool.query(
            "SELECT name, email FROM users WHERE id = $1",
            [userId]
        );

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(userQuery.rows[0]); // Send username & email
    } catch (err) {
        console.error("❌ Error fetching user info:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
