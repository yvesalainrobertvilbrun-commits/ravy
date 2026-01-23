// Control básico de pantallas

function entrar() {
  document.getElementById("login").style.display = "none";
  document.getElementById("ravy").style.display = "block";
}

function salir() {
  document.getElementById("login").style.display = "block";
  document.getElementById("ravy").style.display = "none";
}

// Respuesta temporal de RAVY
function hablar() {
  const input = document.getElementById("userInput").value;
  const response = document.getElementById("response");

  if (input.trim() === "") {
    response.innerText = "Dime algo, estoy escuchando.";
    return;
  }

  response.innerText = "Te escuché: " + input;
}
