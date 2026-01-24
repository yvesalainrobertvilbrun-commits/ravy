export function ravyRespond(text, replyCallback) {
  const lowerText = text.toLowerCase().trim();
  let response = "No estoy segura de eso… Cuéntame más."; // default
  const bubbleColor = "#555555"; // gris uniforme

  // ===== RESPUESTAS PREDEFINIDAS =====
  const greetings = ["hola", "buenos días", "buenas tardes", "buenas noches"];
  const feelings = ["feliz", "triste", "cansado", "bien", "mal"];
  const creatorQuestions = ["quién te creó", "quién es tu dueño", "dueño", "creador"];

  // ===== SALUDOS =====
  for(let g of greetings){
    if(lowerText.includes(g)){
      response = "¡Hola! 👋 ¿Cómo estás hoy?";
      return replyCallback({ text: response, color: bubbleColor });
    }
  }

  // ===== EMOCIONES =====
  for(let f of feelings){
    if(lowerText.includes(f)){
      switch(f){
        case "feliz":
        case "bien":
          response = "¡Me alegra que te sientas bien! 😄";
          break;
        case "triste":
        case "mal":
        case "cansado":
          response = "Oh… lo siento. Estoy aquí contigo. 😔";
          break;
      }
      return replyCallback({ text: response, color: bubbleColor });
    }
  }

  // ===== CREADOR / DUEÑO =====
  for(let c of creatorQuestions){
    if(lowerText.includes(c)){
      response = "Fui creada por mi dueño y creador. 😎";
      return replyCallback({ text: response, color: bubbleColor });
    }
  }

  // ===== RESPUESTA POR DEFECTO =====
  replyCallback({ text: response, color: bubbleColor });
}
