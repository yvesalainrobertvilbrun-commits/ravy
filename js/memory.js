export let memory = []; // memoria general

// Guardar mensaje o respuesta
export function saveMessage(msg) {
  memory.push(msg);
  if(memory.length > 100) memory.shift(); // último 100 mensajes
}

// Recuperar información aprendida
export function learnResponse(key, answer) {
  // Guardamos como objeto clave-respuesta
  memory.push({ key: key.toLowerCase(), answer });
}

// Buscar respuesta aprendida
export function getLearnedResponse(text) {
  const found = memory.find(m => m.key && text.toLowerCase().includes(m.key));
  return found ? found.answer : null;
}
