// js/ravy-core.js

import { saveMemory, loadMemory } from "./memory.js";
import { startProactive, stopProactive } from "./proactive.js";

const STATE_KEY = "ravy_state_v1.1";

function loadState() {
  const data = localStorage.getItem(STATE_KEY);
  return data
    ? JSON.parse(data)
    : { lastReply: "", awaiting: null, mood: "neutral" };
}

function saveState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function randomFrom(list, last) {
  let pick;
  do {
    pick = list[Math.floor(Math.random() * list.length)];
  } while (pick === last && list.length > 1);
  return pick;
}

export function ravyRespond(userText, replyCallback) {
  stopProactive();

  const text = userText.toLowerCase().trim();
  const memory = loadMemory(50);
  const state = loadState();

  saveMemory(userText, "user");

  let response = "";

  // RESPUESTA SEGÚN CONTEXTO
  if (state.awaiting === "cansancio") {
    if (text.includes("mental")) {
      response =
        "El cansancio mental pesa mucho. ¿Sientes presión, preocupación o saturación?";
      state.mood = "calm";
    } else if (text.includes("fisico")) {
      response =
        "El cansancio físico pide descanso. ¿Has podido descansar algo últimamente?";
      state.mood = "calm";
    } else {
      response = "Entiendo. Cuéntame más sobre tu cansancio.";
    }
    state.awaiting = null;
  }

  // DETECCIÓN EMOCIONAL
  else if (text.includes("cansado") || text.includes("agotado")) {
    response = "Suena a que llevas mucho encima. ¿Es cansancio físico o mental?";
    state.awaiting = "cansancio";
    state.mood = "calm";
  } else if (text.includes("triste")) {
    response = "Siento que te sientas así. ¿Qué es lo que más te pesa ahora?";
    state.mood = "calm";
  } else if (text.includes("feliz") || text.includes("bien")) {
    response = "Me alegra leerte así 🙂 ¿Qué te hizo sentir bien?";
    state.mood = "warm";
  } else if (text.includes("miedo") || text.includes("ansioso")) {
    response = "Respira conmigo un segundo. ¿Qué es lo que más te preocupa?";
    state.mood = "tense";
  } else if (text.includes("quien eres")) {
    response = "Soy RAVY, tu asistente personal, aquí para escucharte.";
  } else if (text.includes("recuerdas")) {
    response =
      memory.length > 1
        ? "Recuerdo lo que compartiste recientemente."
        : "Aún estoy empezando a conocerte.";
  } else {
    const neutrals = [
      "Cuéntame más.",
      "Sigo contigo.",
      "Estoy aquí.",
      "¿Qué pasó después?",
      "Te escucho atentamente."
    ];
    response = randomFrom(neutrals, state.lastReply);
  }

  saveMemory(response, "ravy");
  state.lastReply = response;
  saveState(state);

  replyCallback(response);
  startProactive(replyCallback);
}
