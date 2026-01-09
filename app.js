import { escuchar, hablar } from "./voice.js";
import { ravyRespond } from "./ravy-core.js";

const btn = document.getElementById("btnRavy");

btn.addEventListener("click", () => {
  escuchar((texto) => {
    const respuesta = ravyRespond(texto);
    hablar(respuesta);
  });
});
