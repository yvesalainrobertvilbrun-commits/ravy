<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RAVY</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>

  <div class="app">

    <!-- TOP BAR -->
    <header class="topbar">
      <div class="brand">
        <div class="logo">R</div>
        <div class="brand-text">
          <h1>RAVY</h1>
          <p>Executive Assistant</p>
        </div>
      </div>

      <button class="menu-btn" id="openMenu">☰</button>
    </header>

    <!-- SIDE MENU -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-head">
        <h2>Menú</h2>
        <button class="close-btn" id="closeMenu">✕</button>
      </div>

      <nav class="nav">
        <button class="nav-btn active" data-page="home">🏠 Chat</button>
        <button class="nav-btn" data-page="profile">🧠 Perfil</button>
        <button class="nav-btn" data-page="settings">⚙️ Configuración</button>
        <button class="nav-btn" data-page="test">🧪 Test Lab</button>
        <button class="nav-btn" data-page="memory">📌 Memoria</button>
      </nav>

      <div class="sidebar-footer">
        <small>Versión: <span id="ravyVersion">---</span></small>
      </div>
    </aside>

    <!-- MAIN -->
    <main class="main">

      <!-- PAGE: HOME / CHAT -->
      <section class="page show" id="page-home">
        <div class="hero">
          <div class="avatar">
            <div class="avatar-face"></div>
            <div class="avatar-glow"></div>
          </div>
          <div class="hero-text">
            <h2>RAVY Executive</h2>
            <p>Directo. Inteligente. Profesional.</p>
          </div>
        </div>

        <div class="chat" id="chat">
          <!-- mensajes -->
        </div>

        <div class="composer">
          <input
            id="userInput"
            type="text"
            placeholder="Escribe aquí... (ej: ¿Quién eres?)"
            autocomplete="off"
          />
          <button id="sendBtn">➤</button>
        </div>
      </section>

      <!-- PAGE: PROFILE -->
      <section class="page" id="page-profile">
        <div class="card">
          <h2>Perfil de RAVY</h2>
          <p id="profileText">Cargando...</p>
        </div>
      </section>

      <!-- PAGE: SETTINGS -->
      <section class="page" id="page-settings">
        <div class="card">
          <h2>Configuración</h2>
          <p>Pronto: tema, fondo, voz, idioma.</p>
        </div>
      </section>

      <!-- PAGE: TEST -->
      <section class="page" id="page-test">
        <div class="card">
          <h2>Test Lab</h2>
          <p>Pronto: pruebas automáticas H1–H9.</p>
        </div>
      </section>

      <!-- PAGE: MEMORY -->
      <section class="page" id="page-memory">
        <div class="card">
          <h2>Memoria</h2>
          <button id="btnViewMemory">Ver memoria</button>
          <button id="btnClearMemory">Borrar memoria</button>
          <pre id="memoryBox">---</pre>
        </div>
      </section>

    </main>
  </div>

  <script src="./ravy-core.js"></script>
  <script src="./app.js"></script>
</body>
</html>
