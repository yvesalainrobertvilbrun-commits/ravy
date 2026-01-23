export function saveMemory(text, emotion) {
  const memory = {
    text,
    emotion,
    time: new Date().toISOString()
  };
  localStorage.setItem("ravy_last_memory", JSON.stringify(memory));
}

export function getMemory() {
  const mem = localStorage.getItem("ravy_last_memory");
  if (!mem) return null;
  return JSON.parse(mem);
}
