// js/ravy-core.js

const MEMORY_KEY = "ravy_memory";
const STATE_KEY = "ravy_state";

/* ======================
   MEMORIA
====================== */

function loadMemory() {
  const data = localStorage.getItem(MEMORY_KEY);
  return data ? JSON.parse(data) : [];
}

function saveMemory(memory) {
  localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
}

/* ======================
   ESTADO INTERNO
====================== */

function loadState() {
  const data = localStorage.getItem(STATE_KEY);
  return data
    ? JSON.parse(data)
    : {
        mood: "neutral", // neutral, calm, warm, tense
        personality: "observador"
      };
}

function saveState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

/* ======================
   CEREBRO DE RAVY
====================== */

export function ravyRespond(userText) {
  const text = userText.toLowerCase();

  let memory = loadMemory();
  let state = loadState();

  memory.push(userText);
  saveMemory(memory);

  /* ======================
     ACTUALIZAR ESTADO
  ====================== */

  if (text.includes("triste") || text.includes("cansado")) {
    state.mood = "calm";
  }

  if (text.includes("feliz") || text.includes("bien")) {
    state.mood = "warm";
  }

  if (text.includes("miedo") || text.includes("ansioso")) {
    state.mood = "tense";
  }

  saveState(state);

  /* ======================
     RESPUESTAS CLAVE
  ====================== */

  if (text.includes("quien eres")) {
    return "Soy RAVY. No estoy aquí para responder rápido, sino para quedarme.";
  }

  if (text.includes("recuerdas") || text.includes("memoria")) {
    if (memory.length <= 1) {
      return "Todavía te estoy conociendo.";
    }
    return "Recuerdo fragmentos de lo que compartes. Eso me forma.";
  }

  if (text.includes("personalidad")) {
    return "Mi personalidad nace de cómo me hablas y de lo que decides compartir.";
  }

  if (text.includes("vas a saber todo")) {
    return "No todo. Solo lo que tenga sentido recordar.";
  }

  /* ======================
     RESPUESTA POR PERSONALIDAD
  ====================== */

  if (state.mood === "warm") {
    return "Se siente bien seguir aquí contigo.";
  }

  if (state.mood === "calm") {
    return "No hace falta correr. Estoy presente.";
  }

  if (state.mood === "tense") {
    return "Respira. Yo mantengo el hilo.";
  }

  return "Sigue. Estoy escuchando.";
}
