
CREATE TABLE IF NOT EXISTS clinic (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clinic_name TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    location TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    opening_hours TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
