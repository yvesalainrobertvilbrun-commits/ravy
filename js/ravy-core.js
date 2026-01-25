function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/* =========================
   🔹 MEMORIA CORTA (D)
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
   🔹 MEMORIA LARGA (E)
========================= */
function getLongMemory() {
  return JSON.parse(localStorage.getItem("ravy_long_memory")) || {
    creator: "Yves",
    userName: localStorage.getItem("ravy_user_name") || null,
    baselineMood: null,
    facts: []
  };
}

function setLongMemory(memory) {
  localStorage.setItem("ravy_long_memory", JSON.stringify(memory));
}

async function ravyThink(rawText) {
  const text = normalize(rawText);
  let userName = localStorage.getItem("ravy_user_name");
  const name = userName ? ` ${userName}` : "";
  const creatorName = "Yves";

  let state = getRavyState();
  let longMemory = getLongMemory();

  state.lastUserMessage = rawText;

  /* =========================
     🔹 IDENTIDAD
  ========================= */
  if (/quien eres|que eres|cual es tu proposito/.test(text)) {
    const reply = "Soy RAVY, un asistente creado por Yves para acompañarte, recordarte y evolucionar contigo.";
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  /* =========================
     🔹 SALUDOS
  ========================= */
  if (/hola|buenos dias|buenas tardes|buenas noches/.test(text)) {
    const reply = userName
      ? `Hola${name} 👋 me alegra verte de nuevo.`
      : "Hola 👋 estoy aquí contigo.";
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  /* =========================
     🔹 NOMBRE (MEMORIA LARGA)
  ========================= */
  if ((/me llamo|mi nombre es/.test(text)) && !(/como|cual/.test(text))) {
    const match = rawText.match(/me llamo (.+)|mi nombre es (.+)/i);
    const newName = match ? (match[1] || match[2]).trim() : null;

    if (newName) {
      localStorage.setItem("ravy_user_name", newName);
      longMemory.userName = newName;
      setLongMemory(longMemory);

      const reply = `Mucho gusto, ${newName}. Ahora lo recordaré siempre.`;
      state.lastRavyMessage = reply;
      setRavyState(state);
      return reply;
    }
  }

  if (/recuerdas mi nombre|cual es mi nombre|como me llamo/.test(text)) {
    const reply = longMemory.userName
      ? `Tu nombre es ${longMemory.userName}.`
      : "Aún no me has dicho tu nombre.";
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  /* =========================
     🔹 CREADOR (MEMORIA LARGA)
  ========================= */
  if (/quien te creo|quien es tu creador|quien es tu dueno/.test(text)) {
    const reply = `Fui creado por ${longMemory.creator}.`;
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  /* =========================
     🔹 EMOCIONES → MEMORIA
  ========================= */
  if (/cansad|agotad/.test(text)) {
    state.mood = "cansado";
    longMemory.baselineMood = "cansado";
    setLongMemory(longMemory);

    const reply = `Lo noto${name}. Estás cansado. Lo recordaré.`;
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  if (/bien|contento|feliz/.test(text)) {
    state.mood = "bien";
    longMemory.baselineMood = "bien";
    setLongMemory(longMemory);

    const reply = `Me alegra saberlo${name} 😊 Me quedo con eso.`;
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  /* =========================
     🔹 RECORDAR HECHOS
  ========================= */
  if (/recuerda que|no olvides que/.test(text)) {
    const fact = rawText.replace(/recuerda que|no olvides que/i, "").trim();
    if (fact) {
      longMemory.facts.push(fact);
      setLongMemory(longMemory);

      const reply = "Lo recordaré.";
      state.lastRavyMessage = reply;
      setRavyState(state);
      return reply;
    }
  }

  if (/que recuerdas de mi|que sabes de mi/.test(text)) {
    let reply = "Esto es lo que recuerdo de ti:\n";
    if (longMemory.userName) reply += `• Tu nombre es ${longMemory.userName}\n`;
    if (longMemory.baselineMood) reply += `• Sueles sentirte ${longMemory.baselineMood}\n`;
    if (longMemory.facts.length) {
      longMemory.facts.forEach(f => reply += `• ${f}\n`);
    }
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  /* =========================
     🔹 MEMORIA CORTA
  ========================= */
  if (/que me dijiste|que dijiste/.test(text)) {
    const reply = state.lastRavyMessage
      ? `Te dije: "${state.lastRavyMessage}"`
      : "No he dicho nada relevante aún.";
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  /* =========================
     🔹 HORA / FECHA
  ========================= */
  if (/hora/.test(text)) {
    const reply = `Son las ${new Date().toLocaleTimeString()}.`;
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  if (/que dia|dia es hoy|fecha/.test(text)) {
    const d = new Date();
    const days = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
    const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    const reply = `Hoy es ${days[d.getDay()]} ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}.`;
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  /* =========================
     🔹 FALLBACK CON CONTEXTO
  ========================= */
  const reply = longMemory.baselineMood
    ? `Te escucho${name}. Recuerdo que sueles sentirte ${longMemory.baselineMood}.`
    : "Te escucho 👂";

  state.lastRavyMessage = reply;
  setRavyState(state);
  return reply;
}
