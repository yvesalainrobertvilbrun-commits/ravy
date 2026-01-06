const input = document.getElementById("input");
const chat = document.getElementById("chat");

function responder(mensaje) {
  const msg = mensaje.toLowerCase();

  if (msg.includes("hola")) {
    return "Hola, soy RAVY. Estoy activo.";
  }

  if (msg.includes("idioma")) {
    return "Puedo comunicarme en español, français, english y kreyòl ayisyen.";
  }

  if (msg.includes("estado")) {
    return "Estado actual: activo y atento.";
  }

  return "Te escucho.";
}

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter" && input.value.trim() !== "") {
    const mensaje = input.value;

    chat.innerHTML += `<p><strong>Tú:</strong> ${mensaje}</p>`;

    const respuesta = responder(mensaje);
    chat.innerHTML += `<p><strong>RAVY:</strong> ${respuesta}</p>`;

    chat.scrollTop = chat.scrollHeight;
    input.value = "";
  }
});
