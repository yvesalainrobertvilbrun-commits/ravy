export function getEmotion(text) {
  const t = text.toLowerCase();

  if (t.includes("triste") || t.includes("solo") || t.includes("mal")) {
    return "triste";
  }

  if (t.includes("feliz") || t.includes("bien") || t.includes("contento")) {
    return "feliz";
  }

  if (t.includes("miedo") || t.includes("ansioso") || t.includes("nervioso")) {
    return "miedo";
  }

  return "neutral";
}
