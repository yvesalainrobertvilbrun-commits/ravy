// js/proactive.js

let proactiveTimer = null;

const proactiveMessages = [
  "¿Sigues ahí?",
  "Si quieres, podemos seguir.",
  "A veces el silencio también dice cosas.",
  "Estoy presente.",
  "No tienes que escribir perfecto."
];

export function startProactive(callback, delay = 15000) {
  stopProactive();
  proactiveTimer = setTimeout(() => {
    const msg =
      proactiveMessages[
        Math.floor(Math.random() * proactiveMessages.length)
      ];
    callback(msg);
  }, delay);
}

export function stopProactive() {
  if (proactiveTimer) {
    clearTimeout(proactiveTimer);
    proactiveTimer = null;
  }
}
