import { ravyRespond } from "./ravy-core.js";

const chat = document.getElementById("chat");
const input = document.getElementById("userInput");
const button = document.getElementById("sendBtn");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  ravyRespond(text, response => {
    addMessage(response.text, "ravy");
  });
}

button.addEventListener("click", sendMessage);

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
