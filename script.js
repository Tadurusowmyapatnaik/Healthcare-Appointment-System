const LS_USERS = "medicare_users";
const LS_APPTS = "medicare_appointments";
const LS_SESSION = "medicare_session";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAY_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MORNING = [[9, 0, 12, 0]];

const FULLDAY = [
  [9, 0, 12, 30],
  [14, 0, 17, 0],
];

const EVENING = [[14, 0, 18, 0]];

const DOCTORS = [
  {
    id: 1,
    name: "Dr. Ananya Sharma",
    dept: "Cardiology",
    exp: 12,
    fee: 800,
    rating: 4.9,
    days: [1, 3, 5],
    shifts: FULLDAY,
    about:
      "Interventional cardiologist specialising in angioplasty and heart failure management.",
  },
  {
    id: 2,
    name: "Dr. Vikram Rao",
    dept: "Cardiology",
    exp: 9,
    fee: 700,
    rating: 4.7,
    days: [2, 4, 6],
    shifts: FULLDAY,
    about:
      "Expert in non-invasive cardiology, ECG, echo and preventive heart care.",
  },
  {
    id: 3,
    name: "Dr. Neha Gupta",
    dept: "Dermatology",
    exp: 7,
    fee: 600,
    rating: 4.8,
    days: [1, 2, 3, 4, 5],
    shifts: MORNING,
    about:
      "Skin specialist for acne, pigmentation, hair fall and cosmetic dermatology.",
  },
  {
    id: 4,
    name: "Dr. Rajesh Kumar",
    dept: "Pediatrics",
    exp: 15,
    fee: 900,
    rating: 4.9,
    days: [1, 2, 3, 4, 5, 6],
    shifts: FULLDAY,
    about:
      "Senior pediatrician handling child growth, vaccination and newborn care.",
  },
  {
    id: 5,
    name: "Dr. Sneha Reddy",
    dept: "Pediatrics",
    exp: 6,
    fee: 500,
    rating: 4.6,
    days: [3, 4, 5],
    shifts: MORNING,
    about:
      "Child specialist focused on childhood asthma, allergies and nutrition.",
  },
  {
    id: 6,
    name: "Dr. Arjun Mehta",
    dept: "Orthopedics",
    exp: 11,
    fee: 750,
    rating: 4.8,
    days: [2, 4, 6],
    shifts: FULLDAY,
    about:
      "Orthopedic surgeon for fractures, joint replacement and sports injuries.",
  },
  {
    id: 7,
    name: "Dr. Priya Nair",
    dept: "Neurology",
    exp: 14,
    fee: 1000,
    rating: 4.9,
    days: [1, 3, 5],
    shifts: MORNING,
    about:
      "Neurologist treating migraine, epilepsy, stroke and nerve disorders.",
  },
  {
    id: 8,
    name: "Dr. Suresh Babu",
    dept: "General Medicine",
    exp: 20,
    fee: 400,
    rating: 4.7,
    days: [1, 2, 3, 4, 5, 6],
    shifts: FULLDAY,
    about:
      "Family physician for fever, infections, diabetes and general health checkups.",
  },
  {
    id: 9,
    name: "Dr. Kavitha Rao",
    dept: "Gynecology",
    exp: 10,
    fee: 700,
    rating: 4.8,
    days: [1, 3, 5],
    shifts: MORNING,
    about:
      "Gynecologist specializing in pregnancy care, PCOS and women's health.",
  },
  {
    id: 10,
    name: "Dr. Imran Khan",
    dept: "ENT",
    exp: 8,
    fee: 600,
    rating: 4.6,
    days: [2, 4, 6],
    shifts: EVENING,
    about:
      "ENT specialist for ear infections, sinusitis, tonsillitis and hearing issues.",
  },
];

const $ = (id) => document.getElementById(id);

function getUsers() {
  return JSON.parse(localStorage.getItem(LS_USERS) || "[]");
}

function saveUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

function getAppointments() {
  return JSON.parse(localStorage.getItem(LS_APPTS) || "[]");
}

function saveAppointments(appointments) {
  localStorage.setItem(LS_APPTS, JSON.stringify(appointments));
}

function getSession() {
  return localStorage.getItem(LS_SESSION);
}

function setSession(email) {
  localStorage.setItem(LS_SESSION, email);
}

function clearSession() {
  localStorage.removeItem(LS_SESSION);
}

function getCurrentUser() {
  return getUsers().find((user) => user.email === getSession()) || null;
}

