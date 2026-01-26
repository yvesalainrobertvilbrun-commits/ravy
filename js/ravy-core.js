<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>RAVY H7 Final</title>
</head>
<body>

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
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  cursor: pointer;
  z-index: 9999;
">🎤 Hablar con RAVY</button>

<script>
/* ================= UTILIDADES ================= */
function normalize(t){
  return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}

/* ================= MEMORIA ================= */
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

/* ================= VOZ (ESTABLE) ================= */
function speak(text){
  if(!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang="es-ES";
  speechSynthesis.speak(u);
}

let ravyListening=false;
function listen(callback){
  if(ravyListening) return;

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){
    console.warn("🎤 Voz no soportada");
    return;
  }

  const r=new SR();
  r.lang="es-ES";
  r.interimResults=false;
  ravyListening=true;

  r.onresult=e=>{
    ravyListening=false;
    callback(e.results[0][0].transcript);
  };

  r.onerror=()=>{
    ravyListening=false;
  };

  r.onend=()=>{
    ravyListening=false;
  };

  try{ r.start(); }
  catch{ ravyListening=false; }
}

/* ================= DASHBOARD ================= */
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
    d.style.cssText="position:fixed;bottom:10px;right:10px;padding:10px;border-radius:10px;font-size:18px;box-shadow:0 0 10px rgba(0,0,0,.3)";
    document.body.appendChild(d);
  }
  if(map[mood]){
    d.style.background=map[mood][1];
    d.innerHTML=`${map[mood][0]} Estado: ${mood}`;
  }
}

/* ================= CLIMA ================= */
async function clima(city="Santo Domingo"){
  try{
    const r=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&appid=9527074793829c2e506eb3c16faf4b93`);
    const d=await r.json();
    return `En ${city} hay ${d.weather[0].description} con ${d.main.temp}°C.`;
  }catch{
    return "No pude obtener el clima ahora.";
  }
}

/* ================= CEREBRO ================= */
async function ravyThink(input){
  const t=normalize(input);
  const mem=getMemory();
  mem.interactions++;

  let r="Te escucho 👂";
  let mood=null;

  /* SALUDO */
  if(/hola|buenos/.test(t))
    r=mem.userName?`Hola ${mem.userName} 👋`:"Hola 👋";

  /* EMOCIONES */
  if(/cansad/.test(t)){ mood="cansado"; r="Estás cansado, quizá descansar ayude."; }
  if(/feliz|bien|contento/.test(t)){ mood="feliz"; r="Me alegra saberlo 😊"; }
  if(/trist/.test(t)){ mood="triste"; r="Estoy contigo."; }
  if(/ansios/.test(t)){ mood="ansioso"; r="Respira profundo."; }
  if(/motivad/.test(t)){ mood="motivado"; r="Vamos con todo 💪"; }
  if(/creativ/.test(t)){ mood="creativo"; r="Aprovecha esa creatividad 🎨"; }
  if(/aburrid/.test(t)){ mood="aburrido"; r="Tal vez cambiar de actividad."; }
  if(/relajad/.test(t)){ mood="relajado"; r="Disfruta el momento 😌"; }

  /* INFO */
  if(/hora/.test(t))
    r=`Son las ${new Date().toLocaleTimeString()}`;

  if(/fecha|dia es hoy/.test(t))
    r=new Date().toLocaleDateString("es-ES",{weekday:"long",year:"numeric",month:"long",day:"numeric"});

  if(/clima|tiempo/.test(t))
    r=await clima();

  /* IDENTIDAD */
  if(/me llamo|mi nombre es/.test(t)){
    const m=input.match(/me llamo (.+)|mi nombre es (.+)/i);
    if(m){
      mem.userName=(m[1]||m[2]).trim();
      r=`Mucho gusto ${mem.userName}`;
    }
  }

  if(/como me llamo/.test(t))
    r=mem.userName?`Te llamas ${mem.userName}`:"Aún no me lo has dicho";

  if(/quien eres/.test(t))
    r=`Soy RAVY, asistente creado por ${mem.creator}.`;

  if(/quien te creo/.test(t))
    r=`Fui creado por ${mem.creator}.`;

  /* GUARDAR */
  if(mood){
    mem.moods.push(mood);
    dashboard(mood);
  }

  setMemory(mem);
  speak(r);
  return r;
}

/* ================= BOTÓN ================= */
document.getElementById("ravy-speak-btn").onclick=()=>{
  listen(t=>ravyThink(t));
};
</script>

</body>
</html>
