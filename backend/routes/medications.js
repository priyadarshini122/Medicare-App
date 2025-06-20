// At the top of server.js or medications.js
const fs = require("fs");
const uploadsPath = "./uploads";
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

const express = require("express");
const db = require("../db/database");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// ✅ Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `proof-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

/**
 * ✅ Add a medication
 * Body: { user_id, name, dosage, frequency }
 */
router.post("/add", (req, res) => {
  const { user_id, name, dosage, frequency } = req.body;

  db.run(
    `INSERT INTO medications (user_id, name, dosage, frequency) VALUES (?, ?, ?, ?)`,
    [user_id, name, dosage, frequency],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

/**
 * ✅ Get all medications for a user
 */
router.get("/:user_id", (req, res) => {
  db.all(
    `SELECT * FROM medications WHERE user_id = ?`,
    [req.params.user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

/**
 * ✅ Mark medication as taken (adds today’s date)
 */
router.put("/mark/:id", (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  db.get(`SELECT taken_dates FROM medications WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    let updated = row.taken_dates ? row.taken_dates.split(",") : [];
    if (!updated.includes(today)) {
      updated.push(today);
    }

    db.run(
      `UPDATE medications SET taken_dates = ? WHERE id = ?`,
      [updated.join(","), req.params.id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Marked as taken", taken_dates: updated });
      }
    );
  });
});

/**
 * ✅ Upload proof for a medication
 * Field name: proof
 */
router.post("/upload/:id", upload.single("proof"), (req, res) => {
  console.log("Upload endpoint hit");
  console.log("Request file:", req.file); // ✅ Must not be undefined

  if (!req.file) {
    console.log("❌ No file received");
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileUrl = req.file.filename;

  db.run(
    `UPDATE medications SET proof = ? WHERE id = ?`,
    [fileUrl, req.params.id],
    function (err) {
      if (err) {
        console.error("DB Error:", err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log("✅ File uploaded:", fileUrl);
      res.json({ message: "File uploaded successfully", file: fileUrl });
    }
  );
});


module.exports = router;
