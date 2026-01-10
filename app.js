import { escucharVoz, hablar } from "./voice.js";
import { ravyRespond } from "./ravy-core.js";

const inicio = document.getElementById("inicio");
const interfaz = document.getElementById("interfaz");

document.getElementById("btnInicio").onclick = () => {
  inicio.style.display = "none";
  interfaz.classList.remove("oculto");
  hablar("Aquí está RAVY, tu asistente personal.");
};

document.getElementById("btnEscuchar").onclick = () => {
  escucharVoz();
};

document.getElementById("btnResponder").onclick = () => {
  ravyRespond();
};

document.getElementById("btnReposo").onclick = () => {
  location.reload();
};
