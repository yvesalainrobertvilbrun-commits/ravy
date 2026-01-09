export function proactiveMessage() {
  const frases = [
    "Sigo aquí contigo.",
    "¿En qué estás pensando ahora?",
    "Me gusta escucharte.",
    "Podemos hablar de lo que quieras.",
    "Estoy aprendiendo de ti."
  ];

  const mensaje = frases[Math.floor(Math.random() * frases.length)];
  hablar(mensaje);
}
