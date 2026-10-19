
const db = require("./db");

const clinics = [
  ["Central Health Clinic", "Dr. Banda", "General Medicine", "Lusaka", "0970000001", "central@example.com", "08:00 - 17:00"],
  ["Copperbelt Medical Centre", "Dr. Mwansa", "Pediatrics", "Kitwe", "0970000002", "copperbelt@example.com", "07:30 - 18:00"],
  ["Sunrise Family Clinic", "Dr. Phiri", "Family Medicine", "Ndola", "0970000003", "sunrise@example.com", "08:00 - 17:00"],
  ["Green Valley Clinic", "Dr. Tembo", "Dermatology", "Kabwe", "0970000004", "greenvalley@example.com", "08:00 - 16:00"],
  ["Hope Medical Centre", "Dr. Zulu", "General Medicine", "Livingstone", "0970000005", "hope@example.com", "08:00 - 18:00"],
  ["Unity Health Clinic", "Dr. Chanda", "Cardiology", "Chingola", "0970000006", "unity@example.com", "09:00 - 17:00"],
  ["Riverside Medical Clinic", "Dr. Musonda", "Dental Care", "Mufulira", "0970000007", "riverside@example.com", "08:00 - 16:00"],
  ["Care Plus Clinic", "Dr. Lungu", "Ophthalmology", "Solwezi", "0970000008", "careplus@example.com", "08:00 - 17:00"],
  ["Community Health Centre", "Dr. Sakala", "General Medicine", "Chipata", "0970000009", "community@example.com", "07:00 - 17:00"],
  ["Wellness Medical Centre", "Dr. Nkhoma", "Physiotherapy", "Kasama", "0970000010", "wellness@example.com", "08:30 - 17:00"]
];

const count = db.prepare(
  "SELECT COUNT(*) AS total FROM clinic"
).get().total;

if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO clinic (
      clinic_name,
      doctor_name,
      specialization,
      location,
      phone,
      email,
      opening_hours
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAll = db.transaction(() => {
    for (const clinic of clinics) {
      insert.run(...clinic);
    }
  });

  insertAll();
  console.log("10 sample clinics inserted successfully.");
} else {
  console.log("Database already contains records. No samples added.");
}

db.close();
