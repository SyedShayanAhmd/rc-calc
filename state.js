/* ============================================================
   state.js — Unified client-side state for the RC Sizing Suite
   ============================================================ */
const RCState = (function () {
  const KEY = 'rcSizerSuite.v2';
  const defaults = {
    // Sizer
    weight_g: 1500, aspectRatio: 6, wingCubicLoading: 7, taperRatio: 0.6,
    area_dm2: 24.9, span_cm: 122.2, rootChord_cm: 25.4, tipChord_cm: 15.3, meanChord_cm: 20.4,
    fuseLength_cm: 85.5, fuseHeight_cm: 8.5,
    hsArea_dm2: 3.7, hsSpan_cm: 38.5, hsChord_cm: 9.6,
    vsArea_dm2: 1.2, vsHeight_cm: 13.4, vsChord_cm: 8.9,
    // Airfoil
    airfoilCode: '2412', alpha_deg: 2, airspeed_ms: 15,
    // Electronics
    motorKV: 1100, voltageV: 14.8, propDia_in: 9, propPitch_in: 6,
    battCapacity_mAh: 2200, desiredFlightTime_min: 10,
    // CG
    components: [{ n: 'Motor', w: 100, d: 10 }, { n: 'Battery', w: 250, d: 150 }, { n: 'Wing', w: 400, d: 250 }],
    wingLEPosition_mm: 250, fuselageLength_mm: 855, cgPosition_mm: 220,
    // Gear
    propClearance_cm: 5, propRadius_cm: 11.4, mainWheelDia_cm: 6, noseWheelDia_cm: 4,
    gearConfig: 'Tricycle', cgHeight_cm: 9, trackWidth_cm: 22, mainGearPos_mm: 340, rotationAngle_deg: 12
  };

  function load() {
    try { const raw = localStorage.getItem(KEY); return raw ? Object.assign({}, defaults, JSON.parse(raw)) : defaults; } 
    catch (e) { return defaults; }
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); window.dispatchEvent(new CustomEvent('rcstate:update', { detail: state })); } 
    catch (e) {}
  }
  function get() { return load(); }
  function set(patch) { const s = load(); Object.assign(s, patch); save(s); return s; }
  function onChange(fn) {
    window.addEventListener('storage', (e) => { if (e.key === KEY) fn(load()); });
    window.addEventListener('rcstate:update', (e) => fn(e.detail));
  }
  function renderStats(el, data) {
    el.innerHTML = Object.entries(data).map(([label, v]) => {
      const isObj = typeof v === 'object' && v !== null;
      const val = isObj ? v.value : v;
      const note = isObj && v.note ? `<span class="cite" tabindex="0" data-note="${v.note.replace(/"/g, '&quot;')}">i</span>` : '';
      return `<div class="stat-box"><span class="stat-label">${label}${note}</span><span class="stat-val ${isObj && v.cls ? v.cls : ''}">${val}</span></div>`;
    }).join('');
  }
  return { get, set, onChange, renderStats };
})();
