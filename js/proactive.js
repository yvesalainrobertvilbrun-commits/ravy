import { addMessage } from './ravy.js';
import { memory, getUserName } from './memory.js';

setInterval(() => {
  if(memory.length === 0) return;

  const lastMsg = memory[memory.length - 1];
  if(!lastMsg || !lastMsg.text) return;

  const text = lastMsg.text.toLowerCase();
  let proactiveMessage = null;
  const userName = getUserName();

  if(text.includes("triste") || text.includes("mal") || text.includes("cansado")) {
    proactiveMessage = `No te preocupes, ¡todo va a mejorar${userName ? ", "+userName : ""}! 🌟`;
  } else if(text.includes("feliz") || text.includes("bien") || text.includes("genial")) {
    proactiveMessage = `¡Qué alegría verte contento${userName ? ", "+userName : ""}! 😄`;
  }

  if(proactiveMessage){
    addMessage({ text: proactiveMessage, color: "#555555" }, "ravy");
  }

}, 30000); // cada 30s
