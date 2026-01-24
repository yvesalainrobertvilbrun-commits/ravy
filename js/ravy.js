import { ravyRespond } from './ravy-core.js';

const chatBox = document.getElementById("ravy-chat");
const input = document.getElementById("ravy-input");
const sendBtn = document.getElementById("ravy-send");

export function addMessage(content, sender="user") {
  const div = document.createElement("div");
  div.className = sender;

  if(sender === "ravy" && content.color){
    div.style.backgroundColor = content.color;
    div.textContent = content.text;
  } else {
    div.textContent = content;
  }

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const text = input.value.trim();
  if(!text) return;

  addMessage(text, "user");
  ravyRespond(text, res => addMessage(res, "ravy"));
  input.value = "";
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => {
  if(e.key === "Enter") sendMessage();
});
