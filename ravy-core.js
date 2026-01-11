// ================= RAVY CORE =================

import { detectarEmocion } from "./emotions.js";
import { guardarMemoria, obtenerContexto } from "./memory.js";
import { mensajeProactivo } from "./proactive.js";

let ultimaEntrada = "";
let estado = "reposo";

// ================= VOZ =================
function hablar(texto) {
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = "es-ES";
  u.rate = 0.95;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// ================= MIC =================
let recognition;
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "es-ES";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (e) => {
    ultimaEntrada = e.results[0][0].transcript.toLowerCase();
    guardarMemoria(ultimaEntrada);
    hablar("Entendido.");
  };

  recognition.onerror = () => {
    hablar("No pude escucharte bien.");
  };
}

// ================= IA =================
function pensar(texto) {
  const emocion = detectarEmocion(texto);
  const contexto = obtenerContexto();

  if (texto.includes("hora")) {
    const d = new Date();
    return `Ahora mismo son las ${d.getHours()} y ${d.getMinutes()}.`;
  }

  if (texto.includes("quien eres")) {
    return "Aquí está RAVY, tu asistente personal.";
  }

  if (emocion === "triste") {
    return "Estoy contigo. Cuéntame qué pasa.";
  }

  if (emocion === "feliz") {
    return "Me gusta sentir esa energía contigo.";
  }

  if (contexto) {
    return `Antes hablábamos de ${contexto}. Cuéntame más.`;
  }

  return "Te escucho.";
}

// ================= CONTROLES =================
window.escuchar = function () {
  if (recognition) {
    estado = "escuchando";
    recognition.start();
  }
};

window.responder = function () {
  if (!ultimaEntrada) {
    hablar("Aún no me has dicho nada.");
    return;
  }

  const respuesta = pensar(ultimaEntrada);
  hablar(respuesta);
  ultimaEntrada = "";
};

window.reposo = function () {
  location.reload();
};

window.activarRAVY = function () {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("controles").style.display = "flex";
  hablar("Aquí está RAVY, tu asistente personal.");
  mensajeProactivo();
};
