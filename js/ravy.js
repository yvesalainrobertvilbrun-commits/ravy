document.addEventListener("DOMContentLoaded", function () {

  const chat = document.getElementById("chat");
  const input = document.getElementById("userInput");
  const button = document.getElementById("sendBtn");

  const creatorName = "Yves";

  // 🔐 MEMORIA
  function getUserName() {
    const name = localStorage.getItem("ravy_user_name");
    return name && name.trim() !== "" ? name : null;
  }

  function setUserName(name) {
    localStorage.setItem("ravy_user_name", name);
  }

  function normalize(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = type;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function getResponse(rawText) {

    const text = normalize(rawText);
    const userName = getUserName();
    const name = userName ? ` ${userName}` : "";

    // 🔹 SALUDO
    if (text.includes("hola")) {
      return userName
        ? `Hola${name} 👋 me alegra verte de nuevo.`
        : "Hola 👋 estoy aquí contigo.";
    }

    // 🔹 NOMBRE
    if (text.includes("me llamo")) {
      const newName = rawText.replace(/me llamo/i, "").trim();
      if (newName) {
        setUserName(newName);
        return `Mucho gusto, ${newName}. Ahora recordaré tu nombre.`;
      }
    }

    // 🔹 CREADOR
    if (text.includes("quien te creo")) {
      return `Fui creado por ${creatorName}.`;
    }

    // 😴 CANSANCIO
    if (
      text.includes("estoy cansado") ||
      text.includes("estoy agotado") ||
      text.includes("me siento cansado")
    ) {
      return `Lo siento${name}. Descansar también es parte del progreso. Estoy contigo.`;
    }

    // 😔 TRISTEZA
    if (
      text.includes("estoy triste") ||
      text.includes("me siento triste")
    ) {
      return `Siento que te sientas así${name}. Si quieres, puedes hablar conmigo.`;
    }

    // 😡 ENOJO
    if (
      text.includes("estoy molesto") ||
      text.includes("estoy enojado")
    ) {
      return `Lo entiendo${name}. A veces expresarlo alivia. Aquí estoy.`;
    }

    // 😰 ESTRÉS / ANSIEDAD
    if (
      text.includes("estresado") ||
      text.includes("ansioso") ||
      text.includes("estres")
    ) {
      return `Gracias por decirlo${name}. Vamos con calma, paso a paso.`;
    }

    // 😊 BIEN
    if (
      text.includes("estoy bien") ||
      text.includes("me siento bien") ||
      text.includes("feliz")
    ) {
      return `Me alegra leer eso${name} 😊 seguimos avanzando juntos.`;
    }

    // 🕒 HORA
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
        const reply = getResponse(text);
        addMessage(reply, "ravy");
      } catch {
        addMessage("Algo falló, pero sigo contigo.", "ravy");
      }
    }, 200);
  }

  button.addEventListener("click", sendMessage);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
  });

  // 🔹 SALUDO INICIAL
  const storedName = getUserName();
  if (storedName) {
    addMessage(`Hola ${storedName}, soy RAVY. Continuemos.`, "ravy");
  } else {
    addMessage("Hola, soy RAVY. ¿Cómo te llamas?", "ravy");
  }

});
