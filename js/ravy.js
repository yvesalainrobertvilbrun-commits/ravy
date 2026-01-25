import { ravyRespond } from "./ravy-core.js";

const chat = document.getElementById("chat");
const input = document.getElementById("userInput");
const btn = document.getElementById("sendBtn");

function addMessage(text, who) {
  const div = document.createElement("div");
  div.className = `message ${who}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function send() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  ravyRespond(text, res => {
    addMessage(res.text, "ravy");
  });
}

btn.onclick = send;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});
