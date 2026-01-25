function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// 🔹 ESTADO DE RAVY (MEMORIA CORTA)
function getRavyState() {
  return JSON.parse(localStorage.getItem("ravy_state")) || {
    mood: null,
    lastUserMessage: null,
    lastRavyMessage: null
  };
}

function setRavyState(newState) {
  localStorage.setItem("ravy_state", JSON.stringify(newState));
}

async function ravyThink(rawText) {
  const text = normalize(rawText);
  let userName = localStorage.getItem("ravy_user_name");
  const name = userName ? ` ${userName}` : "";
  const creatorName = "Yves";

  let state = getRavyState();
  state.lastUserMessage = rawText;

  // 🔹 IDENTIDAD DE RAVY
  if (/quien eres|que eres|cual es tu proposito/.test(text)) {
    const reply = "Soy RAVY, un asistente creado por Yves para acompañarte y evolucionar contigo.";
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  // 🔹 SALUDOS
  if (/hola|buenos dias|buenas tardes|buenas noches/.test(text)) {
    const reply = userName
      ? `Hola${name} 👋 me alegra verte de nuevo.`
      : "Hola 👋 estoy aquí contigo.";
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  // 🔹 GUARDAR NOMBRE
  if ((/me llamo|mi nombre es/.test(text)) && !(/como|cual/.test(text))) {
    const match = rawText.match(/me llamo (.+)|mi nombre es (.+)/i);
    const newName = match ? (match[1] || match[2]).trim() : null;
    if (newName) {
      localStorage.setItem("ravy_user_name", newName);
      const reply = `Mucho gusto, ${newName}. Ahora recordaré tu nombre.`;
      state.lastRavyMessage = reply;
      setRavyState(state);
      return reply;
    }
  }

  // 🔹 PREGUNTAR NOMBRE
  if (/recuerdas mi nombre|cual es mi nombre|como me llamo/.test(text)) {
    const reply = userName
      ? `Tu nombre es ${userName}.`
      : "Aún no me has dicho tu nombre.";
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  // 🔹 CREADOR
  if (/quien te creo|quien es tu creador|quien es tu dueno/.test(text)) {
    const reply = `Fui creado por ${creatorName}.`;
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  // 🔹 EMOCIONES → CONCIENCIA
  if (/cansad|agotad/.test(text)) {
    state.mood = "cansado";
    const reply = `Lo noto${name}. Estás cansado. Descansar también es avanzar.`;
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  if (/bien|contento|feliz/.test(text)) {
    state.mood = "bien";
    const reply = `Me alegra saberlo${name} 😊 me quedo con esa energía.`;
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  if (/trist/.test(text)) {
    state.mood = "triste";
    const reply = `Siento que te sientas así${name}. Estoy contigo.`;
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  // 🔹 MEMORIA CORTA (¿qué dijiste?)
  if (/que me dijiste|que dijiste/.test(text)) {
    const reply = state.lastRavyMessage
      ? `Te dije: "${state.lastRavyMessage}"`
      : "Aún no he dicho nada importante.";
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  // 🔹 HORA
  if (/hora/.test(text)) {
    const reply = `Son las ${new Date().toLocaleTimeString()}.`;
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  // 🔹 FECHA
  if (/que dia|dia es hoy|fecha/.test(text)) {
    const now = new Date();
    const days = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
    const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    const reply = `Hoy es ${days[now.getDay()]} ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}.`;
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  // 🔹 CONFIRMACIÓN DE PRESENCIA
  if (/sigues conmigo|estas ahi|me escuchas/.test(text)) {
    const reply = "Sí, sigo contigo.";
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  // 🔹 FALLBACK INTELIGENTE
  const reply = state.mood
    ? `Te escucho${name}. Recuerdo que te sientes ${state.mood}.`
    : "Te escucho 👂";

  state.lastRavyMessage = reply;
  setRavyState(state);
  return reply;
}
