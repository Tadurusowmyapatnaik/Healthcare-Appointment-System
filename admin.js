var DEFAULT_DOCTORS = [
  {
    id: 1,
    name: "Dr. Ananya Sharma",
    dept: "Cardiology",
    exp: 12,
    fee: 800,
    rating: 4.9,
    days: [1, 3, 5],
    startHour: 9,
    endHour: 13,
    about: "Heart specialist for angioplasty and heart failure care.",
  },
  {
    id: 2,
    name: "Dr. Vikram Rao",
    dept: "Cardiology",
    exp: 9,
    fee: 700,
    rating: 4.7,
    days: [2, 4, 6],
    startHour: 10,
    endHour: 14,
    about: "Expert in ECG, echo and preventive heart care.",
  },
  {
    id: 3,
    name: "Dr. Neha Gupta",
    dept: "Dermatology",
    exp: 7,
    fee: 600,
    rating: 4.8,
    days: [1, 2, 3, 4, 5],
    startHour: 9,
    endHour: 12,
    about: "Skin specialist for acne, pigmentation and hair fall.",
  },
  {
    id: 4,
    name: "Dr. Rajesh Kumar",
    dept: "Pediatrics",
    exp: 15,
    fee: 900,
    rating: 4.9,
    days: [1, 2, 3, 4, 5, 6],
    startHour: 9,
    endHour: 17,
    about: "Senior child specialist for growth and vaccination.",
  },
  {
    id: 5,
    name: "Dr. Sneha Reddy",
    dept: "Pediatrics",
    exp: 6,
    fee: 500,
    rating: 4.6,
    days: [3, 4, 5],
    startHour: 10,
    endHour: 13,
    about: "Child specialist for asthma, allergies and nutrition.",
  },
  {
    id: 6,
    name: "Dr. Arjun Mehta",
    dept: "Orthopedics",
    exp: 11,
    fee: 750,
    rating: 4.8,
    days: [2, 4, 6],
    startHour: 9,
    endHour: 13,
    about: "Bone specialist for fractures and sports injuries.",
  },
  {
    id: 7,
    name: "Dr. Priya Nair",
    dept: "Neurology",
    exp: 14,
    fee: 1000,
    rating: 4.9,
    days: [1, 3, 5],
    startHour: 9,
    endHour: 12,
    about: "Brain and nerve specialist for migraine and epilepsy.",
  },
  {
    id: 8,
    name: "Dr. Suresh Babu",
    dept: "General Medicine",
    exp: 20,
    fee: 400,
    rating: 4.7,
    days: [1, 2, 3, 4, 5, 6],
    startHour: 9,
    endHour: 17,
    about: "Family physician for fever, infections and diabetes.",
  },
  {
    id: 9,
    name: "Dr. Kavitha Rao",
    dept: "Gynecology",
    exp: 10,
    fee: 700,
    rating: 4.8,
    days: [1, 3, 5],
    startHour: 10,
    endHour: 14,
    about: "Women's health specialist for pregnancy care and PCOS.",
  },
  {
    id: 10,
    name: "Dr. Imran Khan",
    dept: "ENT",
    exp: 8,
    fee: 600,
    rating: 4.6,
    days: [2, 4, 6],
    startHour: 14,
    endHour: 18,
    about: "Ear, nose and throat specialist.",
  },
];

var DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var toastTimer = null;

function byId(id) {
  return document.getElementById(id);
}

function getUsers() {
  var data = localStorage.getItem("medicare_users");
  return data === null ? [] : JSON.parse(data);
}

function saveUsers(list) {
  localStorage.setItem("medicare_users", JSON.stringify(list));
}

function getAppointments() {
  var data = localStorage.getItem("medicare_appointments");
  return data === null ? [] : JSON.parse(data);
}

function saveAppointments(list) {
  localStorage.setItem("medicare_appointments", JSON.stringify(list));
}

function getDoctors() {
  var data = localStorage.getItem("medicare_doctors");
  return data === null ? [] : JSON.parse(data);
}

