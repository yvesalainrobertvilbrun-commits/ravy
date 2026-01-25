import { save, load } from "./memory.js";
import { getWeather } from "./weather.js";

/* =========================
   UTILIDADES
========================= */

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function ravyRespond(text, reply) {
  try {
    const original = text.trim();
    const t = original.toLowerCase();

    const userName = load("user_name");
    const userCity = load("user_city");
    const lastEmotion = load("last_emotion");
    const style = load("ravy_style") || "chill";
    const profile = load("user_profile") || {};

    /* =========================
       BIENVENIDA INTELIGENTE
       (solo si no hay memoria)
    ========================= */

    const isFirstTime =
      !userName &&
      !userCity &&
      !lastEmotion &&
      Object.keys(profile).length === 0;

    if (isFirstTime && t === "") {
      reply({
        text:
          "Hola, soy RAVY.\n" +
          "Puedo conversar contigo, decirte la hora, el clima y recordar cosas simples.\n\n" +
          "Si quieres, dime tu nombre para empezar."
      });
      return;
    }

    /* =========================
       MEMORIA LARGO PLAZO
    ========================= */

    if (t.startsWith("mi nombre es")) {
      const name = original.split("mi nombre es")[1]?.trim();
      if (name) {
        save("user_name", name);
        reply({
          text: `Mucho gusto, ${name}. ¿Cómo te sientes hoy?`
        });
        return;
      }
    }

    if (t.startsWith("vivo en") || t.startsWith("soy de")) {
      const city = original.replace(/vivo en|soy de/i, "").trim();
      if (city) {
        save("user_city", city);
        reply({
          text: `Perfecto. Guardé que estás en ${city}.`
        });
        return;
      }
    }

    if (t.startsWith("me gusta")) {
      const like = original.split("me gusta")[1]?.trim();
      if (like) {
        profile.likes = profile.likes || [];
        profile.likes.push(like);
        save("user_profile", profile);
        reply({
          text: `Entendido. Recordaré que te gusta ${like}.`
        });
        return;
      }
    }

    /* =========================
       SALUDOS CON CONTEXTO
    ========================= */

    if (t.includes("hola") || t.includes("buenas")) {
      if (userName) {
        reply({
          text: `Hola ${userName}. ¿Cómo estás ahora?`
        });
      } else {
        reply({
          text: "Hola. Si quieres, dime tu nombre."
        });
      }
      return;
    }

    /* =========================
       EMOCIONES
    ========================= */

    if (t.includes("cansado")) {
      save("last_emotion", "cansado");
      reply({
        text: "Tiene sentido sentirse cansado. Podemos ir con calma."
      });
      return;
    }

    if (t.includes("triste")) {
      save("last_emotion", "triste");
      reply({
        text: "Siento que te sientas así. Estoy aquí contigo."
      });
      return;
    }

    if (t.includes("bien")) {
      save("last_emotion", "bien");
      reply({
        text: "Me alegra saberlo."
      });
      return;
    }

    /* =========================
       CREADOR
    ========================= */

    if (t.includes("quien te creo") || t.includes("tu creador")) {
      reply({
        text: "Mi creador y dueño se llama Yves."
      });
      return;
    }

    /* =========================
       HORA Y FECHA
    ========================= */

    if (t.includes("hora")) {
      reply({
        text: `Ahora mismo son las ${new Date().toLocaleTimeString()}.`
      });
      return;
    }

    if (t.includes("día") || t.includes("dia") || t.includes("fecha")) {
      reply({
        text: `Hoy es ${new Date().toLocaleDateString()}.`
      });
      return;
    }

    /* =========================
       CLIMA
    ========================= */

    if (t.includes("clima")) {
      if (userCity) {
        getWeather(userCity).then(res => reply({ text: res }));
      } else {
        reply({
          text: "Dime la ciudad y te digo el clima."
        });
      }
      return;
    }

    /* =========================
       RESPUESTA POR DEFECTO
    ========================= */

    reply({
      text: pick([
        "Te escucho.",
        "Cuéntame.",
        "Estoy aquí contigo."
      ])
    });

  } catch (error) {
    console.error(error);
    reply({
      text: "Algo no salió bien, pero sigo aquí."
    });
  }
}
