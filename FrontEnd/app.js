// Select modal, button, and close button using querySelector for cleaner code
const modal = document.getElementById("loginModal");
const btn = document.getElementById("loginBtn");
const closeBtn = document.querySelector(".close-btn");

// Function to open the modal
const openModal = () => {
  if (modal) {
    modal.style.display = "block";
  } else {
    console.error("Modal element not found.");
  }
};

// Function to close the modal
const closeModal = () => {
  if (modal) {
    modal.style.display = "none";
  } else {
    console.error("Modal element not found.");
  }
};

// When the login button is clicked, open the modal
btn?.addEventListener("click", openModal);

// When the close button (x) is clicked, close the modal
closeBtn?.addEventListener("click", closeModal);

// When clicking outside the modal, close the modal
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});
