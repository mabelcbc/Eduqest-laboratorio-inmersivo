/**
 * derivatives.js – Definiciones y cálculo de derivadas
 * Usa math.js (sin eval)
 */

const MODULES = {
  constant: {
    id: "constant",
    name: "Función constante",
    expression: "f(x) = c",
    derivative: "f'(x) = 0",
    rule: "Derivada de una constante: la derivada de cualquier número es cero.",
    steps: [
      "La función es f(x) = c, donde c es un número real fijo.",
      "Al calcular el cociente de incrementos: [f(x+h) − f(x)] / h = (c − c) / h = 0.",
      "Por lo tanto, el límite cuando h → 0 es 0.",
      "Conclusión: f'(x) = 0 para todo x."
    ],
    interpretation: "La gráfica es una recta horizontal. Su pendiente es siempre cero, por eso la derivada es la función nula.",
    defaultParams: { c: 2 },
    f: (x, p) => p.c,
    fp: (x, p) => 0,
    latexF: (p) => `f(x) = ${p.c}`,
    latexFp: () => `f'(x) = 0`
  },

  identity: {
    id: "identity",
    name: "Función idéntica",
    expression: "f(x) = x",
    derivative: "f'(x) = 1",
    rule: "Derivada de la función identidad.",
    steps: [
      "f(x) = x.",
      "[f(x+h) − f(x)] / h = [(x+h) − x] / h = h / h = 1.",
      "El límite es 1.",
      "f'(x) = 1 (pendiente constante)."
    ],
    interpretation: "La recta y = x tiene pendiente 1 en todos los puntos. La derivada es la constante 1.",
    defaultParams: {},
    f: (x) => x,
    fp: () => 1,
    latexF: () => `f(x) = x`,
    latexFp: () => `f'(x) = 1`
  },

  linear: {
    id: "linear",
    name: "Función lineal",
    expression: "f(x) = mx + b",
    derivative: "f'(x) = m",
    rule: "Derivada de una función lineal (o afín).",
    steps: [
      "f(x) = mx + b.",
      "[f(x+h) − f(x)] / h = [m(x+h)+b − (mx+b)] / h = (mx + mh + b − mx − b) / h = m.",
      "El límite es m.",
      "f'(x) = m. La pendiente de la recta es exactamente m."
    ],
    interpretation: "La derivada de una recta es su pendiente. Es constante e independiente de x.",
    defaultParams: { m: 1.5, b: -1 },
    f: (x, p) => p.m * x + p.b,
    fp: (x, p) => p.m,
    latexF: (p) => `f(x) = ${p.m}x ${p.b >= 0 ? "+" : ""} ${p.b}`,
    latexFp: (p) => `f'(x) = ${p.m}`
  },

  quadratic: {
    id: "quadratic",
    name: "Función cuadrática",
    expression: "f(x) = ax² + bx + c",
    derivative: "f'(x) = 2ax + b",
    rule: "Regla de la potencia: d/dx [xⁿ] = n·xⁿ⁻¹, junto con linealidad.",
    steps: [
      "f(x) = ax² + bx + c.",
      "d/dx (ax²) = a · 2x = 2ax.",
      "d/dx (bx) = b.",
      "d/dx (c) = 0.",
      "Por tanto f'(x) = 2ax + b."
    ],
    interpretation: "La pendiente cambia con x. Donde f'(x) = 0 la tangente es horizontal (posible máximo o mínimo local).",
    defaultParams: { a: 0.5, b: -1, c: 2 },
    f: (x, p) => p.a * x * x + p.b * x + p.c,
    fp: (x, p) => 2 * p.a * x + p.b,
    latexF: (p) => `f(x) = ${p.a}x^{2} ${p.b >= 0 ? "+" : ""} ${p.b}x ${p.c >= 0 ? "+" : ""} ${p.c}`,
    latexFp: (p) => `f'(x) = ${2 * p.a}x ${p.b >= 0 ? "+" : ""} ${p.b}`
  },

  rational: {
    id: "rational",
    name: "Funciones racionales",
    expression: "Ejemplo: f(x) = (x² + 1)/(x + 2)",
    derivative: "Regla del cociente",
    rule: "Regla del cociente: (u/v)' = (u'v − uv') / v², con v ≠ 0. También se puede usar la regla del producto con 1/v.",
    steps: [
      "Sea u(x) = x² + 1, v(x) = x + 2.",
      "u'(x) = 2x, v'(x) = 1.",
      "f'(x) = [2x·(x+2) − (x²+1)·1] / (x+2)²",
      "Numerador: 2x² + 4x − x² − 1 = x² + 4x − 1.",
      "f'(x) = (x² + 4x − 1) / (x + 2)²  (para x ≠ −2)."
    ],
    interpretation: "La derivada de un cociente combina las derivadas de numerador y denominador. Observa los puntos donde el denominador se anula: allí la función no está definida.",
    defaultParams: {},
    // Ejemplo fijo: (x²+1)/(x+2)
    f: (x) => {
      if (Math.abs(x + 2) < 1e-9) return NaN;
      return (x * x + 1) / (x + 2);
    },
    fp: (x) => {
      if (Math.abs(x + 2) < 1e-9) return NaN;
      const num = x * x + 4 * x - 1;
      const den = (x + 2) * (x + 2);
      return num / den;
    },
    latexF: () => `f(x) = \\dfrac{x^{2}+1}{x+2}`,
    latexFp: () => `f'(x) = \\dfrac{x^{2}+4x-1}{(x+2)^{2}}`
  }
};

function getModule(id) {
  return MODULES[id] || MODULES.constant;
}

function evaluateF(moduleId, x, params) {
  const m = getModule(moduleId);
  try {
    return m.f(x, params || m.defaultParams);
  } catch {
    return NaN;
  }
}

function evaluateFp(moduleId, x, params) {
  const m = getModule(moduleId);
  try {
    return m.fp(x, params || m.defaultParams);
  } catch {
    return NaN;
  }
}

function generatePoints(moduleId, params, xMin = -5, xMax = 5, n = 200) {
  const xs = [];
  const ys = [];
  const yps = [];
  const step = (xMax - xMin) / (n - 1);
  for (let i = 0; i < n; i++) {
    const x = xMin + i * step;
    const y = evaluateF(moduleId, x, params);
    const yp = evaluateFp(moduleId, x, params);
    xs.push(x);
    ys.push(Number.isFinite(y) ? y : null);
    yps.push(Number.isFinite(yp) ? yp : null);
  }
  return { xs, ys, yps };
}
/**
 * graph.js – Gráficas interactivas con Plotly
 */

let currentModuleId = "constant";
let currentParams = { ...MODULES.constant.defaultParams };
let showF = true;
let showFp = true;
let showTangent = true;
let xTangent = 0;
let animId = null;
let animDirection = 1;

const graphDiv = () => document.getElementById("graph-container");

function buildTraces() {
  const { xs, ys, yps } = generatePoints(currentModuleId, currentParams);
  const traces = [];

  if (showF) {
    traces.push({
      x: xs,
      y: ys,
      mode: "lines",
      name: "f(x)",
      line: { color: "#22d3ee", width: 2.5 },
      hovertemplate: "x: %{x:.2f}<br>f(x): %{y:.2f}<extra></extra>"
    });
  }

  if (showFp) {
    traces.push({
      x: xs,
      y: yps,
      mode: "lines",
      name: "f'(x)",
      line: { color: "#a3e635", width: 2, dash: "dot" },
      hovertemplate: "x: %{x:.2f}<br>f'(x): %{y:.2f}<extra></extra>"
    });
  }

  if (showTangent) {
    const y0 = evaluateF(currentModuleId, xTangent, currentParams);
    const m = evaluateFp(currentModuleId, xTangent, currentParams);
    if (Number.isFinite(y0) && Number.isFinite(m)) {
      const x1 = xTangent - 2.5;
      const x2 = xTangent + 2.5;
      const y1 = y0 + m * (x1 - xTangent);
      const y2 = y0 + m * (x2 - xTangent);
      traces.push({
        x: [x1, x2],
        y: [y1, y2],
        mode: "lines",
        name: "Tangente",
        line: { color: "#f97316", width: 2 },
        hoverinfo: "skip"
      });
      traces.push({
        x: [xTangent],
        y: [y0],
        mode: "markers",
        name: "Punto",
        marker: { color: "#f97316", size: 10, symbol: "circle" },
        hovertemplate: `x = ${xTangent.toFixed(2)}<br>pendiente = ${m.toFixed(3)}<extra></extra>`
      });
    }
  }

  return traces;
}

