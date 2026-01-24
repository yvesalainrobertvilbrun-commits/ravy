// ENTRAR
document.getElementById("entrarBtn").onclick = () => {
  document.getElementById("login").style.display = "none";
  document.getElementById("ravy").style.display = "block";
};

// CHAT
document.getElementById("sendBtn").onclick = () => {
  const input = document.getElementById("userInput");
  const chat = document.getElementById("chat");

  const mensaje = input.value;
  if (!mensaje) return;

  chat.innerHTML += "<p><b>Tú:</b> " + mensaje + "</p>";

  const respuesta = ravyResponder(mensaje);
  chat.innerHTML += "<p><b>RAVY:</b> " + respuesta + "</p>";

  input.value = "";
};
