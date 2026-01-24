// js/ravy.js
import { ravyRespond } from "./ravy-core.js";

// Esperar a que cargue el HTML
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");
  const button = document.getElementById("sendBtn");
  const chat = document.getElementById("chat");

  // Función para agregar mensajes al chat
  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = sender === "user" ? "msg user" : "msg ravy";
    msg.textContent = text;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
  }

  // Enviar mensaje
  function sendMessage() {
    const text = input.value.trim();
    if (text === "") return;

    // Mensaje del usuario
    addMessage(text, "user");

    // Respuesta de RAVY (desde el core)
    const response = ravyRespond(text);

    setTimeout(() => {
      addMessage(response, "ravy");
    }, 500);

    input.value = "";
  }

  // Click en botón
  button.addEventListener("click", sendMessage);

  // Enter para enviar
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});