function updateGraph() {
  const traces = buildTraces();
  const layout = {
    paper_bgcolor: "#050d18",
    plot_bgcolor: "#050d18",
    font: { color: "#94a3b8", size: 11 },
    margin: { t: 30, r: 20, b: 40, l: 45 },
    xaxis: {
      title: "x",
      gridcolor: "#1e3a5f",
      zerolinecolor: "#334155",
      range: [-5.5, 5.5]
    },
    yaxis: {
      title: "y",
      gridcolor: "#1e3a5f",
      zerolinecolor: "#334155",
      range: [-8, 8]
    },
    legend: {
      orientation: "h",
      y: 1.12,
      font: { size: 11 }
    },
    dragmode: "pan"
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ["lasso2d", "select2d"],
    displaylogo: false
  };

  Plotly.react(graphDiv(), traces, layout, config);
  updateSlopeDisplay();
}

function updateSlopeDisplay() {
  const elX = document.getElementById("x-value");
  const elS = document.getElementById("slope-value");
  if (elX) elX.textContent = xTangent.toFixed(2);
  const m = evaluateFp(currentModuleId, xTangent, currentParams);
  if (elS) elS.textContent = Number.isFinite(m) ? m.toFixed(3) : "—";
}

function setModule(id) {
  currentModuleId = id;
  const mod = getModule(id);
  currentParams = { ...mod.defaultParams };
  xTangent = 0;
  const slider = document.getElementById("x-slider");
  if (slider) slider.value = 0;
  stopAnimation();
  updateGraph();
  updateMathCard();
  renderParams();
}

function renderParams() {
  const box = document.getElementById("params-box");
  if (!box) return;
  box.innerHTML = "";
  const mod = getModule(currentModuleId);
  const p = currentParams;

  if (currentModuleId === "constant") {
    box.appendChild(makeSlider("c", "c (constante)", p.c, -5, 5, 0.1, (v) => {
      currentParams.c = v;
      updateGraph();
      updateMathCard();
    }));
  } else if (currentModuleId === "linear") {
    box.appendChild(makeSlider("m", "m (pendiente)", p.m, -3, 3, 0.1, (v) => {
      currentParams.m = v;
      updateGraph();
      updateMathCard();
    }));
    box.appendChild(makeSlider("b", "b (ordenada)", p.b, -5, 5, 0.1, (v) => {
      currentParams.b = v;
      updateGraph();
      updateMathCard();
    }));
  } else if (currentModuleId === "quadratic") {
    box.appendChild(makeSlider("a", "a", p.a, -2, 2, 0.1, (v) => {
      currentParams.a = v;
      updateGraph();
      updateMathCard();
    }));
    box.appendChild(makeSlider("b", "b", p.b, -3, 3, 0.1, (v) => {
      currentParams.b = v;
      updateGraph();
      updateMathCard();
    }));
    box.appendChild(makeSlider("c", "c", p.c, -4, 4, 0.1, (v) => {
      currentParams.c = v;
      updateGraph();
      updateMathCard();
    }));
  } else {
    box.innerHTML = "<p style='font-size:0.85rem;color:var(--muted)'>Ejemplo fijo: (x² + 1)/(x + 2). Cambia el punto de tangencia.</p>";
  }
}

function makeSlider(key, label, value, min, max, step, onChange) {
  const div = document.createElement("div");
  div.className = "param-group";
  const lab = document.createElement("label");
  lab.textContent = label;
  const valSpan = document.createElement("span");
  valSpan.className = "val";
  valSpan.textContent = value.toFixed(1);
  const input = document.createElement("input");
  input.type = "range";
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = value;
  input.addEventListener("input", () => {
    const v = parseFloat(input.value);
    valSpan.textContent = v.toFixed(1);
    onChange(v);
  });
  div.appendChild(lab);
  div.appendChild(input);
  div.appendChild(valSpan);
  return div;
}

function updateMathCard() {
  const mod = getModule(currentModuleId);
  const p = currentParams;

  document.getElementById("func-name").textContent = mod.name;

  const fEl = document.getElementById("func-formula");
  const dEl = document.getElementById("deriv-formula");
  fEl.innerHTML = "";
  dEl.innerHTML = "";
  try {
    katex.render(mod.latexF(p), fEl, { throwOnError: false });
    katex.render(mod.latexFp(p), dEl, { throwOnError: false });
  } catch {
    fEl.textContent = mod.expression;
    dEl.textContent = mod.derivative;
  }

  document.getElementById("rule-text").textContent = mod.rule;
  const steps = document.getElementById("steps-list");
  steps.innerHTML = "";
  mod.steps.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    steps.appendChild(li);
  });
  document.getElementById("interpretation").textContent = mod.interpretation;

  if (typeof loadExercise === "function") {
    loadExercise(currentModuleId);
  }
}

function setShowF(v) {
  showF = v;
  updateGraph();
}
function setShowFp(v) {
  showFp = v;
  updateGraph();
}
function setShowTangent(v) {
  showTangent = v;
  updateGraph();
}

function setXTangent(x) {
  xTangent = x;
  updateGraph();
}

function startAnimation() {
  if (animId) return;
  document.getElementById("btn-animate").disabled = true;
  document.getElementById("btn-pause").disabled = false;
  const slider = document.getElementById("x-slider");

  function tick() {
    xTangent += 0.05 * animDirection;
    if (xTangent >= 5) {
      xTangent = 5;
      animDirection = -1;
    } else if (xTangent <= -5) {
      xTangent = -5;
      animDirection = 1;
    }
    if (slider) slider.value = xTangent;
    updateGraph();
    animId = requestAnimationFrame(tick);
  }
  animId = requestAnimationFrame(tick);
}

function stopAnimation() {
  if (animId) {
    cancelAnimationFrame(animId);
    animId = null;
  }
  const btnA = document.getElementById("btn-animate");
  const btnP = document.getElementById("btn-pause");
  if (btnA) btnA.disabled = false;
  if (btnP) btnP.disabled = true;
}

function resetView() {
  stopAnimation();
  xTangent = 0;
  const slider = document.getElementById("x-slider");
  if (slider) slider.value = 0;
  const mod = getModule(currentModuleId);
  currentParams = { ...mod.defaultParams };
  updateGraph();
  updateMathCard();
  renderParams();
  if (graphDiv()) {
    Plotly.relayout(graphDiv(), {
      "xaxis.range": [-5.5, 5.5],
      "yaxis.range": [-8, 8]
    });
  }
}
/**
 * three-scene.js – Vista 3D complementaria con Three.js
 * Solo apoyo visual; el estudio principal es 2D.
 */

let threeScene = null;
let threeCamera = null;
let threeRenderer = null;
let threeControls = null;
let curveLine = null;
let tangentLine3d = null;
let animFrame3d = null;

function initThreeScene() {
  const container = document.getElementById("three-container");
  if (!container || threeRenderer) return;

  const w = container.clientWidth || 800;
  const h = 420;

  threeScene = new THREE.Scene();
  threeScene.background = new THREE.Color(0x050d18);

  threeCamera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
  threeCamera.position.set(6, 5, 8);

  threeRenderer = new THREE.WebGLRenderer({ antialias: true });
  threeRenderer.setSize(w, h);
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = "";
  container.appendChild(threeRenderer.domElement);

  // Controles de ratón propios (no dependen de OrbitControls)
  let isDragging = false;
  let prevX = 0, prevY = 0;
  const canvasEl = threeRenderer.domElement;
  canvasEl.addEventListener("mousedown", (e) => { isDragging = true; prevX = e.clientX; prevY = e.clientY; });
  window.addEventListener("mouseup", () => { isDragging = false; });
  canvasEl.addEventListener("mousemove", (e) => {
    if (!isDragging || !threeCamera) return;
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    prevX = e.clientX;
    prevY = e.clientY;
    const sph = new THREE.Spherical().setFromVector3(threeCamera.position);
    sph.theta -= dx * 0.01;
    sph.phi = Math.max(0.2, Math.min(Math.PI - 0.2, sph.phi + dy * 0.01));
    threeCamera.position.setFromSpherical(sph);
    threeCamera.lookAt(0, 0, 0);
  });
  canvasEl.addEventListener("wheel", (e) => {
    e.preventDefault();
    threeCamera.position.multiplyScalar(e.deltaY > 0 ? 1.08 : 0.92);
  }, { passive: false });

  // Luces
  const ambient = new THREE.AmbientLight(0x6688aa, 0.6);
  threeScene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 0.7);
  dir.position.set(5, 10, 7);
  threeScene.add(dir);

  // Ejes
  const axes = new THREE.AxesHelper(5);
  threeScene.add(axes);

  // Plano de referencia
  const grid = new THREE.GridHelper(12, 12, 0x1e3a5f, 0x132a45);
  threeScene.add(grid);

  buildCurve3D();
  animate3D();
}

