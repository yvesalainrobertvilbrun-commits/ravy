// js/ravy.js

const input = document.getElementById("userInput");
const chat = document.getElementById("chat");

function ravySpeak(text) {
  const msg = document.createElement("div");
  msg.className = "ravy";
  msg.textContent = "RAVY: " + text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function userSpeak(text) {
  const msg = document.createElement("div");
  msg.className = "user";
  msg.textContent = "TÚ: " + text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

// Respuesta de RAVY
window.sendMessage = function () {
  const text = input.value.trim();
  if (!text) return;

  userSpeak(text);
  saveToRavyMemory(text); // 🧠 GUARDAR MEMORIA

  input.value = "";

  // Respuestas básicas (por ahora)
  let response = "Te escucho. Sigue hablando.";

  if (text.toLowerCase().includes("nombre")) {
    response = "Soy RAVY.";
  }

  if (text.toLowerCase().includes("recuerdas")) {
    const memory = getRavyMemory();
    response = memory.length
      ? "Recuerdo " + memory.length + " cosas que me has dicho."
      : "Aún no tengo recuerdos.";
  }

  setTimeout(() => ravySpeak(response), 400);
};
