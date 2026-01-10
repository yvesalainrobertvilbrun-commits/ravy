import { saveMemory } from "./memory.js";

let ultimaEntrada = "";

export function escucharVoz(){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SpeechRecognition){
    alert("Micrófono no soportado");
    return;
  }

  const rec = new SpeechRecognition();
  rec.lang = "es-ES";
  rec.onresult = e => {
    ultimaEntrada = e.results[0][0].transcript;
    saveMemory(ultimaEntrada);
  };
  rec.start();
}

export function hablar(texto){
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = "es-ES";
  speechSynthesis.speak(u);
}

export function getUltimaEntrada(){
  return ultimaEntrada;
}
