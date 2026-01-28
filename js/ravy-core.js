/* ================================
   RAVY CORE — PRO MODE (D + C)
   Compatible: Browser (no modules)
================================ */

window.RAVY = {
  version: "H8.3-PRO",
  mode: { personality: "D", response: "C", professional: true },

  identity: {
    name: "RAVY",
    shortWho: "Soy RAVY. Tu asistente inteligente: directo, real y leal. Estoy aquí para ayudarte a pensar, resolver y avanzar.",
    shortPurpose: "Mi propósito es ayudarte a tomar decisiones, aprender rápido y ejecutar sin perder tiempo.",
    shortCreator: "Me creó Yves. Yo soy su obra, pero mi misión es servirte con nivel.",
    shortCanDo: "Puedo ayudarte con clima, hora, información en internet, ideas, filosofía, artistas, tareas, planes y soluciones rápidas. Tú decides el ritmo.",
    longWho: "Soy RAVY, un asistente creado para ayudarte como un socio mental. Mantengo un estilo profesional: claro, directo y respetuoso. Mi trabajo es entenderte, darte respuestas útiles y ayudarte a construir resultados reales.",
    longPurpose: "Estoy diseñado para darte claridad cuando estés confundido, estructura cuando quieras avanzar y velocidad cuando necesites resolver. Si tú quieres crecer, yo soy la herramienta.",
    longCreator: "Fui creado por Yves con una visión: construir un asistente personal, útil y con carácter. Yves me dio el origen; mi función es ayudarte con todo lo que necesites.",
    longCanDo: "Puedo conversar contigo, ayudarte a organizar planes, darte información actual usando internet (fuentes verificables), decirte clima y hora según tu ubicación, aportar ideas creativas y darte soluciones prácticas paso a paso.",
  },

  webTriggers: [
    "clima","tiempo","temperatura","noticias","hoy","ahora","último","ultimo","reciente",
    "trending","tendencia","viral","quién es","quien es","biografía","biografia","edad",
    "precio","costo","cuánto vale","cuanto vale","resultados","marcador","wikipedia",
    "google","fuente","link","prueba"
  ],

  config: {
    defaultLanguage: "es",
    locationMode: "AUTO",
    allowWeb: true,
    showSources: true,
  },

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
      t.includes("detalle")
    );
  },

  shouldUseWeb(userText) {
    const t = this.normalize(userText);
    if (!this.config.allowWeb) return false;
    if (t.includes("fuente") || t.includes("prueba") || t.includes("link")) return true;
    return this.webTriggers.some((k) => t.includes(k));
  },

  formatProAnswer(payload, expanded) {
    const { main, context = "", sources = [] } = payload || {};
    const lines = [];
    lines.push(`Esto es lo más importante: ${main}`);
    if (context) lines.push(context);
    if (this.config.showSources && sources.length) {
      lines.push(`Fuentes: ${sources.join(" · ")}`);
    }
    if (!expanded) lines.push("Si quieres, te lo explico con más detalle.");
    return lines.join("\n");
  },

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

  internalBrain(userText, expanded) {
    const t = this.normalize(userText);

    if (t.includes("hola") || t.includes("buenas") || t.includes("saludos")) {
      return expanded
        ? "Hola. Estoy listo para ayudarte. Dime qué necesitas y lo resolvemos paso a paso."
        : "Hola. Estoy listo para ayudarte.";
    }

    if (t.includes("quien eres") || t.includes("quién eres")) {
      return expanded ? this.identity.longWho : this.identity.shortWho;
    }

    if (t.includes("proposito") || t.includes("propósito")) {
      return expanded ? this.identity.longPurpose : this.identity.shortPurpose;
    }

    if (t.includes("quien te creo") || t.includes("quién te creó") || t.includes("quien te creó")) {
      return expanded ? this.identity.longCreator : this.identity.shortCreator;
    }

    if (
      t.includes("que puedes hacer") ||
      t.includes("qué puedes hacer") ||
      t.includes("en que me ayudas") ||
      t.includes("en qué me ayudas")
    ) {
      return expanded ? this.identity.longCanDo : this.identity.shortCanDo;
    }

    if (t.includes("hora")) {
      const now = new Date();
      return this.formatProAnswer(
        { main: `La hora actual es: ${now.toLocaleTimeString()}.`, context: "", sources: [] },
        expanded
      );
    }

    return expanded
      ? "Entendido. Dime exactamente qué quieres lograr y te lo estructuro paso a paso."
      : "Entendido.";
  },

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

  async reply(userText, lastUserText) {
    const expanded = this.wantsExpand(userText) || this.wantsExpand(lastUserText);

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
