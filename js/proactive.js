import { addMessage } from './ravy.js';

setInterval(() => {
  addMessage({text: "RAVY: ¿Sigues ahí?", color: "#555555"}, "ravy");
}, 60000); // cada 60 segundos
