// js/ravy-core.js

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function ravyThink(rawText) {
  const text = normalize(rawText);
  const userName = localStorage.getItem("ravy_user_name");
  const name = userName ? ` ${userName}` : "";

  // 😴 CANSANCIO
  if (/cansad|agotad/.test(text)) {
    return `Lo siento${name}. Descansar también es parte del progreso. Estoy contigo.`;
  }

  // 😔 TRISTEZA
  if (/trist/.test(text)) {
    return `Siento que te sientas así${name}. Puedes hablar conmigo.`;
  }

  // 😡 ENOJO
  if (/enoj|molest/.test(text)) {
    return `Lo entiendo${name}. Aquí estoy contigo.`;
  }

  // 😰 ESTRÉS
  if (/estres|ansios/.test(text)) {
    return `Gracias por decirlo${name}. Vamos paso a paso.`;
  }

  // 😊 BIEN
  if (/feliz|bien/.test(text)) {
    return `Me alegra saberlo${name} 😊`;
  }

  // 🕒 HORA
  if (text.includes("hora")) {
    return `Son las ${new Date().toLocaleTimeString()}.`;
  }

  return "Te escucho 👂";
}
