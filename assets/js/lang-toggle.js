document.addEventListener("DOMContentLoaded", function() {
  const toggleButton = document.getElementById("lang-toggle");
  const body = document.body;
  const lang = localStorage.getItem("lang") || "en";

  // Initialize state
  if (lang === "cn") {
    body.classList.add("lang-cn");
    if(toggleButton) toggleButton.innerText = "EN"; // Button shows what you switch TO, or current? Usually switch TO. Let's say "EN" means "Switch to English". Or just show current state "中文". Let's stick to "CN/EN" or just "CN" when in EN mode.
    // Let's make it simple: Button text shows the OTHER language.
    // If current is CN, button says "EN".
    // If current is EN, button says "CN".
  } else {
    if(toggleButton) toggleButton.innerText = "CN";
  }

  if (toggleButton) {
    toggleButton.addEventListener("click", function(e) {
      e.preventDefault();
      if (body.classList.contains("lang-cn")) {
        body.classList.remove("lang-cn");
        localStorage.setItem("lang", "en");
        toggleButton.innerText = "CN";
      } else {
        body.classList.add("lang-cn");
        localStorage.setItem("lang", "cn");
        toggleButton.innerText = "EN";
      }
    });
  }
});
