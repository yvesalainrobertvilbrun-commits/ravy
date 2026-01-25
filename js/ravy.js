const chat = document.getElementById("chat");
const input = document.getElementById("userInput");

let userName = null;

function addMessage(text, className) {
  const div = document.createElement("div");
  div.className = className;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  setTimeout(() => {
    respond(text.toLowerCase());
  }, 300);
}

function respond(text) {
  try {

    if (text.includes("hola")) {
      addMessage("Hola 👋 estoy aquí contigo.", "ravy");
      return;
    }

    if (text.includes("como estas")) {
      addMessage("Estoy bien, gracias por preguntar. ¿Y tú?", "ravy");
      return;
    }

    if (text.includes("me llamo")) {
      userName = text.replace("me llamo", "").trim();
      addMessage(`Encantado de conocerte, ${userName}.`, "ravy");
      return;
    }

    if (text.includes("quien te creo")) {
      addMessage("Fui creado por Yves.", "ravy");
      return;
    }

    if (text.includes("hora")) {
      const now = new Date();
      addMessage(`Son las ${now.toLocaleTimeString()}.`, "ravy");
      return;
    }

    addMessage("Te escucho 👂", "ravy");

  } catch (e) {
    addMessage("Algo falló, pero sigo contigo.", "ravy");
  }
}

addMessage("Hola, soy RAVY. ¿Cómo te llamas?", "ravy");
