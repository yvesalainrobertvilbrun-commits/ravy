import { processMessage } from "./ravy-core.js";
import { resetMemory } from "./memory.js";

const chat = document.getElementById("chat");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

sendBtn.onclick = () => {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const reply = processMessage(text);
  setTimeout(() => addMessage(reply, "ravy"), 300);
};

document.getElementById("resetRavy").onclick = () => {
  resetMemory();
  location.reload();
};
