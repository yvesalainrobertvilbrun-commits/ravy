import { save, load } from "./memory.js";
import { getWeather } from "./weather.js";

/* =========================
   UTILIDADES DE TONO
========================= */

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
          text: pick([
            `Mucho gusto, ${name} 😊`,
            `Encantado de conocerte, ${name}.`,
            `Perfecto, ${name}. Me alegra saber tu nombre 🙂`
          ])
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
          text: pick([
            `Genial 👍 Entonces estás en ${city}. Lo recordaré.`,
            `Perfecto, ${city}. Ya lo guardé.`,
            `Listo 😊 Me quedo con que vives en ${city}.`
          ])
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
        text: pick([
          userName
            ? `Hola ${userName} 👋 ¿Cómo va tu día?`
            : "Hola 👋 ¿Cómo va tu día?",
          userName
            ? `Hey ${userName} 🙂 Me alegra verte por aquí.`
            : "Hey 🙂 Me alegra verte por aquí.",
          "Hola 👋 Estoy aquí contigo."
        ])
      });
      return;
    }

    /* =========================
       CREADOR
    ========================= */

    if (t.includes("quien te creo") || t.includes("tu creador")) {
      reply({
        text: pick([
          "Mi creador y dueño se llama Yves. Eso lo tengo muy claro 💎",
          "Fui creado por Yves. Es parte de quién soy.",
          "Yves es mi creador. No lo olvido."
        ])
      });
      return;
    }

    /* =========================
       EMOCIONES
    ========================= */

    if (t.includes("cansado")) {
      reply({
        text: pick([
          "Suena a que has dado mucho hoy 😌. Tómate un respiro, estoy aquí.",
          "Es normal sentirse cansado. Podemos ir con calma.",
          "Descansar también es avanzar. Aquí me quedo contigo."
        ])
      });
      return;
    }

    if (t.includes("triste")) {
      reply({
        text: pick([
          "Siento que te sientas así 💙. Si quieres hablar, te escucho.",
          "A veces pesa… no tienes que cargarlo solo.",
          "Estoy aquí contigo. Dime qué te tiene así."
        ])
      });
      return;
    }

    if (t.includes("bien")) {
      reply({
        text: pick([
          "Me alegra leer eso 😊",
          "Qué bueno saberlo. Sigamos.",
          "Perfecto 🙂 Me gusta esa energía."
        ])
      });
      return;
    }

    /* =========================
       HORA Y FECHA
    ========================= */

    if (t.includes("hora")) {
      reply({
        text: pick([
          `Ahora mismo son las ${new Date().toLocaleTimeString()} ⏰`,
          `Son las ${new Date().toLocaleTimeString()}.`
        ])
      });
      return;
    }

    if (t.includes("día") || t.includes("dia") || t.includes("fecha")) {
      reply({
        text: pick([
          `Hoy es ${new Date().toLocaleDateString()} 📅`,
          `Estamos a ${new Date().toLocaleDateString()}.`
        ])
      });
      return;
    }

    /* =========================
       CLIMA (PRIORIDAD)
    ========================= */

    if (t.includes("clima")) {
      if (userCity) {
        getWeather(userCity).then(res => reply({ text: res }));
      } else {
        reply({
          text: pick([
            "¿De qué ciudad quieres saber el clima? 🌍",
            "Dime una ciudad y te digo cómo está el clima."
          ])
        });
      }
      return;
    }

    /* =========================
       CIUDAD SOLA (AUTO CLIMA)
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
        userCity
          ? `Te escucho 👂. Si quieres, puedo decirte el clima en ${userCity}.`
          : "Te escucho 👂. ¿Qué tienes en mente?",
        "Aquí estoy. Dime.",
        "Cuéntame un poco más."
      ])
    });

  } catch (error) {
    console.error(error);
    reply({
      text: "Algo falló, pero sigo aquí contigo 🧠"
    });
  }
}
