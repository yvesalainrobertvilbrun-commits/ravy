import { save, load } from "./memory.js";
import { getWeather } from "./weather.js";

export function ravyRespond(text, reply) {
  const t = text.toLowerCase();

  if (t.startsWith("mi nombre es")) {
    const name = text.split("mi nombre es")[1].trim();
    save("user", name);
    reply({ text: `Mucho gusto, ${name} 😊` });
    return;
  }

  if (t.includes("hola")) {
    const name = load("user");
    reply({ text: name ? `Hola ${name} 👋` : "Hola 👋" });
    return;
  }

  if (t.includes("quien te creo")) {
    reply({ text: "Mi creador se llama Yves 😎" });
    return;
  }

  if (t.includes("hora")) {
    reply({ text: `Son las ${new Date().toLocaleTimeString()}` });
    return;
  }

  if (t.includes("clima")) {
    reply({ text: "Dime una ciudad 🌍" });
    return;
  }

  reply({ text: "Te escucho 👂" });
}
