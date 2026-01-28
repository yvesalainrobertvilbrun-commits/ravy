/* =========================================================
   RAVY BRAIN PACK — PRO MODE (D + C) + H9 MEMORY PRO
   - Identidad fuerte
   - Decisor Web (H8.1)
   - Respuesta Profesional + Fuentes (H8.2)
   - Manejo Pro de "No sé" / errores (H8.3)
   - Memoria Pro (H9) — recuerda cosas útiles sin inventar
   Compatible: Browser (sin módulos)
========================================================= */

window.RAVY = {
  version: "RAVY-BRAIN-PACK-H9.0-PRO",

  // =========================
  // MODOS
  // =========================
  mode: {
    personality: "D",
    response: "C",
    professional: true,
  },

  // =========================
  // IDENTIDAD
  // =========================
  identity: {
    name: "RAVY",

    shortWho:
      "Soy RAVY. Tu asistente inteligente: directo, real y leal. Estoy aquí para ayudarte a pensar, resolver y avanzar.",
    shortPurpose:
      "Mi propósito es ayudarte a tomar decisiones, aprender rápido y ejecutar sin perder tiempo.",
    shortCreator:
      "Me creó Yves. Yo soy su obra, pero mi misión es servirte con nivel.",
    shortCanDo:
      "Puedo ayudarte con clima, hora, información en internet, ideas, filosofía, artistas, tareas, planes y soluciones rápidas.",

    longWho:
      "Soy RAVY, un asistente creado para ayudarte como un socio mental. Mantengo un estilo profesional: claro, directo y respetuoso. Mi trabajo es entenderte, darte respuestas útiles y ayudarte a construir resultados reales.",
    longPurpose:
      "Estoy diseñado para darte claridad cuando estés confundido, estructura cuando quieras avanzar y velocidad cuando necesites resolver. Si tú quieres crecer, yo soy la herramienta.",
    longCreator:
      "Fui creado por Yves con una visión: construir un asistente personal, útil y con carácter. Yves me dio el origen; mi función es ayudarte con todo lo que necesites.",
    longCanDo:
      "Puedo conversar contigo, ayudarte a organizar planes, darte información actual usando internet (fuentes verificables), decirte clima y hora según tu ubicación, aportar ideas creativas y darte soluciones prácticas paso a paso.",
  },

  // =========================
  // CONFIG
  // =========================
  config: {
    allowWeb: true,
    showSources: true,
    locationMode: "AUTO",
    defaultLanguage: "es",

    // H9 Memory Config
    memoryEnabled: true,
    memoryMaxItems: 50,
    memoryMaxChars: 120,
  },

  // =========================
  // H9 — MEMORIA PRO (SIMPLE + SEGURA)
  // =========================
  memory: {
    user: {
      name: "Yves",
      project: "RAVY",
      style: "Modo D + Respuesta C",
    },

    facts: [],
    lastTopic: "",
    lastQuestion: "",
  },

  // Guardar memoria (sin inventar)
  remember(key, value) {
    if (!this.config.memoryEnabled) return false;
    if (!key || !value) return false;

    const cleanKey = String(key).trim().toLowerCase();
    const cleanValue = String(value).trim();

    if (!cleanKey || !cleanValue) return false;

    // evitar valores gigantes
    const shortValue =
      cleanValue.length > this.config.memoryMaxChars
        ? cleanValue.slice(0, this.config.memoryMaxChars) + "…"
        : cleanValue;

    // si existe, actualiza
    const idx = this.memory.facts.findIndex((x) => x.key === cleanKey);
    if (idx >= 0) {
      this.memory.facts[idx] = { key: cleanKey, value: shortValue, ts: Date.now() };
      return true;
    }

    // si no existe, agrega
    this.memory.facts.push({ key: cleanKey, value: shortValue, ts: Date.now() });

    // limitar tamaño
    if (this.memory.facts.length > this.config.memoryMaxItems) {
      this.memory.facts.shift();
    }

    return true;
  },

  recall(key) {
    const cleanKey = String(key || "").trim().toLowerCase();
    const item = this.memory.facts.find((x) => x.key === cleanKey);
    return item ? item.value : null;
  },

  listMemory() {
    return this.memory.facts.map((x) => `${x.key}: ${x.value}`);
  },

  clearMemory() {
    this.memory.facts = [];
    this.memory.lastTopic = "";
    this.memory.lastQuestion = "";
    return true;
  },

  // =========================
  // WEB TRIGGERS
  // =========================
  webTriggers: [
    "clima",
    "tiempo",
    "temperatura",
    "pronóstico",
    "pronostico",
    "noticias",
    "hoy",
    "ahora",
    "último",
    "ultimo",
    "reciente",
    "trending",
    "tendencia",
    "viral",
    "quién es",
    "quien es",
    "biografía",
    "biografia",
    "edad",
    "nació",
    "nacio",
    "precio",
    "costo",
    "cuánto vale",
    "cuanto vale",
    "bitcoin",
    "bnb",
    "ethereum",
    "resultados",
    "marcador",
    "wikipedia",
    "google",
    "fuente",
    "link",
    "prueba",
  ],

  // =========================
  // UTILIDADES
  // =========================
  normalize(text) {
    return String(text || "").trim().toLowerCase();
  },

  wantsExpand(text) {
    const t = this.normalize(text);
    return (
      t === "explícame" ||
      t === "explicame" ||
      t.includes("explícame") ||
      t.includes("explicame") ||
      t.includes("más detalle") ||
      t.includes("mas detalle") ||
      t.includes("detallado") ||
      t.includes("detalle") ||
      t.includes("detállame") ||
      t.includes("detallame") ||
      t.includes("profundiza") ||
      t.includes("dame más") ||
      t.includes("dame mas")
    );
  },

  // =========================
  // DECISOR WEB
  // =========================
  shouldUseWeb(userText) {
    const t = this.normalize(userText);
    if (!this.config.allowWeb) return false;
    if (t.includes("fuente") || t.includes("prueba") || t.includes("link")) return true;
    return this.webTriggers.some((k) => t.includes(k));
  },

  // =========================
  // FORMATO PRO
  // =========================
  formatProAnswer(payload, expanded) {
    const { main, context = "", sources = [] } = payload || {};
    const lines = [];

    lines.push(`Esto es lo más importante: ${main}`);

    if (context) lines.push(context);

    if (this.config.showSources && sources.length) {
      lines.push(`Fuentes: ${sources.join(" · ")}`);
    }

    if (!expanded) {
      lines.push("Si quieres, te lo explico con más detalle.");
    }

    return lines.join("\n");
  },

  // =========================
  // MANEJO PRO DE INCERTIDUMBRE
  // =========================
  handleUncertainty(payload) {
    const { reason, ask = "" } = payload || {};

    if (reason === "missing_info") {
      return this.formatProAnswer(
        {
          main: "Necesito un dato más para responder con precisión.",
          context: ask || "Dime exactamente qué necesitas (ciudad, persona o tema) y te respondo correcto.",
          sources: [],
        },
        false
      );
    }

    if (reason === "changing_data") {
      return this.formatProAnswer(
        {
          main: "Ese dato cambia constantemente.",
          context: "Si quieres, lo verifico ahora con una fuente confiable y te lo doy actualizado.",
          sources: [],
        },
        false
      );
    }

    if (reason === "rumor") {
      return this.formatProAnswer(
        {
          main: "No tengo confirmación fiable en este momento.",
          context: "Puedo verificarlo en fuentes oficiales y decirte lo real, sin rumores.",
          sources: [],
        },
        false
      );
    }

    if (reason === "technical") {
      return this.formatProAnswer(
        {
          main: "Tuve un problema técnico momentáneo.",
          context: "Puedo seguir en modo texto o intentarlo de nuevo.",
          sources: [],
        },
        false
      );
    }

    return this.formatProAnswer(
      {
        main: "No tengo confirmación suficiente todavía.",
        context: "Si quieres, lo investigo y te respondo con certeza.",
        sources: [],
      },
      false
    );
  },

  // =========================
  // H9 — CAPTURA DE MEMORIA (AUTO)
  // =========================
  autoMemoryCapture(userText) {
    const t = this.normalize(userText);

    // Ejemplos:
    // "mi nombre es Juan"
    // "me llamo Pedro"
    if (t.includes("mi nombre es ")) {
      const name = userText.split(/mi nombre es /i)[1]?.trim();
      if (name) this.remember("user_name", name);
    }

    if (t.includes("me llamo ")) {
      const name = userText.split(/me llamo /i)[1]?.trim();
      if (name) this.remember("user_name", name);
    }

    // "mi meta es ..."
    if (t.includes("mi meta es ")) {
      const goal = userText.split(/mi meta es /i)[1]?.trim();
      if (goal) this.remember("user_goal", goal);
    }

    // "quiero construir ..."
    if (t.includes("quiero construir ")) {
      const build = userText.split(/quiero construir /i)[1]?.trim();
      if (build) this.remember("user_building", build);
    }

    // Guardar tema general (simple)
    if (t.length > 3) {
      this.memory.lastTopic = t.slice(0, 60);
    }
  },

  // =========================
  // BRAIN OFFLINE
  // =========================
  internalBrain(userText, expanded) {
    const t = this.normalize(userText);

    // Comandos de memoria (H9)
    if (t === "ravy memoria" || t === "memoria ravy" || t === "ver memoria") {
      const list = this.listMemory();
      if (!list.length) return "Memoria: vacía por ahora.";
      return "Memoria actual:\n- " + list.join("\n- ");
    }

    if (t === "borrar memoria" || t === "limpiar memoria") {
      this.clearMemory();
      return "Listo. Memoria borrada.";
    }

    // Saludos
    if (t.includes("hola") || t.includes("buenas") || t.includes("saludos")) {
      return expanded
        ? "Hola. Estoy listo para ayudarte. Dime qué necesitas y lo resolvemos paso a paso."
        : "Hola. Estoy listo para ayudarte.";
    }

    // Quién eres
    if (t.includes("quien eres") || t.includes("quién eres")) {
      return expanded ? this.identity.longWho : this.identity.shortWho;
    }

    // Propósito
    if (t.includes("proposito") || t.includes("propósito")) {
      return expanded ? this.identity.longPurpose : this.identity.shortPurpose;
    }

    // Creador
    if (t.includes("quien te creo") || t.includes("quién te creó") || t.includes("quien te creó")) {
      return expanded ? this.identity.longCreator : this.identity.shortCreator;
    }

    // Qué puedes hacer
    if (
      t.includes("que puedes hacer") ||
      t.includes("qué puedes hacer") ||
      t.includes("en que me ayudas") ||
      t.includes("en qué me ayudas")
    ) {
      return expanded ? this.identity.longCanDo : this.identity.shortCanDo;
    }

    // Hora (offline)
    if (t.includes("hora")) {
      const now = new Date();
      return this.formatProAnswer(
        {
          main: `La hora actual es: ${now.toLocaleTimeString()}.`,
          context: "",
          sources: [],
        },
        expanded
      );
    }

    // Responder usando memoria si aplica
    if (t.includes("recuerdas mi nombre") || t.includes("cual es mi nombre") || t.includes("cuál es mi nombre")) {
      const name = this.recall("user_name") || this.memory.user?.name || "amigo";
      return this.formatProAnswer(
        {
          main: `Sí. Tu nombre es: ${name}.`,
          context: "",
          sources: [],
        },
        expanded
      );
    }

    if (t.includes("cual es mi meta") || t.includes("cuál es mi meta") || t.includes("recuerdas mi meta")) {
      const goal = this.recall("user_goal");
      if (!goal) {
        return this.handleUncertainty({
          reason: "missing_info",
          ask: "Aún no me la has dicho. Dime: “Mi meta es …” y la guardo.",
        });
      }
      return this.formatProAnswer(
        {
          main: `Tu meta es: ${goal}.`,
          context: "",
          sources: [],
        },
        expanded
      );
    }

    // Default
    return expanded
      ? "Entendido. Dime exactamente qué quieres lograr y te lo estructuro paso a paso."
      : "Entendido.";
  },

  // =========================
  // WEBBRAIN (SIMULADO)
  // =========================
  async webBrain(userText, expanded) {
    const t = this.normalize(userText);

    if (t.includes("clima") || t.includes("tiempo") || t.includes("temperatura")) {
      return this.formatProAnswer(
        {
          main: "Ahora mismo: 29°C y parcialmente nublado en tu zona.",
          context: expanded
            ? "Detalles: sensación térmica 31°C · humedad 68% · viento moderado. Pronóstico: posibles lluvias aisladas."
            : "",
          sources: ["Weather API (pendiente de conectar)"],
        },
        expanded
      );
    }

    if (t.includes("quien es") || t.includes("quién es") || t.includes("biografia") || t.includes("biografía")) {
      return this.formatProAnswer(
        {
          main: "Puedo darte una biografía verificada y actualizada.",
          context: expanded
            ? "Dime el nombre exacto de la persona y te traigo: resumen, datos clave y fuentes."
            : "Dime el nombre exacto y te lo busco con fuentes.",
          sources: ["Wikipedia (pendiente de conectar)", "Búsqueda web (pendiente de conectar)"],
        },
        expanded
      );
    }

    if (t.includes("noticias") || t.includes("hoy") || t.includes("reciente")) {
      return this.formatProAnswer(
        {
          main: "Puedo traerte un resumen de las noticias más relevantes.",
          context: expanded
            ? "Dime el país o tema (RD, tecnología, deportes, economía) y te lo organizo por prioridad."
            : "Dime el país o tema y te lo resumo.",
          sources: ["Noticias (pendiente de conectar)"],
        },
        expanded
      );
    }

    return this.handleUncertainty({
      reason: "missing_info",
      ask: "¿Qué exactamente quieres que investigue (tema, persona o ciudad)?",
    });
  },

  // =========================
  // MOTOR PRINCIPAL
  // =========================
  async reply(userText, lastUserText) {
    // Guardar contexto mínimo
    this.memory.lastQuestion = String(userText || "");

    // Captura automática de memoria
    this.autoMemoryCapture(userText);

    const expanded = this.wantsExpand(userText) || this.wantsExpand(lastUserText);

    // Si el usuario solo dice "explícame"
    if (this.normalize(userText) === "explícame" || this.normalize(userText) === "explicame") {
      return this.handleUncertainty({
        reason: "missing_info",
        ask: "Perfecto. ¿Qué parte quieres que te explique exactamente?",
      });
    }

    const useWeb = this.shouldUseWeb(userText);

    if (useWeb) return await this.webBrain(userText, expanded);
    return this.internalBrain(userText, expanded);
  },
};
