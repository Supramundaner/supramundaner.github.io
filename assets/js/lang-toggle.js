document.addEventListener("DOMContentLoaded", function() {
  const toggleButton = document.getElementById("lang-toggle");
  const body = document.body;
  const lang = localStorage.getItem("lang") || "en";

  // Initialize state
  if (lang === "cn") {
    body.classList.add("lang-cn");
    if(toggleButton) toggleButton.innerText = "EN";
  } else {
    if(toggleButton) toggleButton.innerText = "中文";
  }

  if (toggleButton) {
    toggleButton.addEventListener("click", function(e) {
      e.preventDefault();
      if (body.classList.contains("lang-cn")) {
        body.classList.remove("lang-cn");
        localStorage.setItem("lang", "en");
        toggleButton.innerText = "中文";
      } else {
        body.classList.add("lang-cn");
        localStorage.setItem("lang", "cn");
        toggleButton.innerText = "EN";
      }
    });
  }
});
