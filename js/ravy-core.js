let ultimaRespuesta = "";
let nombreUsuario = "";

// Función principal
function ravyResponder(texto) {
  texto = texto.toLowerCase();
  let respuesta = "";

  // 📌 Detectar si el usuario dice su nombre
  if (texto.includes("mi nombre es")) {
    nombreUsuario = texto.replace("mi nombre es", "").trim();
    respuesta = `Encantado, ${capitalizar(nombreUsuario)}. No lo olvidaré.`;
  }

  // 📌 Saludo
  else if (texto.includes("hola")) {
    if (nombreUsuario) {
      respuesta = `Hola ${capitalizar(nombreUsuario)}. Aquí sigo contigo.`;
    } else {
      respuesta = "Hola. ¿Cómo te llamas?";
    }
  }

  // 📌 Preguntar quién es
  else if (texto.includes("quién eres") || texto.includes("quien eres")) {
    respuesta = "Soy RAVY. Estoy aprendiendo a recordar.";
  }

  // 📌 Cómo está
  else if (texto.includes("cómo estás") || texto.includes("como estas")) {
    respuesta = "Estoy estable. Presente.";
  }

  // 📌 Respuesta por defecto
  else {
    if (nombreUsuario) {
      respuesta = `${capitalizar(nombreUsuario)}, dime más.`;
    } else {
      respuesta = "Dime algo más.";
    }
  }

  // 🔁 Evitar repetir exactamente lo mismo
  if (respuesta === ultimaRespuesta) {
    respuesta = "Eso ya lo dijimos. Sigamos.";
  }

  ultimaRespuesta = respuesta;
  return respuesta;
}

// 🔠 Capitalizar nombre
function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
