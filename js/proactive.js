// js/proactive.js

let proactiveTimer = null;

const proactiveMessages = [
  "Sigo aquí contigo.",
  "¿En qué estabas pensando?",
  "Si quieres, podemos seguir.",
  "A veces el silencio también habla.",
  "No tienes que escribir perfecto."
];

function randomMessage() {
  return proactiveMessages[
    Math.floor(Math.random() * proactiveMessages.length)
  ];
}

export function startProactive(callback, delay = 15000) {
  stopProactive();
  proactiveTimer = setTimeout(() => {
    callback(randomMessage());
  }, delay);
}

export function stopProactive() {
  if (proactiveTimer) {
    clearTimeout(proactiveTimer);
    proactiveTimer = null;
  }
}