function initials(name) {
  return name
    .replace("Dr. ", "")
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function fmt(hour, minute) {
  const period = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${period}`;
}

function shiftsToText(shifts) {
  return shifts
    .map((shift) => `${fmt(shift[0], shift[1])} – ${fmt(shift[2], shift[3])}`)
    .join(" & ");
}

function slotLabel(minutes) {
  return fmt(Math.floor(minutes / 60), minutes % 60);
}

function formatDate(date) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

let toastTimer;

function showToast(message, isError = false) {
  const toast = $("toast");

  toast.textContent = message;
  toast.className = "toast show" + (isError ? " error" : "");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.className = "toast";
  }, 3200);
}

const PROTECTED = ["book", "appointments", "profile"];

function navigate(page) {
  if (PROTECTED.includes(page) && !getSession()) {
    showToast("Please login to continue", true);
    page = "login";
  }

  document
    .querySelectorAll(".page")
    .forEach((pageElement) => pageElement.classList.remove("active"));

  $(page).classList.add("active");

  document
    .querySelectorAll(".nav-link")
    .forEach((link) =>
      link.classList.toggle("active", link.dataset.page === page),
    );

  $("navLinks").classList.remove("open");
  window.scrollTo(0, 0);

  if (page === "home") renderHome();
  if (page === "doctors") renderDoctors();
  if (page === "book") initBookingPage();
  if (page === "appointments") renderAppointments();
  if (page === "profile") renderProfile();
}

function toggleMenu() {
  $("navLinks").classList.toggle("open");
}

function updateNavAuth() {
  const box = $("navAuth");
  const user = getCurrentUser();

  box.innerHTML = user
    ? `<span class="user-chip">👋 ${user.name.split(" ")[0]}</span>
       <button class="btn btn-outline btn-sm" onclick="logout()">Logout</button>`
    : `<button class="btn btn-outline btn-sm" onclick="navigate('login')">Login</button>
       <button class="btn btn-primary btn-sm btn-signup" onclick="navigate('signup')">Sign Up</button>`;
}

$("signupForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $("suName").value.trim();
  const email = $("suEmail").value.trim().toLowerCase();
  const phone = $("suPhone").value.trim();

  if (!/^\d{10}$/.test(phone)) {
    return showToast("Phone must be exactly 10 digits", true);
  }

  if ($("suPassword").value.length < 6) {
    return showToast("Password must be at least 6 characters", true);
  }

  if ($("suPassword").value !== $("suConfirm").value) {
    return showToast("Passwords do not match", true);
  }

  if (getUsers().some((user) => user.email === email)) {
    return showToast("An account with this email already exists", true);
  }

  const users = getUsers();

  users.push({
    name,
    email,
    phone,
    age: $("suAge").value,
    gender: $("suGender").value,
    blood: $("suBlood").value,
    address: $("suAddress").value.trim(),
    password: $("suPassword").value,
    createdAt: new Date().toISOString(),
  });

  saveUsers(users);

  showToast("Account created successfully! Please login.");

  navigate("login");
  $("loEmail").value = email;
});

$("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const email = $("loEmail").value.trim().toLowerCase();

  const user = getUsers().find(
    (user) => user.email === email && user.password === $("loPassword").value,
  );

  if (!user) {
    return showToast("Invalid email or password", true);
  }

  setSession(email);
  updateNavAuth();

  showToast(`Welcome back, ${user.name.split(" ")[0]}!`);

  navigate("home");
});

function logout() {
  clearSession();
  updateNavAuth();

  showToast("You have been logged out");

  navigate("home");
}

function populateDeptFilters() {
  const departments = [...new Set(DOCTORS.map((doctor) => doctor.dept))].sort();

  $("deptFilter").innerHTML =
    '<option value="">All Departments</option>' +
    departments.map((department) => `<option>${department}</option>`).join("");
}

function renderDoctors() {
  const search = $("docSearch").value.trim().toLowerCase();
  const department = $("deptFilter").value;

  const doctors = DOCTORS.filter(
    (doctor) =>
      (!search || doctor.name.toLowerCase().includes(search)) &&
      (!department || doctor.dept === department),
  );

  $("doctorsGrid").innerHTML =
    doctors
      .map(
        (doctor) => `
      <div class="doctor-card">
        <div class="doc-top">
          <div class="avatar">${initials(doctor.name)}</div>
          <div>
            <h3>${doctor.name}</h3>
            <span class="dept-badge">${doctor.dept}</span>
          </div>
        </div>

        <div class="doc-meta">
          <span>⭐ ${doctor.rating}</span>
          <span>🎓 ${doctor.exp} yrs exp</span>
          <span>💰 ₹${doctor.fee}</span>
        </div>

        <p class="doc-about">${doctor.about}</p>

        <div class="doc-days">
          <strong>Available:</strong>
          ${doctor.days
            .map((day) => `<span class="chip">${DAY_NAMES[day]}</span>`)
            .join("")}
        </div>

        <div class="doc-timing">
          🕘 ${shiftsToText(doctor.shifts)}
        </div>

        <button
          class="btn btn-primary"
          onclick="bookDoctor(${doctor.id})"
        >
          Book Appointment
        </button>
      </div>
    `,
      )
      .join("") ||
    `<div class="empty-state" style="grid-column:1/-1">
      <h3>No doctors found</h3>
      <p>Try a different name or department.</p>
    </div>`;
}

$("docSearch").addEventListener("input", renderDoctors);
$("deptFilter").addEventListener("change", renderDoctors);

let selectedSlot = null;
let rescheduleId = null;

function getSelectedDoctor() {
  return (
    DOCTORS.find((doctor) => doctor.id === parseInt($("bkDoctor").value)) ||
    null
  );
}

function populateDoctorSelect() {
  const doctors = DOCTORS.filter((doctor) => doctor.dept === $("bkDept").value);

  $("bkDoctor").innerHTML = doctors
    .map(
      (doctor) =>
        `<option value="${doctor.id}">${doctor.name} — ₹${doctor.fee}</option>`,
    )
    .join("");
}

function initBookingPage() {
  const user = getCurrentUser();

  if (!user) return;

  const departments = [...new Set(DOCTORS.map((doctor) => doctor.dept))].sort();

  $("bkDept").innerHTML = departments
    .map((department) => `<option>${department}</option>`)
    .join("");

  populateDoctorSelect();

  $("bkDate").min = todayStr();

  if (!rescheduleId) {
    $("bkName").value = user.name;
    $("bkAge").value = user.age || "";
    $("bkGender").value = user.gender || "";
    $("bkBlood").value = user.blood || "";
    $("bkPhone").value = user.phone;
    $("bkEmail").value = user.email;
    $("bkAddress").value = user.address || "";
    $("bkDate").value = "";
    $("bkConsult").value = "In-person";
    $("bkVisit").value = "New Consultation";
    $("bkSymptoms").value = "";
    $("bkMeds").value = "";
    $("bkAllergies").value = "";
    $("bkInsurance").value = "None";
    $("bkConsent").checked = false;

    selectedSlot = null;

    onDoctorChange();
  }
}

function onDoctorChange() {
  const doctor = getSelectedDoctor();
  const info = $("doctorInfo");

  if (!doctor) {
    info.style.display = "none";
    renderSlots();
    return;
  }

  info.style.display = "block";

  info.innerHTML = `
    <strong>${doctor.name}</strong> · ${doctor.dept} · ⭐ ${doctor.rating} · ₹${doctor.fee} consultation fee<br>
    <strong>Days:</strong> ${doctor.days.map((day) => DAY_FULL[day]).join(", ")}
    &nbsp;·&nbsp;
    <strong>Timings:</strong> ${shiftsToText(doctor.shifts)}
  `;

  renderSlots();
}

function renderSlots() {
  const picker = $("slotPicker");
  const hint = $("slotHint");
  const doctor = getSelectedDoctor();
  const date = $("bkDate").value;

  selectedSlot = null;
  picker.innerHTML = "";

  if (!doctor || !date) {
    hint.textContent = "Select a doctor and date to view available slots.";
    return;
  }

  const day = new Date(date + "T00:00:00").getDay();

  if (!doctor.days.includes(day)) {
    hint.innerHTML = `
      ⚠️ <strong>${doctor.name}</strong> is not available on
      ${DAY_FULL[day]}s. Available:
      ${doctor.days.map((d) => DAY_FULL[d]).join(", ")}.
    `;
    return;
  }

  const slots = [];

  doctor.shifts.forEach(([startHour, startMinute, endHour, endMinute]) => {
    for (
      let time = startHour * 60 + startMinute;
      time < endHour * 60 + endMinute;
      time += 30
    ) {
      slots.push(time);
    }
  });

  const booked = new Set(
    getAppointments()
      .filter(
        (appointment) =>
          appointment.doctorId === doctor.id &&
          appointment.date === date &&
          appointment.status !== "cancelled" &&
          appointment.id !== rescheduleId,
      )
      .map((appointment) => appointment.slot),
  );

  const isToday = date === todayStr();
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  hint.textContent = `Available slots for ${formatDate(date)} — tap to select:`;

  picker.innerHTML = slots
    .map((minutes) => {
      const taken = booked.has(minutes) || (isToday && minutes <= nowMinutes);

      return `
        <button
          type="button"
          class="slot"
          ${taken ? "disabled" : ""}
          onclick="pickSlot(this, ${minutes})"
        >
          ${slotLabel(minutes)}
        </button>
      `;
    })
    .join("");
}

function pickSlot(button, minutes) {
  document
    .querySelectorAll(".slot.selected")
    .forEach((slot) => slot.classList.remove("selected"));

  button.classList.add("selected");

  selectedSlot = minutes;
}

function bookDoctor(id) {
  if (!getSession()) {
    showToast("Please login to book an appointment", true);
    navigate("login");
    return;
  }

  resetReschedule();
  navigate("book");

  const doctor = DOCTORS.find((doctor) => doctor.id === id);

  $("bkDept").value = doctor.dept;

  populateDoctorSelect();

  $("bkDoctor").value = doctor.id;

  onDoctorChange();

  $("bookingForm").scrollIntoView({
    behavior: "smooth",
  });
}

function resetReschedule() {
  rescheduleId = null;
  $("rescheduleBanner").style.display = "none";
}

$("bookingForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const doctor = getSelectedDoctor();
  const date = $("bkDate").value;
  const phone = $("bkPhone").value.trim();

  if (!doctor) {
    return showToast("Please select a doctor", true);
  }

  if (!date) {
    return showToast("Please select a date", true);
  }

  if (selectedSlot === null) {
    return showToast("Please select a time slot", true);
  }

  if (!/^\d{10}$/.test(phone)) {
    return showToast("Phone must be exactly 10 digits", true);
  }

  const appointment = {
    patientName: $("bkName").value.trim(),
    age: $("bkAge").value,
    gender: $("bkGender").value,
    blood: $("bkBlood").value,
    phone,
    email: $("bkEmail").value.trim(),
    address: $("bkAddress").value.trim(),
    doctorId: doctor.id,
    doctorName: doctor.name,
    dept: doctor.dept,
    fee: doctor.fee,
    consult: $("bkConsult").value,
    visit: $("bkVisit").value,
    date,
    slot: selectedSlot,
    slotLabel: slotLabel(selectedSlot),
    symptoms: $("bkSymptoms").value.trim(),
    meds: $("bkMeds").value.trim(),
    allergies: $("bkAllergies").value.trim(),
    insurance: $("bkInsurance").value,
    userEmail: getSession(),
    status: "upcoming",
  };

  const appointments = getAppointments();

  if (rescheduleId) {
    const index = appointments.findIndex(
      (appointment) => appointment.id === rescheduleId,
    );

    if (index > -1) {
      appointments[index] = {
        ...appointments[index],
        ...appointment,
        rescheduledAt: new Date().toISOString(),
      };
    }

    saveAppointments(appointments);

    showToast("Appointment rescheduled successfully!");

    resetReschedule();
  } else {
    appointment.id = Date.now();
    appointment.createdAt = new Date().toISOString();

    appointments.push(appointment);

    saveAppointments(appointments);

    showToast("Appointment booked successfully!");
  }

  event.target.reset();

  navigate("appointments");
});

$("bkDept").addEventListener("change", () => {
  populateDoctorSelect();
  onDoctorChange();
});

$("bkDoctor").addEventListener("change", onDoctorChange);
$("bkDate").addEventListener("change", renderSlots);

["suPhone", "bkPhone", "pfPhone"].forEach((id) => {
  $(id).addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(/\D/g, "").slice(0, 10);
  });
});

let apptFilter = "all";

function effectiveStatus(appointment) {
  if (appointment.status === "cancelled") {
    return "cancelled";
  }

  return appointment.date < todayStr() ? "completed" : "upcoming";
}

function setApptFilter(filter, element) {
  apptFilter = filter;

  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active"));

  element.classList.add("active");

  renderAppointments();
}

function renderAppointments() {
  const email = getSession();

  let appointments = getAppointments().filter(
    (appointment) =>
      appointment.userEmail === email &&
      (apptFilter === "all" || effectiveStatus(appointment) === apptFilter),
  );

  const priority = {
    upcoming: 0,
    completed: 1,
    cancelled: 2,
  };

  appointments.sort((a, b) => {
    const statusA = effectiveStatus(a);
    const statusB = effectiveStatus(b);

    if (statusA !== statusB) {
      return priority[statusA] - priority[statusB];
    }

    if (a.date !== b.date) {
      return statusA === "upcoming"
        ? a.date < b.date
          ? -1
          : 1
        : a.date > b.date
          ? -1
          : 1;
    }

    return statusA === "upcoming" ? a.slot - b.slot : b.slot - a.slot;
  });

  if (!appointments.length) {
    $("appointmentsList").innerHTML = `
      <div class="empty-state">
        <h3>
          No ${apptFilter === "all" ? "" : apptFilter} appointments
        </h3>

        <p>Book an appointment to get started.</p>

        <button
          class="btn btn-primary"
          onclick="navigate('book')"
        >
          📅 Book Appointment
        </button>
      </div>
    `;

    return;
  }

  $("appointmentsList").innerHTML = appointments
    .map((appointment) => {
      const status = effectiveStatus(appointment);

      const actions =
        status === "upcoming"
          ? `
            <button
              class="btn btn-outline btn-sm"
              onclick="rescheduleAppt(${appointment.id})"
            >
              🔄 Reschedule
            </button>

            <button
              class="btn btn-danger btn-sm"
              onclick="cancelAppt(${appointment.id})"
            >
              ✕ Cancel
            </button>
          `
          : "";

      const meeting =
        status === "upcoming" && appointment.consult === "Video Consultation"
          ? `
            <div class="meet-link">
              🎥 Video consultation — meeting link will be emailed before your slot.
            </div>
          `
          : "";

      return `
        <div class="appt-card">
          <div class="appt-main">
            <div class="appt-doc">
              <div class="avatar">
                ${initials(appointment.doctorName)}
              </div>

              <div>
                <h3>${appointment.doctorName}</h3>
                <span class="dept-badge">
                  ${appointment.dept}
                </span>
              </div>
            </div>

            <span class="badge badge-${status}">
              ${status.toUpperCase()}
            </span>
          </div>

          <div class="appt-details">
            <div>📅 ${formatDate(appointment.date)}</div>
            <div>🕘 ${appointment.slotLabel}</div>
            <div>🏥 ${appointment.consult}</div>
            <div>📋 ${appointment.visit}</div>
            <div>💰 ₹${appointment.fee}</div>
            <div>🆔 #${appointment.id}</div>
          </div>

          <div class="appt-extra">
            <div>
              <strong>Patient:</strong>
              ${appointment.patientName}
              (${appointment.age}, ${appointment.gender})
            </div>

            <div>
              <strong>Reason:</strong>
              ${appointment.symptoms}
            </div>

            ${
              appointment.meds
                ? `<div><strong>Medications:</strong> ${appointment.meds}</div>`
                : ""
            }

            ${
              appointment.allergies
                ? `<div><strong>Allergies:</strong> ${appointment.allergies}</div>`
                : ""
            }

            ${
              appointment.insurance && appointment.insurance !== "None"
                ? `<div><strong>Insurance:</strong> ${appointment.insurance}</div>`
                : ""
            }
          </div>

          ${meeting}

          <div class="appt-actions">
            ${actions}
          </div>
        </div>
      `;
    })
    .join("");
}

function rescheduleAppt(id) {
  const appointment = getAppointments().find((item) => item.id === id);

  if (!appointment) return;

  rescheduleId = id;

  navigate("book");

  $("bkDept").value = appointment.dept;

  populateDoctorSelect();

  $("bkDoctor").value = appointment.doctorId;

  onDoctorChange();

  $("bkName").value = appointment.patientName;
  $("bkAge").value = appointment.age;
  $("bkGender").value = appointment.gender;
  $("bkBlood").value = appointment.blood;
  $("bkPhone").value = appointment.phone;
  $("bkEmail").value = appointment.email;
  $("bkAddress").value = appointment.address || "";
  $("bkConsult").value = appointment.consult;
  $("bkVisit").value = appointment.visit;
  $("bkSymptoms").value = appointment.symptoms;
  $("bkMeds").value = appointment.meds || "";
  $("bkAllergies").value = appointment.allergies || "";
  $("bkInsurance").value = appointment.insurance || "None";
  $("bkDate").value = appointment.date;

  renderSlots();

  $("rescheduleBanner").style.display = "flex";

  $("rescheduleText").textContent =
    `🔄 Rescheduling #${id} with ${appointment.doctorName} ` +
    `(currently ${formatDate(appointment.date)} at ${appointment.slotLabel}) ` +
    `— pick a new date & slot.`;

  $("bookingForm").scrollIntoView({
    behavior: "smooth",
  });

  showToast("Choose a new date and time slot");
}

function cancelAppt(id) {
  if (!confirm("Are you sure you want to cancel this appointment?")) {
    return;
  }

  const appointments = getAppointments();

  const appointment = appointments.find((item) => item.id === id);

  if (appointment) {
    appointment.status = "cancelled";
    appointment.cancelledAt = new Date().toISOString();

    saveAppointments(appointments);
  }

  showToast("Appointment cancelled");

  renderAppointments();
}

function renderProfile() {
  const user = getCurrentUser();

  if (!user) return;

  const appointments = getAppointments().filter(
    (appointment) => appointment.userEmail === user.email,
  );

  const upcoming = appointments.filter(
    (appointment) => effectiveStatus(appointment) === "upcoming",
  ).length;

  const completed = appointments.filter(
    (appointment) => effectiveStatus(appointment) === "completed",
  ).length;

  $("profileSummary").innerHTML = `
    <div class="avatar avatar-lg">
      ${initials(user.name)}
    </div>

    <h2>${user.name}</h2>

    <p class="text-muted">${user.email}</p>

    <div class="profile-stats">
      <div>
        <strong>${appointments.length}</strong>
        <span>Total</span>
      </div>

      <div>
        <strong>${upcoming}</strong>
        <span>Upcoming</span>
      </div>

      <div>
        <strong>${completed}</strong>
        <span>Completed</span>
      </div>
    </div>

    <p class="small text-muted">
      Member since
      ${new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })}
    </p>

    <button
      class="btn btn-danger btn-block"
      style="margin-top:14px"
      onclick="logout()"
    >
      Logout
    </button>
  `;

  $("pfName").value = user.name;
  $("pfPhone").value = user.phone;
  $("pfAge").value = user.age || "";
  $("pfGender").value = user.gender || "";
  $("pfBlood").value = user.blood || "";
  $("pfAddress").value = user.address || "";
}

$("profileForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const users = getUsers();

  const user = users.find((item) => item.email === getSession());

  const phone = $("pfPhone").value.trim();

  if (!/^\d{10}$/.test(phone)) {
    return showToast("Phone must be exactly 10 digits", true);
  }

  Object.assign(user, {
    name: $("pfName").value.trim(),
    phone,
    age: $("pfAge").value,
    gender: $("pfGender").value,
    blood: $("pfBlood").value,
    address: $("pfAddress").value.trim(),
  });

  saveUsers(users);

  updateNavAuth();

  showToast("Profile updated successfully!");

  renderProfile();
});

