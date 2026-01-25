function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

async function ravyThink(rawText) {
  const text = normalize(rawText);
  const userName = localStorage.getItem("ravy_user_name");
  const name = userName ? ` ${userName}` : "";

  // 😴 CANSANCIO
  if (/cansad|agotad/.test(text)) {
    return `Lo siento${name}. Descansar también es avanzar.`;
  }

  // 😔 TRISTEZA
  if (/trist/.test(text)) {
    return `Siento que te sientas así${name}. Estoy contigo.`;
  }

  // 😰 ESTRÉS
  if (/estres|ansios/.test(text)) {
    return `Gracias por decirlo${name}. Vamos paso a paso.`;
  }

  // 😊 BIEN
  if (/feliz|bien/.test(text)) {
    return `Me alegra leer eso${name} 😊`;
  }

  // 🕒 HORA
  if (text.includes("hora")) {
    return `Son las ${new Date().toLocaleTimeString()}.`;
  }

  // 🌦️ CLIMA
  if (text.includes("clima") || text.includes("tiempo")) {
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
    } catch {
      return "Hubo un problema consultando el clima.";
    }
  }

  return "Te escucho 👂";
}
