export function getEmotion(text) {
  text = text.toLowerCase();

  if (text.includes("triste") || text.includes("mal") || text.includes("solo")) {
    return "triste";
  }
  if (text.includes("feliz") || text.includes("bien") || text.includes("contento")) {
    return "feliz";
  }
  if (text.includes("miedo") || text.includes("nervioso")) {
    return "miedo";
  }
  if (text.includes("amor") || text.includes("te quiero")) {
    return "afecto";
  }
  return "neutral";
}
