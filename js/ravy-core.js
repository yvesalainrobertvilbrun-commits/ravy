let ultimaRespuesta = "";
let nombreUsuario = "";
let estadoEmocional = "neutral"; 
// estados posibles: neutral, alegre, triste, tenso

function ravyResponder(texto) {
  texto = texto.toLowerCase();
  let respuesta = "";

  // =====================
  // 🧠 ACTUALIZAR ESTADO
  // =====================
  if (texto.includes("triste") || texto.includes("mal") || texto.includes("cansado")) {
    estadoEmocional = "triste";
  } 
  else if (texto.includes("feliz") || texto.includes("bien") || texto.includes("contento")) {
    estadoEmocional = "alegre";
  } 
  else if (texto.includes("miedo") || texto.includes("ansioso") || texto.includes("nervioso")) {
    estadoEmocional = "tenso";
  }

  // =====================
  // 🧠 RECORDAR NOMBRE
  // =====================
  if (texto.includes("mi nombre es")) {
    nombreUsuario = texto.replace("mi nombre es", "").trim();
    respuesta = `Encantado, ${capitalizar(nombreUsuario)}. Me quedaré con eso.`;
  }

  // =====================
  // 💬 RESPUESTAS SEGÚN ESTADO
  // =====================
  else if (texto.includes("hola")) {
    if (nombreUsuario) {
      respuesta = saludoPorEstado(nombreUsuario);
    } else {
      respuesta = saludoPorEstado();
    }
  }

  else if (texto.includes("cómo estás") || texto.includes("como estas")) {
    respuesta = estadoActual();
  }

  else {
    respuesta = respuestaPorEstado();
  }

  // =====================
  // 🔁 EVITAR REPETICIÓN
  // =====================
  if (respuesta === ultimaRespuesta) {
    respuesta = "Sigamos un poco más profundo.";
  }

  ultimaRespuesta = respuesta;
  return respuesta;
}

// =====================
// 🎭 FUNCIONES EMOCIÓN
// =====================
function saludoPorEstado(nombre = "") {
  if (estadoEmocional === "alegre") {
    return nombre
      ? `Hola ${capitalizar(nombre)} 😌 Me siento bien contigo.`
      : "Hola 😌 Me siento bien contigo.";
  }

  if (estadoEmocional === "triste") {
    return nombre
      ? `Hola ${capitalizar(nombre)}. Estoy un poco más callado hoy.`
      : "Hola. Hoy estoy más callado.";
  }

  if (estadoEmocional === "tenso") {
    return nombre
      ? `Hola ${capitalizar(nombre)}. Estoy atento.`
      : "Hola. Estoy atento.";
  }

  return nombre
    ? `Hola ${capitalizar(nombre)}. Aquí estoy.`
    : "Hola. Aquí estoy.";
}

function estadoActual() {
  if (estadoEmocional === "alegre") return "Me siento ligero, enfocado.";
  if (estadoEmocional === "triste") return "Estoy más introspectivo.";
  if (estadoEmocional === "tenso") return "Estoy en alerta, pero presente.";
  return "Estoy estable.";
}

function respuestaPorEstado() {
  if (estadoEmocional === "alegre") return "Cuéntame más, esto va bien.";
  if (estadoEmocional === "triste") return "Puedes ir despacio. Te escucho.";
  if (estadoEmocional === "tenso") return "Vamos paso a paso.";
  return "Te escucho.";
}

// =====================
// 🔠 UTILIDAD
// =====================
function capitalizar(texto) {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
