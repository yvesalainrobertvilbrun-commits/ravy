async function ravyThink(rawText) {
  const text = normalize(rawText);
  let state = getRavyState();
  let longMemory = getLongMemory();
  const name = longMemory.userName ? ` ${longMemory.userName}` : "";

  state.lastUserMessage = rawText;

  // =========================
  // 🔹 DETECCIÓN DE INTENCIÓN
  // =========================
  let intent = "fallback";

  if (/hola|buenos dias|buenas tardes|buenas noches/.test(text)) {
    intent = "saludo";
  } else if (/cansad|agotad|bien|feliz|trist/.test(text)) {
    intent = "emocion";
  } else if (/hora|que dia|fecha/.test(text)) {
    intent = "informacion";
  } else if (/clima|temperatura|llueve|sol|hace frio|hace calor/.test(text)) {
    intent = "informacion";
  } else if (/me llamo|mi nombre es|recuerdas mi nombre/.test(text)) {
    intent = "identidad";
  } else if (/quien eres|quien te creo|cual es tu proposito/.test(text)) {
    intent = "identidad";
  } else if (/recuerda que|no olvides que|que recuerdas de mi/.test(text)) {
    intent = "memoria";
  }

  // Guardar la intención en el estado
  state.currentIntent = intent;
  setRavyState(state);

  // =========================
  // 🔹 RESPUESTAS SEGÚN INTENCIÓN
  // =========================

  // Saludo
  if (intent === "saludo") {
    const reply = longMemory.userName
      ? `Hola${name} 👋 me alegra verte de nuevo.`
      : "Hola 👋 estoy aquí contigo.";
    state.lastRavyMessage = applyPersonality(reply, longMemory.personality);
    setRavyState(state);
    return state.lastRavyMessage;
  }

  // Emoción
  if (intent === "emocion") {
    let mood = "neutral";
    if (/cansad|agotad/.test(text)) mood = "cansado";
    if (/bien|contento|feliz/.test(text)) mood = "bien";
    if (/trist/.test(text)) mood = "triste";

    longMemory = learn(longMemory, mood);
    setLongMemory(longMemory);

    const replyMap = {
      cansado: `Lo noto${name}. Estás cansado.`,
      bien: `Me alegra saberlo${name}.`,
      triste: `Siento que te sientas así${name}. Estoy contigo.`,
      neutral: `Te escucho${name}.`
    };

    const reply = replyMap[mood];
    state.lastRavyMessage = applyPersonality(reply, longMemory.personality);
    setRavyState(state);
    return state.lastRavyMessage;
  }

  // Información objetiva
  if (intent === "informacion") {
    if (/hora/.test(text)) {
      const reply = `Son las ${new Date().toLocaleTimeString()}.`;
      state.lastRavyMessage = applyPersonality(reply, longMemory.personality);
      setRavyState(state);
      return state.lastRavyMessage;
    }
    if (/que dia|fecha|dia es hoy/.test(text)) {
      const d = new Date();
      const days = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
      const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
      const reply = `Hoy es ${days[d.getDay()]} ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}.`;
      state.lastRavyMessage = applyPersonality(reply, longMemory.personality);
      setRavyState(state);
      return state.lastRavyMessage;
    }
    if (/clima|temperatura|llueve|sol|hace frio|hace calor/.test(text)) {
      const weather = await getWeather(); // Ciudad fija: Santo Domingo
      state.lastRavyMessage = applyPersonality(weather, longMemory.personality);
      setRavyState(state);
      return state.lastRavyMessage;
    }
  }

  // Identidad
  if (intent === "identidad") {
    if (/quien eres|cual es tu proposito/.test(text)) {
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
    if (/me llamo|mi nombre es/.test(text) && !(/como|cual/.test(text))) {
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
  }

  // Memoria
  if (intent === "memoria") {
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
      if (longMemory.facts.length) {
        longMemory.facts.forEach(f => (reply += `\n• ${f}`));
      }
      reply += `\n• Hemos interactuado ${longMemory.learning.interactions} veces`;
      state.lastRavyMessage = applyPersonality(reply, longMemory.personality);
      setRavyState(state);
      return state.lastRavyMessage;
    }
  }

  // Fallback
  let reply = "Te escucho 👂";
  state.lastRavyMessage = applyPersonality(reply, longMemory.personality);
  setRavyState(state);
  return reply;
}
