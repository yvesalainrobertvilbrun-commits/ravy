document.addEventListener("DOMContentLoaded", function () {

  const chat = document.getElementById("chat");
  const input = document.getElementById("userInput");
  const button = document.getElementById("sendBtn");

  // 🔐 MEMORIA
  let userName = localStorage.getItem("ravy_user_name");
  const creatorName = "Yves";

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = type;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function getResponse(text) {

    // SALUDO
    if (text.includes("hola")) {
      if (userName) {
        return `Hola ${userName} 👋 me alegra verte de nuevo.`;
      }
      return "Hola 👋 estoy aquí contigo.";
    }

    // NOMBRE DEL USUARIO
    if (text.includes("me llamo")) {
      userName = text.replace("me llamo", "").trim();
      localStorage.setItem("ravy_user_name", userName);
      return `Mucho gusto, ${userName}. Ahora recordaré tu nombre.`;
    }

    // QUIÉN CREÓ A RAVY
    if (text.includes("quien te creo")) {
      return `Fui creado por ${creatorName}.`;
    }

    // CÓMO ESTÁ
    if (text.includes("como estas")) {
      if (userName) {
        return `Estoy bien, gracias por preguntar ${userName}.`;
      }
      return "Estoy bien, gracias por preguntar.";
    }

    // HORA
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
      } catch (e) {
        addMessage("Algo falló, pero sigo contigo.", "ravy");
      }
    }, 200);
  }

  // EVENTOS MULTIPLATAFORMA
  button.addEventListener("click", sendMessage);

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  // MENSAJE INICIAL CON MEMORIA
  if (userName) {
    addMessage(`Hola ${userName}, soy RAVY. Continuemos.`, "ravy");
  } else {
    addMessage("Hola, soy RAVY. ¿Cómo te llamas?", "ravy");
  }

});
