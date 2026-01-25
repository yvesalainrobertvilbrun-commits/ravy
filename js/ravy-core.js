import { save, load } from "./memory.js";
import { getWeather } from "./weather.js";

/* =========================
   PERSONALIDAD DE RAVY
========================= */

const personality = {
  calm: true,
  warm: true,
  curious: true,
  emojis: false
};

function say(text) {
  return text;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

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
        reply({
          text: say(
            pick([
              `Mucho gusto, ${name}.`,
              `Encantado de conocerte, ${name}.`,
              `Perfecto, ${name}. Me alegra saber tu nombre.`
            ])
          )
        });
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
        reply({
          text: say(
            pick([
              `Bien. Entonces estás en ${city}. Lo tendré en cuenta.`,
              `Perfecto. Me quedo con que vives en ${city}.`,
              `Entendido. ${city}.`
            ])
          )
        });
        return;
      }
    }

    const userCity = load("user_city");

    /* =========================
       SALUDOS
    ========================= */

    if (t.includes("hola") || t.includes("buenas")) {
      reply({
        text: say(
          pick([
            userName
              ? `Hola ${userName}. ¿Cómo te sientes hoy?`
              : "Hola. ¿Cómo te sientes hoy?",
            "Hola. Estoy aquí.",
            "Buenas. Cuéntame."
          ])
        )
      });
      return;
    }

    /* =========================
       CREADOR
    ========================= */

    if (t.includes("quien te creo") || t.includes("tu creador")) {
      reply({
        text: say(
          "Mi creador y dueño se llama Yves. Eso es parte de mí."
        )
      });
      return;
    }

    /* =========================
       EMOCIONES
    ========================= */

    if (t.includes("cansado")) {
      reply({
        text: say(
          pick([
            "Tiene sentido sentirse cansado. ¿Fue un día largo?",
            "A veces el cuerpo y la mente piden pausa.",
            "Podemos ir con calma."
          ])
        )
      });
      return;
    }

    if (t.includes("triste")) {
      reply({
        text: say(
          pick([
            "Lamento que te sientas así. Si quieres hablar, estoy aquí.",
            "No siempre es fácil. Puedes contar conmigo.",
            "Tómate tu tiempo."
          ])
        )
      });
      return;
    }

    if (t.includes("bien")) {
      reply({
        text: say(
          pick([
            "Me alegra saberlo.",
            "Qué bueno.",
            "Eso suena bien."
          ])
        )
      });
      return;
    }

    /* =========================
       HORA Y FECHA
    ========================= */

    if (t.includes("hora")) {
      reply({
        text: say(`Ahora mismo son las ${new Date().toLocaleTimeString()}.`)
      });
      return;
    }

    if (t.includes("día") || t.includes("dia") || t.includes("fecha")) {
      reply({
        text: say(`Hoy es ${new Date().toLocaleDateString()}.`)
      });
      return;
    }

    /* =========================
       CLIMA
    ========================= */

    if (t.includes("clima")) {
      if (userCity) {
        getWeather(userCity).then(res => {
          reply({ text: say(res) });
        });
      } else {
        reply({
          text: say("Dime la ciudad y te digo cómo está el clima.")
        });
      }
      return;
    }

    /* =========================
       CIUDAD SOLA
    ========================= */

    if (original.split(" ").length <= 2 && !t.includes("hola")) {
      getWeather(original).then(res => {
        reply({ text: say(res) });
      });
      return;
    }

    /* =========================
       RESPUESTA POR DEFECTO
    ========================= */

    reply({
      text: say(
        pick([
          "Te escucho.",
          "Cuéntame un poco más.",
          "Estoy contigo. ¿Qué pasa?"
        ])
      )
    });

  } catch (error) {
    console.error(error);
    reply({
      text: "Algo no salió bien, pero sigo aquí."
    });
  }
}
