// js/ravy.js
import { ravyRespond } from "./ravy-core.js";

document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  const input = document.getElementById("userInput");
  const button = document.getElementById("sendBtn");

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = "msg " + sender;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function send() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    const response = ravyRespond(text);

    setTimeout(() => {
      addMessage(response, "ravy");
    }, 400);

    input.value = "";
  }

  button.onclick = send;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });

  addMessage("Hola. Soy RAVY.", "ravy");
});
