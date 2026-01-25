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
  if (/hola|buenos dias|buenas tardes|buenas noches/.test(text)) {
    return userName
      ? `Hola${name} 👋 me alegra verte de nuevo.`
      : "Hola 👋 estoy aquí contigo.";
  }

  // 🔹 GUARDAR NOMBRE (solo si NO es pregunta)
  if (
    (/me llamo|mi nombre es/.test(text)) &&
    !(/como|cual/.test(text))
  ) {
    const match = rawText.match(/me llamo (.+)|mi nombre es (.+)/i);
    const newName = match ? (match[1] || match[2]).trim() : null;

    if (newName) {
      const cleanName = newName.replace(
        /^[^a-zA-ZáéíóúÁÉÍÓÚñÑ]+|[^a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/g,
        ""
      );
      localStorage.setItem("ravy_user_name", cleanName);
      return `Mucho gusto, ${cleanName}. Ahora recordaré tu nombre.`;
    }
  }

  // 🔹 PREGUNTAR NOMBRE (CORREGIDO)
  if (/como me llamo|cual es mi nombre|recuerdas mi nombre/.test(text)) {
    return userName
      ? `Tu nombre es ${userName}.`
      : "Aún no me has dicho tu nombre.";
  }

  // 🔹 CREADOR
  if (
    /quien te creo|quien te hizo|quien te programo|quien es tu creador|quien es tu dueno/.test(
      text
    )
  ) {
    return `Fui creado por ${creatorName}.`;
  }

  // 🔹 EMOCIONES
  if (/cansad|agotad/.test(text)) {
    return `Lo siento${name}. Descansar también es parte del progreso. Estoy contigo.`;
  }

  if (/trist/.test(text)) {
    return `Siento que te sientas así${name}. Puedes hablar conmigo.`;
  }

  if (/molest|enoj/.test(text)) {
    return `Lo entiendo${name}. Respira, estoy aquí.`;
  }

  if (/estres|ansios/.test(text)) {
    return `Vamos paso a paso${name}. No estás solo.`;
  }

  if (/feliz|contento|bien/.test(text)) {
    return `Me alegra saberlo${name} 😊 seguimos avanzando juntos.`;
  }

  // 🔹 HORA
  if (/hora/.test(text)) {
    return `Son las ${new Date().toLocaleTimeString()}.`;
  }

  // 🔹 FECHA / DÍA (ESTABLE EN TODOS LOS DISPOSITIVOS)
  if (/que dia|que fecha|dia es hoy|fecha es hoy/.test(text)) {
    const now = new Date();
    const days = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado"
    ];
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre"
    ];

    const dayName = days[now.getDay()];
    const dayNumber = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();

    return `Hoy es ${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNumber} de ${monthName} de ${year}.`;
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
        return `En ${city} hay ${data.weather[0].description}, con ${Math.round(
          data.main.temp
        )}°C.`;
      } else {
        return "No pude obtener el clima ahora mismo.";
      }
    } catch (e) {
      return "Hubo un problema consultando el clima.";
    }
  }

  // 🔹 CONFIRMACIÓN
  if (/estas|me escuchas|sigues conmigo/.test(text)) {
    return "Sí, estoy contigo.";
  }

  // 🔹 FALLBACK FINAL
  return "Te escucho 👂";
}
