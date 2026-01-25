function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

async function ravyThink(rawText) {
  const text = normalize(rawText);
  let userName = localStorage.getItem("ravy_user_name");
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
    // regex robusta: captura todo después de "me llamo" o "mi nombre es"
    const match = rawText.match(/me llamo (.+)|mi nombre es (.+)/i);
    const newName = match ? (match[1] || match[2]).trim() : null;
    if (newName) {
      // limpia caracteres no alfabéticos al inicio y final
      const cleanName = newName.replace(/^[^a-zA-ZáéíóúÁÉÍÓÚñÑ]+|[^a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/g, "");
      localStorage.setItem("ravy_user_name", cleanName);
      return `Mucho gusto, ${cleanName}. Ahora recordaré tu nombre.`;
    }
  }

  if (/cómo me llamo|recuerdas mi nombre/.test(text)) {
    userName = localStorage.getItem("ravy_user_name");
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
  if (/qué día|qué fecha|día es hoy|fecha es hoy/.test(text)) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-ES', options);
    return `Hoy es ${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}.`;
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

  // 🔹 CONFIRMACION GENERAL
  if (/estas|me escuchas|sigues conmigo/.test(text)) {
    return "Sí, estoy contigo.";
  }

  // 🔹 FALLBACK
  return "Te escucho 👂";
}
