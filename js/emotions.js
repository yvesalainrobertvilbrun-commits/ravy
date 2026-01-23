export function getEmotion(text) {
  const t = text.toLowerCase();

  if (t.includes("triste") || t.includes("mal") || t.includes("cansado")) {
    return "triste";
  }
  if (t.includes("feliz") || t.includes("bien") || t.includes("gracias")) {
    return "feliz";
  }
  if (t.includes("miedo") || t.includes("ansioso") || t.includes("nervioso")) {
    return "miedo";
  }
  return "neutral";
}
