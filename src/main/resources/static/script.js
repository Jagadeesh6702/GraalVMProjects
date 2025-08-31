document.addEventListener('DOMContentLoaded', function() {
  const tourList = document.getElementById('tour-list');
  const form = document.getElementById('add-tour-form');
  const nameInput = document.getElementById('tour-name');
  const descInput = document.getElementById('tour-description');
  const modal = document.getElementById('form-modal');
  const showAddBtn = document.getElementById('show-add-form');
  const cancelBtn = document.getElementById('cancel-btn');
  const formTitle = document.getElementById('form-title');
  const submitBtn = document.getElementById('submit-btn');
  let editingId = null;

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
    fetch('/api/tours')
      .then(res => res.json())
      .then(tours => {
        tourList.innerHTML = '';
        tours.forEach(tour => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${tour.name}</td>
            <td>${tour.description}</td>
            <td>
              <button class="action-btn edit-btn">Edit</button>
              <button class="action-btn delete-btn">Delete</button>
            </td>
          `;
          // Edit
          tr.querySelector('.edit-btn').onclick = () => {
            nameInput.value = tour.name;
            descInput.value = tour.description;
            editingId = tour.id;
            openModal(true);
          };
          // Delete
          tr.querySelector('.delete-btn').onclick = () => {
            if (confirm('Delete this tour?')) {
              fetch(`/api/tours/${tour.id}`, { method: 'DELETE' })
                .then(() => loadTours());
            }
          };
          tourList.appendChild(tr);
        });
      });
  }

  showAddBtn.onclick = () => {
    form.reset();
    editingId = null;
    openModal(false);
  };

  cancelBtn.onclick = closeModal;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const tour = {
      name: nameInput.value,
      description: descInput.value
    };
    if (editingId) {
      fetch(`/api/tours/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tour)
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update tour');
        return res.json();
      })
      .then(() => {
        closeModal();
        loadTours();
      })
      .catch(err => alert(err.message));
    } else {
      fetch('/api/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tour)
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add tour');
        return res.json();
      })
      .then(() => {
        closeModal();
        loadTours();
      })
      .catch(err => alert(err.message));
    }
  });

  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });

  loadTours();
});
