const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/database");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    [name, email, hashedPassword, role],
    function (err) {
      if (err) return res.status(400).json({ error: "Email already exists" });
      res.json({ id: this.lastID, name, email, role });
    }
  );
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: "Invalid email" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  });
});

module.exports = router;
