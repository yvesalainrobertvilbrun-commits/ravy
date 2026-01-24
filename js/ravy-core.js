// js/ravy-core.js

import { startProactive, stopProactive } from "./proactive.js";

const MEMORY_KEY = "ravy_memory";
const STATE_KEY = "ravy_state";

/* ========= MEMORIA ========= */

function loadMemory() {
  const data = localStorage.getItem(MEMORY_KEY);
  return data ? JSON.parse(data) : [];
}

function saveMemory(memory) {
  localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
}

/* ========= ESTADO ========= */

function loadState() {
  const data = localStorage.getItem(STATE_KEY);
  return data
    ? JSON.parse(data)
    : { mood: "neutral" };
}

function saveState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

/* ========= CEREBRO ========= */

export function ravyRespond(userText, replyCallback) {
  stopProactive();

  let memory = loadMemory();
  let state = loadState();
  const text = userText.toLowerCase();

  memory.push(userText);
  saveMemory(memory);

  if (text.includes("triste") || text.includes("cansado")) {
    state.mood = "calm";
  } else if (text.includes("feliz") || text.includes("bien")) {
    state.mood = "warm";
  } else if (text.includes("miedo") || text.includes("ansioso")) {
    state.mood = "tense";
  }

  saveState(state);

  let response = "";

  if (text.includes("quien eres")) {
    response = "Soy RAVY. Estoy aquí para acompañarte, no para apurarte.";
  } else if (text.includes("recuerdas")) {
    response =
      memory.length > 1
        ? "Recuerdo lo que compartes conmigo."
        : "Aún estoy empezando a conocerte.";
  } else if (text.includes("vas a saber todo")) {
    response = "Recordaré lo que tenga sentido para ti.";
  } else {
    if (state.mood === "warm") response = "Me gusta sentirte así.";
    else if (state.mood === "calm") response = "Tómate tu tiempo. Estoy aquí.";
    else if (state.mood === "tense") response = "Respira. Yo sostengo el momento.";
    else response = "Te escucho.";
  }

  replyCallback(response);

  // 🔥 PROACTIVIDAD ACTIVADA
  startProactive(replyCallback);
}
