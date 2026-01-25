document.addEventListener("DOMContentLoaded", function () {

  const chat = document.getElementById("chat");
  const input = document.getElementById("userInput");
  const button = document.getElementById("sendBtn");

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = type;
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
      try {
        const reply = ravyThink(text);
        addMessage(reply, "ravy");
      } catch {
        addMessage("Algo falló, pero sigo contigo.", "ravy");
      }
    }, 150);
  }

  button.addEventListener("click", sendMessage);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
  });

  const storedName = localStorage.getItem("ravy_user_name");
  if (storedName) {
    addMessage(`Hola ${storedName}, soy RAVY. Continuemos.`, "ravy");
  } else {
    addMessage("Hola, soy RAVY. ¿Cómo te llamas?", "ravy");
  }

});
