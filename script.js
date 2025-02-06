document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".tab-button");
  const workTab = document.getElementById("workTab");
  const eduTab = document.getElementById("eduTab");
  const projectsSection = document.querySelector(".wok-exp");
  const educationSection = document.getElementById("education-section");

  educationSection.classList.add("hidden");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      buttons.forEach((btn) => btn.classList.remove("active"));

      this.classList.add("active");

      if (this.id === "workTab") {
        projectsSection.classList.remove("hidden");
        educationSection.classList.add("hidden");
      } else {
        educationSection.classList.remove("hidden");
        projectsSection.classList.add("hidden");
      }
    });
  });
});
