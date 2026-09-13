/* ============================================================
   state.js — Unified client-side state for the RC Sizing Suite
   ------------------------------------------------------------
   No backend: state lives in localStorage under a single key.
   Every module (Sizer, Airfoil, Electronics, CG, Gear, Viewer)
   reads shared inputs on load and writes back its own outputs,
   so downstream tabs (e.g. the 3D Viewer, CG plot) stay in sync
   without any manual re-entry of data.

   Cross-tab sync: the native 'storage' event fires in *other*
   open tabs/windows whenever localStorage changes here, so if a
   user has the Sizer and Viewer open side by side, the Viewer
   updates live. A CustomEvent covers same-tab / same-document
   updates (e.g. navigating via SPA-style includes).
   ============================================================ */
const RCState = (function () {
  const KEY = 'rcSizerSuite.v1';

  const defaults = {
    // --- Sizer (index.html) ---
    weight_g: 1500,
    aspectRatio: 6,
    wingCubicLoading: 7,
    taperRatio: 0.6,
    area_dm2: 24.9,
    span_cm: 122.2,
    rootChord_cm: 25.4,
    tipChord_cm: 15.3,
    meanChord_cm: 20.4,

    // --- Airfoil (airfoil.html) ---
    airfoilCode: '2412',
    alpha_deg: 2,
    airspeed_ms: 15,

    // --- Electronics (electronics.html) ---
    motorKV: 1100,
    voltageV: 14.8,
    propDia_in: 9,
    propPitch_in: 6,
    battCapacity_mAh: 2200,
    cruiseThrottlePct: 50,

    // --- CG Analysis (cg.html) ---
    components: [
      { n: 'Motor', w: 100, d: 10 },
      { n: 'Battery', w: 250, d: 150 },
      { n: 'Wing (LE)', w: 400, d: 300 }
    ],
    fuselageLength_mm: 900,

    // --- Landing Gear (gear.html) ---
    propClearance_cm: 5,
    propRadius_cm: 12,
    mainWheelDia_cm: 6,
    noseWheelDia_cm: 4,
    gearConfig: 'Tricycle',
    cgHeight_cm: 9,
    trackWidth_cm: 22,
    mainGearPos_mm: 340,
    rotationAngle_deg: 12
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(defaults));
      return Object.assign(JSON.parse(JSON.stringify(defaults)), JSON.parse(raw));
    } catch (e) {
      console.warn('RCState: load failed, using defaults', e);
      return JSON.parse(JSON.stringify(defaults));
    }
  }

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      window.dispatchEvent(new CustomEvent('rcstate:update', { detail: state }));
    } catch (e) {
      console.warn('RCState: save failed (localStorage unavailable)', e);
    }
  }

  function get() { return load(); }

  function set(patch) {
    const s = load();
    Object.assign(s, patch);
    save(s);
    return s;
  }

  function onChange(fn) {
    window.addEventListener('storage', (e) => { if (e.key === KEY) fn(load()); });
    window.addEventListener('rcstate:update', (e) => fn(e.detail));
  }

  /* Renders a { Label: value } or { Label: {value, note} } object into
     a .stat-grid container, wiring up a citation tooltip when `note`
     (the engineering source) is supplied. */
  function renderStats(el, data) {
    el.innerHTML = Object.entries(data).map(([label, v]) => {
      const isObj = v !== null && typeof v === 'object' && 'value' in v;
      const val = isObj ? v.value : v;
      const note = isObj ? v.note : null;
      const cls = isObj && v.cls ? ' ' + v.cls : '';
      const cite = note
        ? `<span class="cite" tabindex="0" data-note="${String(note).replace(/"/g, '&quot;')}">i</span>`
        : '';
      return `<div class="stat-box"><span class="stat-label">${label}${cite}</span><span class="stat-val${cls}">${val}</span></div>`;
    }).join('');
  }

  return { get, set, onChange, renderStats, defaults, KEY };
})();
