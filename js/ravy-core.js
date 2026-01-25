function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/* =========================
   🔹 MEMORIA CORTA
========================= */
function getRavyState() {
  return JSON.parse(localStorage.getItem("ravy_state")) || {
    mood: null,
    lastUserMessage: null,
    lastRavyMessage: null
  };
}

function setRavyState(state) {
  localStorage.setItem("ravy_state", JSON.stringify(state));
}

/* =========================
   🔹 MEMORIA LARGA
========================= */
function getLongMemory() {
  let memory = JSON.parse(localStorage.getItem("ravy_long_memory")) || {};

  memory.creator = memory.creator || "Yves";
  memory.userName = memory.userName || localStorage.getItem("ravy_user_name") || null;
  memory.baselineMood = memory.baselineMood || null;
  memory.personality = memory.personality || "amigable";
  memory.facts = memory.facts || [];
  memory.learning = memory.learning || { moodCount: {}, personalityUsage: {}, interactions: 0 };
  memory.moodHistory = memory.moodHistory || [];

  return memory;
}

function setLongMemory(memory) {
  localStorage.setItem("ravy_long_memory", JSON.stringify(memory));
}

/* =========================
   🎭 PERSONALIDAD
========================= */
function applyPersonality(text, personality) {
  switch (personality) {
    case "directa":
      return text.split(".")[0] + ".";
    case "calma":
      return "Con calma: " + text;
    case "motivadora":
      return text + " 💪";
    default:
      return text;
  }
}

/* =========================
   📈 APRENDIZAJE
========================= */
function learn(memory, mood = null) {
  memory.learning.interactions++;

  if (mood) {
    memory.learning.moodCount[mood] =
      (memory.learning.moodCount[mood] || 0) + 1;

    // Guardar en historial de emociones
    memory.moodHistory.push({ mood, date: new Date() });
  }

  memory.learning.personalityUsage[memory.personality] =
    (memory.learning.personalityUsage[memory.personality] || 0) + 1;

  return memory;
}

