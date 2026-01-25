// =========================
// 🔹 NORMALIZACIÓN DE TEXTO
// =========================
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// =========================
// 🔹 MEMORIA CORTA
// =========================
function getRavyState() {
  return JSON.parse(localStorage.getItem("ravy_state")) || {
    mood: null,
    lastUserMessage: null,
    lastRavyMessage: null,
    currentIntent: null,
    subIntent: null,
    context: []
  };
}

function setRavyState(state) {
  localStorage.setItem("ravy_state", JSON.stringify(state));
}

// =========================
// 🔹 MEMORIA LARGA
// =========================
function getLongMemory() {
  let memory = JSON.parse(localStorage.getItem("ravy_long_memory")) || {};
  memory.creator = memory.creator || "Yves";
  memory.userName = memory.userName || localStorage.getItem("ravy_user_name") || null;
  memory.personality = memory.personality || "amigable";
  memory.facts = memory.facts || [];
  memory.learning = memory.learning || { moodCount: {}, personalityUsage: {}, interactions: 0 };
  memory.moodHistory = memory.moodHistory || [];
  memory.contextualMemory = memory.contextualMemory || [];
  memory.predictions = memory.predictions || [];
  memory.reminders = memory.reminders || [];
  return memory;
}

function setLongMemory(memory) {
  localStorage.setItem("ravy_long_memory", JSON.stringify(memory));
}

// =========================
// 🎭 PERSONALIDAD ADAPTATIVA
// =========================
function adjustPersonalityBasedOnMood(memory, mood) {
  if (!mood) return memory.personality;
  switch (mood) {
    case "cansado": case "ansioso": case "frustrado": memory.personality = "calma"; break;
    case "feliz": case "motivado": case "creativo": case "confiado": memory.personality = "motivadora"; break;
    case "aburrido": case "relajado": memory.personality = "amigable"; break;
    default: memory.personality = "amigable"; break;
  }
  return memory.personality;
}

function applyPersonality(text, personality) {
  switch (personality) {
    case "directa": return text.split(".")[0]+".";
    case "calma": return "Con calma: " + text;
    case "motivadora": return text + " 💪";
    default: return text;
  }
}

// =========================
// 📈 APRENDIZAJE AVANZADO & PREDICCIONES
// =========================
function learn(memory, mood=null, userMessage=null) {
  memory.learning.interactions++;
  if (mood) {
    memory.learning.moodCount[mood] = (memory.learning.moodCount[mood]||0)+1;
    memory.moodHistory.push({ mood, date: new Date(), hour: new Date().getHours() });
  }
  if (userMessage) {
    memory.contextualMemory.push({ message: userMessage, date: new Date(), mood, hour: new Date().getHours() });
    if (memory.contextualMemory.length > 300) memory.contextualMemory.shift(); // hasta 300 mensajes
  }
  memory.learning.personalityUsage[memory.personality] = (memory.learning.personalityUsage[memory.personality]||0)+1;

  // Predicción avanzada
  if (mood) {
    let recentSameMood = memory.moodHistory.filter(m=>m.mood===mood).length;
    if (recentSameMood > 2) {
      switch(mood) {
        case "cansado": memory.predictions.push("Quizá necesites descansar pronto."); break;
        case "feliz": memory.predictions.push("Aprovecha tu energía positiva en tus proyectos."); break;
        case "triste": memory.predictions.push("Recuerda tomar un momento para relajarte y cuidar tu ánimo."); break;
        case "ansioso": memory.predictions.push("Respira profundo y toma un pequeño descanso."); break;
        case "motivado": memory.predictions.push("Es un buen momento para avanzar en tus metas."); break;
        case "creativo": memory.predictions.push("Aprovecha esta creatividad en tus proyectos."); break;
        case "aburrido": memory.predictions.push("Quizá sea buen momento para cambiar de actividad."); break;
        case "relajado": memory.predictions.push("Disfruta tu momento de tranquilidad."); break;
      }
      if (memory.predictions.length>10) memory.predictions.shift();
    }
  }

  // Recordatorios inteligentes con probabilidad
  if (memory.predictions.length > 0 && Math.random() < 0.25) { // 25% de chance de sugerir proactivamente
    memory.reminders.push({ date:new Date(), reminder: memory.predictions[memory.predictions.length-1] });
    if (memory.reminders.length > 15) memory.reminders.shift();
  }

  return memory;
}