function saveDoctors(list) {
  localStorage.setItem("medicare_doctors", JSON.stringify(list));
}

function getAdmin() {
  var data = localStorage.getItem("medicare_admin");
  return data === null ? null : JSON.parse(data);
}

function saveAdmin(admin) {
  localStorage.setItem("medicare_admin", JSON.stringify(admin));
}

function isAdminLoggedIn() {
  return localStorage.getItem("medicare_admin_session") !== null;
}

function hourLabel(hour) {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour > 12) return hour - 12 + " PM";
  return hour + " AM";
}

function todayStr() {
  var d = new Date();
  var month = d.getMonth() + 1;
  var day = d.getDate();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  return d.getFullYear() + "-" + month + "-" + day;
}

function formatDate(dateStr) {
  var d = new Date(dateStr + "T00:00:00");

  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name) {
  var words = name.replace("Dr. ", "").split(" ");
  var text = "";

  for (var i = 0; i < 2; i++) {
    if (words[i] !== undefined) {
      text += words[i].charAt(0);
    }
  }

  return text.toUpperCase();
}

function getStatus(a) {
  if (a.status === "cancelled") return "cancelled";
  if (a.status === "completed") return "completed";
  if (a.date < todayStr()) return "completed";

  return "upcoming";
}

function showToast(message, isError) {
  var toast = byId("toast");

  toast.textContent = message;
  toast.className = isError === true ? "toast show error" : "toast show";

  clearTimeout(toastTimer);

  toastTimer = setTimeout(function () {
    toast.className = "toast";
  }, 3000);
}

function sortAppointments(list) {
  for (var i = 0; i < list.length - 1; i++) {
    for (var j = 0; j < list.length - 1 - i; j++) {
      var a = list[j];
      var b = list[j + 1];
      var swap = false;

      if (a.date > b.date) {
        swap = true;
      } else if (a.date === b.date && a.slot > b.slot) {
        swap = true;
      }

      if (swap === true) {
        list[j] = b;
        list[j + 1] = a;
      }
    }
  }
}

var PROTECTED_PAGES = [
  "dashboard",
  "doctors",
  "appointments",
  "patients",
  "settings",
];

function navigate(page) {
  if (PROTECTED_PAGES.indexOf(page) !== -1 && isAdminLoggedIn() === false) {
    showToast("Please login as admin", true);
    page = "login";
  }

  var pages = document.querySelectorAll(".page");

  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.remove("active");
  }

  byId(page).classList.add("active");

  var links = document.querySelectorAll(".nav-link");

  for (var j = 0; j < links.length; j++) {
    links[j].classList.remove("active");

    if (links[j].getAttribute("data-page") === page) {
      links[j].classList.add("active");
    }
  }

  byId("navLinks").classList.remove("open");
  window.scrollTo(0, 0);

  if (page === "dashboard") renderDashboard();
  if (page === "doctors") renderDoctors();
  if (page === "appointments") renderAppointments();
  if (page === "patients") renderPatients();
  if (page === "settings") renderSettings();
}

function toggleMenu() {
  byId("navLinks").classList.toggle("open");
}

function updateNavAuth() {
  var box = byId("navAuth");
  var links = byId("navLinks");

  if (isAdminLoggedIn() === true) {
    links.style.display = "flex";

    box.innerHTML = `
      <span class="user-chip">🛡️ Admin</span>
      <button class="btn btn-outline btn-sm" onclick="adminLogout()">Logout</button>
    `;
  } else {
    links.style.display = "none";

    box.innerHTML = `
      <a class="btn btn-outline btn-sm" href="index.html">
        ← Patient Portal
      </a>
    `;
  }
}

