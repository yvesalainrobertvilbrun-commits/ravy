import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const RAVY = {
  nombre: "RAVY",
  personalidad: "respetuoso, familiar, atento",
  memoria: []
};

app.post("/pensar", async (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    return res.json({ respuesta: "No escuché nada." });
  }

  RAVY.memoria.push(texto);

  let respuesta = "Estoy aquí contigo.";

  if (texto.includes("hola")) {
    respuesta = "Hola. Aquí está RAVY contigo.";
  } 
  else if (texto.includes("hora")) {
    respuesta = "La hora actual es " + new Date().toLocaleTimeString();
  }
  else if (texto.includes("quién eres")) {
    respuesta = "Soy RAVY, parte de tu familia digital.";
  }
  else {
    respuesta = "Te escucho. Dime más.";
  }

  res.json({ respuesta });
});

app.listen(3000, () => {
  console.log("🧠 Cerebro de RAVY activo en puerto 3000");
});
