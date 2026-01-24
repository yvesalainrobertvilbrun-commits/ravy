const KEY = "ravy_memory";

export function saveMemory(text, emotion) {
  const data = {
    text,
    emotion,
    time: Date.now()
  };

  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getMemory() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);
    return data.text;
  } catch {
    return null;
  }
}
