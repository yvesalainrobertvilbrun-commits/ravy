import { save, load } from "./memory.js";
import { getWeather } from "./weather.js";

/* =========================
   PERSONALIDAD BASE
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

    /* =========================
       MEMORIA: NOMBRE
    ========================= */

    if (t.startsWith("mi nombre es")) {
      const name = original.split("mi nombre es")[1]?.trim();
      if (name) {
        save("user_name", name);
        reply({
          text: pick([
            `Mucho gusto, ${name}.`,
            `Encantado de conocerte, ${name}.`
          ])
        });
        return;
      }
    }

    /* =========================
       MEMORIA: CIUDAD
    ========================= */

    if (t.startsWith("vivo en") || t.startsWith("soy de")) {
      const city = original.replace(/vivo en|soy de/i, "").trim();
      if (city) {
        save("user_city", city);
        reply({
          text: `Entendido. Guardé que estás en ${city}.`
        });
        return;
      }
    }

    /* =========================
       SALUDOS + CONTEXTO EMOCIONAL
    ========================= */

    if (t.includes("hola") || t.includes("buenas")) {
      if (lastEmotion) {
        reply({
          text: pick([
            `Hola${userName ? " " + userName : ""}. La última vez estabas ${lastEmotion}. ¿Cómo te sientes ahora?`,
            `Hola. Recuerdo que estabas ${lastEmotion}. ¿Cambió algo?`
          ])
        });
      } else {
        reply({
          text: pick([
            `Hola${userName ? " " + userName : ""}. ¿Cómo te sientes hoy?`,
            "Hola. Estoy aquí."
          ])
        });
      }
      return;
    }

    /* =========================
       EMOCIONES (SE GUARDAN)
    ========================= */

    if (t.includes("cansado")) {
      save("last_emotion", "cansado");
      reply({
        text: pick([
          "Tiene sentido sentirse cansado. Podemos ir con calma.",
          "A veces el cuerpo pide pausa."
        ])
      });
      return;
    }

    if (t.includes("triste")) {
      save("last_emotion", "triste");
      reply({
        text: pick([
          "Siento que te sientas así. Estoy aquí contigo.",
          "No es fácil sentirse triste. Puedes hablar."
        ])
      });
      return;
    }

    if (t.includes("bien") || t.includes("mejor")) {
      save("last_emotion", "bien");
      reply({
        text: pick([
          "Me alegra saberlo.",
          "Qué bueno leer eso."
        ])
      });
      return;
    }

    /* =========================
       CREADOR
    ========================= */

    if (t.includes("quien te creo") || t.includes("tu creador")) {
      reply({
        text: "Mi creador y dueño se llama Yves. Eso lo recuerdo siempre."
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
          text: "Dime la ciudad y te digo cómo está el clima."
        });
      }
      return;
    }

    /* =========================
       CIUDAD SOLA
    ========================= */

    if (original.split(" ").length <= 2 && !t.includes("hola")) {
      getWeather(original).then(res => reply({ text: res }));
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
