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
    let profile = load("user_profile") || {};

    /* =========================
       MEMORIA LARGO PLAZO
    ========================= */

    // Gustos
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

    // Preferencias
    if (t.startsWith("prefiero")) {
      const pref = original.split("prefiero")[1]?.trim();
      if (pref) {
        profile.preferences = profile.preferences || [];
        profile.preferences.push(pref);
        save("user_profile", profile);

        reply({
          text: `Perfecto. Tendré en cuenta que prefieres ${pref}.`
        });
        return;
      }
    }

    // Hábitos
    if (t.startsWith("suelo")) {
      const habit = original.split("suelo")[1]?.trim();
      if (habit) {
        profile.habits = profile.habits || [];
        profile.habits.push(habit);
        save("user_profile", profile);

        reply({
          text: `Ok. Recordaré que sueles ${habit}.`
        });
        return;
      }
    }

    /* =========================
       SALUDO CON CONTEXTO
    ========================= */

    if (t.includes("hola") || t.includes("buenas")) {
      if (profile.likes && profile.likes.length > 0) {
        reply({
          text: pick([
            `Hola${userName ? " " + userName : ""}. Recuerdo que te gusta ${profile.likes[0]}. ¿Cómo vas con eso?`,
            `Hola. ¿Sigues disfrutando de ${profile.likes[0]}?`
          ])
        });
      } else if (lastEmotion) {
        reply({
          text: `Hola. La última vez estabas ${lastEmotion}. ¿Cómo estás ahora?`
        });
      } else {
        reply({
          text: "Hola. Estoy aquí contigo."
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
        text: "Entiendo. Estoy aquí contigo."
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
