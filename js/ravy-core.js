import { save, load } from "./memory.js";
import { getWeather } from "./weather.js";

/* =========================
   ESTILOS DE RAVY
========================= */

const styles = {
  mentor: {
    greet: [
      "Hola. ¿Qué reflexión te trae hoy?",
      "Estoy aquí. Dime qué necesitas comprender."
    ],
    listen: [
      "Te escucho con atención.",
      "Continúa. Estoy siguiendo la idea."
    ],
    tired: [
      "El cansancio suele aparecer cuando se ha dado mucho.",
      "Tal vez sea momento de escuchar al cuerpo."
    ]
  },

  chill: {
    greet: [
      "Hey 🙂 ¿Qué tal todo?",
      "Aquí estoy. Tranquilo."
    ],
    listen: [
      "Te escucho.",
      "Cuéntame."
    ],
    tired: [
      "Uff, suena a día largo.",
      "Tómalo con calma."
    ]
  },

  serio: {
    greet: [
      "Hola. ¿En qué te ayudo?",
      "Dime."
    ],
    listen: [
      "Te escucho.",
      "Continúa."
    ],
    tired: [
      "El cansancio es una señal.",
      "Conviene descansar."
    ]
  }
};

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
    let style = load("ravy_style") || "calm";

    if (!styles[style]) {
      style = "chill";
      save("ravy_style", "chill");
    }

    /* =========================
       CAMBIO DE ESTILO
    ========================= */

    if (t.includes("cambia tu estilo a")) {
      const newStyle = t.split("cambia tu estilo a")[1]?.trim();
      if (styles[newStyle]) {
        save("ravy_style", newStyle);
        reply({
          text: `De acuerdo. A partir de ahora hablaré con estilo ${newStyle}.`
        });
      } else {
        reply({
          text: "Ese estilo no existe. Puedes usar: mentor, chill o serio."
        });
      }
      return;
    }

    /* =========================
       SALUDO
    ========================= */

    if (t.includes("hola") || t.includes("buenas")) {
      reply({
        text: pick(styles[style].greet)
      });
      return;
    }

    /* =========================
       EMOCIONES
    ========================= */

    if (t.includes("cansado")) {
      save("last_emotion", "cansado");
      reply({
        text: pick(styles[style].tired)
      });
      return;
    }

    if (t.includes("triste")) {
      save("last_emotion", "triste");
      reply({
        text: "Entiendo. Puedes tomarte tu tiempo. Estoy aquí."
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
      text: pick(styles[style].listen)
    });

  } catch (error) {
    console.error(error);
    reply({
      text: "Algo no salió bien, pero sigo aquí."
    });
  }
}
