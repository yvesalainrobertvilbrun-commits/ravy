// ==============================
// RAVY APP UI
// ==============================

const chat = document.getElementById("chat");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

const sidebar = document.getElementById("sidebar");
const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");

const navBtns = document.querySelectorAll(".nav-btn");
const pages = {
  home: document.getElementById("page-home"),
  profile: document.getElementById("page-profile"),
  settings: document.getElementById("page-settings"),
  test: document.getElementById("page-test"),
  memory: document.getElementById("page-memory"),
};

const ravyVersion = document.getElementById("ravyVersion");
const profileText = document.getElementById("profileText");

const btnViewMemory = document.getElementById("btnViewMemory");
const btnClearMemory = document.getElementById("btnClearMemory");
const memoryBox = document.getElementById("memoryBox");

// ====== helpers ======
function addMsg(text, who = "ravy") {
  const div = document.createElement("div");
  div.className = `msg ${who}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function showPage(name) {
  Object.values(pages).forEach((p) => p.classList.remove("show"));
  pages[name].classList.add("show");

  navBtns.forEach((b) => b.classList.remove("active"));
  document.querySelector(`[data-page="${name}"]`).classList.add("active");

  sidebar.classList.remove("open");
}

function setProfile() {
  if (!window.RAVY) return;
  profileText.textContent =
    `${RAVY.identity.longWho}\n\n` +
    `Modo: ${RAVY.mode.personality} (Profesional)\n` +
    `Respuesta: ${RAVY.mode.response} (corta primero)\n` +
    `Versión: ${RAVY.version}`;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMsg(text, "user");
  input.value = "";

  // typing
  addMsg("Pensando...", "ravy");

  // remove last "Pensando..."
  const thinkingNode = chat.lastChild;

  try {
    const answer = await RAVY.reply(text);
    thinkingNode.textContent = answer;
  } catch (e) {
    thinkingNode.textContent = "Tuve un fallo técnico. Pero sigo contigo.";
  }
}

// ====== events ======
sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

openMenu.addEventListener("click", () => sidebar.classList.add("open"));
closeMenu.addEventListener("click", () => sidebar.classList.remove("open"));

navBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    showPage(btn.dataset.page);
    if (btn.dataset.page === "profile") setProfile();
  });
});

// Memory page buttons
btnViewMemory.addEventListener("click", async () => {
  try {
    const res = await RAVY.reply("Ver memoria");
    memoryBox.textContent = res;
  } catch (e) {
    memoryBox.textContent = "Error leyendo memoria.";
  }
});

btnClearMemory.addEventListener("click", async () => {
  try {
    const res = await RAVY.reply("Borrar memoria");
    memoryBox.textContent = res;
  } catch (e) {
    memoryBox.textContent = "Error borrando memoria.";
  }
});

// ====== init ======
(function init() {
  if (window.RAVY) {
    ravyVersion.textContent = RAVY.version;
  } else {
    ravyVersion.textContent = "RAVY no cargó";
  }

  addMsg("Soy RAVY. Dime qué necesitas y lo resolvemos.", "ravy");
})();
