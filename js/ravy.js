// js/ravy.js

import { ravyRespond } from "./ravy-core.js";

const input = document.getElementById("ravy-input");
const sendBtn = document.getElementById("ravy-send");
const chatBox = document.getElementById("ravy-chat");

function addMessage(text, sender = "user") {
  const div = document.createElement("div");
  div.className = sender;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, "user");
  ravyRespond(text, res => addMessage(res, "ravy"));
  input.value = "";
});

input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendBtn.click();
});