function buildCurve3D() {
  if (!threeScene) return;

  // Eliminar curva anterior
  if (curveLine) {
    threeScene.remove(curveLine);
    curveLine.geometry.dispose();
    curveLine.material.dispose();
  }
  if (tangentLine3d) {
    threeScene.remove(tangentLine3d);
    tangentLine3d.geometry.dispose();
    tangentLine3d.material.dispose();
  }

  const points = [];
  const n = 120;
  for (let i = 0; i <= n; i++) {
    const x = -5 + (10 * i) / n;
    const y = evaluateF(currentModuleId, x, currentParams);
    if (Number.isFinite(y)) {
      points.push(new THREE.Vector3(x, y, 0));
    }
  }

  if (points.length < 2) return;

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x22d3ee, linewidth: 2 });
  curveLine = new THREE.Line(geometry, material);
  threeScene.add(curveLine);

  // Tangente en xTangent
  const y0 = evaluateF(currentModuleId, xTangent, currentParams);
  const m = evaluateFp(currentModuleId, xTangent, currentParams);
  if (Number.isFinite(y0) && Number.isFinite(m)) {
    const tPoints = [
      new THREE.Vector3(xTangent - 2, y0 + m * (-2), 0.05),
      new THREE.Vector3(xTangent + 2, y0 + m * 2, 0.05)
    ];
    const tGeo = new THREE.BufferGeometry().setFromPoints(tPoints);
    const tMat = new THREE.LineBasicMaterial({ color: 0xf97316 });
    tangentLine3d = new THREE.Line(tGeo, tMat);
    threeScene.add(tangentLine3d);

    // Punto
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xf97316 })
    );
    sphere.position.set(xTangent, y0, 0.05);
    threeScene.add(sphere);
    // Guardar referencia para limpiar después
    sphere.userData.isPoint = true;
  }

  // Limpiar esferas anteriores
  threeScene.children
    .filter((c) => c.userData && c.userData.isPoint)
    .forEach((c) => {
      if (c !== threeScene.children[threeScene.children.length - 1]) {
        threeScene.remove(c);
      }
    });
}

function animate3D() {
  animFrame3d = requestAnimationFrame(animate3D);
  if (threeRenderer && threeScene && threeCamera) {
    threeRenderer.render(threeScene, threeCamera);
  }
}

function refreshThreeScene() {
  if (!threeRenderer) return;
  // Limpiar puntos antiguos
  const toRemove = [];
  threeScene.children.forEach((c) => {
    if (c.userData && c.userData.isPoint) toRemove.push(c);
  });
  toRemove.forEach((c) => {
    threeScene.remove(c);
    if (c.geometry) c.geometry.dispose();
    if (c.material) c.material.dispose();
  });
  buildCurve3D();
}

function disposeThreeScene() {
  if (animFrame3d) cancelAnimationFrame(animFrame3d);
  animFrame3d = null;
  if (threeRenderer) {
    threeRenderer.dispose();
    threeRenderer = null;
  }
  threeScene = null;
  threeCamera = null;
  threeControls = null;
  curveLine = null;
  tangentLine3d = null;
}

function open3DView() {
  const overlay = document.getElementById("view-3d");
  overlay.classList.remove("hidden");
  // Pequeño delay para que el contenedor tenga tamaño
  setTimeout(() => {
    initThreeScene();
    refreshThreeScene();
  }, 50);
}

function close3DView() {
  document.getElementById("view-3d").classList.add("hidden");
  disposeThreeScene();
  const container = document.getElementById("three-container");
  if (container) container.innerHTML = "";
}
/**
 * hand-tracking.js – Control gestual con MediaPipe Hands (CDN)
 * Si MediaPipe no carga o no hay cámara, la app sigue funcionando con ratón/teclado.
 */

let hands = null;
let camera = null;
let handsActive = false;
let lastPinchX = null;

const GESTURE_STATUS = {
  idle: "Esperando mano…",
  open: "Palma abierta → desplazar",
  point: "Índice → seleccionar",
  pinch: "Pinza → mover tangente",
  fist: "Puño → restablecer",
  zoom: "Dos manos → zoom"
};

async function loadMediaPipe() {
  // Carga dinámica de MediaPipe desde CDN
  if (window.Hands) return true;
  return new Promise((resolve) => {
    const s1 = document.createElement("script");
    s1.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
    s1.crossOrigin = "anonymous";
    s1.onload = () => {
      const s2 = document.createElement("script");
      s2.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
      s2.crossOrigin = "anonymous";
      s2.onload = () => resolve(!!window.Hands);
      s2.onerror = () => resolve(false);
      document.head.appendChild(s2);
    };
    s1.onerror = () => resolve(false);
    document.head.appendChild(s1);
  });
}

function setHandsStatus(text) {
  const el = document.getElementById("hands-status");
  if (el) el.textContent = text;
}

async function startHandTracking() {
  const panel = document.getElementById("hands-panel");
  panel.classList.remove("hidden");
  setHandsStatus("Iniciando cámara…");

  const video = document.getElementById("hands-video");
  const canvas = document.getElementById("hands-canvas");
  const ctx = canvas.getContext("2d");

  const ok = await loadMediaPipe();
  if (!ok) {
    setHandsStatus("MediaPipe no disponible. Usa ratón/teclado.");
    return;
  }

  try {
    hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5
    });

    hands.onResults((results) => {
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
        setHandsStatus(GESTURE_STATUS.idle);
        return;
      }

      const landmarks = results.multiHandLandmarks[0];
      drawLandmarks(ctx, landmarks, canvas.width, canvas.height);

      const gesture = classifyGesture(landmarks, results.multiHandLandmarks);
      handleGesture(gesture, landmarks);
    });

    camera = new Camera(video, {
      onFrame: async () => {
        if (hands) await hands.send({ image: video });
      },
      width: 320,
      height: 240
    });
    await camera.start();
    handsActive = true;
    setHandsStatus("Cámara activa · muestra tu mano");
  } catch (err) {
    console.warn("Cámara o MediaPipe no disponible:", err);
    setHandsStatus("Sin permiso de cámara o error. Usa ratón.");
  }
}

function stopHandTracking() {
  handsActive = false;
  if (camera && camera.stop) camera.stop();
  camera = null;
  hands = null;
  const panel = document.getElementById("hands-panel");
  if (panel) panel.classList.add("hidden");
  setHandsStatus("Cámara desactivada");
}

