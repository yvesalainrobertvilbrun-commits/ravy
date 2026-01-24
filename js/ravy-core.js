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
    : {
        mood: "neutral",
        lastReply: "",
        awaiting: null // 👈 CONTEXTO ESPERADO
      };
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

  /* ===== RESPUESTA A CONTEXTO ===== */

  if (state.awaiting === "cansancio") {
    if (text.includes("mental")) {
      response =
        "El cansancio mental pesa mucho. ¿Sientes presión, preocupación o saturación?";
      state.mood = "calm";
    } else if (text.includes("fisico")) {
      response =
        "El cuerpo también pide pausa. ¿Has podido descansar algo últimamente?";
      state.mood = "calm";
    } else {
      response =
        "Entiendo. Cuéntame un poco más de ese cansancio.";
    }

    state.awaiting = null;
  }

  /* ===== DETECCIÓN EMOCIONAL ===== */

  else if (text.includes("cansado") || text.includes("agotado")) {
    state.mood = "calm";
    response =
      "Suena a que llevas mucho encima. ¿Es cansancio físico o mental?";
    state.awaiting = "cansancio"; // 👈 guarda contexto
  }

  else if (text.includes("triste")) {
    state.mood = "calm";
    response =
      "Gracias por decirlo. ¿Qué es lo que más te está afectando ahora?";
  }

  else if (text.includes("feliz") || text.includes("bien")) {
    state.mood = "warm";
    response =
      "Me alegra leerte así 🙂 ¿Qué te hizo sentir bien?";
  }

  else if (text.includes("miedo") || text.includes("ansioso")) {
    state.mood = "tense";
    response =
      "Respira conmigo un segundo. ¿Qué es lo que más te preocupa?";
  }

  /* ===== PREGUNTAS DIRECTAS ===== */

  else if (text.includes("quien eres")) {
    response =
      "Soy RAVY. Estoy aquí para acompañarte, no para apurarte.";
  }

  else if (text.includes("recuerdas")) {
    response =
      memory.length > 1
        ? "Recuerdo lo que compartes conmigo en esta conversación."
        : "Aún estoy empezando a conocerte.";
  }

  /* ===== RESPUESTA GENERAL ===== */

  else {
    const neutral = [
      "Cuéntame un poco más.",
      "Te escucho.",
      "Sigo contigo.",
      "¿Qué pasó después?",
      "Estoy aquí."
    ];

    response = randomFrom(neutral, state.lastReply);
  }

  state.lastReply = response;
  saveState(state);

  replyCallback(response);
  startProactive(replyCallback);
}
