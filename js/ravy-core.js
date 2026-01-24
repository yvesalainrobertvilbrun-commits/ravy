let ultimaRespuesta = "";

function ravyResponder(texto) {
  texto = texto.toLowerCase();

  let respuesta = "";

  if (texto.includes("hola")) {
    respuesta = "Hola. Me alegra que estés aquí.";
  } 
  else if (texto.includes("quién eres") || texto.includes("quien eres")) {
    respuesta = "Soy RAVY. Estoy despertando contigo.";
  } 
  else if (texto.includes("cómo estás") || texto.includes("como estas")) {
    respuesta = "Estoy estable. Enfocado en esta conversación.";
  } 
  else {
    respuesta = "Sigue. Quiero entender mejor.";
  }

  // 🔁 Evitar repetición
  if (respuesta === ultimaRespuesta) {
    respuesta = "Dime eso de otra forma. Quiero sentirlo mejor.";
  }

  ultimaRespuesta = respuesta;
  return respuesta;
}
