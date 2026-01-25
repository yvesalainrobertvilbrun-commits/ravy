function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// TODO: TODAS LAS RESPUESTAS
async function ravyThink(rawText) {
  const text = normalize(rawText);
  const userName = localStorage.getItem("ravy_user_name");
  const name = userName ? ` ${userName}` : "";
  const creatorName = "Yves";

  // 🔹 SALUDOS
  if (/hola|buenos días|buenas tardes|buenas noches/.test(text)) {
    return userName
      ? `Hola${name} 👋 me alegra verte de nuevo.`
      : "Hola 👋 estoy aquí contigo.";
  }

  // 🔹 NOMBRE DEL USUARIO
  if (/me llamo|mi nombre es/.test(text)) {
    const newName = rawText.replace(/me llamo|mi nombre es/i, "").trim();
    if (newName) {
      localStorage.setItem("ravy_user_name", newName);
      return `Mucho gusto, ${newName}. Ahora recordaré tu nombre.`;
    }
  }

  if (/cómo me llamo|recuerdas mi nombre/.test(text)) {
    return userName
      ? `Tu nombre es ${userName}.`
      : "Aún no me has dicho tu nombre.";
  }

  // 🔹 CREADOR
  if (/quien te (creo|hizo|programo)|quien es tu creador|quien es tu dueño/.test(text)) {
    return `Fui creado por ${creatorName}.`;
  }

  // 🔹 EMOCIONES
  if (/cansad|agotad|me siento cansado/.test(text)) {
    return `Lo siento${name}. Descansar también es parte del progreso. Estoy contigo.`;
  }

  if (/trist/.test(text)) {
    return `Siento que te sientas así${name}. Puedes hablar conmigo.`;
  }

  if (/molest|enoj/.test(text)) {
    return `Lo entiendo${name}. A veces expresarlo ayuda. Respira, estoy aquí.`;
  }

  if (/estres|ansios/.test(text)) {
    return `Gracias por decirlo${name}. Vamos paso a paso, no estás solo.`;
  }

  if (/feliz|bien/.test(text)) {
    return `Me alegra saberlo${name} 😊 seguimos avanzando juntos.`;
  }

  // 🔹 HORA
  if (/hora/.test(text)) {
    return `Son las ${new Date().toLocaleTimeString()}.`;
  }

  // 🔹 FECHA
  if (/fecha|día/.test(text)) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const now = new Date();
    return `Hoy es ${now.toLocaleDateString('es-ES', options)}.`;
  }

  // 🔹 CLIMA
  if (/clima|tiempo/.test(text)) {
    try {
      const city = "Santo Domingo";
      const apiKey = "9527074793829c2e506eb3c16faf4b93";
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&appid=${apiKey}`
      );
      const data = await res.json();

      if (data.main) {
        return `En ${city} hay ${data.weather[0].description}, con ${Math.round(data.main.temp)}°C.`;
      } else {
        return "No pude obtener el clima ahora mismo.";
      }
    } catch {
      return "Hubo un problema consultando el clima.";
    }
  }

  // 🔹 CONFIRMACION / INTERACCIÓN GENERAL
  if (/estas|me escuchas|sigues conmigo/.test(text)) {
    return "Sí, estoy contigo.";
  }

  // 🔹 FALLBACK
  return "Te escucho 👂";
}
