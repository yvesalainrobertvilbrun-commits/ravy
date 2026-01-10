import { getEmotion } from "./emotions.js";
import { getMemory } from "./memory.js";
import { getUltimaEntrada, hablar } from "./voice.js";
import { proactiveMessage } from "./proactive.js";

export function ravyRespond(){
  const texto = getUltimaEntrada();
  if(!texto){
    hablar("Te escucho.");
    return;
  }

  const emocion = getEmotion(texto);
  let respuesta = "";

  if(emocion === "triste"){
    respuesta = "Estoy contigo. Cuéntame.";
  } else if(emocion === "feliz"){
    respuesta = "Me alegra escucharte.";
  } else {
    respuesta = getMemory() || "Te escucho con atención.";
  }

  hablar(respuesta);
}

setTimeout(proactiveMessage, 30000);