$("passwordForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const users = getUsers();

  const user = users.find((item) => item.email === getSession());

  if ($("cpCurrent").value !== user.password) {
    return showToast("Current password is incorrect", true);
  }

  if ($("cpNew").value.length < 6) {
    return showToast("New password must be at least 6 characters", true);
  }

  if ($("cpNew").value !== $("cpConfirm").value) {
    return showToast("New passwords do not match", true);
  }

  user.password = $("cpNew").value;

  saveUsers(users);

  event.target.reset();

  showToast("Password updated successfully!");
});

function renderHome() {
  $("statDoctors").textContent = DOCTORS.length;

  $("statDepts").textContent = new Set(
    DOCTORS.map((doctor) => doctor.dept),
  ).size;

  $("statAppointments").textContent = getAppointments().length;

  $("statPatients").textContent = getUsers().length;

  const banner = $("homeReminder");
  const email = getSession();

  if (!email) {
    banner.style.display = "none";
    return;
  }

  const next = getAppointments()
    .filter(
      (appointment) =>
        appointment.userEmail === email &&
        effectiveStatus(appointment) === "upcoming",
    )
    .sort((a, b) =>
      a.date === b.date ? a.slot - b.slot : a.date < b.date ? -1 : 1,
    )[0];

  if (!next) {
    banner.style.display = "none";
    return;
  }

  banner.style.display = "block";

  banner.innerHTML = `
    🔔 <strong>Reminder:</strong>
    Appointment with
    <strong>${next.doctorName}</strong>
    (${next.dept}) on
    <strong>${formatDate(next.date)}</strong>
    at
    <strong>${next.slotLabel}</strong>.

    <a
      href="#"
      onclick="navigate('appointments');return false;"
    >
      View details →
    </a>
  `;
}

function init() {
  populateDeptFilters();
  updateNavAuth();
  navigate("home");
}

init();