function drawLandmarks(ctx, landmarks, w, h) {
  ctx.fillStyle = "#22d3ee";
  landmarks.forEach((lm) => {
    ctx.beginPath();
    ctx.arc(lm.x * w, lm.y * h, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

/**
 * Clasificación simple de gestos a partir de landmarks
 */
function classifyGesture(landmarks, allHands) {
  if (allHands && allHands.length >= 2) return "zoom";

  const tip = (i) => landmarks[i];
  const wrist = landmarks[0];
  const thumbTip = tip(4);
  const indexTip = tip(8);
  const middleTip = tip(12);
  const ringTip = tip(16);
  const pinkyTip = tip(20);

  // Distancia pinza
  const pinchDist = Math.hypot(
    thumbTip.x - indexTip.x,
    thumbTip.y - indexTip.y
  );

  if (pinchDist < 0.06) return "pinch";

  // Dedos extendidos (comparación y relativa a muñeca)
  const indexUp = indexTip.y < landmarks[6].y && indexTip.y < wrist.y;
  const middleUp = middleTip.y < landmarks[10].y;
  const ringUp = ringTip.y < landmarks[14].y;
  const pinkyUp = pinkyTip.y < landmarks[18].y;
  const thumbUp = thumbTip.x > landmarks[2].x; // aproximado

  if (indexUp && !middleUp && !ringUp && !pinkyUp) return "point";
  if (!indexUp && !middleUp && !ringUp && !pinkyUp) return "fist";
  if (indexUp && middleUp && ringUp) return "open";

  return "idle";
}

function handleGesture(gesture, landmarks) {
  setHandsStatus(GESTURE_STATUS[gesture] || GESTURE_STATUS.idle);

  if (gesture === "pinch") {
    // Mapear posición del índice al rango de x del slider
    const indexTip = landmarks[8];
    // x de 0 (izquierda) a 1 (derecha) → -5 a 5
    const mapped = (1 - indexTip.x) * 10 - 5;
    const clamped = Math.max(-5, Math.min(5, mapped));
    if (Math.abs(clamped - xTangent) > 0.08) {
      setXTangent(clamped);
      const slider = document.getElementById("x-slider");
      if (slider) slider.value = clamped;
    }
  } else if (gesture === "fist") {
    resetView();
  } else if (gesture === "open") {
    // Podría panear la gráfica; por simplicidad solo status
  }
  // zoom y point se pueden ampliar según necesidad
}

/* ========== Modo cámara educativa (superposición simple) ========== */
let cameraStream = null;

async function openCameraMode() {
  const overlay = document.getElementById("camera-mode");
  overlay.classList.remove("hidden");
  const video = document.getElementById("camera-video");
  const canvas = document.getElementById("camera-canvas");
  const mathBox = document.getElementById("camera-math");

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false
    });
    video.srcObject = cameraStream;
    await video.play();

    // Dibujar info matemática encima
    const drawOverlay = () => {
      if (!cameraStream) return;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Texto de contexto
      ctx.fillStyle = "rgba(10,22,40,0.65)";
      ctx.fillRect(10, 10, 280, 70);
      ctx.fillStyle = "#22d3ee";
      ctx.font = "16px system-ui";
      ctx.fillText("Eduquest · Derivadas", 20, 35);
      ctx.fillStyle = "#a3e635";
      ctx.font = "14px system-ui";
      const m = evaluateFp(currentModuleId, xTangent, currentParams);
      ctx.fillText(`x = ${xTangent.toFixed(2)}  ·  pendiente ≈ ${Number.isFinite(m) ? m.toFixed(3) : "—"}`, 20, 58);

      requestAnimationFrame(drawOverlay);
    };
    drawOverlay();

    if (mathBox) {
      mathBox.innerHTML = `<strong>${getModule(currentModuleId).name}</strong><br>Mueve el punto de tangencia en el laboratorio principal.`;
    }
  } catch (err) {
    console.warn(err);
    if (mathBox) {
      mathBox.innerHTML = "No se pudo acceder a la cámara. Comprueba los permisos del navegador (HTTPS o localhost).";
    }
  }
}

function closeCameraMode() {
  document.getElementById("camera-mode").classList.add("hidden");
  if (cameraStream) {
    cameraStream.getTracks().forEach((t) => t.stop());
    cameraStream = null;
  }
  const video = document.getElementById("camera-video");
  if (video) video.srcObject = null;
}
/**
 * chatbot.js – Tutor local de derivadas (sin API externa)
 * Solo visible después del login.
 */

const TUTOR_RESPONSES = [
  {
    keys: ["qué es", "que es", "definición", "concepto", "derivada"],
    answer:
      "La derivada de f en un punto x es el límite del cociente de incrementos cuando h tiende a 0. Representa la pendiente de la recta tangente a la gráfica en ese punto, es decir, la tasa de variación instantánea."
  },
  {
    keys: ["constante", "f(x)=c"],
    answer:
      "La derivada de una función constante f(x) = c es siempre 0. La gráfica es horizontal y su pendiente no cambia."
  },
  {
    keys: ["idéntica", "identidad", "f(x)=x"],
    answer:
      "La derivada de f(x) = x es 1. La recta y = x tiene pendiente constante igual a 1."
  },
  {
    keys: ["lineal", "mx+b", "recta"],
    answer:
      "Si f(x) = mx + b, entonces f'(x) = m. La derivada de una recta es exactamente su pendiente."
  },
  {
    keys: ["cuadrática", "parábola", "ax²"],
    answer:
      "Para f(x) = ax² + bx + c, la derivada es f'(x) = 2ax + b. La pendiente cambia con x. Donde f'(x) = 0 la tangente es horizontal."
  },
  {
    keys: ["cociente", "racional", "u/v"],
    answer:
      "Regla del cociente: (u/v)' = (u'v − uv') / v², siempre que v ≠ 0. También puedes escribir u·v⁻¹ y usar la regla del producto."
  },
  {
    keys: ["producto", "uv"],
    answer:
      "Regla del producto: (uv)' = u'v + uv'. Es útil cuando la función se puede ver como producto de dos partes más simples."
  },
  {
    keys: ["tangente", "pendiente", "recta tangente"],
    answer:
      "La recta tangente en x₀ tiene pendiente f'(x₀) y pasa por el punto (x₀, f(x₀)). Su ecuación es y − f(x₀) = f'(x₀)(x − x₀)."
  },
  {
    keys: ["secante", "promedio"],
    answer:
      "La recta secante une dos puntos de la curva. Su pendiente es la tasa de variación promedio. Cuando los puntos se acercan, la secante se convierte en tangente y obtenemos la tasa instantánea (la derivada)."
  },
  {
    keys: ["cómo se calcula", "calcular", "procedimiento"],
    answer:
      "Puedes usar la definición con el límite del cociente de incrementos, o aplicar reglas: constante, potencia, suma, producto y cociente. En este laboratorio verás el procedimiento paso a paso de cada módulo."
  },
  {
    keys: ["ejemplo", "ejercicio", "práctica"],
    answer:
      "Elige un módulo en el panel izquierdo, modifica los parámetros y observa la gráfica y la ficha. Luego responde la pregunta de comprobación que aparece abajo a la derecha."
  },
  {
    keys: ["hola", "buenos", "ayuda"],
    answer:
      "¡Hola! Soy el tutor de derivadas de Eduquest. Pregúntame sobre el concepto de derivada, las reglas (constante, lineal, potencia, producto, cociente) o la interpretación gráfica de la tangente."
  }
];

const DEFAULT_ANSWER =
  "Puedo ayudarte con el concepto de derivada, la pendiente de la tangente, las reglas básicas (constante, lineal, potencia, producto y cociente) y la interpretación de las gráficas. ¿Sobre qué módulo o idea quieres que te explique?";

function getTutorReply(text) {
  const lower = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const item of TUTOR_RESPONSES) {
    if (item.keys.some((k) => lower.includes(k))) {
      return item.answer;
    }
  }
  return DEFAULT_ANSWER;
}

function appendMessage(text, who) {
  const box = document.getElementById("chat-messages");
  if (!box) return;
  const div = document.createElement("div");
  div.className = `msg ${who}`;
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function initChatbot() {
  const toggle = document.getElementById("chat-toggle");
  const win = document.getElementById("chat-window");
  const close = document.getElementById("chat-close");
  const input = document.getElementById("chat-input");
  const send = document.getElementById("chat-send");

  if (!toggle) return;

  toggle.addEventListener("click", () => {
    win.classList.toggle("hidden");
    if (!win.classList.contains("hidden") && document.getElementById("chat-messages").children.length === 0) {
      appendMessage(
        "Hola. Soy tu tutor de derivadas. Pregúntame por el concepto, las reglas o la interpretación de la tangente.",
        "bot"
      );
    }
  });

  close.addEventListener("click", () => win.classList.add("hidden"));

  function sendMsg() {
    let text = (input.value || "").trim().replace(/\s+/g, " ");
    if (!text) return;
    if (text.length > 300) {
      text = text.slice(0, 300);
    }
    // Evitar envíos repetidos idénticos muy seguidos
    if (input.dataset.lastMsg === text) return;
    input.dataset.lastMsg = text;
    setTimeout(() => { input.dataset.lastMsg = ""; }, 1500);

    appendMessage(text, "user");
    input.value = "";
    setTimeout(() => {
      appendMessage(getTutorReply(text), "bot");
    }, 350);
  }

  send.addEventListener("click", sendMsg);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMsg();
  });
}

function showChatbot() {
  const el = document.getElementById("chatbot");
  if (el) el.classList.remove("hidden");
}

function hideChatbot() {
  const el = document.getElementById("chatbot");
  if (el) el.classList.add("hidden");
  const win = document.getElementById("chat-window");
  if (win) win.classList.add("hidden");
}
/**
 * exercises.js – Actividades de comprobación por módulo
 */

