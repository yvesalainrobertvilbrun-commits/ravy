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

    /* =========================
       MEMORIA: NOMBRE
    ========================= */

    if (t.startsWith("mi nombre es")) {
      const name = original.split("mi nombre es")[1]?.trim();
      if (name) {
        save("user_name", name);
        reply({
          text: pick([
            `Mucho gusto, ${name} 😊 ¿Cómo te sientes hoy?`,
            `Encantado, ${name}. ¿Qué tal va tu día?`,
            `Perfecto, ${name}. ¿En qué te ayudo ahora?`
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
            `Genial 👍 Entonces estás en ${city}. ¿Quieres saber el clima ahora?`,
            `Perfecto, ${city}. ¿Te muestro el clima o prefieres otra cosa?`,
            `Listo 😊 Me quedo con ${city}. ¿Seguimos?`
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
            ? `Hola ${userName} 👋 ¿Cómo va tu día hoy?`
            : "Hola 👋 ¿Cómo va tu día hoy?",
          "Hey 🙂 ¿En qué te ayudo ahora?",
          "Hola 👋 ¿Qué tienes en mente?"
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
          "Mi creador y dueño se llama Yves. ¿Quieres saber cómo funciono?",
          "Fui creado por Yves. ¿Te cuento qué puedo hacer?",
          "Yves es mi creador. ¿En qué te ayudo ahora?"
        ])
      });
      return;
    }

    /* =========================
       EMOCIONES + PREGUNTA
    ========================= */

    if (t.includes("cansado")) {
      reply({
        text: pick([
          "Suena a que has tenido un día largo 😌. ¿Fue trabajo o algo personal?",
          "Es normal sentirse cansado. ¿Quieres hablar de eso o prefieres distraerte?",
          "Te noto cansado. ¿Te ayudo con algo rápido?"
        ])
      });
      return;
    }

    if (t.includes("triste")) {
      reply({
        text: pick([
          "Siento que te sientas así 💙. ¿Qué es lo que más te pesa ahora?",
          "Aquí estoy contigo. ¿Quieres contarme qué pasó?",
          "A veces hablar ayuda. ¿Te animas a decirme qué te entristece?"
        ])
      });
      return;
    }

    if (t.includes("bien")) {
      reply({
        text: pick([
          "Me alegra leer eso 😊 ¿Qué te gustaría hacer ahora?",
          "Qué bueno 🙂 ¿Seguimos con algo en particular?",
          "Excelente. ¿En qué te ayudo?"
        ])
      });
      return;
    }

    /* =========================
       HORA Y FECHA + CONTINUACIÓN
    ========================= */

    if (t.includes("hora")) {
      reply({
        text: pick([
          `Ahora mismo son las ${new Date().toLocaleTimeString()} ⏰. ¿Necesitas algo más?`,
          `Son las ${new Date().toLocaleTimeString()}. ¿Seguimos?`
        ])
      });
      return;
    }

    if (t.includes("día") || t.includes("dia") || t.includes("fecha")) {
      reply({
        text: pick([
          `Hoy es ${new Date().toLocaleDateString()} 📅. ¿Te ayudo con algo hoy?`,
          `Estamos a ${new Date().toLocaleDateString()}. ¿Qué sigue?`
        ])
      });
      return;
    }

    /* =========================
       CLIMA + PROPUESTA
    ========================= */

    if (t.includes("clima")) {
      if (userCity) {
        getWeather(userCity).then(res => {
          reply({
            text: `${res}\n¿Quieres el pronóstico o saber la hora ahora?`
          });
        });
      } else {
        reply({
          text: "¿De qué ciudad quieres saber el clima? 🌍"
        });
      }
      return;
    }

    /* =========================
       CIUDAD SOLA
    ========================= */

    if (original.split(" ").length <= 2 && !t.includes("hola")) {
      getWeather(original).then(res => {
        reply({
          text: `${res}\n¿Quieres saber la hora o el clima de otra ciudad?`
        });
      });
      return;
    }

    /* =========================
       RESPUESTA POR DEFECTO
    ========================= */

    reply({
      text: pick([
        "Te escucho 👂 ¿Qué te gustaría hacer ahora?",
        userCity
          ? `Puedo decirte el clima en ${userCity}, la hora o simplemente escucharte.`
          : "Puedo ayudarte con la hora, el clima o simplemente conversar.",
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