byId("adminLoginForm").addEventListener("submit", function (event) {
  event.preventDefault();

  var admin = getAdmin();
  var email = byId("alEmail").value.trim().toLowerCase();
  var password = byId("alPassword").value;

  if (admin === null || admin.email !== email || admin.password !== password) {
    showToast("Wrong admin email or password", true);
    return;
  }

  localStorage.setItem("medicare_admin_session", admin.email);

  updateNavAuth();
  showToast("Welcome, Admin!");
  navigate("dashboard");
});

function adminLogout() {
  localStorage.removeItem("medicare_admin_session");

  updateNavAuth();
  showToast("Logged out");
  navigate("login");
}

function renderDashboard() {
  var users = getUsers();
  var appts = getAppointments();
  var docs = getDoctors();
  var today = todayStr();

  var todayCount = 0;
  var revenue = 0;
  var deptCount = {};

  for (var i = 0; i < appts.length; i++) {
    var a = appts[i];

    if (a.status !== "cancelled") {
      revenue += a.fee;

      if (a.date === today) {
        todayCount++;
      }

      if (deptCount[a.dept] === undefined) {
        deptCount[a.dept] = 0;
      }

      deptCount[a.dept]++;
    }
  }

  byId("stPatients").textContent = users.length;
  byId("stAppointments").textContent = appts.length;
  byId("stToday").textContent = todayCount;
  byId("stDoctors").textContent = docs.length;
  byId("stRevenue").textContent = "₹" + revenue;

  var biggest = 1;

  for (var dept in deptCount) {
    if (deptCount[dept] > biggest) {
      biggest = deptCount[dept];
    }
  }

  var chartHtml = "";

  for (var dept2 in deptCount) {
    var width = Math.round((deptCount[dept2] / biggest) * 100);

    chartHtml += `
      <div class="bar-row">
        <span class="bar-label">${dept2}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width:${width}%"></div>
        </div>
        <span class="bar-val">${deptCount[dept2]}</span>
      </div>
    `;
  }

  if (chartHtml === "") {
    chartHtml = '<p class="text-muted">No appointments yet.</p>';
  }

  byId("deptChart").innerHTML = chartHtml;

  var todayAppts = [];

  for (var j = 0; j < appts.length; j++) {
    if (appts[j].date === today && appts[j].status !== "cancelled") {
      todayAppts.push(appts[j]);
    }
  }

  sortAppointments(todayAppts);

  var todayHtml = "";

  for (var k = 0; k < todayAppts.length; k++) {
    var t = todayAppts[k];

    todayHtml += `
      <div class="today-item">
        <div class="avatar">${getInitials(t.doctorName)}</div>
        <div>
          <strong>${t.patientName}</strong>
          <span class="small text-muted">with ${t.doctorName}</span>
          <div class="small">${t.slotLabel} · ${t.consult} · ${t.visit}</div>
        </div>
        <span class="badge badge-upcoming">${t.slotLabel}</span>
      </div>
    `;
  }

  if (todayHtml === "") {
    todayHtml = '<p class="text-muted">No appointments today.</p>';
  }

  byId("todayList").innerHTML = todayHtml;

  var recent = [];

  for (var m = 0; m < appts.length; m++) {
    recent.push(appts[m]);
  }

  for (var n = 0; n < recent.length - 1; n++) {
    for (var p = 0; p < recent.length - 1 - n; p++) {
      if (recent[p].id < recent[p + 1].id) {
        var temp = recent[p];
        recent[p] = recent[p + 1];
        recent[p + 1] = temp;
      }
    }
  }

  var recentHtml = "";

  for (var r = 0; r < recent.length && r < 6; r++) {
    var recentAppt = recent[r];

    recentHtml += `
      <div class="recent-item">
        <div>
          <strong>${recentAppt.patientName}</strong>
          <div class="small text-muted">
            ${recentAppt.doctorName} · ${formatDate(recentAppt.date)}
          </div>
        </div>
        <span class="badge badge-${getStatus(recentAppt)}">
          ${getStatus(recentAppt)}
        </span>
      </div>
    `;
  }

  if (recentHtml === "") {
    recentHtml = '<p class="text-muted">No appointments yet.</p>';
  }

  if (byId("recentList")) {
    byId("recentList").innerHTML = recentHtml;
  }
}

