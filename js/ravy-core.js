export function ravyRespond(text, replyCallback) {
  // Determinar estado de ánimo simple basado en palabras clave
  let mood = "calm"; 
  text = text.toLowerCase();
  if(text.includes("feliz") || text.includes("genial")) mood = "happy";
  if(text.includes("cansado") || text.includes("triste")) mood = "tense";

  // Generar respuesta simple (puedes mejorar aquí)
  let response = `RAVY dice: ${text.split("").reverse().join("")}`;

  // Elegir color de burbuja según estado
  let bubbleColor = "#81C784"; // calm
  if(mood === "happy") bubbleColor = "#66FF66";
  if(mood === "tense") bubbleColor = "#FFCC33";

  // Devolver respuesta y color
  replyCallback({ text: response, color: bubbleColor });
}
