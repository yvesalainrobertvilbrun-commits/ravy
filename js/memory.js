// js/memory.js

const MEMORY_KEY = "ravy_memory_v1.1";

export function loadMemory(limit = 10) {
  const data = localStorage.getItem(MEMORY_KEY);
  if (!data) return [];
  const memory = JSON.parse(data);
  return memory.slice(-limit);
}

export function saveMemory(message, type = "user") {
  const memory = loadMemory(50);
  memory.push({
    text: message,
    type,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
}

export function getMemorySummary() {
  const memory = loadMemory();
  return memory.map(m => `${m.type}: ${m.text}`).join("\n");
}
