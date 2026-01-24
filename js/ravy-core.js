export function ravyRespond(text, replyCallback) {
  const lowerText = text.toLowerCase().trim();
  const bubbleColor = "#555555"; // gris uniforme
  let response = "No estoy segura de eso… Cuéntame más."; // default

  // ===== CATEGORÍAS =====
  const greetings = ["hola", "buenos días", "buenas tardes", "buenas noches"];
  const feelings = ["feliz", "triste", "cansado", "bien", "mal"];
  const creatorQuestions = ["quién te creó", "quién es tu dueño", "dueño", "creador"];
  const hobbiesQuestions = ["qué te gusta", "hobbies", "gustos"];
  const daysQuestions = ["qué día es", "día de la semana", "fecha"];
  const weatherQuestions = ["cómo está el clima", "llueve", "soleado", "nublado"];

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
      response = `Hoy es ${today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}. 📅`;
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
