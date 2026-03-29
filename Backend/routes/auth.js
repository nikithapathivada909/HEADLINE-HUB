const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("🟡 Login request received:", { email, password });

    try {
        const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = userQuery.rows[0];

        if (!user) {
            console.log("❌ Error: User not found");
            return res.status(401).json({ error: "Invalid credentials" });
        }

        console.log("✅ User found:", user);

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        console.log("🔍 Password match result:", passwordMatch);

        if (!passwordMatch) {
            console.log("❌ Error: Password mismatch");
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("✅ Login successful, token generated");
        res.json({ token, userId: user.id, role: user.role }); // Now sending userId to frontend
    } catch (err) {
        console.error("❌ Error in /login:", err.message);
        res.status(500).json({ error: err.message });
    }
});

router.post("/sign-up", async (req, res) => {
    const { name, email, password } = req.body;
    console.log("🟡 Sign-Up request received:", { name, email, password });

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        // Check if user already exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "User already exists!" });
        }

        // Hash the password correctly
        const saltRounds = 10;  // Ensure saltRounds is a number
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("🔐 Hashed Password:", hashedPassword);

        // Insert new user into the database with role = 'user'
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, hashedPassword, "user"]
        );

        console.log("✅ User registered:", newUser.rows[0]);

        // Generate JWT token
        const token = jwt.sign({ id: newUser.rows[0].id, role: "user" }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(201).json({ message: "User created successfully!", token });

    } catch (err) {
        console.error("❌ Error in /sign-up:", err.message);
        res.status(500).json({ error: "Internal server error!" });
    }
});

module.exports = router;
