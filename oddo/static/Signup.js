document.addEventListener("DOMContentLoaded", () => {
  // Handle Tag Inputs
  const tagInputs = document.querySelectorAll('.tag-input');

  tagInputs.forEach(input => {
    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter' && this.value.trim() !== '') {
        e.preventDefault();
        const tagText = this.value.trim();
        const container = document.getElementById(this.dataset.target);

        const tag = document.createElement('span');
        tag.className = 'tag';
        
        const tagLabel = document.createElement('span');
        tagLabel.textContent = tagText;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-tag';
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', function () {
          tag.remove();
        });

        tag.appendChild(tagLabel);
        tag.appendChild(removeBtn);
        container.appendChild(tag);

        this.value = '';
      }
    });
  });

  // Handle Profile Photo
  const profileImg = document.getElementById("profile-img");
  const photoUpload = document.getElementById("photo-upload");
  const removePhoto = document.getElementById("remove-photo");
  const defaultImage = "img/default-profile.png"; // Set your default image path

  profileImg.addEventListener("click", () => {
    photoUpload.click();
  });

  photoUpload.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profileImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  removePhoto.addEventListener("click", () => {
    profileImg.src = defaultImage;
    photoUpload.value = "";
  });

  // Handle Terms Modal Popup
  const termsLink = document.getElementById("show-terms");
  const modal = document.getElementById("terms-modal");
  const closeBtn = document.querySelector(".close-modal");

  termsLink.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  });
});
