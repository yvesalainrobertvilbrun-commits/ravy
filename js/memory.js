// ===== RESPUESTAS APRENDIDAS =====
export function learnResponse(question, answer) {
  const memory = JSON.parse(localStorage.getItem("ravy_memory") || "{}");
  memory[question] = answer;
  localStorage.setItem("ravy_memory", JSON.stringify(memory));
}

export function getLearnedResponse(question) {
  const memory = JSON.parse(localStorage.getItem("ravy_memory") || "{}");
  return memory[question];
}

// ===== NOMBRE DEL USUARIO =====
export function saveUserName(name) {
  localStorage.setItem("ravy_user_name", name);
}

export function getUserName() {
  return localStorage.getItem("ravy_user_name");
}

// ===== CREADOR =====
export function getCreatorName() {
  return "Yves";
}

// ===== CIUDAD DEL USUARIO =====
export function saveUserCity(city) {
  localStorage.setItem("ravy_city", city);
}

export function getUserCity() {
  return localStorage.getItem("ravy_city");
}
