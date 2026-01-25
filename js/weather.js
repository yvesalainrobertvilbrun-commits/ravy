const API_KEY = "9527074793829c2e506eb3c16faf4b93";

export async function getWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&lang=es&appid=${API_KEY}`;

    const res = await fetch(url);

    if (!res.ok) {
      return "No pude obtener el clima de esa ciudad 🤔";
    }

    const data = await res.json();

    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;

    return `🌤️ En ${data.name} hay ${desc} con ${temp}°C`;
  } catch (err) {
    console.error(err);
    return "El clima no está disponible ahora 🌫️";
  }
}
