document.addEventListener("DOMContentLoaded", function () {

  const chat = document.getElementById("chat");
  const input = document.getElementById("userInput");
  const button = document.getElementById("sendBtn");

  const creatorName = "Yves";

  // 🔐 MEMORIA SEGURA
  function getUserName() {
    const name = localStorage.getItem("ravy_user_name");
    return name && name.trim() !== "" ? name : null;
  }

  function setUserName(name) {
    localStorage.setItem("ravy_user_name", name);
  }

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = type;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function getResponse(text) {

    let userName = getUserName();

    // SALUDO
    if (text.includes("hola")) {
      if (userName) {
        return `Hola ${userName} 👋 me alegra verte de nuevo.`;
      }
      return "Hola 👋 estoy aquí contigo.";
    }

    // NOMBRE DEL USUARIO
    if (text.includes("me llamo")) {
      const name = text.replace("me llamo", "").trim();
      if (name) {
        setUserName(name);
        return `Mucho gusto, ${name}. Ahora recordaré tu nombre.`;
      }
      return "¿Cómo te llamas?";
    }

    // CREADOR
    if (text.includes("quien te creo")) {
      return `Fui creado por ${creatorName}.`;
    }

    // ESTADO
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

  // EVENTOS
  button.addEventListener("click", sendMessage);

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  // 🔁 SALUDO INICIAL CON MEMORIA REAL
  const storedName = getUserName();
  if (storedName) {
    addMessage(`Hola ${storedName}, soy RAVY. Continuemos.`, "ravy");
  } else {
    addMessage("Hola, soy RAVY. ¿Cómo te llamas?", "ravy");
  }

});
