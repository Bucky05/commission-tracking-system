const express = require("express");
const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../services/userService");
const router = express.Router();
const { sign } = require("../services/jwtService");

router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await createUser(email, hashed, role);

    res.json({ message: "User created" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "User already exists" });
    }

    if (err.code === "ER_BAD_NULL_ERROR") {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.error(err);

    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const results = await findUserByEmail(email);

    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = sign(user.id, user.role);

    res.json({ token });
  } catch (err) {
    console.error(err);

    if (err.code === "ER_ACCESS_DENIED_ERROR") {
      return res.status(500).json({ error: "Database access error" });
    }

    if (err.code === "ECONNREFUSED") {
      return res.status(500).json({ error: "Database connection failed" });
    }

    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
