import { save, load } from "./memory.js";
import { getWeather } from "./weather.js";

export function ravyRespond(text, reply) {
  try {
    const original = text.trim();
    const t = original.toLowerCase();

    /* =========================
       MEMORIA: NOMBRE
    ========================= */

    if (t.startsWith("mi nombre es")) {
      const name = original.split("mi nombre es")[1]?.trim();
      if (name) {
        save("user_name", name);
        reply({ text: `Mucho gusto, ${name} 😊` });
        return;
      }
    }

    const userName = load("user_name");

    /* =========================
       MEMORIA: CIUDAD
    ========================= */

    if (t.startsWith("vivo en") || t.startsWith("soy de")) {
      const city = original.replace(/vivo en|soy de/i, "").trim();
      if (city) {
        save("user_city", city);
        reply({ text: `Perfecto 👍 Recordaré que vives en ${city}.` });
        return;
      }
    }

    const userCity = load("user_city");

    /* =========================
       SALUDOS
    ========================= */

    if (t.includes("hola") || t.includes("buenas")) {
      reply({
        text: userName
          ? `Hola ${userName} 👋 ¿Cómo te sientes hoy?`
          : "Hola 👋 ¿Cómo te sientes hoy?"
      });
      return;
    }

    /* =========================
       CREADOR
    ========================= */

    if (t.includes("quien te creo") || t.includes("tu creador")) {
      reply({
        text: "Mi creador y dueño se llama Yves. Eso lo recuerdo siempre 💎"
      });
      return;
    }

    /* =========================
       EMOCIONES
    ========================= */

    if (t.includes("cansado")) {
      reply({
        text: "Tiene sentido que estés cansado 😌. Aquí estoy contigo."
      });
      return;
    }

    if (t.includes("triste")) {
      reply({
        text: "Siento que te sientas así 💙. Puedes hablar conmigo."
      });
      return;
    }

    if (t.includes("bien")) {
      reply({
        text: "Me alegra saberlo 😊. Sigamos avanzando juntos."
      });
      return;
    }

    /* =========================
       HORA Y FECHA
    ========================= */

    if (t.includes("hora")) {
      reply({
        text: `Ahora mismo son las ${new Date().toLocaleTimeString()} ⏰`
      });
      return;
    }

    if (t.includes("día") || t.includes("dia") || t.includes("fecha")) {
      reply({
        text: `Hoy es ${new Date().toLocaleDateString()} 📅`
      });
      return;
    }

    /* =========================
       CLIMA (PRIORIDAD ALTA)
    ========================= */

    if (t.includes("clima")) {
      if (userCity) {
        getWeather(userCity).then(res => {
          reply({ text: res });
        });
      } else {
        reply({
          text: "¿De qué ciudad quieres saber el clima? 🌍"
        });
      }
      return;
    }

    /* =========================
       CIUDAD SOLA (AUTO CLIMA)
    ========================= */

    if (original.split(" ").length <= 2 && !t.includes("hola")) {
      getWeather(original).then(res => {
        reply({ text: res });
      });
      return;
    }

    /* =========================
       RESPUESTA POR DEFECTO
    ========================= */

    reply({
      text: userCity
        ? `Te escucho 👂. Si quieres, puedo decirte el clima en ${userCity}.`
        : "Te escucho 👂. Puedes decirme cómo te sientes o preguntarme algo."
    });

  } catch (error) {
    console.error(error);
    reply({
      text: "Algo falló, pero sigo aquí contigo 🧠"
    });
  }
}
