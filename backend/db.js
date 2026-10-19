
require("dotenv").config();

const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

// Use the database path from environment variables
const dbPath = path.resolve(
  __dirname,
  process.env.DB_FILE || "clinic.db"
);

// Create the database directory if necessary
fs.mkdirSync(path.dirname(dbPath), {
  recursive: true
});

// Connect to SQLite
const db = new Database(dbPath);

// Read and execute the table schema
const schema = fs.readFileSync(
  path.join(__dirname, "schema.sql"),
  "utf8"
);

db.exec(schema);

module.exports = db;
