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
  if (/hola|buenos días|buenas tardes|buenas noches/i.test(text)) {
    return userName
      ? `Hola${name} 👋 me alegra verte de nuevo.`
      : "Hola 👋 estoy aquí contigo.";
  }

  // 🔹 NOMBRE DEL USUARIO
  // Guardar nombre solo si NO es pregunta
  if (/me llamo|mi nombre es/i.test(rawText) && !/cómo|cuál/i.test(rawText)) {
    const match = rawText.match(/me llamo (.+)|mi nombre es (.+)/i);
    const newName = match ? (match[1] || match[2]).trim() : null;
    if (newName) {
      const cleanName = newName.replace(/^[^a-zA-ZáéíóúÁÉÍÓÚñÑ]+|[^a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/g, "");
      localStorage.setItem("ravy_user_name", cleanName);
      return `Mucho gusto, ${cleanName}. Ahora recordaré tu nombre.`;
    }
  }

  // Preguntar nombre
  if (/cómo me llamo|cuál es mi nombre|recuerdas mi nombre/i.test(rawText)) {
    userName = localStorage.getItem("ravy_user_name");
    return userName
      ? `Tu nombre es ${userName}.`
      : "Aún no me has dicho tu nombre.";
  }

  // 🔹 CREADOR
  if (/quien te (creo|hizo|programo)|quien es tu creador|quien es tu dueño/i.test(text)) {
    return `Fui creado por ${creatorName}.`;
  }

  // 🔹 EMOCIONES
  if (/cansad|agotad|me siento cansado/i.test(text)) {
    return `Lo siento${name}. Descansar también es parte del progreso. Estoy contigo.`;
  }

  if (/trist/i.test(text)) {
    return `Siento que te sientas así${name}. Puedes hablar conmigo.`;
  }

  if (/molest|enoj/i.test(text)) {
    return `Lo entiendo${name}. A veces expresarlo ayuda. Respira, estoy aquí.`;
  }

  if (/estres|ansios/i.test(text)) {
    return `Gracias por decirlo${name}. Vamos paso a paso, no estás solo.`;
  }

  if (/feliz|bien/i.test(text)) {
    return `Me alegra saberlo${name} 😊 seguimos avanzando juntos.`;
  }

  // 🔹 HORA
  if (/hora/i.test(text)) {
    return `Son las ${new Date().toLocaleTimeString()}.`;
  }

  // 🔹 FECHA / DÍA
  if (/qué día|qué fecha|día es hoy|fecha es hoy/i.test(text)) {
    const now = new Date();
    const weekdays = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

    const dayName = weekdays[now.getDay()];
    const dayNumber = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();

    return `Hoy es ${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNumber} de ${monthName} de ${year}.`;
  }

  // 🔹 CLIMA
  if (/clima|tiempo/i.test(text)) {
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
  if (/estas|me escuchas|sigues conmigo/i.test(text)) {
    return "Sí, estoy contigo.";
  }

  // 🔹 FALLBACK
  return "Te escucho 👂";
}
