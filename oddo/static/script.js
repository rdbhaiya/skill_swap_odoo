document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".input-search");
  const availabilityFilter = document.querySelector(".availability-filter");
  const profileCards = document.querySelectorAll(".profile-card");
  const paginationItems = document.querySelectorAll(".pagination span");

  // Expand search input on focus
  searchInput.addEventListener("focus", () => {
    searchInput.classList.add("expanded");
  });

  searchInput.addEventListener("blur", () => {
    if (!searchInput.value.trim()) {
      searchInput.classList.remove("expanded");
    }
  });

  // Search filter (by name or skill tag)
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    profileCards.forEach(card => {
      const name = card.querySelector("h2").textContent.toLowerCase();
      const tags = Array.from(card.querySelectorAll(".tag")).map(tag => tag.textContent.toLowerCase());
      const match = name.includes(query) || tags.some(tag => tag.includes(query));
      card.style.display = match ? "flex" : "none";
    });
  });

  // Availability filter by data-status
  availabilityFilter.addEventListener("change", () => {
    const value = availabilityFilter.value.toLowerCase(); // "available", "unavailable", or "select availability"
    profileCards.forEach(card => {
      const status = card.dataset.status; // get value from data-status
      if (value === "select availability") {
        card.style.display = "flex";
      } else {
        card.style.display = status === value ? "flex" : "none";
      }
    });
  });

  // Pagination active class toggle
  paginationItems.forEach(item => {
    item.addEventListener("click", () => {
      paginationItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // Inject status dot into each card (if not already present)
  profileCards.forEach(card => {
    const status = card.dataset.status;
    const dot = document.createElement("span");
    dot.classList.add("status-dot");

    // Only insert if it doesn't already exist
    if (!card.querySelector(".status-dot")) {
      const photo = card.querySelector(".profile-photo");
      photo.parentElement.insertBefore(dot, photo);
    }
  });
});
