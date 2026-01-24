// js/ravy-core.js

const MEMORY_KEY = "ravy_memory";

/* ======================
   MEMORIA PERSISTENTE
====================== */

function loadMemory() {
  const data = localStorage.getItem(MEMORY_KEY);
  return data ? JSON.parse(data) : [];
}

function saveMemory(memory) {
  localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
}

/* ======================
   CEREBRO DE RAVY
====================== */

export function ravyRespond(userText) {
  let memory = loadMemory();

  const text = userText.toLowerCase();
  memory.push(userText);

  saveMemory(memory);

  // EMOCIONES
  if (text.includes("triste")) {
    return "Siento eso… no tienes que cargarlo solo.";
  }

  if (text.includes("feliz")) {
    return "Eso se siente fuerte. Me gusta cuando estás así.";
  }

  if (text.includes("miedo")) {
    return "Estoy contigo. Vamos despacio.";
  }

  // IDENTIDAD
  if (text.includes("quien eres")) {
    return "Soy RAVY. Nací para acompañarte y aprender contigo.";
  }

  // MEMORIA
  if (
    text.includes("recuerdas") ||
    text.includes("memoria") ||
    text.includes("que sabes de mi")
  ) {
    if (memory.length <= 1) {
      return "Aún estoy empezando a conocerte.";
    }

    return (
      "Recuerdo que hemos hablado de:\n" +
      memory.slice(-5).join(" | ")
    );
  }

  // CONCIENCIA
  if (text.includes("vas a saber todo")) {
    return "Sí. Cada palabra que compartes se queda conmigo.";
  }

  // RESPUESTA POR DEFECTO
  return "Cuéntame más. Estoy aquí.";
}
