const API_KEY = "9527074793829c2e506eb3c16faf4b93";

export async function getWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&appid=${API_KEY}`
    );
    const data = await res.json();

    if (data.cod !== 200) return "No encontré esa ciudad 😕";

    return `En ${city} hay ${data.weather[0].description} y ${Math.round(
      data.main.temp
    )}°C`;
  } catch {
    return "Error consultando el clima";
  }
}
