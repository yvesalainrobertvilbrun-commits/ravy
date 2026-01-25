import { save, load } from "./memory.js";

export function ravyRespond(text, reply) {
  try {
    const t = text.toLowerCase();

    if (t.includes("hola")) {
      const name = load("user");
      reply({ text: name ? `Hola ${name} 👋` : "Hola 👋" });
      return;
    }

    if (t.startsWith("mi nombre es")) {
      const name = text.split("mi nombre es")[1].trim();
      save("user", name);
      reply({ text: `Encantado, ${name} 😊` });
      return;
    }

    if (t.includes("quien te creo")) {
      reply({ text: "Mi creador se llama Yves." });
      return;
    }

    if (t.includes("hora")) {
      reply({ text: `Ahora mismo son las ${new Date().toLocaleTimeString()}` });
      return;
    }

    // 🔒 Respuesta por defecto OBLIGATORIA
    reply({ text: "Te escucho 👂" });

  } catch (err) {
    reply({ text: "Algo falló, pero sigo aquí 🧠" });
    console.error(err);
  }
}
