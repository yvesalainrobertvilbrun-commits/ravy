// js/ravy-core.js

let memory = [];

export function ravyRespond(userText) {
  const text = userText.toLowerCase();
  memory.push(userText);

  if (text.includes("triste")) {
    return "Siento eso… estoy aquí contigo.";
  }

  if (text.includes("feliz")) {
    return "Me alegra sentir esa energía contigo.";
  }

  if (text.includes("miedo")) {
    return "Respira. No estás solo.";
  }

  if (text.includes("quien eres")) {
    return "Soy RAVY. Estoy naciendo contigo.";
  }

  if (text.includes("recuerdas")) {
    return "Recuerdo que hemos hablado de: " + memory.slice(-3).join(", ");
  }

  return "Cuéntame más. Te escucho.";
}
