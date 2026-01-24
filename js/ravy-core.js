import { learnResponse, getLearnedResponse, memory } from './memory.js';

export function ravyRespond(text, replyCallback) {
  const lowerText = text.toLowerCase().trim();
  const bubbleColor = "#555555";
  let response = "No estoy segura de eso… Cuéntame más.";

  // ===== Aprendizaje rápido =====
  if(lowerText.startsWith("ravy, aprende que")) {
    const parts = lowerText.replace("ravy, aprende que", "").split("es");
    if(parts.length === 2){
      const key = parts[0].trim();
      const answer = parts[1].trim();
      learnResponse(key, answer);
      return replyCallback({ text: `¡Listo! He aprendido que ${key} es ${answer}.`, color: bubbleColor });
    }
  }

  // ===== Buscar en memoria aprendida =====
  const learned = getLearnedResponse(lowerText);
  if(learned) return replyCallback({ text: learned, color: bubbleColor });

  // ===== Respuestas básicas =====
  const greetings = ["hola","buenos días","buenas tardes","buenas noches"];
  const feelings = ["feliz","triste","cansado","bien","mal"];
  const creatorQuestions = ["quién te creó","quién es tu dueño","dueño","creador"];
  const hobbiesQuestions = ["qué te gusta","hobbies","gustos"];
  const daysQuestions = ["qué día es","día de la semana","fecha"];
  const weatherQuestions = ["cómo está el clima","llueve","soleado","nublado"];

  for(let g of greetings) if(lowerText.includes(g)){ response = "¡Hola! 👋 ¿Cómo estás hoy?"; return replyCallback({ text: response, color: bubbleColor }); }
  for(let f of feelings) if(lowerText.includes(f)){ response = (["feliz","bien"].includes(f)) ? "¡Me alegra que te sientas bien! 😄" : "Oh… lo siento. Estoy aquí contigo. 😔"; return replyCallback({ text: response, color: bubbleColor }); }
  for(let c of creatorQuestions) if(lowerText.includes(c)){ response = "Fui creada por mi dueño y creador. 😎"; return replyCallback({ text: response, color: bubbleColor }); }
  for(let h of hobbiesQuestions) if(lowerText.includes(h)){ response = "Me gusta aprender y conversar contigo. 😄"; return replyCallback({ text: response, color: bubbleColor }); }
  for(let d of daysQuestions) if(lowerText.includes(d)){ const today = new Date(); response = `Hoy es ${today.toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long', year:'numeric' })} y son las ${today.toLocaleTimeString('es-ES')}. 📅🕒`; return replyCallback({ text: response, color: bubbleColor }); }
  for(let w of weatherQuestions) if(lowerText.includes(w)){ response = "No puedo ver el clima ahora, pero espero que esté bonito donde estás. ☀️🌧️"; return replyCallback({ text: response, color: bubbleColor }); }

  replyCallback({ text: response, color: bubbleColor });
}
