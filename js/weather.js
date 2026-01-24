const API_KEY = "TU_API_KEY_AQUI";
const DEFAULT_CITY = "Santo Domingo";
const DEFAULT_COUNTRY = "DO";

export async function getWeather(city = DEFAULT_CITY) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${DEFAULT_COUNTRY}&units=metric&lang=es&appid=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      return "No pude obtener el clima ahora mismo 😕";
    }

    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;

    return `En ${city} está ${desc} con ${temp}°C 🌤️`;
  } catch (e) {
    return "Error al consultar el clima 🌧️";
  }
}