const EXERCISES = {
  constant: {
    question: "Si f(x) = 7, ¿cuál es f'(x)?",
    options: [
      { text: "7", correct: false },
      { text: "0", correct: true },
      { text: "1", correct: false },
      { text: "x", correct: false }
    ],
    feedbackOk: "Correcto. La derivada de cualquier constante es 0.",
    feedbackBad: "La gráfica de una constante es horizontal: su pendiente (y por tanto la derivada) es 0."
  },
  identity: {
    question: "La derivada de f(x) = x es:",
    options: [
      { text: "0", correct: false },
      { text: "x", correct: false },
      { text: "1", correct: true },
      { text: "2x", correct: false }
    ],
    feedbackOk: "Exacto. La pendiente de y = x es constantemente 1.",
    feedbackBad: "Recuerda: la recta y = x forma 45° con el eje x y tiene pendiente 1."
  },
  linear: {
    question: "Si f(x) = −3x + 5, entonces f'(x) vale:",
    options: [
      { text: "−3", correct: true },
      { text: "5", correct: false },
      { text: "−3x", correct: false },
      { text: "0", correct: false }
    ],
    feedbackOk: "Bien. En una función lineal f(x) = mx + b, la derivada es m.",
    feedbackBad: "La derivada de mx + b es simplemente el coeficiente m (aquí −3)."
  },
  quadratic: {
    question: "Para f(x) = 2x² − 4x + 1, ¿cuál es f'(x)?",
    options: [
      { text: "2x − 4", correct: false },
      { text: "4x − 4", correct: true },
      { text: "4x − 4 + 1", correct: false },
      { text: "2x² − 4", correct: false }
    ],
    feedbackOk: "Correcto: d/dx (2x²) = 4x y d/dx (−4x) = −4.",
    feedbackBad: "Aplica la regla de la potencia: d/dx (ax²) = 2ax. Aquí 2·2x = 4x, más la derivada de −4x."
  },
  rational: {
    question: "La regla del cociente (u/v)' es:",
    options: [
      { text: "(u'v + uv') / v²", correct: false },
      { text: "(u'v − uv') / v²", correct: true },
      { text: "u'/v'", correct: false },
      { text: "(uv' − u'v) / v²", correct: false }
    ],
    feedbackOk: "Muy bien. Numerador: u'v − uv'. Denominador: v².",
    feedbackBad: "La fórmula correcta es (u'v − uv') / v² (con v ≠ 0)."
  }
};

const completedModules = new Set();

function loadExercise(moduleId) {
  const area = document.getElementById("exercise-area");
  if (!area) return;
  const ex = EXERCISES[moduleId];
  if (!ex) {
    area.innerHTML = "";
    return;
  }

  area.innerHTML = "";
  const q = document.createElement("p");
  q.className = "exercise-q";
  q.textContent = ex.question;
  area.appendChild(q);

  const opts = document.createElement("div");
  opts.className = "exercise-options";
  ex.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "ex-opt";
    btn.textContent = opt.text;
    btn.addEventListener("click", () => {
      // Deshabilitar todos
      opts.querySelectorAll(".ex-opt").forEach((b) => (b.disabled = true));
      if (opt.correct) {
        btn.classList.add("correct");
        showFeedback(area, ex.feedbackOk, true);
        markModuleComplete(moduleId);
      } else {
        btn.classList.add("wrong");
        // Marcar la correcta
        opts.querySelectorAll(".ex-opt").forEach((b, j) => {
          if (ex.options[j].correct) b.classList.add("correct");
        });
        showFeedback(area, ex.feedbackBad, false);
      }
    });
    opts.appendChild(btn);
  });
  area.appendChild(opts);
}

function showFeedback(container, text, ok) {
  const prev = container.querySelector(".feedback");
  if (prev) prev.remove();
  const fb = document.createElement("div");
  fb.className = "feedback " + (ok ? "ok" : "bad");
  fb.textContent = text;
  container.appendChild(fb);
}

function markModuleComplete(id) {
  completedModules.add(id);
  const fill = document.getElementById("progress-fill");
  const text = document.getElementById("progress-text");
  const n = completedModules.size;
  if (fill) fill.style.width = (n / 5) * 100 + "%";
  if (text) text.textContent = n + " / 5 módulos";
  if (typeof currentUser !== "undefined" && currentUser) {
    recordModuleComplete(currentUser, id);
  }
}
/**
 * app.js – Orquestación principal de Eduquest
 */

/** Validación del nombre del estudiante */
function validateStudentName(raw) {
  const name = (raw || "").trim().replace(/\s+/g, " ");

  if (!name) {
    return { ok: false, message: "Escribe tu nombre para continuar." };
  }
  if (name.length < 2) {
    return { ok: false, message: "El nombre debe tener al menos 2 caracteres." };
  }
  if (name.length > 40) {
    return { ok: false, message: "El nombre no puede superar 40 caracteres." };
  }
  // Solo letras (incluye acentos), espacios, guion y apóstrofe
  const namePattern = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
  if (!namePattern.test(name)) {
    return {
      ok: false,
      message: "Usa solo letras, espacios, guion o apóstrofe. Sin números ni símbolos."
    };
  }
  // Evitar nombres solo con espacios o caracteres repetidos triviales
  if (/^[\s'-]+$/.test(name)) {
    return { ok: false, message: "Introduce un nombre válido." };
  }

  return { ok: true, name };
}

function showNameError(message) {
  const input = document.getElementById("student-name");
  const err = document.getElementById("name-error");
  if (!input || !err) return;
  input.classList.remove("input-ok");
  input.classList.add("input-error");
  input.setAttribute("aria-invalid", "true");
  err.textContent = message;
  err.hidden = false;
}

function clearNameError() {
  const input = document.getElementById("student-name");
  const err = document.getElementById("name-error");
  if (!input || !err) return;
  input.classList.remove("input-error");
  input.setAttribute("aria-invalid", "false");
  err.textContent = "";
  err.hidden = true;
}

function markNameOk() {
  const input = document.getElementById("student-name");
  if (!input) return;
  input.classList.remove("input-error");
  input.classList.add("input-ok");
  input.setAttribute("aria-invalid", "false");
}

/* ========== Progreso (localStorage) ========== */
const STORAGE_KEY = "eduquest_progress_v1";
const TEACHER_KEY = "eduquest";
let currentUser = null;
let currentMode = "student";
let uiBound = false;

function loadProgressStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveProgressStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.warn("No se pudo guardar el progreso", e);
  }
}

function ensureStudentRecord(name) {
  const store = loadProgressStore();
  if (!store[name]) {
    store[name] = {
      modules: [],
      quizzes: [],
      lastActive: new Date().toISOString()
    };
    saveProgressStore(store);
  }
  return store[name];
}

function recordModuleComplete(name, moduleId) {
  if (!name) return;
  const store = loadProgressStore();
  if (!store[name]) {
    store[name] = { modules: [], quizzes: [], lastActive: new Date().toISOString() };
  }
  if (store[name].modules.indexOf(moduleId) === -1) {
    store[name].modules.push(moduleId);
  }
  store[name].lastActive = new Date().toISOString();
  saveProgressStore(store);
}

function recordQuizResult(name, correct, total) {
  if (!name) return;
  const store = loadProgressStore();
  if (!store[name]) {
    store[name] = { modules: [], quizzes: [], lastActive: new Date().toISOString() };
  }
  const pct = Math.round((correct / total) * 100);
  store[name].quizzes.push({
    correct: correct,
    total: total,
    percent: pct,
    at: new Date().toISOString()
  });
  store[name].lastActive = new Date().toISOString();
  saveProgressStore(store);
}

function formatDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (e) {
    return iso;
  }
}

function badgeForPercent(pct) {
  if (pct >= 70) return '<span class="badge badge-ok">' + pct + "%</span>";
  if (pct >= 50) return '<span class="badge badge-mid">' + pct + "%</span>";
  return '<span class="badge badge-low">' + pct + "%</span>";
}

function renderTeacherDashboard() {
  const store = loadProgressStore();
  const names = Object.keys(store).sort();
  const tbody = document.getElementById("teacher-tbody");
  let totalAttempts = 0;
  let sumBest = 0;
  let withQuiz = 0;

  if (!names.length) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="empty-row">Aún no hay datos. Los estudiantes deben completar actividades en este mismo navegador.</td></tr>';
  } else {
    tbody.innerHTML = "";
    names.forEach(function (name) {
      const rec = store[name];
      const modules = (rec.modules || []).length;
      const quizzes = rec.quizzes || [];
      totalAttempts += quizzes.length;
      let best = null;
      let lastQuiz = "—";
      if (quizzes.length) {
        best = Math.max.apply(
          null,
          quizzes.map(function (q) {
            return q.percent;
          })
        );
        sumBest += best;
        withQuiz++;
        const last = quizzes[quizzes.length - 1];
        lastQuiz = last.correct + "/" + last.total + " (" + last.percent + "%)";
      }
      const tr = document.createElement("tr");
      tr.dataset.name = name;
      tr.innerHTML =
        "<td><strong>" +
        name +
        "</strong></td>" +
        "<td>" +
        modules +
        " / 5</td>" +
        "<td>" +
        lastQuiz +
        "</td>" +
        "<td>" +
        (best !== null ? badgeForPercent(best) : "—") +
        "</td>" +
        "<td>" +
        quizzes.length +
        "</td>" +
        "<td>" +
        formatDate(rec.lastActive) +
        "</td>";
      tr.addEventListener("click", function () {
        document.querySelectorAll("#teacher-tbody tr").forEach(function (r) {
          r.classList.remove("selected");
        });
        tr.classList.add("selected");
        showTeacherDetail(name, rec);
      });
      tbody.appendChild(tr);
    });
  }

  document.getElementById("stat-students").textContent = String(names.length);
  document.getElementById("stat-attempts").textContent = String(totalAttempts);
  document.getElementById("stat-avg").textContent = withQuiz
    ? Math.round(sumBest / withQuiz) + "%"
    : "—";

  document.getElementById("teacher-detail").classList.add("hidden");
  document.getElementById("teacher-detail-empty").classList.remove("hidden");
}

