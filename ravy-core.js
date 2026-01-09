import { getEmotion } from "./emotions.js";
import { saveMemory, getMemory } from "./memory.js";
import { proactiveMessage } from "./proactive.js";

export function ravyRespond(userText) {
  const emotion = getEmotion(userText);
  saveMemory(userText, emotion);

  if (userText.includes("hora")) {
    const d = new Date();
    return `Son las ${d.getHours()} con ${d.getMinutes()}.`;
  }

  if (emotion === "triste") {
    return "Estoy aquí contigo. No estás solo.";
  }
  if (emotion === "feliz") {
    return "Me alegra sentir tu energía.";
  }
  if (emotion === "miedo") {
    return "Respira, vamos paso a paso.";
  }

  return getMemory() || "Cuéntame más, quiero aprender de ti.";
}

setTimeout(() => {
  proactiveMessage();
}, 30000);
