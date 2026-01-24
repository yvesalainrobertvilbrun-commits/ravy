export function ravyRespond(text, replyCallback) {
  // Genera respuesta simple
  const response = `RAVY dice: ${text.split("").reverse().join("")}`;
  
  // Color gris uniforme
  const bubbleColor = "#555555";

  // Devuelve respuesta con color
  replyCallback({ text: response, color: bubbleColor });
}
