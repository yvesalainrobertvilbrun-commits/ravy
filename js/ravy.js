document.addEventListener("DOMContentLoaded", function () {

  const chat = document.getElementById("chat");
  const input = document.getElementById("userInput");
  const button = document.getElementById("sendBtn");

  let userName = null;

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = type;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function getResponse(text) {
    if (text.includes("hola")) {
      return "Hola 👋 estoy aquí contigo.";
    }

    if (text.includes("me llamo")) {
      userName = text.replace("me llamo", "").trim();
      return `Encantado de conocerte, ${userName}.`;
    }

    if (text.includes("como estas")) {
      return "Gracias por preguntar. Estoy bien y atento a ti.";
    }

    if (text.includes("quien te creo")) {
      return "Fui creado por Yves.";
    }

    if (text.includes("hora")) {
      return `Son las ${new Date().toLocaleTimeString()}.`;
    }

    return "Te escucho 👂";
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    setTimeout(() => {
      try {
        const reply = getResponse(text.toLowerCase());
        addMessage(reply, "ravy");
      } catch {
        addMessage("Algo falló, pero sigo contigo.", "ravy");
      }
    }, 200);
  }

  button.addEventListener("click", sendMessage);

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  addMessage("Hola, soy RAVY. ¿Cómo te llamas?", "ravy");
});
