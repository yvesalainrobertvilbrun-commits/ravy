export function hablar(texto) {
  const voz = new SpeechSynthesisUtterance(texto);
  voz.lang = "es-ES";
  voz.rate = 1;
  voz.pitch = 1.1;
  speechSynthesis.speak(voz);
}

export function escuchar(callback) {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Tu navegador no soporta micrófono");
    return;
  }

  const reconocimiento = new webkitSpeechRecognition();
  reconocimiento.lang = "es-ES";
  reconocimiento.interimResults = false;
  reconocimiento.continuous = false;

  reconocimiento.onresult = (event) => {
    callback(event.results[0][0].transcript);
  };

  reconocimiento.start();
}
