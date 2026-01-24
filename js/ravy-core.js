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
    : { mood: "neutral", lastReply: "" };
}

function saveState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

/* ========= UTIL ========= */

function randomFrom(list, last) {
  let pick;
  do {
    pick = list[Math.floor(Math.random() * list.length)];
  } while (pick === last && list.length > 1);
  return pick;
}

/* ========= CEREBRO ========= */

export function ravyRespond(userText, replyCallback) {
  stopProactive();

  const text = userText.toLowerCase();
  let memory = loadMemory();
  let state = loadState();

  memory.push(userText);
  saveMemory(memory);

  // detectar estado emocional
  if (text.includes("triste") || text.includes("cansado")) {
    state.mood = "calm";
  } else if (text.includes("feliz") || text.includes("bien")) {
    state.mood = "warm";
  } else if (text.includes("miedo") || text.includes("ansioso")) {
    state.mood = "tense";
  }

  let response = "";

  // respuestas con intención
  if (text.includes("quien eres")) {
    response = "Soy RAVY. No estoy aquí para responder rápido, sino para quedarme.";
  } 
  else if (text.includes("recuerdas")) {
    response =
      memory.length > 1
        ? "Recuerdo fragmentos de lo que compartes conmigo."
        : "Aún estoy empezando a conocerte.";
  } 
  else if (text.includes("vas a saber todo")) {
    response = "No todo. Solo lo que tenga sentido recordar.";
  }
  else {
    // respuestas variadas según estado
    const neutral = [
      "Cuéntame más.",
      "Sigo contigo.",
      "Estoy atento.",
      "¿Qué pasó después?",
      "Continúa."
    ];

    const warm = [
      "Se siente bien leerte así.",
      "Me gusta esa energía.",
      "Eso dice mucho de ti."
    ];

    const calm = [
      "Tómate tu tiempo.",
      "No hay prisa.",
      "Estoy aquí contigo."
    ];

    const tense = [
      "Respira un segundo.",
      "Estoy sosteniendo el momento.",
      "No estás solo aquí."
    ];

    let pool = neutral;
    if (state.mood === "warm") pool = warm;
    if (state.mood === "calm") pool = calm;
    if (state.mood === "tense") pool = tense;

    response = randomFrom(pool, state.lastReply);
  }

  state.lastReply = response;
  saveState(state);

  replyCallback(response);

  // proactividad
  startProactive(replyCallback);
}
