
require("dotenv").config();

const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(
  __dirname,
  process.env.DB_FILE || "clinic.db"
);

const db = new Database(dbPath);

const schema = fs.readFileSync(
  path.join(__dirname, "schema.sql"),
  "utf8"
);

db.exec(schema);

module.exports = db;