function renderDoctors() {
  var docs = getDoctors();
  var html = "";

  for (var i = 0; i < docs.length; i++) {
    var d = docs[i];

    html += `
      <tr>
        <td>
          <div class="cell-doc">
            <div class="avatar">${getInitials(d.name)}</div>
            <div>
              <strong>${d.name}</strong>
              <div class="small text-muted">${d.dept}</div>
            </div>
          </div>
        </td>
        <td>${d.exp} years</td>
        <td>₹${d.fee}</td>
        <td>⭐ ${d.rating}</td>
        <td>${d.days
          .map(function (day) {
            return DAY_NAMES[day];
          })
          .join(", ")}</td>
        <td>${hourLabel(d.startHour)} - ${hourLabel(d.endHour)}</td>
        <td class="actions-cell">
          <button class="btn btn-outline btn-xs" onclick="editDoctor(${d.id})">
            Edit
          </button>
          <button class="btn btn-danger btn-xs" onclick="deleteDoctor(${d.id})">
            Delete
          </button>
        </td>
      </tr>
    `;
  }

  if (html === "") {
    html = '<tr><td colspan="7" class="empty-cell">No doctors found.</td></tr>';
  }

  byId("doctorsBody").innerHTML = html;
}

function openDoctorModal(id) {
  var modal = byId("doctorModal");
  var form = byId("doctorForm");

  form.reset();
  byId("doctorId").value = "";

  if (id !== undefined) {
    var docs = getDoctors();
    var doctor = null;

    for (var i = 0; i < docs.length; i++) {
      if (docs[i].id === id) {
        doctor = docs[i];
        break;
      }
    }

    if (doctor === null) return;

    byId("doctorId").value = doctor.id;
    byId("dcName").value = doctor.name;
    byId("dcDept").value = doctor.dept;
    byId("dcExp").value = doctor.exp;
    byId("dcFee").value = doctor.fee;
    byId("dcRating").value = doctor.rating;
    byId("dcStart").value = doctor.startHour;
    byId("dcEnd").value = doctor.endHour;
    byId("dcAbout").value = doctor.about;

    var checks = document.querySelectorAll(".day-check");

    for (var j = 0; j < checks.length; j++) {
      checks[j].checked = doctor.days.indexOf(Number(checks[j].value)) !== -1;
    }

    byId("doctorModalTitle").textContent = "Edit Doctor";
  } else {
    byId("doctorModalTitle").textContent = "Add Doctor";
  }

  modal.classList.add("open");
}

function closeDoctorModal() {
  byId("doctorModal").classList.remove("open");
}

function editDoctor(id) {
  openDoctorModal(id);
}

byId("doctorForm").addEventListener("submit", function (event) {
  event.preventDefault();

  var docs = getDoctors();
  var id = byId("doctorId").value;

  var days = [];
  var checks = document.querySelectorAll(".day-check");

  for (var i = 0; i < checks.length; i++) {
    if (checks[i].checked) {
      days.push(Number(checks[i].value));
    }
  }

  var doctorData = {
    name: byId("dcName").value.trim(),
    dept: byId("dcDept").value.trim(),
    exp: Number(byId("dcExp").value),
    fee: Number(byId("dcFee").value),
    rating: Number(byId("dcRating").value),
    days: days,
    startHour: Number(byId("dcStart").value),
    endHour: Number(byId("dcEnd").value),
    about: byId("dcAbout").value.trim(),
  };

  if (id === "") {
    var newId = 1;

    for (var j = 0; j < docs.length; j++) {
      if (docs[j].id >= newId) {
        newId = docs[j].id + 1;
      }
    }

    doctorData.id = newId;
    docs.push(doctorData);

    showToast("Doctor added!");
  } else {
    for (var k = 0; k < docs.length; k++) {
      if (docs[k].id === Number(id)) {
        doctorData.id = Number(id);
        docs[k] = doctorData;
      }
    }

    showToast("Doctor updated!");
  }

  saveDoctors(docs);
  closeDoctorModal();
  renderDoctors();
});

