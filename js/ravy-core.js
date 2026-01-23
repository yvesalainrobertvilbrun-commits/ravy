import { getEmotion } from "./emotions.js";
import { saveMemory, getMemory } from "./memory.js";

export function ravyRespond(userText) {
  const emotion = getEmotion(userText);
  saveMemory(userText, emotion);

  if (emotion === "triste") {
    return "Estoy aquí contigo. Puedes tomarte tu tiempo.";
  }

  if (emotion === "feliz") {
    return "Me alegra sentir tu energía. Cuéntame más.";
  }

  if (emotion === "miedo") {
    return "Respira conmigo. No estás solo.";
  }

  const last = getMemory();
  if (last) {
    return "Te escucho. Antes mencionaste algo importante.";
  }

  return "Cuéntame más, estoy atento.";
}