let selectedStudentName = null;

function showTeacherDetail(name, rec) {
  selectedStudentName = name;
  document.getElementById("teacher-detail-empty").classList.add("hidden");
  document.getElementById("teacher-detail").classList.remove("hidden");
  document.getElementById("detail-name").textContent = name;
  const ul = document.getElementById("detail-history");
  ul.innerHTML = "";
  const quizzes = (rec.quizzes || []).slice().reverse();
  if (!quizzes.length) {
    ul.innerHTML = "<li>Sin intentos de quiz registrados.</li>";
  } else {
    quizzes.forEach(function (q) {
      const li = document.createElement("li");
      li.innerHTML =
        "<strong>Intento</strong> · " +
        q.correct +
        "/" +
        q.total +
        " (" +
        badgeForPercent(q.percent) +
        ") · " +
        formatDate(q.at);
      ul.appendChild(li);
    });
  }
  const mods = rec.modules || [];
  if (mods.length) {
    const li = document.createElement("li");
    li.innerHTML =
      "<strong>Módulos completados:</strong> " + mods.join(", ");
    ul.appendChild(li);
  }
}

/* ========== Informes PDF ========== */
function getJsPdf() {
  if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
  if (window.jsPDF) return window.jsPDF;
  return null;
}

function pdfSafeFilename(name) {
  return String(name || "estudiante")
    .replace(/[^\w\-áéíóúüñÁÉÍÓÚÜÑ ]+/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .slice(0, 40) || "estudiante";
}

function buildStudentReportData(name, rec) {
  const quizzes = rec.quizzes || [];
  const modules = rec.modules || [];
  let best = null;
  let last = null;
  if (quizzes.length) {
    best = Math.max.apply(
      null,
      quizzes.map(function (q) {
        return q.percent;
      })
    );
    last = quizzes[quizzes.length - 1];
  }
  return {
    name: name,
    modules: modules,
    modulesCount: modules.length,
    quizzes: quizzes,
    attempts: quizzes.length,
    best: best,
    last: last,
    lastActive: rec.lastActive
  };
}

function generateStudentPdf(name) {
  const JsPDF = getJsPdf();
  if (!JsPDF) {
    alert("No se pudo cargar la librería de PDF. Revisa la conexión a internet.");
    return;
  }
  const store = loadProgressStore();
  if (!store[name]) {
    alert("No hay datos para este estudiante.");
    return;
  }
  const data = buildStudentReportData(name, store[name]);
  const doc = new JsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  let y = 18;

  doc.setFillColor(13, 21, 40);
  doc.rect(0, 0, pageW, 28, "F");
  doc.setTextColor(34, 211, 238);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Eduquest – Informe de progreso", 14, 14);
  doc.setFontSize(10);
  doc.setTextColor(200, 210, 230);
  doc.setFont("helvetica", "normal");
  doc.text("Laboratorio Matematico Inmersivo · Derivadas", 14, 22);

  y = 38;
  doc.setTextColor(30, 30, 40);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Estudiante: " + data.name, 14, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Generado: " + formatDate(new Date().toISOString()), 14, y);
  y += 6;
  doc.text("Ultima actividad: " + formatDate(data.lastActive), 14, y);
  y += 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Resumen", 14, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Modulos completados: " + data.modulesCount + " / 5", 14, y);
  y += 6;
  if (data.modules.length) {
    doc.text("Detalle: " + data.modules.join(", "), 14, y);
    y += 6;
  }
  doc.text("Intentos de quiz: " + data.attempts, 14, y);
  y += 6;
  doc.text(
    "Mejor resultado: " + (data.best !== null ? data.best + "%" : "Sin intentos"),
    14,
    y
  );
  y += 6;
  if (data.last) {
    doc.text(
      "Ultimo quiz: " +
        data.last.correct +
        "/" +
        data.last.total +
        " (" +
        data.last.percent +
        "%) – " +
        formatDate(data.last.at),
      14,
      y
    );
    y += 10;
  } else {
    y += 4;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Historial de quizzes", 14, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  if (!data.quizzes.length) {
    doc.text("Sin intentos registrados.", 14, y);
  } else {
    data.quizzes
      .slice()
      .reverse()
      .forEach(function (q, idx) {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(
          (idx + 1) +
            ". " +
            q.correct +
            "/" +
            q.total +
            " (" +
            q.percent +
            "%) – " +
            formatDate(q.at),
          16,
          y
        );
        y += 6;
      });
  }

  y += 10;
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 130);
  doc.text(
    "Informe automatico generado por Eduquest. Solo contenido de derivadas de funciones.",
    14,
    y
  );

  doc.save("Eduquest_informe_" + pdfSafeFilename(name) + ".pdf");
}

function generateGroupPdf() {
  const JsPDF = getJsPdf();
  if (!JsPDF) {
    alert("No se pudo cargar la librería de PDF. Revisa la conexión a internet.");
    return;
  }
  const store = loadProgressStore();
  const names = Object.keys(store).sort();
  if (!names.length) {
    alert("No hay estudiantes registrados en este navegador.");
    return;
  }

  const doc = new JsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  let y = 18;

  doc.setFillColor(13, 21, 40);
  doc.rect(0, 0, pageW, 28, "F");
  doc.setTextColor(34, 211, 238);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Eduquest – Informe de grupo", 14, 14);
  doc.setFontSize(10);
  doc.setTextColor(200, 210, 230);
  doc.setFont("helvetica", "normal");
  doc.text("Evaluacion de progreso · Derivadas", 14, 22);

  y = 38;
  doc.setTextColor(30, 30, 40);
  doc.setFontSize(10);
  doc.text("Generado: " + formatDate(new Date().toISOString()), 14, y);
  y += 6;
  doc.text("Estudiantes registrados: " + names.length, 14, y);
  y += 12;

  let totalAttempts = 0;
  let sumBest = 0;
  let withQuiz = 0;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Estudiante", 14, y);
  doc.text("Modulos", 70, y);
  doc.text("Intentos", 95, y);
  doc.text("Mejor %", 120, y);
  doc.text("Ultimo quiz", 145, y);
  y += 3;
  doc.setDrawColor(180, 180, 190);
  doc.line(14, y, pageW - 14, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  names.forEach(function (name) {
    const data = buildStudentReportData(name, store[name]);
    totalAttempts += data.attempts;
    if (data.best !== null) {
      sumBest += data.best;
      withQuiz++;
    }
    if (y > 275) {
      doc.addPage();
      y = 20;
    }
    const lastStr = data.last
      ? data.last.correct + "/" + data.last.total + " (" + data.last.percent + "%)"
      : "—";
    doc.text(String(name).slice(0, 28), 14, y);
    doc.text(data.modulesCount + "/5", 72, y);
    doc.text(String(data.attempts), 100, y);
    doc.text(data.best !== null ? data.best + "%" : "—", 122, y);
    doc.text(lastStr, 145, y);
    y += 6;
  });

  y += 10;
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Resumen del grupo", 14, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Total de intentos de quiz: " + totalAttempts, 14, y);
  y += 6;
  doc.text(
    "Promedio de mejores resultados: " +
      (withQuiz ? Math.round(sumBest / withQuiz) + "%" : "—"),
    14,
    y
  );
  y += 12;
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 130);
  doc.text(
    "Informe automatico generado por Eduquest. Datos locales de este navegador.",
    14,
    y
  );

  doc.save("Eduquest_informe_grupo.pdf");
}

function enterStudentMode(safeName) {
  currentUser = safeName;
  currentMode = "student";
  ensureStudentRecord(safeName);
  document.getElementById("greeting").textContent = "Hola, " + safeName + " · Estudiante";
  document.getElementById("login-screen").classList.remove("active");
  document.getElementById("teacher-screen").classList.remove("active");
  document.getElementById("lab-screen").classList.add("active");
  showChatbot();
  initChatbot();
  setModule("constant");
  if (!uiBound) {
    bindUI();
    uiBound = true;
  }
}

