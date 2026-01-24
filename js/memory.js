export let memory = []; // mensajes y aprendizajes
export let userInfo = { name: null, creator: "Yves" }; // guardamos info fija y del usuario

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

// Guardar nombre del usuario
export function saveUserName(name) {
  userInfo.name = name;
}

// Obtener nombre del usuario
export function getUserName() {
  return userInfo.name;
}

// Obtener nombre del creador
export function getCreatorName() {
  return userInfo.creator;
}