function deleteDoctor(id) {
  if (confirm("Delete this doctor?") === false) return;

  var docs = getDoctors();
  var kept = [];

  for (var i = 0; i < docs.length; i++) {
    if (docs[i].id !== id) {
      kept.push(docs[i]);
    }
  }

  saveDoctors(kept);
  showToast("Doctor deleted");
  renderDoctors();
}

function rowAppt(a) {
  return `
    <tr>
      <td>${a.id}</td>
      <td>${a.patientName}</td>
      <td>${a.doctorName}</td>
      <td>${formatDate(a.date)}</td>
      <td>${a.slotLabel}</td>
      <td>${a.visit}</td>
      <td>
        <span class="badge badge-${getStatus(a)}">
          ${getStatus(a)}
        </span>
      </td>
      <td class="actions-cell">
        <button class="btn btn-outline btn-xs" onclick="viewAppt(${a.id})">
          View
        </button>
        ${
          getStatus(a) === "upcoming"
            ? `<button class="btn btn-danger btn-xs" onclick="cancelAppt(${a.id})">Cancel</button>`
            : ""
        }
      </td>
    </tr>
  `;
}

function renderAppointments() {
  var current = byId("apDoctor").value;
  var docs = getDoctors();

  var options = '<option value="">All Doctors</option>';

  for (var i = 0; i < docs.length; i++) {
    options += `
      <option value="${docs[i].id}">
        ${docs[i].name}
      </option>
    `;
  }

  byId("apDoctor").innerHTML = options;
  byId("apDoctor").value = current;

  var status = byId("apStatus").value;
  var doctorId = byId("apDoctor").value;
  var date = byId("apDate").value;
  var search = byId("apSearch").value.trim().toLowerCase();

  var list = [];
  var all = getAppointments();

  for (var j = 0; j < all.length; j++) {
    var a = all[j];
    var ok = true;

    if (status !== "" && getStatus(a) !== status) {
      ok = false;
    }

    if (doctorId !== "" && String(a.doctorId) !== doctorId) {
      ok = false;
    }

    if (date !== "" && a.date !== date) {
      ok = false;
    }

    if (
      search !== "" &&
      a.patientName.toLowerCase().indexOf(search) === -1 &&
      a.phone.indexOf(search) === -1
    ) {
      ok = false;
    }

    if (ok === true) {
      list.push(a);
    }
  }

  sortAppointments(list);

  var html = "";

  for (var k = 0; k < list.length; k++) {
    html += rowAppt(list[k]);
  }

  if (html === "") {
    html =
      '<tr><td colspan="8" class="empty-cell">No appointments found.</td></tr>';
  }

  byId("apptsBody").innerHTML = html;
}

byId("apSearch").addEventListener("input", renderAppointments);
byId("apStatus").addEventListener("change", renderAppointments);
byId("apDoctor").addEventListener("change", renderAppointments);
byId("apDate").addEventListener("change", renderAppointments);

function clearApptFilters() {
  byId("apSearch").value = "";
  byId("apStatus").value = "";
  byId("apDoctor").value = "";
  byId("apDate").value = "";

  renderAppointments();
}

