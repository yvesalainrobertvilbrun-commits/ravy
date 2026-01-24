import { addMessage } from './ravy.js';

let timer = setInterval(() => {
  addMessage({text: "RAVY: ¿Sigues ahí?", color: "#81C784"}, "ravy");
}, 60000); // cada 60s
