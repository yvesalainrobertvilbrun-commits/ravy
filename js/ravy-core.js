export function ravyRespond(text, replyCallback) {
  // Aquí ya no necesitamos mood/color dinámico
  // Generar respuesta simple (puedes mejorar aquí)
  let response = `RAVY dice: ${text.split("").reverse().join("")}`;

  // Color gris uniforme
  const bubbleColor = "#555555"; // gris oscuro para modo noche

  // Devolver respuesta y color
  replyCallback({ text: response, color: bubbleColor });
}
