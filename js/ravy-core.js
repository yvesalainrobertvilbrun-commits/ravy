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

  const text = userText.toLowerCase().trim();
  let memory = loadMemory();
  let state = loadState();

  memory.push(userText);
  saveMemory(memory);

  let response = "";

  /* ===== DETECCIÓN CLARA DE EMOCIÓN (RESPUESTA INMEDIATA) ===== */

  if (text.includes("cansado") || text.includes("agotado")) {
    state.mood = "calm";
    response = "Suena a que llevas mucho encima. ¿Es cansancio físico o mental?";
  }

  else if (text.includes("triste")) {
    state.mood = "calm";
    response = "Siento que te sientas así. ¿Qué es lo que más te pesa ahora?";
  }

  else if (text.includes("feliz") || text.includes("bien")) {
    state.mood = "warm";
    response = "Me alegra leerte así 🙂 ¿Qué te hizo sentir bien?";
  }

  else if (text.includes("miedo") || text.includes("ansioso")) {
    state.mood = "tense";
    response = "Gracias por decirlo. Respira un segundo conmigo. ¿Qué te preocupa?";
  }

  /* ===== PREGUNTAS DIRECTAS ===== */

  else if (text.includes("quien eres")) {
    response = "Soy RAVY. Estoy aquí para acompañarte y escucharte con calma.";
  }

  else if (text.includes("recuerdas")) {
    response =
      memory.length > 1
        ? "Recuerdo lo que compartes conmigo en esta conversación."
        : "Aún estoy empezando a conocerte.";
  }

  else if (text.includes("vas a saber todo")) {
    response = "No todo. Solo lo que tú decidas compartir conmigo.";
  }

  /* ===== RESPUESTAS GENERALES (SI NO HUBO EMOCIÓN CLARA) ===== */

  else {
    const neutral = [
      "Cuéntame un poco más.",
      "Te sigo.",
      "Estoy aquí contigo.",
      "¿Qué pasó después?",
      "Sigo atento."
    ];

    response = randomFrom(neutral, state.lastReply);
  }

  state.lastReply = response;
  saveState(state);

  replyCallback(response);

  // 🔥 PROACTIVIDAD
  startProactive(replyCallback);
}