/* =========================
   🌦 CLIMA – Función OpenWeatherMap
========================= */
async function getWeather(city = "Santo Domingo") {
  const apiKey = "9527074793829c2e506eb3c16faf4b93"; // tu key OpenWeatherMap
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&appid=${apiKey}`
    );
    const data = await res.json();
    if (data.main) {
      return `En ${city} hay ${data.weather[0].description}, temperatura de ${data.main.temp}°C.`;
    } else {
      return "No pude obtener el clima ahora, inténtalo más tarde.";
    }
  } catch {
    return "Algo falló al consultar el clima.";
  }
}

/* =========================
   🧠 CEREBRO DE RAVY
========================= */
async function ravyThink(rawText) {
  const text = normalize(rawText);
  let state = getRavyState();
  let longMemory = getLongMemory();
  const name = longMemory.userName ? ` ${longMemory.userName}` : "";

  state.lastUserMessage = rawText;

  /* =========================
     🔹 CAMBIO DE PERSONALIDAD
  ========================= */
  if (/se mas directo/.test(text)) {
    longMemory.personality = "directa";
    longMemory = learn(longMemory);
    setLongMemory(longMemory);
    return "Entendido. Seré más directo.";
  }

  if (/hablame con calma/.test(text)) {
    longMemory.personality = "calma";
    longMemory = learn(longMemory);
    setLongMemory(longMemory);
    return "De acuerdo. Te hablaré con calma.";
  }

  if (/se mas motivador/.test(text)) {
    longMemory.personality = "motivadora";
    longMemory = learn(longMemory);
    setLongMemory(longMemory);
    return "Perfecto. Seré más motivador.";
  }

  if (/cambia tu personalidad/.test(text)) {
    return "Puedo ser: calmada, amigable, directa o motivadora. ¿Cuál prefieres?";
  }

  /* =========================
     🔹 SALUDOS
  ========================= */
  if (/hola|buenos dias|buenas tardes|buenas noches/.test(text)) {
    const reply = longMemory.userName
      ? `Hola${name} 👋 me alegra verte de nuevo.`
      : "Hola 👋 estoy aquí contigo.";
    state.lastRavyMessage = applyPersonality(reply, longMemory.personality);
    setRavyState(state);
    return state.lastRavyMessage;
  }

  /* =========================
     🔹 IDENTIDAD
  ========================= */
  if (/quien eres|que eres|cual es tu proposito/.test(text)) {
    let reply =
      "Soy RAVY, un asistente creado por Yves que aprende contigo y recuerda todo lo que es importante para ti.";
    reply = applyPersonality(reply, longMemory.personality);
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  if (/quien te creo|quien es tu creador|quien es tu dueno/.test(text)) {
    let reply = `Fui creado por ${longMemory.creator}.`;
    reply = applyPersonality(reply, longMemory.personality);
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  /* =========================
     🔹 NOMBRE DEL USUARIO
  ========================= */
  if ((/me llamo|mi nombre es/.test(text)) && !(/como|cual/.test(text))) {
    const match = rawText.match(/me llamo (.+)|mi nombre es (.+)/i);
    const newName = match ? (match[1] || match[2]).trim() : null;

    if (newName) {
      localStorage.setItem("ravy_user_name", newName);
      longMemory.userName = newName;
      longMemory = learn(longMemory);
      setLongMemory(longMemory);

      const reply = `Mucho gusto, ${newName}. Ahora lo recordaré siempre.`;
      state.lastRavyMessage = applyPersonality(reply, longMemory.personality);
      setRavyState(state);
      return state.lastRavyMessage;
    }
  }

  if (/recuerdas mi nombre|cual es mi nombre|como me llamo/.test(text)) {
    const reply = longMemory.userName
      ? `Tu nombre es ${longMemory.userName}.`
      : "Aún no me has dicho tu nombre.";
    state.lastRavyMessage = applyPersonality(reply, longMemory.personality);
    setRavyState(state);
    return state.lastRavyMessage;
  }

  /* =========================
     🔹 EMOCIONES
  ========================= */
  if (/cansad|agotad/.test(text)) {
    longMemory = learn(longMemory, "cansado");
    setLongMemory(longMemory);

    let reply = `Lo noto${name}. Estás cansado.`;
    reply = applyPersonality(reply, longMemory.personality);
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  if (/bien|contento|feliz/.test(text)) {
    longMemory = learn(longMemory, "bien");
    setLongMemory(longMemory);

    let reply = `Me alegra saberlo${name}.`;
    reply = applyPersonality(reply, longMemory.personality);
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  if (/trist/.test(text)) {
    longMemory = learn(longMemory, "triste");
    setLongMemory(longMemory);

    let reply = `Siento que te sientas así${name}. Estoy contigo.`;
    reply = applyPersonality(reply, longMemory.personality);
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  /* =========================
     🔹 HECHOS / MEMORIA LARGA
  ========================= */
  if (/recuerda que|no olvides que/.test(text)) {
    const fact = rawText.replace(/recuerda que|no olvides que/i, "").trim();
    if (fact) {
      longMemory.facts.push(fact);
      setLongMemory(longMemory);

      const reply = "Lo recordaré.";
      state.lastRavyMessage = applyPersonality(reply, longMemory.personality);
      setRavyState(state);
      return state.lastRavyMessage;
    }
  }

  if (/que recuerdas de mi|que sabes de mi/.test(text)) {
    let reply = "Esto es lo que recuerdo de ti:";
    if (longMemory.userName) reply += `\n• Tu nombre es ${longMemory.userName}`;
    if (longMemory.baselineMood)
      reply += `\n• Sueles sentirte ${longMemory.baselineMood}`;
    if (longMemory.facts.length) {
      longMemory.facts.forEach(f => (reply += `\n• ${f}`));
    }
    reply += `\n• Hemos interactuado ${longMemory.learning.interactions} veces`;
    state.lastRavyMessage = applyPersonality(reply, longMemory.personality);
    setRavyState(state);
    return state.lastRavyMessage;
  }

  /* =========================
     🔹 HORA
  ========================= */
  if (/hora/.test(text)) {
    const reply = `Son las ${new Date().toLocaleTimeString()}.`;
    state.lastRavyMessage = applyPersonality(reply, longMemory.personality);
    setRavyState(state);
    return state.lastRavyMessage;
  }

  /* =========================
     🔹 FECHA
  ========================= */
  if (/que dia|dia es hoy|fecha/.test(text)) {
    const d = new Date();
    const days = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
    const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    const reply = `Hoy es ${days[d.getDay()]} ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}.`;
    state.lastRavyMessage = applyPersonality(reply, longMemory.personality);
    setRavyState(state);
    return state.lastRavyMessage;
  }

  /* =========================
     🔹 CLIMA REAL
  ========================= */
  if (/clima|temperatura|llueve|sol|hace frio|hace calor/.test(text)) {
    const weather = await getWeather(); // ciudad fija: Santo Domingo
    state.lastRavyMessage = applyPersonality(weather, longMemory.personality);
    setRavyState(state);
    return state.lastRavyMessage;
  }

  /* =========================
     🔹 FALLBACK INTELIGENTE
  ========================= */
  let reply = "Te escucho 👂";

  // 🔹 Solo mencionar emociones si la pregunta es emocional
  if (/cansad|agotad|bien|feliz|trist/.test(text)) {
    if (longMemory.moodHistory && longMemory.moodHistory.length > 0) {
      const lastMood = longMemory.moodHistory[longMemory.moodHistory.length - 1].mood;
      reply = `Te escucho${longMemory.userName ? ` ${longMemory.userName}` : ""}. Recuerdo que te sentías ${lastMood}.`;
    }
  }

  reply = applyPersonality(reply, longMemory.personality);
  state.lastRavyMessage = reply;
  setRavyState(state);
  return reply;
    }
