<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>RAVY Core</title>
<style>
  body{
    font-family: Arial, sans-serif;
    padding:20px;
  }
  #ravy-input{
    width:70%;
    padding:10px;
    font-size:16px;
  }
  #ravy-send{
    padding:10px 16px;
    font-size:16px;
    cursor:pointer;
  }
  #ravy-log{
    margin-top:20px;
    max-height:300px;
    overflow:auto;
    border:1px solid #ccc;
    padding:10px;
  }
</style>
</head>
<body>

<h2>🤖 RAVY</h2>

<input id="ravy-input" placeholder="Escribe aquí o usa el micrófono">
<button id="ravy-send">Enviar</button>

<button id="ravy-speak-btn" style="
  position: fixed;
  bottom: 80px;
  right: 10px;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 12px;
  background-color: #32CD32;
  color: white;
  border: none;
  box-shadow:0 0 10px rgba(0,0,0,.3);
  cursor:pointer;
">🎤 Hablar</button>

<div id="ravy-log"></div>

<script>
/* =================================================
   UTILIDADES
================================================= */
function normalize(t){
  return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}
function log(text, from="RAVY"){
  const box=document.getElementById("ravy-log");
  box.innerHTML += `<div><b>${from}:</b> ${text}</div>`;
  box.scrollTop = box.scrollHeight;
}

/* =================================================
   MEMORIA (H1 – H2 – H5)
================================================= */
function getMemory(){
  return JSON.parse(localStorage.getItem("ravy_memory")) || {
    creator:"Yves",
    userName:null,
    interactions:0,
    moods:[]
  };
}
function setMemory(m){
  localStorage.setItem("ravy_memory",JSON.stringify(m));
}

/* =================================================
   VOZ (H7 ESTABLE)
================================================= */
function speak(text){
  if(!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang="es-ES";
  speechSynthesis.speak(u);
}

let listening=false;
function listen(callback){
  if(listening) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR) return;

  const r=new SR();
  r.lang="es-ES";
  r.interimResults=false;
  listening=true;

  r.onresult=e=>{
    listening=false;
    callback(e.results[0][0].transcript);
  };
  r.onerror=()=>listening=false;
  r.onend=()=>listening=false;

  try{ r.start(); }catch{ listening=false; }
}

/* =================================================
   DASHBOARD EMOCIONAL (H4)
================================================= */
function dashboard(mood){
  const map={
    cansado:["😴","#1E90FF"],
    feliz:["😃","#FFD700"],
    triste:["😢","#4169E1"],
    ansioso:["😰","#FF8C00"],
    motivado:["💪","#32CD32"],
    creativo:["🎨","#00FA9A"],
    aburrido:["😐","#A9A9A9"],
    relajado:["😌","#20B2AA"]
  };
  let d=document.getElementById("dash");
  if(!d){
    d=document.createElement("div");
    d.id="dash";
    d.style.cssText="position:fixed;bottom:10px;right:10px;padding:10px;border-radius:10px;color:#000;font-size:18px;box-shadow:0 0 10px rgba(0,0,0,.3)";
    document.body.appendChild(d);
  }
  if(map[mood]){
    d.style.background=map[mood][1];
    d.innerHTML=`${map[mood][0]} ${mood}`;
  }
}

/* =================================================
   CLIMA (H3)
================================================= */
async function clima(city="Santo Domingo"){
  try{
    const r=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&appid=9527074793829c2e506eb3c16faf4b93`);
    const d=await r.json();
    return `En ${city} hay ${d.weather[0].description} con ${d.main.temp}°C.`;
  }catch{
    return "No pude obtener el clima ahora.";
  }
}

/* =================================================
   CEREBRO RAVY (H1 → H7)
================================================= */
async function ravyThink(input){
  const t=normalize(input);
  const mem=getMemory();
  mem.interactions++;

  let reply="Te escucho 👂";
  let mood=null;

  // SALUDO
  if(/hola|buenos/.test(t))
    reply=mem.userName?`Hola ${mem.userName} 👋`:"Hola 👋";

  // EMOCIONES
  if(/cansad/.test(t)){ mood="cansado"; reply="Parece que estás cansado."; }
  if(/feliz|bien|contento/.test(t)){ mood="feliz"; reply="Me alegra saberlo 😊"; }
  if(/trist/.test(t)){ mood="triste"; reply="Estoy contigo."; }
  if(/ansios/.test(t)){ mood="ansioso"; reply="Respira profundo."; }
  if(/motivad/.test(t)){ mood="motivado"; reply="Vamos con todo 💪"; }
  if(/creativ/.test(t)){ mood="creativo"; reply="Aprovecha esa creatividad 🎨"; }
  if(/aburrid/.test(t)){ mood="aburrido"; reply="Tal vez cambiar de actividad ayude."; }
  if(/relajad/.test(t)){ mood="relajado"; reply="Disfruta el momento 😌"; }

  // INFO
  if(/hora/.test(t))
    reply=`Son las ${new Date().toLocaleTimeString()}`;

  if(/fecha|dia es hoy/.test(t))
    reply=new Date().toLocaleDateString("es-ES",{weekday:"long",year:"numeric",month:"long",day:"numeric"});

  if(/clima|tiempo/.test(t))
    reply=await clima();

  // IDENTIDAD
  if(/me llamo|mi nombre es/.test(t)){
    const m=input.match(/me llamo (.+)|mi nombre es (.+)/i);
    if(m){
      mem.userName=(m[1]||m[2]).trim();
      reply=`Mucho gusto ${mem.userName}`;
    }
  }

  if(/como me llamo/.test(t))
    reply=mem.userName?`Te llamas ${mem.userName}`:"Aún no me lo has dicho";

  if(/quien eres|que eres/.test(t))
    reply=`Soy RAVY, un asistente creado por ${mem.creator} para aprender contigo.`;

  if(/quien te creo/.test(t))
    reply=`Fui creado por ${mem.creator}.`;

  if(mood){
    mem.moods.push(mood);
    dashboard(mood);
  }

  setMemory(mem);
  log(reply,"RAVY");
  speak(reply);
}

/* =================================================
   INPUT TEXTO (FALLBACK TOTAL)
================================================= */
document.getElementById("ravy-send").onclick=()=>{
  const i=document.getElementById("ravy-input");
  if(!i.value) return;
  log(i.value,"TÚ");
  ravyThink(i.value);
  i.value="";
};

/* =================================================
   BOTÓN VOZ
================================================= */
document.getElementById("ravy-speak-btn").onclick=()=>{
  listen(text=>{
    log(text,"TÚ");
    ravyThink(text);
  });
};
</script>

</body>
</html>
