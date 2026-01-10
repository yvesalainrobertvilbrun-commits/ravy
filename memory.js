const KEY = "ravy_memoria";

let memoria = JSON.parse(localStorage.getItem(KEY)) || {
  historial: [],
  resumen: ""
};

export function saveMemory(texto){
  memoria.historial.push(texto);
  memoria.resumen = memoria.historial.slice(-3).join(". ");
  localStorage.setItem(KEY, JSON.stringify(memoria));
}

export function getMemory(){
  return memoria.resumen;
}
