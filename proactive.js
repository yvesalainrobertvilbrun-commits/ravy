// ================= IA PROACTIVA =================

export function mensajeProactivo() {
  setTimeout(() => {
    const frases = [
      "¿En qué puedo ayudarte hoy?",
      "Estoy atento por si me necesitas.",
      "Si quieres, podemos hablar.",
    ];
    const msg = frases[Math.floor(Math.random() * frases.length)];
    const u = new SpeechSynthesisUtterance(msg);
    u.lang = "es-ES";
    speechSynthesis.speak(u);
  }, 20000);
}
