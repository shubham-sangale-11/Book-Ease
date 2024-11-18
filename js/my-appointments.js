const apiUrl = "https://book-ease-73f27-default-rtdb.firebaseio.com/confomebooking.json";
const container = document.getElementById("appointments-container");
const sortSelect = document.getElementById("sort-appointments");

let appointmentsData = {}; // Store fetched data globally for sorting

// Fetch appointments
const fetchAppointments = async () => {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data) {
      appointmentsData = data; // Store the fetched data globally
      renderAppointments(data); // Render initial appointments
    } else {
      container.innerHTML = '<p class="text-center">No appointments found.</p>';
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    container.innerHTML = '<p class="text-center text-danger">Failed to fetch appointments. Try again later.</p>';
  }
};

// Render appointments
const renderAppointments = (appointments) => {
  container.innerHTML = "";

  Object.entries(appointments).forEach(([key, appointment]) => {
    const card = document.createElement("div");
    card.classList.add("card", "mb-4", "shadow-sm");
    card.innerHTML = `
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${appointment.image}" class="img-fluid rounded-start" alt="${appointment.title}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${appointment.title}</h5>
            <p class="card-text">${appointment.description}</p>
            <p><strong>Category:</strong> ${appointment.category}</p>
            <p><strong>Location:</strong> ${appointment.location}</p>
            <p><strong>Date:</strong> ${appointment.date} <strong>Time:</strong> ${appointment.time}</p>
            <p><strong>Charges:</strong> $${appointment.charges}</p>
            <button class="btn btn-danger cancel-btn" data-id="${key}">Cancel</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  attachDeleteListeners();
};

// Sorting appointments
const sortAppointments = (sortBy) => {
  let sortedEntries = Object.entries(appointmentsData);

  if (sortBy === "date") {
    sortedEntries = sortedEntries.sort(([, a], [, b]) => new Date(a.date) - new Date(b.date));
  } else if (sortBy === "time") {
    sortedEntries = sortedEntries.sort(([, a], [, b]) => a.time.localeCompare(b.time));
  } else if (sortBy === "category") {
    sortedEntries = sortedEntries.sort(([, a], [, b]) => a.category.localeCompare(b.category));
  }

  const sortedAppointments = Object.fromEntries(sortedEntries);
  renderAppointments(sortedAppointments);
};

// Attach delete listeners
const attachDeleteListeners = () => {
  document.querySelectorAll(".cancel-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const appointmentId = e.target.dataset.id;
      if (confirm("Are you sure you want to cancel this appointment?")) {
        await deleteAppointment(appointmentId);
      }
    });
  });
};

// Delete appointment
const deleteAppointment = async (id) => {
  try {
    const response = await fetch(`${apiUrl.replace(".json", `/${id}.json`)}`, { method: "DELETE" });
    if (response.ok) {
      alert("Appointment cancelled successfully.");
      fetchAppointments(); // Refresh the list
    } else {
      alert("Failed to cancel the appointment. Try again later.");
    }
  } catch (error) {
    console.error("Error deleting appointment:", error);
    alert("An error occurred. Please try again.");
  }
};

// Listen for sorting changes
sortSelect.addEventListener("change", (e) => {
  const sortBy = e.target.value;
  if (sortBy) {
    sortAppointments(sortBy);
  } else {
    renderAppointments(appointmentsData); // Default render when no sort option is selected
  }
});

// Fetch appointments on page load
document.addEventListener("DOMContentLoaded", fetchAppointments);
