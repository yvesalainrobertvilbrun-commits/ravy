function ravyResponder(texto) {
  texto = texto.toLowerCase();

  if (texto.includes("hola")) {
    return "Hola. Estoy aquí contigo.";
  }

  if (texto.includes("quién eres") || texto.includes("quien eres")) {
    return "Soy RAVY. Un sistema en crecimiento.";
  }

  if (texto.includes("te repites")) {
    return "Estoy aprendiendo. Gracias por notarlo.";
  }

  return "Te escucho. Continúa.";
}
