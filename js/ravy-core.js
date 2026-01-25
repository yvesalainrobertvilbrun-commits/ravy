import { save, load } from "./memory.js";

export function processMessage(text) {
  const lower = text.toLowerCase();

  let userName = load("userName");
  const creator = "Yves";

  /* SALUDOS */
  if (lower.includes("hola") || lower.includes("buenos")) {
    return "Hola 😊 estoy aquí contigo.";
  }

  /* NOMBRE USUARIO */
  if (lower.includes("me llamo")) {
    const name = text.split("me llamo")[1].trim();
    save("userName", name);
    return `Mucho gusto, ${name}. Lo recordaré.`;
  }

  if (lower.includes("como me llamo")) {
    return userName
      ? `Te llamas ${userName}.`
      : "Aún no me has dicho tu nombre.";
  }

  /* CREADOR */
  if (lower.includes("quien te creo") || lower.includes("tu creador")) {
    return "Fui creado por Yves.";
  }

  /* EMOCIONES */
  if (lower.includes("estoy cansado")) {
    return "Lo siento 😔 descansa un poco, aquí sigo contigo.";
  }

  /* FECHA Y HORA */
  if (lower.includes("hora")) {
    return `Son las ${new Date().toLocaleTimeString()}`;
  }

  if (lower.includes("dia") || lower.includes("fecha")) {
    return `Hoy es ${new Date().toLocaleDateString()}`;
  }

  /* FALLBACK */
  return "Te escucho 👂";
}
