document.addEventListener('DOMContentLoaded', function () {
  const tourCards = document.getElementById('tour-cards');
  const form = document.getElementById('add-tour-form');
  const nameInput = document.getElementById('tour-name');
  const descInput = document.getElementById('tour-description');
  const typeInput = document.getElementById('tour-type');
  const priceInput = document.getElementById('tour-price');
  const modal = document.getElementById('form-modal');
  const showAddBtn = document.getElementById('show-add-form');
  const cancelBtn = document.getElementById('cancel-btn');
  const formTitle = document.getElementById('form-title');
  const submitBtn = document.getElementById('submit-btn');
  let editingId = null;

  // Map location_type to background images
  const images = {
    City: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b",
    Beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    Mountain: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    Forest: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    Desert: "https://images.unsplash.com/photo-1601091656925-6df67f3a1e01"
  };

  function openModal(isEdit = false) {
    modal.classList.remove('hidden');
    formTitle.textContent = isEdit ? 'Edit Tour' : 'Add a New Tour';
    submitBtn.textContent = isEdit ? 'Update' : 'Save';
  }

  function closeModal() {
    modal.classList.add('hidden');
    form.reset();
    editingId = null;
  }

  function loadTours() {
    return fetch('/api/tours')
      .then(res => res.json())
      .then(tours => {
        tourCards.innerHTML = '';
        tours.forEach(tour => {
          const imgSrc = images[tour.location_type] || "https://via.placeholder.com/300x160.png?text=Tour";

          const card = document.createElement('div');
          card.className = 'tour-card';
          card.innerHTML = `
            <img src="${imgSrc}" alt="${tour.location_type}">
            <div class="content">
              <h3>${tour.name}</h3>
              <p><strong>Type:</strong> ${tour.location_type || ''}</p>
              <p><strong>Description:</strong> ${tour.description}</p>
              <p><strong>Price:</strong> $${tour.price || ''}</p>
              <div class="actions">
                <button class="action-btn edit-btn">Edit</button>
                <button class="action-btn delete-btn">Delete</button>
              </div>
            </div>
          `;

          card.querySelector('.edit-btn').onclick = () => {
            nameInput.value = tour.name;
            descInput.value = tour.description;
            typeInput.value = tour.location_type || '';
            priceInput.value = tour.price || '';
            editingId = tour.id;
            openModal(true);
          };

          card.querySelector('.delete-btn').onclick = () => {
            if (confirm('Delete this tour?')) {
              fetch(`/api/tours/${tour.id}`, { method: 'DELETE' })
                .then(() => loadTours());
            }
          };

          tourCards.appendChild(card);
        });

        checkUserPermissions();
      });
  }

  function checkUserPermissions() {
    fetch('/api/users/current')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Not logged in");
      })
      .then(user => {
        const addBtn = document.getElementById("show-add-form");
        const editBtns = document.querySelectorAll(".edit-btn");
        const deleteBtns = document.querySelectorAll(".delete-btn");

        if (user.isAdmin) {
          addBtn.style.display = "inline-block";
          editBtns.forEach(btn => btn.style.display = "inline-block");
          deleteBtns.forEach(btn => btn.style.display = "inline-block");
        } else {
          addBtn.style.display = "none";
          editBtns.forEach(btn => btn.style.display = "none");
          deleteBtns.forEach(btn => btn.style.display = "none");
        }
      })
      .catch(() => {
        document.getElementById("show-add-form").style.display = "none";
        document.querySelectorAll(".edit-btn, .delete-btn")
          .forEach(btn => btn.style.display = "none");
      });
  }

  showAddBtn.onclick = () => {
    form.reset();
    editingId = null;
    openModal(false);
  };

  cancelBtn.onclick = closeModal;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const tour = {
      name: nameInput.value,
      description: descInput.value,
      location_type: typeInput.value, 
      price: priceInput.value
    };
    if (editingId) {
      fetch(`/api/tours/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tour)
      })
        .then(() => {
          closeModal();
          loadTours();
        });
    } else {
      fetch('/api/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tour)
      })
        .then(() => {
          closeModal();
          loadTours();
        });
    }
  });

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  loadTours();
});
