// js/memory.js

const RAVY_MEMORY_KEY = "ravy_memory";

// Obtener memoria
window.getRavyMemory = function () {
  const memory = localStorage.getItem(RAVY_MEMORY_KEY);
  return memory ? JSON.parse(memory) : [];
};

// Guardar memoria
window.saveToRavyMemory = function (text) {
  const memory = getRavyMemory();
  memory.push({
    text,
    date: new Date().toISOString()
  });
  localStorage.setItem(RAVY_MEMORY_KEY, JSON.stringify(memory));
};

// Limpiar memoria (por si acaso)
window.clearRavyMemory = function () {
  localStorage.removeItem(RAVY_MEMORY_KEY);
};
