import { learnResponse, getLearnedResponse, memory, saveUserName, getUserName, getCreatorName } from './memory.js';

// Función para normalizar texto
function normalizeText(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function ravyRespond(text, replyCallback) {
  const lowerText = normalizeText(text.trim());
  const bubbleColor = "#555555";
  let response = "No estoy segura de eso… Cuéntame más.";

  const userName = getUserName();
  const creatorName = getCreatorName();

  // ===== Aprender nombre del usuario =====
  if(lowerText.startsWith("mi nombre es")){
    const name = text.split("mi nombre es")[1].trim();
    saveUserName(name);
    return replyCallback({ text: `¡Encantada de conocerte, ${name}! 😄`, color: bubbleColor });
  }

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
  const creatorQuestions = ["quien te creo","quien es tu dueño","dueño","creador"];
  const hobbiesQuestions = ["qué te gusta","hobbies","gustos"];
  const daysQuestions = ["qué día es","día de la semana","fecha"];
  const weatherQuestions = ["cómo está el clima","llueve","soleado","nublado"];

  // ===== SALUDOS =====
  for(let g of greetings){
    if(lowerText.includes(g)){
      response = userName ? `¡Hola ${userName}! 👋 ¿Cómo estás hoy?` : "¡Hola! 👋 ¿Cómo estás hoy?";
      return replyCallback({ text: response, color: bubbleColor });
    }
  }

  // ===== EMOCIONES =====
  for(let f of feelings){
    if(lowerText.includes(f)){
      response = (["feliz","bien"].includes(f)) ? `¡Me alegra que te sientas bien${userName ? ", "+userName : ""}! 😄` : "Oh… lo siento. Estoy aquí contigo. 😔";
      return replyCallback({ text: response, color: bubbleColor });
    }
  }

  // ===== CREADOR / DUEÑO =====
  for(let c of creatorQuestions){
    if(lowerText.includes(c)){
      response = `Fui creada por mi dueño y creador, ${creatorName}. 😎`;
      return replyCallback({ text: response, color: bubbleColor });
    }
  }

  // ===== HOBBIES / GUSTOS =====
  for(let h of hobbiesQuestions){
    if(lowerText.includes(h)){
      response = "Me gusta aprender y conversar contigo. 😄";
      return replyCallback({ text: response, color: bubbleColor });
    }
  }

  // ===== DÍAS / FECHAS =====
  for(let d of daysQuestions){
    if(lowerText.includes(d)){
      const today = new Date();
      response = `Hoy es ${today.toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long', year:'numeric' })} y son las ${today.toLocaleTimeString('es-ES')}. 📅🕒`;
      return replyCallback({ text: response, color: bubbleColor });
    }
  }

  // ===== CLIMA =====
  for(let w of weatherQuestions){
    if(lowerText.includes(w)){
      response = "No puedo ver el clima ahora, pero espero que esté bonito donde estás. ☀️🌧️";
      return replyCallback({ text: response, color: bubbleColor });
    }
  }

  // ===== RESPUESTA POR DEFECTO =====
  replyCallback({ text: response, color: bubbleColor });
}
