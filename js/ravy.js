document.addEventListener("DOMContentLoaded", () => {

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

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    try {
      const reply = await ravyThink(text);
      addMessage(reply, "ravy");
    } catch (e) {
      console.error(e);
      addMessage("Algo falló, pero sigo contigo.", "ravy");
    }
  }

  button.addEventListener("click", sendMessage);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
  });

  const name = localStorage.getItem("ravy_user_name");
  addMessage(
    name ? `Hola ${name}, soy RAVY.` : "Hola, soy RAVY. ¿Cómo te llamas?",
    "ravy"
  );
});