function enterTeacherMode() {
  currentUser = null;
  currentMode = "teacher";
  document.getElementById("login-screen").classList.remove("active");
  document.getElementById("lab-screen").classList.remove("active");
  document.getElementById("teacher-screen").classList.add("active");
  hideChatbot();
  renderTeacherDashboard();
}

function logoutAll() {
  hideChatbot();
  stopHandTracking();
  closeCameraMode();
  close3DView();
  closeQuiz();
  currentUser = null;
  document.getElementById("lab-screen").classList.remove("active");
  document.getElementById("teacher-screen").classList.remove("active");
  document.getElementById("login-screen").classList.add("active");
  const nameInput = document.getElementById("student-name");
  if (nameInput) {
    nameInput.value = "";
    clearNameError();
    nameInput.classList.remove("input-ok");
  }
  const keyInput = document.getElementById("teacher-key");
  if (keyInput) keyInput.value = "";
  const terr = document.getElementById("teacher-error");
  if (terr) {
    terr.hidden = true;
    terr.textContent = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const nameInput = document.getElementById("student-name");
  let selectedMode = "student";

  // Selector de modo
  document.querySelectorAll(".mode-card").forEach(function (card) {
    card.addEventListener("click", function () {
      document.querySelectorAll(".mode-card").forEach(function (c) {
        c.classList.remove("active");
      });
      card.classList.add("active");
      selectedMode = card.dataset.mode;
      if (selectedMode === "student") {
        document.getElementById("student-fields").classList.remove("hidden");
        document.getElementById("teacher-fields").classList.add("hidden");
        document.getElementById("btn-login").textContent = "Entrar al laboratorio";
      } else {
        document.getElementById("student-fields").classList.add("hidden");
        document.getElementById("teacher-fields").classList.remove("hidden");
        document.getElementById("btn-login").textContent = "Entrar como docente";
      }
    });
  });

  nameInput.addEventListener("input", () => {
    const result = validateStudentName(nameInput.value);
    if (!nameInput.value.trim()) {
      clearNameError();
      nameInput.classList.remove("input-ok");
      return;
    }
    if (result.ok) {
      clearNameError();
      markNameOk();
    } else {
      showNameError(result.message);
    }
  });

  nameInput.addEventListener("blur", () => {
    if (selectedMode !== "student") return;
    if (!nameInput.value.trim()) {
      showNameError("Escribe tu nombre para continuar.");
      return;
    }
    const result = validateStudentName(nameInput.value);
    if (!result.ok) showNameError(result.message);
    else {
      clearNameError();
      markNameOk();
    }
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (selectedMode === "teacher") {
      const key = (document.getElementById("teacher-key").value || "").trim();
      const terr = document.getElementById("teacher-error");
      if (key !== TEACHER_KEY) {
        terr.textContent = "Clave incorrecta. Prueba con la clave por defecto.";
        terr.hidden = false;
        return;
      }
      terr.hidden = true;
      enterTeacherMode();
      return;
    }

    const result = validateStudentName(nameInput.value);
    if (!result.ok) {
      showNameError(result.message);
      nameInput.focus();
      return;
    }
    clearNameError();
    markNameOk();
    enterStudentMode(result.name);
  });

  document.getElementById("btn-logout").addEventListener("click", logoutAll);
  document.getElementById("btn-teacher-logout").addEventListener("click", logoutAll);
  document.getElementById("btn-teacher-refresh").addEventListener("click", renderTeacherDashboard);
  document.getElementById("btn-teacher-clear").addEventListener("click", function () {
    if (confirm("¿Borrar todos los registros de progreso de este navegador?")) {
      localStorage.removeItem(STORAGE_KEY);
      selectedStudentName = null;
      renderTeacherDashboard();
    }
  });
  document.getElementById("btn-pdf-all").addEventListener("click", generateGroupPdf);
  document.getElementById("btn-pdf-student").addEventListener("click", function () {
    if (!selectedStudentName) {
      alert("Selecciona un estudiante en la tabla.");
      return;
    }
    generateStudentPdf(selectedStudentName);
  });
});

function bindUI() {
  // Módulos
  document.querySelectorAll(".module-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".module-card").forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      setModule(card.dataset.module);
    });
  });

  // Toggles
  document.getElementById("tog-f").addEventListener("change", (e) => setShowF(e.target.checked));
  document.getElementById("tog-fp").addEventListener("change", (e) => setShowFp(e.target.checked));
  document.getElementById("tog-tangent").addEventListener("change", (e) => setShowTangent(e.target.checked));

  // Slider de tangente
  document.getElementById("x-slider").addEventListener("input", (e) => {
    setXTangent(parseFloat(e.target.value));
  });

  // Animación
  document.getElementById("btn-animate").addEventListener("click", startAnimation);
  document.getElementById("btn-pause").addEventListener("click", stopAnimation);
  document.getElementById("btn-reset").addEventListener("click", resetView);

  // 3D
  document.getElementById("btn-3d").addEventListener("click", open3DView);
  document.getElementById("close-3d").addEventListener("click", close3DView);

  // Cámara
  document.getElementById("btn-camera").addEventListener("click", openCameraMode);
  document.getElementById("close-camera").addEventListener("click", closeCameraMode);

  // Gestos
  document.getElementById("btn-hands").addEventListener("click", () => {
    const panel = document.getElementById("hands-panel");
    if (panel.classList.contains("hidden")) {
      startHandTracking();
    } else {
      stopHandTracking();
    }
  });
  document.getElementById("close-hands").addEventListener("click", stopHandTracking);

  // Quiz
  document.getElementById("btn-quiz").addEventListener("click", openQuiz);
  document.getElementById("close-quiz").addEventListener("click", closeQuiz);
  document.getElementById("btn-quiz-close").addEventListener("click", closeQuiz);
  document.getElementById("btn-start-quiz").addEventListener("click", startQuiz);
  document.getElementById("btn-quiz-next").addEventListener("click", nextQuizQuestion);
  document.getElementById("btn-quiz-retry").addEventListener("click", startQuiz);

  // Redimensionar gráfica al cambiar layout
  window.addEventListener("resize", () => {
    if (document.getElementById("graph-container")) {
      Plotly.Plots.resize(document.getElementById("graph-container"));
    }
  });
}