// =========================
// 🌦 CLIMA
// =========================
async function getWeather(city="Santo Domingo") {
  const apiKey = "9527074793829c2e506eb3c16faf4b93";
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&appid=${apiKey}`);
    const data = await res.json();
    if (data && data.main && data.weather) {
      return `En ${city} hay ${data.weather[0].description}, temperatura de ${data.main.temp}°C.`;
    } else return "No pude obtener el clima ahora, inténtalo más tarde.";
  } catch { return "No pude obtener el clima ahora, inténtalo más tarde."; }
}

// =========================
// 🧠 CEREBRO H6 – EMOCIONES COMPLEJAS + PREDICCIÓN DIARIA
// =========================
async function ravyThink(rawText) {
  const text = normalize(rawText);
  let state = getRavyState();
  let longMemory = getLongMemory();
  const name = longMemory.userName ? ` ${longMemory.userName}` : "";

  state.lastUserMessage = rawText;

  let intent = "fallback";
  let subIntent = null;
  let detectedMood = null;
  let suggestion = "";

  // ---------- SALUDOS ----------
  if (/hola|buenos dias|buenas tardes|buenas noches/.test(text)) intent="saludo";

  // ---------- EMOCIONES COMPLEJAS ----------
  else if (/cansad|agotad/.test(text)) { intent="emocion"; subIntent="cansado"; detectedMood="cansado"; suggestion="Tal vez sería bueno descansar un poco para recuperar energía."; }
  else if (/bien|contento|feliz/.test(text)) { intent="emocion"; subIntent="feliz"; detectedMood="feliz"; suggestion="Sigue así y aprovecha esta energía positiva para tus proyectos."; }
  else if (/trist|deprimid/.test(text)) { intent="emocion"; subIntent="triste"; detectedMood="triste"; suggestion="Recuerda que está bien descansar y pedir ayuda si lo necesitas."; }
  else if (/ansios|preocupad/.test(text)) { intent="emocion"; subIntent="ansioso"; detectedMood="ansioso"; suggestion="Respira profundo y toma un pequeño descanso."; }
  else if (/motivad/.test(text)) { intent="emocion"; subIntent="motivado"; detectedMood="motivado"; suggestion="Es un buen momento para avanzar en tus metas."; }
  else if (/creativ/.test(text)) { intent="emocion"; subIntent="creativo"; detectedMood="creativo"; suggestion="Aprovecha esta creatividad en tus proyectos."; }
  else if (/aburrid/.test(text)) { intent="emocion"; subIntent="aburrido"; detectedMood="aburrido"; suggestion="Quizá sea buen momento para cambiar de actividad."; }
  else if (/relajad/.test(text)) { intent="emocion"; subIntent="relajado"; detectedMood="relajado"; suggestion="Disfruta tu momento de tranquilidad."; }

  // ---------- INFORMACIÓN OBJETIVA ----------
  else if (/hora/.test(text)) { intent="informacion"; subIntent="hora"; }
  else if (/que dia|fecha|dia es hoy/.test(text)) { intent="informacion"; subIntent="fecha"; }
  else if (/clima|temperatura|llueve|sol|hace frio|hace calor/.test(text)) { intent="informacion"; subIntent="clima"; }

  // ---------- IDENTIDAD ----------
  else if (/me llamo|mi nombre es|recuerdas mi nombre|como me llamo/.test(text)) { intent="identidad"; subIntent="nombre"; }
  else if (/(quien eres|quién eres|que eres|cual es tu proposito|cuál es tu propósito)/.test(text)) { intent="identidad"; subIntent="presentacion"; }
  else if (/quien te creo|quien es tu dueño/.test(text)) { intent="identidad"; subIntent="creador"; }

  // ---------- MEMORIA ----------
  else if (/recuerda que|no olvides que|que recuerdas de mi|que sabes de mi/.test(text)) { intent="memoria"; }

  // ---------- ADAPTAR PERSONALIDAD AUTOMÁTICA ----------
  longMemory.personality = adjustPersonalityBasedOnMood(longMemory, detectedMood);

  state.currentIntent = intent;
  state.subIntent = subIntent;
  setRavyState(state);

  // ---------- RESPUESTAS ----------
  if (intent==="saludo") {
    const reply = longMemory.userName ? `Hola${name} 👋 me alegra verte de nuevo.` : "Hola 👋 estoy aquí contigo.";
    state.lastRavyMessage = applyPersonality(reply,longMemory.personality);
    setRavyState(state); return state.lastRavyMessage;
  }

  if (intent==="emocion") {
    longMemory=learn(longMemory, subIntent, rawText);
    setLongMemory(longMemory);
    const map = {cansado:`Lo noto${name}. Estás cansado.`, feliz:`Me alegra saberlo${name}.`, triste:`Siento que te sientas así${name}. Estoy contigo.`, ansioso:`Te escucho${name}.`, motivado:`Genial${name}!`, creativo:`Excelente${name}!`, aburrido:`Te escucho${name}.`, relajado:`Disfruta${name}.`, neutral:`Te escucho${name}.`};
    let reply = map[subIntent||"neutral"];
    if (suggestion) reply += `\n${suggestion}`;
    // Añadir predicciones si existen
    if (longMemory.predictions.length) reply += `\n💡 Sugerencia proactiva: ${longMemory.predictions[longMemory.predictions.length-1]}`;
    // Añadir recordatorios inteligentes
    if (longMemory.reminders.length) reply += `\n🔔 Recordatorio: ${longMemory.reminders[longMemory.reminders.length-1].reminder}`;
    state.lastRavyMessage = applyPersonality(reply,longMemory.personality);
    setRavyState(state); return state.lastRavyMessage;
  }

  // ---------- INFORMACIÓN ----------
  if (intent==="informacion") {
    if(subIntent==="hora") { const reply=`Son las ${new Date().toLocaleTimeString()}.`; state.lastRavyMessage=applyPersonality(reply,longMemory.personality); setRavyState(state); return state.lastRavyMessage; }
    if(subIntent==="fecha") { const d=new Date(); const days=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"]; const months=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]; const reply=`Hoy es ${days[d.getDay()]} ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}.`; state.lastRavyMessage=applyPersonality(reply,longMemory.personality); setRavyState(state); return state.lastRavyMessage; }
    if(subIntent==="clima") { const w=await getWeather(); state.lastRavyMessage=applyPersonality(w,longMemory.personality); setRavyState(state); return state.lastRavyMessage; }
  }

  // ---------- IDENTIDAD ----------
  if (intent==="identidad") {
    if(subIntent==="nombre") {
      if(/me llamo|mi nombre es/.test(text) && !(/como|cual/.test(text))) {
        const match = rawText.match(/me llamo (.+)|mi nombre es (.+)/i); 
        const newName = match ? (match[1] || match[2]).trim():null;
        if(newName){ localStorage.setItem("ravy_user_name",newName); longMemory.userName=newName; longMemory=learn(longMemory,null,rawText); setLongMemory(longMemory); const reply=`Mucho gusto, ${newName}. Ahora lo recordaré siempre.`; state.lastRavyMessage=applyPersonality(reply,longMemory.personality); setRavyState(state); return state.lastRavyMessage;}
      }
      if(/recuerdas mi nombre|como me llamo/.test(text)){ const reply = longMemory.userName?`Tu nombre es ${longMemory.userName}.`:"Aún no me has dicho tu nombre."; state.lastRavyMessage=applyPersonality(reply,longMemory.personality); setRavyState(state); return state.lastRavyMessage;}
    }
    if(subIntent==="presentacion"){ const reply=`Soy RAVY, tu asistente creado por ${longMemory.creator}, diseñado para aprender contigo y recordarte todo lo importante.`; state.lastRavyMessage=applyPersonality(reply,longMemory.personality); setRavyState(state); return state.lastRavyMessage; }
    if(subIntent==="creador"){ const reply=`Fui creado por ${longMemory.creator}.`; state.lastRavyMessage=applyPersonality(reply,longMemory.personality); setRavyState(state); return state.lastRavyMessage; }
  }

  // ---------- MEMORIA ----------
  if (intent==="memoria") {
    if(/recuerda que|no olvides que/.test(text)){ const fact=rawText.replace(/recuerda que|no olvides que/i,"").trim(); if(fact){ longMemory.facts.push(fact); setLongMemory(longMemory); const reply="Lo recordaré."; state.lastRavyMessage=applyPersonality(reply,longMemory.personality); setRavyState(state); return state.lastRavyMessage; } }
    if(/que recuerdas de mi|que sabes de mi/.test(text)){ let reply="Esto es lo que recuerdo de ti:"; if(longMemory.userName) reply+=`\n• Tu nombre es ${longMemory.userName}`; if(longMemory.facts.length) longMemory.facts.forEach(f=>reply+=`\n• ${f}`); reply+=`\n• Hemos interactuado ${longMemory.learning.interactions} veces`; state.lastRavyMessage=applyPersonality(reply,longMemory.personality); setRavyState(state); return state.lastRavyMessage;}
  }

  const reply = "Te escucho 👂";
  state.lastRavyMessage = applyPersonality(reply,longMemory.personality);
  setRavyState(state);
  return reply;
}
