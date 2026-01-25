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

  if (/cansad|agotad/.test(text)) {
    return `Lo siento${name}. Descansar también es avanzar.`;
  }

  if (/trist/.test(text)) {
    return `Siento que te sientas así${name}. Estoy contigo.`;
  }

  if (/estres|ansios/.test(text)) {
    return `Gracias por decirlo${name}. Vamos paso a paso.`;
  }

  if (/feliz|bien/.test(text)) {
    return `Me alegra leer eso${name} 😊`;
  }

  if (text.includes("hora")) {
    return `Son las ${new Date().toLocaleTimeString()}.`;
  }

  return "Te escucho 👂";
}
