// ================= EMOCIONES =================

export function detectarEmocion(texto) {
  if (texto.includes("triste") || texto.includes("mal")) return "triste";
  if (texto.includes("feliz") || texto.includes("bien")) return "feliz";
  if (texto.includes("miedo")) return "miedo";
  return "neutral";
}
