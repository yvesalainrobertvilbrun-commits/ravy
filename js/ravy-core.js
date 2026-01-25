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
   🔹 MEMORIA LARGA (E + F + G)
========================= */
function getLongMemory() {
  return JSON.parse(localStorage.getItem("ravy_long_memory")) || {
    creator: "Yves",
    userName: localStorage.getItem("ravy_user_name") || null,
    baselineMood: null,
    personality: "amigable",
    facts: [],
    learning: {
      moodCount: {},
      personalityUsage: {},
      interactions: 0
    }
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

    // Ajustar baseline si se repite
    if (memory.learning.moodCount[mood] >= 3) {
      memory.baselineMood = mood;
    }
  }

  memory.learning.personalityUsage[memory.personality] =
    (memory.learning.personalityUsage[memory.personality] || 0) + 1;

  return memory;
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

  /* =========================
     🔹 IDENTIDAD
  ========================= */
  if (/quien eres|que eres/.test(text)) {
    let reply =
      "Soy RAVY, un asistente creado por Yves que aprende contigo con el tiempo.";
    reply = applyPersonality(reply, longMemory.personality);
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
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

  /* =========================
     🔹 QUÉ HA APRENDIDO
  ========================= */
  if (/que has aprendido|que sabes ahora/.test(text)) {
    let reply = "He aprendido esto de ti:";
    if (longMemory.baselineMood)
      reply += `\n• Sueles sentirte ${longMemory.baselineMood}`;
    reply += `\n• Hemos interactuado ${longMemory.learning.interactions} veces`;
    reply = applyPersonality(reply, longMemory.personality);
    state.lastRavyMessage = reply;
    setRavyState(state);
    return reply;
  }

  /* =========================
     🔹 FALLBACK INTELIGENTE
  ========================= */
  let reply = "Te escucho 👂";

  if (longMemory.baselineMood) {
    reply = `Te escucho${name}. Recuerdo que sueles sentirte ${longMemory.baselineMood}.`;
  }

  reply = applyPersonality(reply, longMemory.personality);
  state.lastRavyMessage = reply;
  setRavyState(state);
  return reply;
}
