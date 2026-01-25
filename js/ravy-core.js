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
   🔹 MEMORIA LARGA (E + F)
========================= */
function getLongMemory() {
  return JSON.parse(localStorage.getItem("ravy_long_memory")) || {
    creator: "Yves",
    userName: localStorage.getItem("ravy_user_name") || null,
    baselineMood: null,
    personality: "amigable",
    facts: []
  };
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
      return text.replace(/😊|👋|✨/g, "").split(".")[0] + ".";
    case "calma":
      return "Con calma: " + text;
    case "motivadora":
      return text + " 💪 Tú puedes.";
    case "amigable":
    default:
      return text;
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
    setLongMemory(longMemory);
    return "Entendido. Seré más directo.";
  }

  if (/hablame con calma/.test(text)) {
    longMemory.personality = "calma";
    setLongMemory(longMemory);
    return "De acuerdo. Te hablaré con calma.";
  }

  if (/se mas motivador/.test(text)) {
    longMemory.personality = "motivadora";
    setLongMemory(longMemory);
    return "Perfecto. Seré más motivador.";
  }

  if (/cambia tu personalidad/.test(text)) {
    return "Puedo ser: calmada, amigable, directa o motivadora. ¿Cuál prefieres?";
  }

  /* =========================
     🔹 IDENTIDAD
  ========================= */
  if (/quien eres|que eres/.test(text)) {
    let reply = "Soy RAVY, un asistente creado por Yves para acompañarte y evolucionar contigo.";
    reply = applyPersonality(reply, longMemory.personality);
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  /* =========================
     🔹 EMOCIONES
  ========================= */
  if (/cansad|agotad/.test(text)) {
    longMemory.baselineMood = "cansado";
    setLongMemory(longMemory);

    let reply = `Lo noto${name}. Estás cansado.`;
    reply = applyPersonality(reply, longMemory.personality);
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  if (/bien|contento|feliz/.test(text)) {
    longMemory.baselineMood = "bien";
    setLongMemory(longMemory);

    let reply = `Me alegra saberlo${name} 😊`;
    reply = applyPersonality(reply, longMemory.personality);
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  /* =========================
     🔹 FALLBACK ADAPTADO
  ========================= */
  let reply = "Te escucho 👂";

  if (longMemory.baselineMood) {
    reply = `Te escucho${name}. Recuerdo que te has sentido ${longMemory.baselineMood}.`;
  }

  reply = applyPersonality(reply, longMemory.personality);
  state.lastRavyMessage = reply;
  setRavyState(state);
  return reply;
}