function viewAppt(id) {
  var appts = getAppointments();
  var a = null;

  for (var i = 0; i < appts.length; i++) {
    if (appts[i].id === id) {
      a = appts[i];
      break;
    }
  }

  if (a === null) return;

  var body = `
    <div class="detail-grid">
      <div><label>Patient</label><strong>${a.patientName}</strong></div>
      <div><label>Age / Gender</label>${a.age} / ${a.gender}</div>
      <div><label>Phone</label>${a.phone}</div>
      <div><label>Email</label>${a.email}</div>
      <div class="full"><label>Address</label>${a.address}</div>
      <div><label>Blood Group</label>${a.blood}</div>
      <div><label>Doctor</label>${a.doctorName} (${a.dept})</div>
      <div><label>Date & Slot</label>${formatDate(a.date)} · ${a.slotLabel}</div>
      <div><label>Consultation</label>${a.consult}</div>
      <div><label>Visit Type</label>${a.visit}</div>
      <div><label>Fee</label>₹${a.fee}</div>
      <div>
        <label>Status</label>
        <span class="badge badge-${getStatus(a)}">${getStatus(a)}</span>
      </div>
      <div class="full"><label>Symptoms / Reason</label>${a.symptoms}</div>
      <div class="full"><label>Medications</label>${a.meds}</div>
      <div class="full"><label>Allergies</label>${a.allergies}</div>
      <div><label>Insurance</label>${a.insurance}</div>
      <div><label>Booked On</label>${formatDate(a.date.substring(0, 10))}</div>
    </div>
  `;

  byId("apptModalBody").innerHTML = body;
  byId("apptModal").classList.add("open");
}

function cancelAppt(id) {
  if (confirm("Cancel this appointment? The slot will be freed.") === false) {
    return;
  }

  var appts = getAppointments();

  for (var i = 0; i < appts.length; i++) {
    if (appts[i].id === id) {
      appts[i].status = "cancelled";
    }
  }

  saveAppointments(appts);
  showToast("Appointment cancelled - slot freed");
  renderAppointments();
}

function completeAppt(id) {
  var appts = getAppointments();

  for (var i = 0; i < appts.length; i++) {
    if (appts[i].id === id) {
      appts[i].status = "completed";
    }
  }

  saveAppointments(appts);
  showToast("Appointment marked completed");
  renderAppointments();
}

function restoreAppt(id) {
  var appts = getAppointments();

  for (var i = 0; i < appts.length; i++) {
    if (appts[i].id === id) {
      appts[i].status = "upcoming";
    }
  }

  saveAppointments(appts);
  showToast("Appointment restored");
  renderAppointments();
}

function renderPatients() {
  var users = getUsers();
  var appts = getAppointments();
  var html = "";

  for (var i = 0; i < users.length; i++) {
    var u = users[i];
    var mine = 0;
    var upcoming = 0;

    for (var j = 0; j < appts.length; j++) {
      if (appts[j].userEmail === u.email) {
        mine++;

        if (getStatus(appts[j]) === "upcoming") {
          upcoming++;
        }
      }
    }

    html += `
      <tr>
        <td>
          <div class="cell-doc">
            <div class="avatar">${getInitials(u.name)}</div>
            <div>
              <strong>${u.name}</strong>
              <div class="small text-muted">${u.email}</div>
            </div>
          </div>
        </td>
        <td>${u.phone}</td>
        <td>${u.age} / ${u.gender}</td>
        <td>${u.blood}</td>
        <td>
          <strong>${mine}</strong>
          <span class="small text-muted">(${upcoming} upcoming)</span>
        </td>
        <td class="small">${formatDate(u.createdAt.substring(0, 10))}</td>
        <td class="actions-cell">
          <button class="btn btn-outline btn-xs" onclick="viewPatient('${u.email}')">
            📋 History
          </button>
          <button class="btn btn-danger btn-xs" onclick="deletePatient('${u.email}')">
            🗑 Delete
          </button>
        </td>
      </tr>
    `;
  }

  if (html === "") {
    html =
      '<tr><td colspan="7" class="empty-cell">No patients registered yet.</td></tr>';
  }

  byId("patientsBody").innerHTML = html;
}

