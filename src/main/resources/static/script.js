// Modal & Form Elements
const modal = document.getElementById("form-modal");
const showAddFormBtn = document.getElementById("show-add-form");
const cancelBtn = document.getElementById("cancel-btn");
const addTourForm = document.getElementById("add-tour-form");
const tourLocation = document.getElementById("tour-location");
const locationImage = document.getElementById("location-image");
const photoUrlField = document.getElementById("photo-url");

// View Modal for non-admin users
const viewModal = document.getElementById("view-modal");
const viewContent = document.getElementById("view-content");
const viewCloseBtn = document.getElementById("view-close-btn");

const UNSPLASH_ACCESS_KEY = "lX89VBFwR5hXGoEvy72mVRv-4D2ynW4wcy-dEyFaRXk"; // Replace with your Unsplash key
let editingId = null; // for edit

// Open modal
showAddFormBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// Close modal
cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  addTourForm.reset();
  locationImage.classList.add("hidden");
  editingId = null;
});

// Close view modal
viewCloseBtn.addEventListener("click", () => {
  viewModal.classList.add("hidden");
  viewContent.innerHTML = "";
});

// Load static locations
function loadLocations() {
  const locations = ["Paris", "New York", "London", "Tokyo", "Sydney", "Goa", "Dubai", "Rome", "Istanbul", "Bangkok","Munnar","Kerala","Agra","Jaipur","Kolkata"];
  tourLocation.innerHTML = `<option value="" disabled selected>Select Location</option>`;
  locations.forEach(loc => {
    const option = document.createElement("option");
    option.value = loc;
    option.textContent = loc;
    tourLocation.appendChild(option);
  });
}

// Fetch image from Unsplash
async function fetchLocationImage(location) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(location)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      const imgUrl = data.results[0].urls.small;
      locationImage.src = imgUrl;
      locationImage.classList.remove("hidden");
      photoUrlField.value = imgUrl; // store for DB insert
    } else {
      locationImage.classList.add("hidden");
      photoUrlField.value = "";
    }
  } catch (err) {
    console.error("Error fetching image:", err);
  }
}

// When user selects location
tourLocation.addEventListener("change", (e) => {
  const selectedLocation = e.target.value;
  fetchLocationImage(selectedLocation);
});

// Save (POST/PUT) to backend
addTourForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById("tour-name").value,
    description: document.getElementById("tour-description").value,
    location: tourLocation.value,
    price: document.getElementById("tour-price").value,
    photo_url: photoUrlField.value
  };

  try {
    if (editingId) {
      // Update tour
      await fetch(`/api/tours/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      editingId = null;
    } else {
      // Create new tour
      await fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
    }

    alert("Tour saved successfully!");
    modal.classList.add("hidden");
    addTourForm.reset();
    locationImage.classList.add("hidden");

    loadTours(); // reload all tours
  } catch (err) {
    console.error("Error saving tour:", err);
    alert("Failed to save tour");
  }
});

// Load tours from backend
async function loadTours() {
  try {
    let currentUser = { isAdmin: false };

    async function fetchCurrentUser() {
      try {
        const res = await fetch("/api/users/current");
        if (!res.ok) throw new Error("Not logged in");
        currentUser = await res.json();
      } catch (err) {
        console.warn("User not logged in, defaulting to guest");
        currentUser = { isAdmin: false };
      }
    }

    await fetchCurrentUser();

    const res = await fetch("/api/tours");
    if (!res.ok) throw new Error("Failed to fetch tours");
    const tours = await res.json();

    const tourCards = document.getElementById("tour-cards");
    tourCards.innerHTML = "";

    tours.forEach(tour => {
      const card = document.createElement("div");
      card.className = "tour-card";

      card.innerHTML = `
        <img src="${tour.photo_url || 'https://via.placeholder.com/300'}" alt="${tour.location}">
        <div class="content">
          <h3>${tour.location}</h3>
          <p><strong>Added By:</strong> ${tour.name}</p>
          <p><strong>Description:</strong> ${tour.description}</p>
          <p><strong>Price:</strong> ₹${tour.price}</p>
        </div>
      `;

      const contentDiv = card.querySelector(".content");

      if (currentUser.isAdmin) {
        // Admin: edit/delete buttons
        const actions = document.createElement("div");
        actions.className = "action-buttons";
        actions.innerHTML = `
          <button class="btn edit-btn">✏ Edit</button>
          <button class="btn delete-btn">🗑 Delete</button>
        `;
        contentDiv.appendChild(actions);

        // Edit
        actions.querySelector(".edit-btn").onclick = () => {
          editingId = tour.id;
          document.getElementById("tour-name").value = tour.name;
          document.getElementById("tour-description").value = tour.description;
          tourLocation.value = tour.location;
          document.getElementById("tour-price").value = tour.price;
          photoUrlField.value = tour.photo_url || "";
          if (tour.photo_url) {
            locationImage.src = tour.photo_url;
            locationImage.classList.remove("hidden");
          }
          modal.classList.remove("hidden");
        };

        // Delete
        actions.querySelector(".delete-btn").onclick = async () => {
          if (confirm("Delete this tour?")) {
            await fetch(`/api/tours/${tour.id}`, { method: "DELETE" });
            loadTours();
          }
        };

      } else {
        // Non-admin: add View button
        const viewBtn = document.createElement("button");
        viewBtn.className = "btn view-btn";
        viewBtn.textContent = "View";
        contentDiv.appendChild(viewBtn);

        viewBtn.onclick = () => {
          // Show view modal with full details
          viewContent.innerHTML = `
            <h3>${tour.location}</h3>
            <p><strong>Added By:</strong> ${tour.name}</p>
            <p><strong>Description:</strong> ${tour.description}</p>
            <p><strong>Price:</strong> ₹${tour.price}</p>
            <p><strong>Tour Slots:</strong> ${tour.slots || "N/A"}</p>
            <p><strong>Contact Number:</strong> ${tour.contact_number || "N/A"}</p>
            <p><strong>Day of Travel:</strong> ${tour.travel_day || "N/A"}</p>
            <p><strong>Additional Details:</strong> ${tour.additional_details || "N/A"}</p>
          `;
          viewModal.classList.remove("hidden");
        };
      }

      tourCards.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading tours:", err);
  }
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  loadLocations();
  loadTours();
});
