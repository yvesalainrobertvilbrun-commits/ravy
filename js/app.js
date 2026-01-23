import { ravyRespond } from "./ravy-core.js";

// Mostrar pantallas
window.entrar = function () {
  document.getElementById("login").style.display = "none";
  document.getElementById("ravy").style.display = "block";
};

window.salir = function () {
  document.getElementById("login").style.display = "block";
  document.getElementById("ravy").style.display = "none";
};

// Hablar con RAVY
window.hablar = function () {
  const inputEl = document.getElementById("userInput");
  const responseEl = document.getElementById("response");

  const text = inputEl.value.trim();
  if (!text) {
    responseEl.innerText = "Estoy aquí, cuando quieras.";
    return;
  }

  responseEl.innerText = "…";

  setTimeout(() => {
    const reply = ravyRespond(text);
    responseEl.innerText = reply;
  }, 600);

  inputEl.value = "";
};