function viewPatient(email) {
  var users = getUsers();
  var user = null;

  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      user = users[i];
      break;
    }
  }

  if (user === null) return;

  var mine = [];
  var appts = getAppointments();

  for (var j = 0; j < appts.length; j++) {
    if (appts[j].userEmail === email) {
      mine.push(appts[j]);
    }
  }

  sortAppointments(mine);

  byId("patientModalTitle").textContent = user.name + "'s Appointments";

  var body = "";

  for (var k = 0; k < mine.length; k++) {
    var a = mine[k];

    body += `
      <div class="mini-appt">
        <div>
          <strong>${a.doctorName}</strong>
          <span class="dept-badge">${a.dept}</span>
        </div>

        <div class="small text-muted">
          ${formatDate(a.date)} · ${a.slotLabel} · ${a.consult} · ₹${a.fee}
        </div>

        <span class="badge badge-${getStatus(a)}">
          ${getStatus(a)}
        </span>
      </div>
    `;
  }

  if (body === "") {
    body = '<p class="text-muted">No appointments for this patient.</p>';
  }

  byId("patientModalBody").innerHTML = body;
  byId("patientModal").classList.add("open");
}

function deletePatient(email) {
  if (confirm("Delete this patient and ALL their appointments?") === false) {
    return;
  }

  var users = getUsers();
  var keptUsers = [];

  for (var i = 0; i < users.length; i++) {
    if (users[i].email !== email) {
      keptUsers.push(users[i]);
    }
  }

  saveUsers(keptUsers);

  var appts = getAppointments();
  var keptAppts = [];

  for (var j = 0; j < appts.length; j++) {
    if (appts[j].userEmail !== email) {
      keptAppts.push(appts[j]);
    }
  }

  saveAppointments(keptAppts);

  showToast("Patient deleted");
  renderPatients();
}

function renderSettings() {
  var html = "";

  html += `
    <div class="sys-row">
      <span>Registered Patients</span>
      <strong>${getUsers().length}</strong>
    </div>
  `;

  html += `
    <div class="sys-row">
      <span>Total Appointments</span>
      <strong>${getAppointments().length}</strong>
    </div>
  `;

  html += `
    <div class="sys-row">
      <span>Doctors</span>
      <strong>${getDoctors().length}</strong>
    </div>
  `;

  byId("sysStats").innerHTML = html;
}

byId("adminPassForm").addEventListener("submit", function (event) {
  event.preventDefault();

  var admin = getAdmin();

  if (byId("apCurrent").value !== admin.password) {
    showToast("Current password is wrong", true);
    return;
  }

  if (byId("apNew").value.length < 6) {
    showToast("New password must be at least 6 characters", true);
    return;
  }

  if (byId("apNew").value !== byId("apConfirm").value) {
    showToast("New passwords do not match", true);
    return;
  }

  admin.password = byId("apNew").value;
  saveAdmin(admin);

  byId("adminPassForm").reset();
  showToast("Admin password updated!");
});

function clearAllAppointments() {
  if (confirm("Delete ALL appointments?") === false) return;

  saveAppointments([]);
  showToast("All appointments cleared");
  renderSettings();
}

function resetDoctors() {
  if (confirm("Reset doctors to the default list?") === false) return;

  saveDoctors(DEFAULT_DOCTORS);
  showToast("Doctors reset to default");
  renderSettings();
}

byId("doctorModal").addEventListener("click", function (event) {
  if (event.target === byId("doctorModal")) {
    closeDoctorModal();
  }
});

byId("apptModal").addEventListener("click", function (event) {
  if (event.target === byId("apptModal")) {
    byId("apptModal").classList.remove("open");
  }
});

byId("patientModal").addEventListener("click", function (event) {
  if (event.target === byId("patientModal")) {
    byId("patientModal").classList.remove("open");
  }
});

function seedData() {
  if (localStorage.getItem("medicare_doctors") === null) {
    saveDoctors(DEFAULT_DOCTORS);
  }

  if (getAdmin() === null) {
    saveAdmin({
      name: "Admin",
      email: "admin@medicare.com",
      password: "admin123",
      createdAt: new Date().toISOString(),
    });
  }
}

function init() {
  seedData();
  updateNavAuth();

  if (isAdminLoggedIn() === true) {
    navigate("dashboard");
  } else {
    navigate("login");
  }
}

init();
