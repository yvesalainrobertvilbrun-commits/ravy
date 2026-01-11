// ================= MEMORIA =================

const memoria = JSON.parse(localStorage.getItem("ravy_memoria")) || {
  historial: [],
  temas: {},
  ultimoTema: null,
};

export function guardarMemoria(texto) {
  memoria.historial.push(texto);

  const temas = {
    familia: ["familia", "madre", "hijo", "esposa"],
    trabajo: ["trabajo", "negocio", "proyecto"],
    tiempo: ["hora", "día", "noche"],
  };

  for (const tema in temas) {
    if (temas[tema].some((p) => texto.includes(p))) {
      memoria.temas[tema] = (memoria.temas[tema] || 0) + 1;
      memoria.ultimoTema = tema;
    }
  }

  localStorage.setItem("ravy_memoria", JSON.stringify(memoria));
}

export function obtenerContexto() {
  return memoria.ultimoTema;
}