/* ========== BANCO DE PREGUNTAS – QUIZ DE DERIVADAS ========== */
const QUIZ_BANK = [
  {
    q: "¿Qué representa geométricamente la derivada de f en un punto x₀?",
    options: [
      "El área bajo la curva hasta x₀",
      "La pendiente de la recta tangente a la gráfica en x₀",
      "La distancia de x₀ al origen",
      "El valor máximo de f"
    ],
    correct: 1,
    explain: "La derivada f'(x₀) es la pendiente de la recta tangente a y = f(x) en el punto (x₀, f(x₀))."
  },
  {
    q: "Si f(x) = 5, ¿cuál es f'(x)?",
    options: ["5", "0", "1", "x"],
    correct: 1,
    explain: "La derivada de cualquier constante es 0: la gráfica es horizontal."
  },
  {
    q: "La derivada de f(x) = x es:",
    options: ["0", "x", "1", "2x"],
    correct: 2,
    explain: "La recta y = x tiene pendiente constante igual a 1."
  },
  {
    q: "Si f(x) = 3x − 2, entonces f'(x) vale:",
    options: ["3x", "−2", "3", "1"],
    correct: 2,
    explain: "En f(x) = mx + b, la derivada es el coeficiente m (aquí 3)."
  },
  {
    q: "Para f(x) = x², la derivada es:",
    options: ["x", "2x", "2", "x²"],
    correct: 1,
    explain: "Regla de la potencia: d/dx [xⁿ] = n·xⁿ⁻¹. Así d/dx [x²] = 2x."
  },
  {
    q: "Si f(x) = 2x² − 4x + 1, ¿cuál es f'(x)?",
    options: ["2x − 4", "4x − 4", "4x − 4 + 1", "2x² − 4"],
    correct: 1,
    explain: "d/dx(2x²) = 4x y d/dx(−4x) = −4, por tanto f'(x) = 4x − 4."
  },
  {
    q: "La regla del cociente (u/v)' es:",
    options: [
      "(u'v + uv') / v²",
      "(u'v − uv') / v²",
      "u' / v'",
      "(uv' − u'v) / v²"
    ],
    correct: 1,
    explain: "Fórmula correcta: (u'v − uv') / v², con v ≠ 0."
  },
  {
    q: "La regla del producto (uv)' es:",
    options: ["u'v'", "u' + v'", "u'v + uv'", "u/v + v/u"],
    correct: 2,
    explain: "(uv)' = u'v + uv'. Se derivan ambos factores y se suman los productos cruzados."
  },
  {
    q: "¿Qué significa que f'(x₀) = 0?",
    options: [
      "La función no está definida en x₀",
      "La tangente en x₀ es horizontal",
      "La función es constante en todo su dominio",
      "f(x₀) = 0"
    ],
    correct: 1,
    explain: "Si la derivada es cero, la pendiente de la tangente es 0: la tangente es horizontal (posible extremo local)."
  },
  {
    q: "La tasa de variación promedio de f entre a y b es:",
    options: [
      "f'(a)",
      "[f(b) − f(a)] / (b − a)",
      "f(b) − f(a)",
      "f'(b) − f'(a)"
    ],
    correct: 1,
    explain: "Es la pendiente de la recta secante que une (a, f(a)) y (b, f(b))."
  },
  {
    q: "Cuando el incremento h tiende a 0, la recta secante se convierte en:",
    options: [
      "La recta normal",
      "La recta tangente",
      "El eje x",
      "Una parábola"
    ],
    correct: 1,
    explain: "Al acercarse los dos puntos, la secante tiende a la tangente; ese límite es la derivada."
  },
  {
    q: "Si f'(x) > 0 en un intervalo, la función f en ese intervalo:",
    options: [
      "Es constante",
      "Es decreciente",
      "Es creciente",
      "Tiene un máximo"
    ],
    correct: 2,
    explain: "Derivada positiva implica que la función es creciente en ese intervalo."
  },
  {
    q: "Si f'(x) < 0 en un intervalo, la función f en ese intervalo:",
    options: [
      "Es creciente",
      "Es decreciente",
      "Es nula",
      "No tiene tangente"
    ],
    correct: 1,
    explain: "Derivada negativa implica que la función es decreciente."
  },
  {
    q: "d/dx [x³] es igual a:",
    options: ["3x", "3x²", "x²", "3"],
    correct: 1,
    explain: "Regla de la potencia: n = 3 → 3x²."
  },
  {
    q: "La derivada de f(x) = −7x + 10 es:",
    options: ["−7", "10", "−7x", "0"],
    correct: 0,
    explain: "Derivada de una lineal mx + b: solo queda m = −7."
  },
  {
    q: "¿Cuál es la ecuación de la recta tangente a y = f(x) en x₀?",
    options: [
      "y = f'(x₀)",
      "y − f(x₀) = f'(x₀)(x − x₀)",
      "y = f(x₀)·x",
      "y = f(x) + f'(x)"
    ],
    correct: 1,
    explain: "Punto-pendiente: pasa por (x₀, f(x₀)) con pendiente f'(x₀)."
  },
  {
    q: "Si f(x) = (x² + 1)/(x + 2), para derivar se usa principalmente:",
    options: [
      "Solo la regla de la potencia",
      "La regla del cociente (o producto con 1/v)",
      "La definición con límites únicamente",
      "La regla de la cadena con senos"
    ],
    correct: 1,
    explain: "Es un cociente de funciones; se aplica (u/v)' = (u'v − uv')/v²."
  },
  {
    q: "La derivada mide la tasa de variación:",
    options: [
      "Promedio en un intervalo largo",
      "Instantánea en un punto",
      "Solo de funciones lineales",
      "Del área bajo la curva"
    ],
    correct: 1,
    explain: "La derivada es la tasa de variación instantánea; la promedio corresponde a la secante."
  },
  {
    q: "Para f(x) = ax² + bx + c, la derivada es:",
    options: ["ax + b", "2ax + b", "2ax + c", "a + b + c"],
    correct: 1,
    explain: "d/dx(ax²) = 2ax, d/dx(bx) = b, d/dx(c) = 0 → f'(x) = 2ax + b."
  },
  {
    q: "Si la gráfica de f es una recta horizontal, entonces f'(x) es:",
    options: ["Igual a f(x)", "Siempre 1", "Siempre 0", "No existe"],
    correct: 2,
    explain: "Recta horizontal ⟹ pendiente 0 ⟹ derivada idénticamente nula."
  }
];

let quizDeck = [];
let quizIndex = 0;
let quizCorrect = 0;
let quizAnswered = false;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function openQuiz() {
  document.getElementById("quiz-overlay").classList.remove("hidden");
  document.getElementById("quiz-start").classList.remove("hidden");
  document.getElementById("quiz-play").classList.add("hidden");
  document.getElementById("quiz-result").classList.add("hidden");
}

function closeQuiz() {
  document.getElementById("quiz-overlay").classList.add("hidden");
}

function startQuiz() {
  quizDeck = shuffle(QUIZ_BANK).slice(0, 10);
  quizIndex = 0;
  quizCorrect = 0;
  quizAnswered = false;
  document.getElementById("quiz-start").classList.add("hidden");
  document.getElementById("quiz-result").classList.add("hidden");
  document.getElementById("quiz-play").classList.remove("hidden");
  renderQuizQuestion();
}

function renderQuizQuestion() {
  quizAnswered = false;
  const item = quizDeck[quizIndex];
  const total = quizDeck.length;

  document.getElementById("quiz-counter").textContent =
    "Pregunta " + (quizIndex + 1) + " / " + total;
  document.getElementById("quiz-score-live").textContent =
    "Aciertos: " + quizCorrect;
  document.getElementById("quiz-bar-fill").style.width =
    ((quizIndex / total) * 100) + "%";

  document.getElementById("quiz-question").textContent = item.q;

  const optsBox = document.getElementById("quiz-options");
  optsBox.innerHTML = "";
  item.options.forEach(function (text, i) {
    const btn = document.createElement("button");
    btn.className = "quiz-opt";
    btn.textContent = text;
    btn.addEventListener("click", function () {
      answerQuiz(i);
    });
    optsBox.appendChild(btn);
  });

  const fb = document.getElementById("quiz-feedback");
  fb.classList.add("hidden");
  fb.textContent = "";
  fb.classList.remove("ok", "bad");

  const nextBtn = document.getElementById("btn-quiz-next");
  nextBtn.classList.add("hidden");
  nextBtn.textContent = quizIndex === total - 1 ? "Ver resultado" : "Siguiente";
}

function answerQuiz(choice) {
  if (quizAnswered) return;
  quizAnswered = true;
  const item = quizDeck[quizIndex];
  const buttons = document.querySelectorAll("#quiz-options .quiz-opt");

  buttons.forEach(function (btn, i) {
    btn.disabled = true;
    if (i === item.correct) btn.classList.add("correct");
    if (i === choice && choice !== item.correct) btn.classList.add("wrong");
  });

  const fb = document.getElementById("quiz-feedback");
  fb.classList.remove("hidden");
  if (choice === item.correct) {
    quizCorrect++;
    fb.classList.add("ok");
    fb.classList.remove("bad");
    fb.textContent = "Correcto. " + item.explain;
  } else {
    fb.classList.add("bad");
    fb.classList.remove("ok");
    fb.textContent = "Incorrecto. " + item.explain;
  }

  document.getElementById("quiz-score-live").textContent =
    "Aciertos: " + quizCorrect;
  document.getElementById("btn-quiz-next").classList.remove("hidden");
}

function nextQuizQuestion() {
  if (quizIndex < quizDeck.length - 1) {
    quizIndex++;
    renderQuizQuestion();
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  document.getElementById("quiz-play").classList.add("hidden");
  document.getElementById("quiz-result").classList.remove("hidden");

  const total = quizDeck.length;
  const pct = Math.round((quizCorrect / total) * 100);
  document.getElementById("quiz-result-score").textContent =
    quizCorrect + "/" + total;

  var title = "Buen intento";
  var msg = "Repasa los módulos del laboratorio y vuelve a intentarlo.";
  if (pct >= 90) {
    title = "¡Excelente!";
    msg = "Dominas muy bien los conceptos de derivada. Sigue explorando las gráficas.";
  } else if (pct >= 70) {
    title = "¡Muy bien!";
    msg = "Tienes una base sólida. Revisa las preguntas falladas en la ficha de cada módulo.";
  } else if (pct >= 50) {
    title = "Vas por buen camino";
    msg = "Repasa la recta tangente, las reglas básicas y el cociente en el laboratorio.";
  }

  document.getElementById("quiz-result-title").textContent = title;
  document.getElementById("quiz-result-msg").textContent =
    "Obtuviste " + quizCorrect + " de " + total + " (" + pct + "%). " + msg;

  document.getElementById("quiz-bar-fill").style.width = "100%";

  if (typeof currentUser !== "undefined" && currentUser) {
    recordQuizResult(currentUser, quizCorrect, total);
  }
}
