export let memory = [];

// Guardar mensaje simple
export function saveMessage(msg) {
  memory.push(msg);
  if(memory.length > 100) memory.shift(); // último 100 mensajes
}

// Aprendizaje de frases
export function learnResponse(key, answer) {
  memory.push({ key: key.toLowerCase(), answer });
}

// Buscar respuesta aprendida
export function getLearnedResponse(text) {
  const found = memory.find(m => m.key && text.toLowerCase().includes(m.key));
  return found ? found.answer : null;
}
