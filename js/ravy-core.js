export function ravyRespond(text, replyCallback) {
  const lowerText = text.toLowerCase();

  // Detectar emociones simples
  let emotion = "neutral"; // default
  if(lowerText.includes("feliz") || lowerText.includes("genial") || lowerText.includes("bien")) emotion = "happy";
  if(lowerText.includes("triste") || lowerText.includes("cansado") || lowerText.includes("mal")) emotion = "sad";
  if(lowerText.includes("enojado") || lowerText.includes("frustrado")) emotion = "angry";

  // Generar respuesta diferente según emoción
  let response = "";
  switch(emotion){
    case "happy":
      response = `¡Me alegra que te sientas bien! 😄`;
      break;
    case "sad":
      response = `Oh… lo siento. Estoy aquí contigo. 😔`;
      break;
    case "angry":
      response = `Respira profundo, todo va a estar bien. 😐`;
      break;
    default:
      response = `Entiendo… Cuéntame más.`;
  }

  // Color gris uniforme
  const bubbleColor = "#555555";

  // Devolver respuesta
  replyCallback({ text: response, color: bubbleColor });
}
