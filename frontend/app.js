
const API_URL = "/api/clinic";

const form = document.getElementById("clinicForm");
const table = document.getElementById("clinicTable");
const message = document.getElementById("message");
const searchInput = document.getElementById("searchInput");

let clinics = [];

// Display a message
function showMessage(text, type = "success") {
  message.textContent = text;
  message.className = type;
}

// Collect form values
function getFormData() {
  return {
    clinic_name: document.getElementById("clinicName").value,
    doctor_name: document.getElementById("doctorName").value,
    specialization: document.getElementById("specialization").value,
    location: document.getElementById("location").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    opening_hours: document.getElementById("openingHours").value
  };
}

// Reset form
function resetForm() {
  form.reset();
  document.getElementById("clinicId").value = "";
  document.getElementById("formTitle").textContent =
    "Register New Clinic";
  document.getElementById("saveBtn").textContent =
    "Save Clinic";
}

// Fetch all clinics
async function loadClinics() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Unable to load clinics");
    }

    clinics = await response.json();
    displayClinics();

  } catch (error) {
    showMessage(error.message, "error");
  }
}

// Create table cells safely
function addCell(row, value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  row.appendChild(cell);
}

// Display clinics in the table
function displayClinics() {
  const query = searchInput.value.toLowerCase();

  const filtered = clinics.filter(clinic =>
    clinic.clinic_name.toLowerCase().includes(query) ||
    clinic.doctor_name.toLowerCase().includes(query) ||
    clinic.location.toLowerCase().includes(query)
  );

  table.innerHTML = "";

  document.getElementById("clinicCount").textContent =
    `${filtered.length} clinic(s) displayed`;

  if (filtered.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 9;
    cell.textContent = "No clinics found.";
    row.appendChild(cell);
    table.appendChild(row);
    return;
  }

  filtered.forEach(clinic => {
    const row = document.createElement("tr");

    addCell(row, clinic.id);
    addCell(row, clinic.clinic_name);
    addCell(row, clinic.doctor_name);
    addCell(row, clinic.specialization);
    addCell(row, clinic.location);
    addCell(row, clinic.phone);
    addCell(row, clinic.email);
    addCell(row, clinic.opening_hours);

    const actions = document.createElement("td");
    const buttons = document.createElement("div");
    buttons.className = "action-buttons";

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "btn edit";
    editButton.onclick = () => editClinic(clinic.id);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "btn delete";
    deleteButton.onclick = () => deleteClinic(clinic.id);

    buttons.append(editButton, deleteButton);
    actions.appendChild(buttons);
    row.appendChild(actions);

    table.appendChild(row);
  });
}

// Create or update a clinic
form.addEventListener("submit", async event => {
  event.preventDefault();

  const id = document.getElementById("clinicId").value;
  const data = getFormData();

  const url = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Operation failed");
    }

    resetForm();
    await loadClinics();
    showMessage(result.message);

  } catch (error) {
    showMessage(error.message, "error");
  }
});

// Load a clinic into the form for editing
function editClinic(id) {
  const clinic = clinics.find(item => item.id === id);

  if (!clinic) return;

  document.getElementById("clinicId").value = clinic.id;
  document.getElementById("clinicName").value = clinic.clinic_name;
  document.getElementById("doctorName").value = clinic.doctor_name;
  document.getElementById("specialization").value =
    clinic.specialization;
  document.getElementById("location").value = clinic.location;
  document.getElementById("phone").value = clinic.phone;
  document.getElementById("email").value = clinic.email;
  document.getElementById("openingHours").value =
    clinic.opening_hours;

  document.getElementById("formTitle").textContent =
    "Edit Clinic";
  document.getElementById("saveBtn").textContent =
    "Update Clinic";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Delete a clinic
async function deleteClinic(id) {
  if (!confirm("Are you sure you want to delete this clinic?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Delete failed");
    }

    await loadClinics();
    showMessage(result.message);

  } catch (error) {
    showMessage(error.message, "error");
  }
}

// Cancel editing
document.getElementById("cancelBtn").addEventListener(
  "click",
  () => {
    resetForm();
    showMessage("");
  }
);

// Search as the user types
searchInput.addEventListener("input", displayClinics);

// Load records when the page opens
loadClinics();
