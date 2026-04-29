console.log("🌿 Fitogames carregado com sucesso!");

// animação de entrada segura
window.addEventListener("DOMContentLoaded", () => {

  const elements = document.querySelectorAll(
    '.card, .importance-card, section'
  );

  elements.forEach((el, index) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(30px)";

    setTimeout(() => {
      el.style.transition = "0.6s ease";
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    }, 120 * index);
  });

});