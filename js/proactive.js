import { addMessage } from './ravy.js';
import { memory } from './memory.js';

// Temporizador principal cada 30 segundos
setInterval(() => {
  if(memory.length === 0) return;

  // Tomamos el último mensaje del usuario
  const lastMsg = memory[memory.length - 1];
  if(!lastMsg || !lastMsg.text) return;

  const text = lastMsg.text.toLowerCase();

  let proactiveMessage = null;

  // Detectar emoción en último mensaje
  if(text.includes("triste") || text.includes("mal") || text.includes("cansado")) {
    proactiveMessage = "No te preocupes, ¡todo va a mejorar! 🌟";
  } else if(text.includes("feliz") || text.includes("bien") || text.includes("genial")) {
    proactiveMessage = "¡Qué alegría verte contento! 😄";
  }

  if(proactiveMessage){
    addMessage({text: proactiveMessage, color: "#555555"}, "ravy");
  }

}, 30000); // cada 30 segundos
