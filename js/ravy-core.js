import { learnResponse, getLearnedResponse, saveUserName, getUserName, getCreatorName } from './memory.js';
import { getWeather } from './weather.js';

// Normalizar texto (acentos, mayúsculas)
function normalizeText(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function ravyRespond(text, replyCallback) {
  const lowerText = normalizeText(text.trim());
  const bubbleColor = "#555555";

  let response = "Te escucho 👂";

  const userName = getUserName();
  const creatorName = getCreatorName();

  /* =====================
     APRENDER NOMBRE USUARIO
  ====================== */
  if (lowerText.startsWith("mi nombre es")) {
    const name = text.split(/mi nombre es/i)[1]?.trim();
    if (name) {
      saveUserName(name);
      replyCallback({
        text: `Encantada de conocerte, ${name} 😊`,
        color: bubbleColor
      });
      return;
    }
  }

  /* =====================
     APRENDIZAJE MANUAL
  ====================== */
  if (lowerText.startsWith("ravy, aprende que")) {
    const phrase = lowerText.replace("ravy, aprende que", "").trim();
    const parts = phrase.split(" es ");
    if (parts.length === 2) {
      learnResponse(parts[0], parts[1]);
      replyCallback({
        text: `Listo ✅ He aprendido que ${parts[0]} es ${parts[1]}`,
        color: bubbleColor
      });
      return;
    }
  }

  /* =====================
     RESPUESTAS APRENDIDAS
  ====================== */
  const learned = getLearnedResponse(lowerText);
  if (learned) {
    replyCallback({ text: learned, color: bubbleColor });
    return;
  }

  /* =====================
     SALUDOS
  ====================== */
  if (["hola", "buenos dias", "buenas tardes", "buenas noches"].some(w => lowerText.includes(w))) {
    replyCallback({
      text: userName ? `Hola ${userName} 👋 ¿Cómo estás hoy?` : "Hola 👋 ¿Cómo estás hoy?",
      color: bubbleColor
    });
    return;
  }

  /* =====================
     EMOCIONES
  ====================== */
  if (["cansado", "triste", "mal"].some(w => lowerText.includes(w))) {
    replyCallback({
      text: "Siento que te sientas así… estoy aquí contigo 🤍",
      color: bubbleColor
    });
    return;
  }

  if (["feliz", "bien", "contento"].some(w => lowerText.includes(w))) {
    replyCallback({
      text: "Me alegra mucho leerte 😊",
      color: bubbleColor
    });
    return;
  }

  /* =====================
     CREADOR / DUEÑO
  ====================== */
  if (["quien te creo", "creador", "dueño"].some(w => lowerText.includes(w))) {
    replyCallback({
      text: `Fui creada por mi creador y dueño: ${creatorName} 😎`,
      color: bubbleColor
    });
    return;
  }

  /* =====================
     FECHA Y HORA
  ====================== */
  if (["hora", "fecha", "dia"].some(w => lowerText.includes(w))) {
    const now = new Date();
    replyCallback({
      text: `Hoy es ${now.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      })} y son las ${now.toLocaleTimeString("es-ES")} ⏰`,
      color: bubbleColor
    });
    return;
  }

  /* =====================
     CLIMA REAL 🌦️
  ====================== */
  if (["clima", "tiempo", "llueve", "calor", "frio"].some(w => lowerText.includes(w))) {
    getWeather().then(result => {
      replyCallback({
        text: result,
        color: bubbleColor
      });
    });
    return;
  }

  /* =====================
     RESPUESTA POR DEFECTO
  ====================== */
  replyCallback({ text: response, color: bubbleColor });
}
