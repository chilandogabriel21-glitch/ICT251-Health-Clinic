
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve the frontend
app.use(express.static(
  path.join(__dirname, "../frontend")
));

// Fields required for a clinic
const fields = [
  "clinic_name",
  "doctor_name",
  "specialization",
  "location",
  "phone",
  "email",
  "opening_hours"
];

// Validate request data
function validateClinic(data) {
  return fields.every(field =>
    typeof data[field] === "string" &&
    data[field].trim() !== ""
  );
}

// GET - All clinics
app.get("/api/clinic", (req, res) => {
  try {
    const clinics = db.prepare(
      "SELECT * FROM clinic ORDER BY id DESC"
    ).all();

    res.json(clinics);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve clinics"
    });
  }
});

// GET - One clinic by ID
app.get("/api/clinic/:id", (req, res) => {
  const clinic = db.prepare(
    "SELECT * FROM clinic WHERE id = ?"
  ).get(req.params.id);

  if (!clinic) {
    return res.status(404).json({
      error: "Clinic not found"
    });
  }

  res.json(clinic);
});

// POST - Create a clinic
app.post("/api/clinic", (req, res) => {
  if (!validateClinic(req.body)) {
    return res.status(400).json({
      error: "All clinic fields are required"
    });
  }

  const values = fields.map(field =>
    req.body[field].trim()
  );

  const result = db.prepare(`
    INSERT INTO clinic (
      clinic_name, doctor_name, specialization,
      location, phone, email, opening_hours
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(...values);

  const clinic = db.prepare(
    "SELECT * FROM clinic WHERE id = ?"
  ).get(result.lastInsertRowid);

  res.status(201).json({
    message: "Clinic created successfully",
    clinic
  });
});

// PUT - Update a clinic
app.put("/api/clinic/:id", (req, res) => {
  const existing = db.prepare(
    "SELECT * FROM clinic WHERE id = ?"
  ).get(req.params.id);

  if (!existing) {
    return res.status(404).json({
      error: "Clinic not found"
    });
  }

  if (!validateClinic(req.body)) {
    return res.status(400).json({
      error: "All clinic fields are required"
    });
  }

  const values = fields.map(field =>
    req.body[field].trim()
  );

  db.prepare(`
    UPDATE clinic SET
      clinic_name = ?,
      doctor_name = ?,
      specialization = ?,
      location = ?,
      phone = ?,
      email = ?,
      opening_hours = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(...values, req.params.id);

  const clinic = db.prepare(
    "SELECT * FROM clinic WHERE id = ?"
  ).get(req.params.id);

  res.json({
    message: "Clinic updated successfully",
    clinic
  });
});

// DELETE - Remove a clinic
app.delete("/api/clinic/:id", (req, res) => {
  const result = db.prepare(
    "DELETE FROM clinic WHERE id = ?"
  ).run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Clinic not found"
    });
  }

  res.json({
    message: "Clinic deleted successfully"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `Health Clinic Server running at http://localhost:${PORT}`
  );
});
