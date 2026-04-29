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

  const bubble = document.getElementById("creatorBubble");
const modal = document.getElementById("creatorModal");
const closeModal = document.getElementById("closeModal");

// abrir modal
bubble.addEventListener("click", () => {
  modal.classList.add("active");
});

// fechar modal
closeModal.addEventListener("click", () => {
  modal.classList.remove("active");
});

// fechar clicando fora da caixa
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

});