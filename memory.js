let memory = JSON.parse(localStorage.getItem("ravyMemory")) || [];

export function saveMemory(text, emotion) {
  memory.push({
    text,
    emotion,
    time: Date.now()
  });

  if (memory.length > 200) memory.shift();

  localStorage.setItem("ravyMemory", JSON.stringify(memory));
}

export function getMemory() {
  if (memory.length === 0) return null;
  return memory[memory.length - 1].text;
}
