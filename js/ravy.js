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

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = type;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function getResponse(text) {

    const userName = getUserName();
    const name = userName ? ` ${userName}` : "";

    // SALUDO
    if (text.includes("hola")) {
      return userName
        ? `Hola${name} 👋 me alegra verte de nuevo.`
        : "Hola 👋 estoy aquí contigo.";
    }

    // NOMBRE
    if (text.includes("me llamo")) {
      const newName = text.replace("me llamo", "").trim();
      if (newName) {
        setUserName(newName);
        return `Mucho gusto, ${newName}. Ahora recordaré tu nombre.`;
      }
    }

    // CREADOR
    if (text.includes("quien te creo")) {
      return `Fui creado por ${creatorName}.`;
    }

    // 😴 CANSADO
    if (text.includes("cansado") || text.includes("agotado")) {
      return `Lo siento${name}. Descansar un poco también es avanzar. Estoy contigo.`;
    }

    // 😔 TRISTE
    if (text.includes("triste")) {
      return `Siento que te sientas así${name}. Si quieres, puedes desahogarte conmigo.`;
    }

    // 😡 MOLESTO
    if (text.includes("molesto") || text.includes("enojado")) {
      return `Entiendo${name}. A veces soltarlo ayuda. Respira, estoy aquí.`;
    }

    // 😰 ESTRÉS / ANSIEDAD
    if (text.includes("estres") || text.includes("ansioso")) {
      return `Gracias por decirlo${name}. Vamos paso a paso, no estás solo.`;
    }

    // 😊 BIEN / FELIZ
    if (text.includes("bien") || text.includes("feliz")) {
      return `Me alegra saberlo${name} 😊 seguimos avanzando juntos.`;
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
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
  });

  // SALUDO INICIAL
  const storedName = getUserName();
  if (storedName) {
    addMessage(`Hola ${storedName}, soy RAVY. Continuemos.`, "ravy");
  } else {
    addMessage("Hola, soy RAVY. ¿Cómo te llamas?", "ravy");
  }

});
