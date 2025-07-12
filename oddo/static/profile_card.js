const ratings = [
  {
    score: "⭐ 4.5/5 – Very skilled and helpful!",
    feedback: "Very smooth collaboration.",
    name: "~Rupam"
  },
  {
    score: "⭐ 5.0/5 – Would definitely recommend.",
    feedback: "Great attention to detail!",
    name: "~Aarav"
  },
  {
    score: "⭐ 4.8/5 – Great experience!",
    feedback: "Understood the task well.",
    name: "~Nisha"
  },
  {
    score: "⭐ 4.9/5 – Professional and on time.",
    feedback: "Very punctual and respectful.",
    name: "~Ravi"
  },
  {
    score: "⭐ 5.0/5 – Excellent work ethic!",
    feedback: "Delivered before deadline.",
    name: "~Sanya"
  }
];

let current = 0;
const box = document.getElementById("ratingBox");

function showNextRating() {
  const { score, feedback, name } = ratings[current];
  box.style.opacity = 0;
  setTimeout(() => {
    box.innerHTML = `
      <p class="rating-score">${score}</p>
      <p class="rating-feedback">"${feedback}"</p>
      <p class="rating-user">${name}</p>
    `;
    box.style.opacity = 1;
  }, 200);
  current = (current + 1) % ratings.length;
}

showNextRating();
setInterval(showNextRating, 3000);

document.querySelector(".request-btn").addEventListener("click", () => {
  document.getElementById("requestModal").style.display = "flex";
});

document.addEventListener("click", function (e) {
  const modal = document.getElementById("requestModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

