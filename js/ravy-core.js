import { save, load } from "./memory.js";
import { getWeather } from "./weather.js";

export function ravyRespond(text, reply) {
  try {
    const t = text.toLowerCase().trim();

    /* =========================
       MEMORIA BÁSICA
    ========================= */

    if (t.startsWith("mi nombre es")) {
      const name = text.split("mi nombre es")[1]?.trim();
      if (name) {
        save("user_name", name);
        reply({ text: `Mucho gusto, ${name} 😊` });
        return;
      }
    }

    const userName = load("user_name");

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
        text: "Mi creador y dueño se llama Yves. Eso lo tengo muy claro 💎"
      });
      return;
    }

    /* =========================
       EMOCIONES
    ========================= */

    if (t.includes("estoy cansado") || t.includes("cansado")) {
      reply({
        text: "Tiene sentido que estés cansado 😌. Respira un momento, aquí estoy contigo."
      });
      return;
    }

    if (t.includes("estoy triste") || t.includes("triste")) {
      reply({
        text: "Siento que te sientas así 💙. No tienes que cargarlo solo, cuéntame."
      });
      return;
    }

    if (t.includes("estoy bien") || t.includes("bien")) {
      reply({
        text: "Me alegra saberlo 😊. Sigamos construyendo juntos."
      });
      return;
    }

    /* =========================
       HORA Y FECHA
    ========================= */

    if (t.includes("hora")) {
      const hora = new Date().toLocaleTimeString();
      reply({ text: `Ahora mismo son las ${hora} ⏰` });
      return;
    }

    if (t.includes("dia") || t.includes("fecha")) {
      const fecha = new Date().toLocaleDateString();
      reply({ text: `Hoy es ${fecha} 📅` });
      return;
    }

    /* =========================
       CLIMA (BÁSICO)
    ========================= */

    if (t.includes("clima")) {
      reply({
        text: "Dime el nombre de una ciudad 🌍"
      });
      return;
    }

    // Si el usuario escribe solo una ciudad
    if (t.split(" ").length <= 2) {
      getWeather(text).then(res => {
        reply({ text: res });
      });
      return;
    }

    /* =========================
       RESPUESTA POR DEFECTO
    ========================= */

    reply({
      text: "Te escucho 👂. Puedes hablarme con confianza."
    });

  } catch (error) {
    console.error(error);
    reply({
      text: "Algo falló, pero sigo aquí contigo 🧠"
    });
  }
}
