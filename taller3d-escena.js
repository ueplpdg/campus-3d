// Taller 3D · escena del campus (three.js): estaciones, recorrido, ubicación de componentes y simulación.
(function () {
  const EST = {
    bar: { x: -16, z: -11, r: 0, w: 11, n: 'BAR', c: '#e8a33d', pared: '#f3e1c2' },
    aula: { x: 0, z: -11, r: 0, w: 11, n: 'AULA', c: '#3d8be8', pared: '#cfe3f5' },
    bano: { x: 16, z: -11, r: 0, w: 11, n: 'BAÑOS', c: '#2fb8d8', pared: '#d6f0f4' },
    patio: { x: -12, z: 11, r: Math.PI, w: 16, n: 'PATIO', c: '#4caf50', pared: null },
    lab: { x: 12, z: 11, r: Math.PI, w: 11, n: 'LABORATORIO', c: '#8e5be0', pared: '#e4dcf5' }
  };
  const PROY = { aforo: ['bar', -2.4, -3.3], agua: ['bar', 3.0, -3.2], ruido: ['aula', 0, -3.55], luzbano: ['bano', -2.4, -3.3], llave: ['bano', 2.8, -3.3], riego: ['patio', -5.2, -1.5], basurero: ['patio', 0, -1.5], solar: ['patio', 5.2, -1.5], gel: ['lab', -2.6, -3.55], alarma: ['lab', 2.4, -3.3] };
  if (window.T3D_EXTRA) { Object.assign(EST, window.T3D_EXTRA.EST); Object.assign(PROY, window.T3D_EXTRA.PROY); }
  if (window.T3D_CAMPUS) { Object.keys(window.T3D_CAMPUS.EST).forEach(k => { EST[k] = Object.assign({}, EST[k], window.T3D_CAMPUS.EST[k]); }); Object.assign(PROY, window.T3D_CAMPUS.PROY); }

  async function crear(cont, cb) {
    const T = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
    const W = () => cont.clientWidth || 800, H = () => cont.clientHeight || 600;
    const ren = new T.WebGLRenderer({ antialias: true });
    ren.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); ren.setSize(W(), H()); ren.outputColorSpace = T.SRGBColorSpace; ren.shadowMap.enabled = true; ren.shadowMap.type = T.PCFSoftShadowMap;
    cont.appendChild(ren.domElement); ren.domElement.style.display = 'block'; ren.domElement.style.outline = 'none';
    const sc = new T.Scene(); sc.background = new T.Color('#9fd3f2'); sc.fog = new T.Fog('#9fd3f2', 45, 95);
    const cam = new T.PerspectiveCamera(55, W() / H(), 0.1, 200);
    sc.add(new T.HemisphereLight('#ffffff', '#7a8a6a', 0.9));
    const sol = new T.DirectionalLight('#fff4dc', 1.6); sol.position.set(18, 30, 12); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048); const sc2 = sol.shadow.camera; sc2.left = -40; sc2.right = 40; sc2.top = 30; sc2.bottom = -30; sc2.far = 90; sc.add(sol);
    const mats = {}, M = (c, o) => { const k = c + JSON.stringify(o || {}); return mats[k] || (mats[k] = new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.85 }, o || {}))); };
    const add = (m, par, x, y, z) => { m.position.set(x || 0, y || 0, z || 0); m.castShadow = true; m.receiveShadow = true; (par || sc).add(m); return m; };
    const box = (w, h, d, c, par, x, y, z) => add(new T.Mesh(new T.BoxGeometry(w, h, d), typeof c === 'string' ? M(c) : c), par, x, (y || 0) + h / 2, z);
    const cyl = (rt, rb, h, c, par, x, y, z, s) => add(new T.Mesh(new T.CylinderGeometry(rt, rb, h, s || 20), typeof c === 'string' ? M(c) : c), par, x, (y || 0) + h / 2, z);
    const sph = (r, c, par, x, y, z) => add(new T.Mesh(new T.SphereGeometry(r, 20, 14), typeof c === 'string' ? M(c) : c), par, x, y, z);
    const lamp = (c) => new T.MeshStandardMaterial({ color: '#333', emissive: c, emissiveIntensity: 0 });
    function cartel(txt, o) {
      o = o || {}; const fs = o.fs || 44, cv = document.createElement('canvas'), x = cv.getContext('2d'); x.font = '800 ' + fs + 'px Arial'; const w = Math.ceil(x.measureText(txt).width) + fs; cv.width = w; cv.height = fs * 1.6;
      const dib = t => { x.clearRect(0, 0, cv.width, cv.height); x.fillStyle = o.bg || 'rgba(10,20,30,.85)'; x.beginPath(); x.roundRect(0, 0, cv.width, cv.height, fs * 0.35); x.fill(); x.font = '800 ' + fs + 'px Arial'; x.fillStyle = o.fg || '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t, cv.width / 2, cv.height / 2 + 2); };
      dib(txt); const tx = new T.CanvasTexture(cv); tx.colorSpace = T.SRGBColorSpace; const sp = new T.Sprite(new T.SpriteMaterial({ map: tx, depthTest: o.dt !== false, transparent: true })); const h = o.h || 0.4; sp.scale.set(h * cv.width / cv.height, h, 1);
      sp.userData.set = t => { dib(t); tx.needsUpdate = true; }; return sp;
    }
    function persona(c, par) { const g = new T.Group(); cyl(0.2, 0.24, 0.75, c, g, 0, 0.55, 0); sph(0.16, '#e0b48a', g, 0, 1.45, 0); cyl(0.09, 0.09, 0.55, '#2c3e50', g, -0.1, 0, 0); cyl(0.09, 0.09, 0.55, '#2c3e50', g, 0.1, 0, 0); (par || sc).add(g); return g; }

    if (!window.T3D_CAMPUS) {
    // Terreno
    box(110, 0.2, 80, '#86b86b', sc, 0, -0.2, 0);
    box(60, 0.05, 12, '#d8d0bf', sc, 0, -0.01, 0);
    for (let i = -26; i <= 26; i += 4) box(1.6, 0.06, 0.25, '#f2eee4', sc, i, 0, 0);
    box(70, 9, 2, '#bfe3f2', sc, 0, 0, -21); for (let i = -30; i <= 30; i += 4) for (let f = 0; f < 3; f++) box(2, 1.4, 0.1, '#5a8fb0', sc, i, 1.2 + f * 2.7, -19.95);
    const tc = cartel('U. E. P. LA PROVIDENCIA', { fs: 60, h: 1.4, bg: '#1d4f91' }); tc.position.set(0, 10.4, -20); sc.add(tc);
    [[-30, 6], [30, 6], [-30, -5], [30, -5], [0, 22], [-24, 22], [24, 22]].forEach(([x, z]) => { cyl(0.18, 0.25, 1.8, '#7a5230', sc, x, 0, z); sph(1.4, '#3f8f3a', sc, x, 2.6, z); });
    }
    const solS = sph(1.6, new T.MeshBasicMaterial({ color: '#ffe066' }), sc, -12, 16, 26);

    // Estaciones
    const est = {}, anc = {}, colis = [];
    Object.keys(EST).forEach(k => {
      const E = EST[k], g = new T.Group(); g.position.set(E.x, 0, E.z); g.rotation.y = E.r; sc.add(g); est[k] = g;
      if (!E.sin) box(E.w, 0.12, 8, k === 'patio' ? '#c9c2b0' : '#e9e4da', g, 0, 0, -0.5);
      if (E.emb) { const cp = new T.Mesh(new T.PlaneGeometry(E.w, 8), new T.MeshLambertMaterial({ color: '#f4f6f8' })); cp.rotation.x = Math.PI / 2; cp.position.set(0, 3.45, -0.5); g.add(cp); }
      if (E.pared) { box(E.w, 3.4, 0.25, E.pared, g, 0, 0, -4.4); box(0.25, E.alto || 1.1, 8, E.pared, g, -E.w / 2, 0, -0.5); box(0.25, E.alto || 1.1, 8, E.pared, g, E.w / 2, 0, -0.5); box(E.w + 0.3, 0.25, 0.5, E.c, g, 0, 3.4, -4.3); }
      else if (!E.sin) { box(E.w, 0.6, 0.3, '#a89f8c', g, 0, 0, -4.4); }
      const c = cartel(E.n, { fs: 56, h: 0.75, bg: E.c }); c.position.set(0, E.sy || 4.3, E.sz != null ? E.sz : -4.2); g.add(c);
      const wv = new T.Vector3(); g.updateMatrixWorld();
      const p1 = g.localToWorld(new T.Vector3(-E.w / 2, 0, -4.6)), p2 = g.localToWorld(new T.Vector3(E.w / 2, 0, -4.1)); if (!E.sin) colis.push([Math.min(p1.x, p2.x), Math.max(p1.x, p2.x), Math.min(p1.z, p2.z), Math.max(p1.z, p2.z)]);
      if (E.pared) [-1, 1].forEach(s => { const a = g.localToWorld(new T.Vector3(s * E.w / 2 - 0.15, 0, -4.5)), b = g.localToWorld(new T.Vector3(s * E.w / 2 + 0.15, 0, 3.5)); colis.push([Math.min(a.x, b.x), Math.max(a.x, b.x), Math.min(a.z, b.z), Math.max(a.z, b.z)]); });
    });
    if (window.T3D_CAMPUS) window.T3D_CAMPUS.build({ T, sc, colis, cartel });
    // Decoración
    { const g = est.bar; box(3.4, 1.0, 0.8, '#b36b3a', g, 1.2, 0, -1.6); box(3.6, 0.08, 1.0, '#e8d5b0', g, 1.2, 1.0, -1.6); const m = cartel('MENÚ', { fs: 40, h: 0.35, bg: '#7a3e1d' }); m.position.set(1.2, 2.6, -4.2); g.add(m); }
    { const g = est.aula; box(4.2, 1.6, 0.08, '#20402c', g, 0, 1.0, -4.25); for (let r = 0; r < 3; r++) for (let c = -2; c <= 2; c++) { box(0.9, 0.06, 0.6, '#c99a5b', g, c * 1.8, 0.75, -1.4 + r * 1.5); cyl(0.04, 0.04, 0.75, '#555', g, c * 1.8, 0, -1.4 + r * 1.5); } box(1.2, 2.0, 0.6, '#8a6b48', g, -2.6, 0, -3.9); }
    { const g = est.bano; for (let i = 0; i < 2; i++) box(0.08, 2.0, 1.4, '#9fc9d2', g, -0.6 - i * 1.4, 0, 1.0); box(1.6, 1.0, 0.08, '#cfe8ff', g, 1.6, 1.3, -4.25); }
    { const g = est.lab; for (let i = -1; i <= 1; i++) { box(2.2, 0.08, 0.9, '#f0f0f0', g, i * 3.2, 0.85, 1.4); box(0.4, 0.3, 0.05, '#222', g, i * 3.2, 0.95, 1.2); } box(0.08, 2.4, 1.2, '#7b5a3c', g, -4.0, 0, -4.2); }

    // Proyectos: anclas, anillos, elementos de simulación
    const SP = {}, EL = {};
    Object.keys(PROY).forEach(id => {
      const [e, x, z] = PROY[id], a = new T.Group(); a.position.set(x, 0, z); est[e].add(a); const ring = new T.Mesh(new T.RingGeometry(0.55, 0.75, 40), new T.MeshBasicMaterial({ color: '#21d07a', side: T.DoubleSide, transparent: true, opacity: 0.9 })); ring.rotation.x = -Math.PI / 2; ring.position.set(0, 0.08, 2.4); a.add(ring);
      const lb = cartel('', { fs: 40, h: 0.38, bg: 'rgba(10,20,30,.85)' }); lb.position.set(0, 1.0, 2.4); a.add(lb);
      anc[id] = { g: a, ring, lb, e }; EL[id] = {};
    });
    const L = (id) => anc[id].g;
    if (window.T3D_EXTRA) Object.keys(window.T3D_EXTRA.M3D).forEach(id => { if (anc[id]) try { window.T3D_EXTRA.M3D[id]({ T, box, cyl, sph, lamp, cartel, persona }, L(id), EL[id]); } catch (e) { console.warn('3D', id, e); } });
    // aforo
    { const g = L('aforo'), E = EL.aforo; [-1, 1].forEach(s => box(0.16, 2.4, 0.2, '#7b5a3c', g, s * 0.98, 0, 0)); box(2.12, 0.18, 0.2, '#7b5a3c', g, 0, 2.4, 0); box(0.9, 0.4, 0.08, '#222', g, 0, 2.45, 0.08); E.lr = lamp('#ff3b30'); E.lv = lamp('#2ee86d'); sph(0.12, E.lr, g, -0.2, 2.65, 0.14); sph(0.12, E.lv, g, 0.2, 2.65, 0.14); E.cnt = cartel('PERSONAS: 0', { fs: 40, h: 0.32 }); E.cnt.position.set(0, 3.2, 0.2); g.add(E.cnt); E.pp = [0, 1, 2].map(i => { const p = persona(['#e74c3c', '#3498db', '#f1c40f'][i], g); p.visible = false; return p; }); }
    // agua
    { const g = L('agua'), E = EL.agua; box(0.8, 1.3, 0.6, '#eaeaea', g, 0, 0, 0); cyl(0.26, 0.26, 0.55, new T.MeshStandardMaterial({ color: '#7fc8ff', transparent: true, opacity: 0.6 }), g, 0, 1.3, 0); E.btn = box(0.12, 0.12, 0.05, '#d23b3b', g, 0.28, 0.96, 0.31); E.vaso = cyl(0.07, 0.06, 0.16, new T.MeshStandardMaterial({ color: '#dff4ff', transparent: true, opacity: 0.7 }), g, 0, 0.64, 0.42); E.ch = cyl(0.025, 0.025, 0.2, new T.MeshStandardMaterial({ color: '#4fb3ff', emissive: '#1a6fd0', emissiveIntensity: 0.4 }), g, 0, 0.82, 0.42); }
    // ruido
    { const g = L('ruido'), E = EL.ruido; box(0.36, 1.0, 0.12, '#222', g, 2.1, 1.3, 0); E.lr = lamp('#ff3b30'); E.la = lamp('#ffc531'); E.lv = lamp('#2ee86d'); sph(0.12, E.lr, g, 2.1, 2.1, 0.08); sph(0.12, E.la, g, 2.1, 1.8, 0.08); sph(0.12, E.lv, g, 2.1, 1.5, 0.08); E.on = [0, 1, 2].map(i => { const r = new T.Mesh(new T.RingGeometry(0.2 + i * 0.25, 0.25 + i * 0.25, 32), new T.MeshBasicMaterial({ color: '#ff8a3d', transparent: true, opacity: 0, side: T.DoubleSide })); r.position.set(0, 2.75, 0.15); g.add(r); return r; }); E.al = [-1.8, 0, 1.8].map((x, i) => persona(['#2e86de', '#e67e22', '#16a085'][i], g)); E.al.forEach((p, i) => p.position.set([-1.8, 0, 1.8][i], 0, 2.6)); E.db = cartel('-- dB', { fs: 40, h: 0.3 }); E.db.position.set(0, 3.3, 0.2); g.add(E.db); }
    // luz baño
    { const g = L('luzbano'), E = EL.luzbano; E.lb = new T.MeshStandardMaterial({ color: '#ddd', emissive: '#fff6d0', emissiveIntensity: 0 }); cyl(0.35, 0.35, 0.08, E.lb, g, 0, 3.05, 1.3); E.pl = new T.PointLight('#fff2c8', 0, 7); E.pl.position.set(0, 2.8, 1.3); g.add(E.pl); E.ven = new T.MeshBasicMaterial({ color: '#9fd3f2' }); add(new T.Mesh(new T.PlaneGeometry(1.2, 0.9), E.ven), g, 1.6, 1.8, 0.02); E.p = persona('#9b59b6', g); E.p.position.set(0, 0, 2.2); E.p.visible = false; }
    // llave
    { const g = L('llave'), E = EL.llave; box(1.3, 0.85, 0.65, '#f5f5f5', g, 0, 0, 0); box(0.9, 0.1, 0.45, '#cfe6ee', g, 0, 0.85, 0.05); cyl(0.04, 0.04, 0.35, '#b8c4cc', g, 0, 0.9, -0.15); box(0.04, 0.04, 0.25, '#b8c4cc', g, 0, 1.22, -0.05); box(1.0, 0.8, 0.04, '#cfe8ff', g, 0, 1.4, -0.3); E.ch = cyl(0.03, 0.03, 0.3, new T.MeshStandardMaterial({ color: '#4fb3ff', emissive: '#1a6fd0', emissiveIntensity: 0.4 }), g, 0, 0.9, 0.07); E.mano = sph(0.09, '#e0b48a', g, 0, 1.0, 0.6); }
    // riego
    { const g = L('riego'), E = EL.riego; cyl(0.35, 0.26, 0.5, '#b5562e', g, 0, 0, 0); cyl(0.33, 0.33, 0.04, '#5a3b24', g, 0, 0.46, 0); cyl(0.03, 0.03, 0.5, '#3f8f3a', g, 0, 0.5, 0); E.hoja = new T.MeshStandardMaterial({ color: '#3f8f3a' }); [[0.2, 0.9, 0], [-0.2, 0.95, 0.05], [0, 1.1, -0.1], [0.05, 1.05, 0.18]].forEach(p => sph(0.17, E.hoja, g, p[0], p[1], p[2])); box(0.6, 0.9, 0.5, '#2f6fd0', g, 1.05, 0, -0.1); box(0.9, 0.05, 0.05, '#555', g, 0.6, 0.85, 0); E.ch = cyl(0.025, 0.025, 0.35, new T.MeshStandardMaterial({ color: '#4fb3ff', emissive: '#1a6fd0', emissiveIntensity: 0.4 }), g, 0.18, 0.5, 0); E.hum = cartel('-- %', { fs: 40, h: 0.3 }); E.hum.position.set(0, 1.6, 0); g.add(E.hum); }
    // basurero
    { const g = L('basurero'), E = EL.basurero; cyl(0.38, 0.32, 0.85, '#2e7d32', g, 0, 0, 0); E.tapa = new T.Group(); E.tapa.position.set(0, 0.87, -0.38); g.add(E.tapa); cyl(0.4, 0.4, 0.06, '#1b5e20', E.tapa, 0, 0, 0.38); E.mano = sph(0.09, '#e0b48a', g, 0, 0.85, 1.5); }
    // solar
    { const g = L('solar'), E = EL.solar; cyl(0.06, 0.08, 2.75, '#888', g, 0, 0, 0); box(0.36, 1.0, 0.12, '#222', g, 0, 1.15, 0.08); E.lr = lamp('#ff3b30'); E.la = lamp('#ffc531'); E.lv = lamp('#2ee86d'); sph(0.12, E.lr, g, 0, 1.95, 0.16); sph(0.12, E.la, g, 0, 1.65, 0.16); sph(0.12, E.lv, g, 0, 1.35, 0.16); box(1.4, 0.08, 1.0, '#a33', g, -1.5, 2.2, -0.5); [-0.6, 0.6].forEach(s => cyl(0.04, 0.04, 2.2, '#777', g, -1.5 + s * 0.9, 0, -0.5)); E.uv = cartel('UV --', { fs: 40, h: 0.3 }); E.uv.position.set(0, 3.2, 0); g.add(E.uv); E.consejo = cartel('', { fs: 36, h: 0.3 }); E.consejo.position.set(0, 0.6, 0.6); g.add(E.consejo); }
    // gel
    { const g = L('gel'), E = EL.gel; box(0.38, 0.5, 0.22, '#f5f5f5', g, 0, 1.05, 0.1); box(0.06, 0.08, 0.06, '#888', g, 0, 1.0, 0.2); E.gota = sph(0.05, new T.MeshStandardMaterial({ color: '#bfe6ff', emissive: '#4fb3ff', emissiveIntensity: 0.5 }), g, 0, 0.92, 0.22); E.mano = sph(0.09, '#e0b48a', g, 0, 0.85, 0.9); [-1, 1].forEach(s => box(0.12, 2.3, 0.15, '#7b5a3c', g, -1.8 + s * 0.6, 0, 0)); }
    // alarma
    { const g = L('alarma'), E = EL.alarma; [-1, 1].forEach(s => box(0.14, 2.4, 0.18, '#7b5a3c', g, -1.6 + s * 0.6, 0, 0)); E.lr = lamp('#ff3b30'); sph(0.13, E.lr, g, -1.6, 2.65, 0.12); E.bz = [0, 1].map(i => { const r = new T.Mesh(new T.RingGeometry(0.15 + i * 0.25, 0.2 + i * 0.25, 32), new T.MeshBasicMaterial({ color: '#ff3b30', transparent: true, opacity: 0, side: T.DoubleSide })); r.rotation.x = Math.PI / 2; r.position.set(0, 3.0, 1.6); g.add(r); return r; }); E.flash = new T.PointLight('#ff2020', 0, 8); E.flash.position.set(0, 2.6, 1.5); g.add(E.flash); E.p = persona('#34495e', g); E.p.position.set(-1.6, 0, 1.0); E.p.visible = false; E.arm = cartel('', { fs: 36, h: 0.28 }); E.arm.position.set(-0.55, 1.6, 0.2); g.add(E.arm); }

    // Jugador
    const yo = persona('#1d4f91'); yo.position.set(0, 0, 3); let yaw = Math.PI, pitch = 0.42, dist = 7;
    const keys = {}; const kd = e => { if (/INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName)) return; keys[e.code] = true; if (e.code === 'KeyE' && modo === 'walk' && cerca && cb.onStation) cb.onStation(cerca); };
    const ku = e => { keys[e.code] = false; }; window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    let drag = null; const el = ren.domElement;
    el.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, m: 0 }; });
    window.addEventListener('pointerup', e => { if (drag && drag.m < 6) clic(e); drag = null; });
    window.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.m += Math.abs(dx) + Math.abs(dy); drag.x = e.clientX; drag.y = e.clientY; if (modo === 'walk') { yaw -= dx * 0.006; pitch = Math.max(0.12, Math.min(1.2, pitch + dy * 0.004)); } else { oy -= dx * 0.004; } });
    el.addEventListener('wheel', e => { if (modo === 'walk') dist = Math.max(3.5, Math.min(14, dist + e.deltaY * 0.01)); else oz = Math.max(2.5, Math.min(9, oz + e.deltaY * 0.006)); e.preventDefault(); }, { passive: false });
    const ray = new T.Raycaster(), mv = new T.Vector2();
    function clic(e) {
      const r = el.getBoundingClientRect(); mv.x = ((e.clientX - r.left) / r.width) * 2 - 1; mv.y = -((e.clientY - r.top) / r.height) * 2 + 1; ray.setFromCamera(mv, cam);
      if (modo === 'proy') { const hs = ray.intersectObjects(spotM, false); if (hs[0] && cb.onSpot) cb.onSpot(hs[0].object.userData.id); return; }
      const rs = ray.intersectObjects(Object.values(anc).map(a => a.ring), false); if (rs[0]) { const id = Object.keys(anc).find(k => anc[k].ring === rs[0].object); if (id && cb.onStation) cb.onStation(id); }
    }

    let modo = 'walk', actual = null, cerca = null, oy = 0, oz = 5.2, spotM = [], placedM = [], abiertos = null;
    const tmp = new T.Vector3(), tgt = new T.Vector3(), camGoal = new T.Vector3();
    function limpiar(arr) { arr.forEach(m => { m.parent && m.parent.remove(m); }); arr.length = 0; }
    const API = {
      proyecto(id) { modo = id ? 'proy' : 'walk'; actual = id; oy = 0; oz = 5.2; limpiar(spotM); limpiar(placedM); if (!id) Object.keys(EL).forEach(k => API.sim(k, null)); },
      spots(list, sel) { limpiar(spotM); if (!actual || !list) return; const a = anc[actual].g; list.forEach(s => { const m = new T.Mesh(new T.SphereGeometry(0.14, 16, 12), new T.MeshBasicMaterial({ color: s.id === sel ? '#ffd23f' : '#21d07a', transparent: true, opacity: 0.85 })); m.position.set(s.pos[0], s.pos[1], s.pos[2]); m.userData.id = s.id; a.add(m); spotM.push(m); const c = cartel(s.lab, { fs: 30, h: 0.2, bg: 'rgba(10,30,20,.85)' }); c.position.set(s.pos[0], s.pos[1] + 0.28, s.pos[2]); a.add(c); spotM.push(c); }); },
      colocados(list) { limpiar(placedM); if (!actual) return; const a = anc[actual].g, cnt = {}; list.forEach(o => { const k = o.spot; cnt[k] = (cnt[k] || 0) + 1; const off = (cnt[k] - 1) * 0.16; const m = new T.Mesh(new T.BoxGeometry(0.18, 0.12, 0.1), new T.MeshStandardMaterial({ color: o.col, emissive: o.col, emissiveIntensity: 0.25 })); m.position.set(o.pos[0] + off, o.pos[1], o.pos[2] + 0.05); a.add(m); placedM.push(m); }); },
      abiertos(set) { abiertos = set; Object.keys(anc).forEach(id => { const ok = !set || set.includes(id); anc[id].ring.material.color.set(ok ? '#21d07a' : '#7a7a7a'); anc[id].lb.userData.set(ok ? anc[id].nombre || id : '🔒 ' + (anc[id].nombre || id)); }); },
      nombres(o) { Object.keys(o).forEach(id => { if (anc[id]) { anc[id].nombre = o[id]; anc[id].lb.userData.set(o[id]); } }); API.abiertos(abiertos); },
      sim(id, s) {
        const E = EL[id]; if (!E) return; if (E.upd) { E.upd((s && s.out) || {}, (s && s.in) || {}, s); return; } const o = (s && s.out) || {}, i = (s && s.in) || {}, on = (m, v) => { if (m) m.emissiveIntensity = v ? 2.2 : 0; };
        if (id === 'aforo') { on(E.lr, o.lr); on(E.lv, o.lv); E.cnt.userData.set('PERSONAS: ' + (s && s.c != null ? s.c : 0)); }
        if (id === 'agua') { E.vaso.visible = !!i.b; E.ch.visible = !!o.rb; E.btn.position.z = i.a ? 0.27 : 0.31; }
        if (id === 'ruido' || id === 'solar') { on(E.lr, o.lr); on(E.la, o.la); on(E.lv, o.lv); }
        if (id === 'ruido') { const v = i.v || 0; E.on.forEach((r, k) => { r.material.opacity = v > 40 + k * 15 ? 0.7 : 0; }); E.db.userData.set(s ? v + ' dB' : '-- dB'); E.lvl = v; }
        if (id === 'solar') { const v = i.v || 0; E.uv.userData.set(s ? 'UV ' + v : 'UV --'); solS.material.color.set(v >= 8 ? '#ff9a2e' : v >= 3 ? '#ffd23f' : '#fff3b0'); E.consejo.userData.set(!s ? '' : o.lr ? 'Protector solar + sombra' : o.la ? 'Usa gorra' : o.lv ? 'Sin riesgo' : ''); }
        if (id === 'luzbano') { E.lb.emissiveIntensity = o.lb ? 1.6 : 0; E.pl.intensity = o.lb ? 6 : 0; E.p.visible = !!i.a; const b = i.b == null ? 600 : i.b; E.ven.color.set(b < 300 ? '#1b2440' : b < 600 ? '#e7a96b' : '#bfe6ff'); }
        if (id === 'llave') { E.ch.visible = !!o.rv; E.mano.position.z = 0.1 + Math.min(1, (i.v == null ? 90 : i.v) / 100) * 1.2; }
        if (id === 'riego') { E.ch.visible = !!o.rb; const h = i.v == null ? 50 : i.v; E.hoja.color.set(h < 30 ? '#a3a83a' : '#3f8f3a'); E.hum.userData.set(s ? h + ' %' : '-- %'); }
        if (id === 'basurero') { E.tapaGoal = (o.sv || 0) * Math.PI / 180 * 1.0; E.mano.position.z = 0.4 + Math.min(1, (i.v == null ? 150 : i.v) / 150) * 1.6; }
        if (id === 'gel') { E.gota.visible = !!o.rg; E.mano.position.z = i.v ? 0.3 : 1.0; }
        if (id === 'alarma') { on(E.lr, o.lr); E.son = !!o.bz; E.p.visible = !!i.a; E.arm.userData.set(s ? (i.b ? 'ARMADA' : 'DESARMADA') : ''); if (!o.bz) { E.flash.intensity = 0; E.bz.forEach(r => { r.material.opacity = 0; }); } }
      },
      evento(ev) { const E = EL.aforo, p = E.pp.find(x => !x.visible); if (!p) return; p.visible = true; p.userData.t = 0; p.userData.dir = ev === 'e' ? -1 : 1; p.position.set(0, 0, ev === 'e' ? 1.6 : -1.4); },
      enfocar() { oy = 0; oz = 5.2; },
      resize() { ren.setSize(W(), H()); cam.aspect = W() / H(); cam.updateProjectionMatrix(); },
      destruir() { vivo = false; window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); ren.dispose(); el.remove(); }
    };
    let vivo = true, last = performance.now();
    function loop(now) {
      if (!vivo) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; const t = now / 1000;
      if (modo === 'walk') {
        const f = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0), s = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0);
        if (f || s) { const sp = (keys.ShiftLeft ? 7 : 4.2) * dt, fx = -Math.sin(yaw), fz = -Math.cos(yaw);
          const mx = fx * f - fz * s, mz = fz * f + fx * s, n = Math.hypot(mx, mz) || 1, X = yo.position.x + mx / n * sp, Z = yo.position.z + mz / n * sp;
          const hit = (x, z) => Math.abs(x) > 50 || Math.abs(z) > 30 || colis.some(c => x > c[0] - 0.3 && x < c[1] + 0.3 && z > c[2] - 0.3 && z < c[3] + 0.3);
          if (!hit(X, yo.position.z)) yo.position.x = X; if (!hit(yo.position.x, Z)) yo.position.z = Z; yo.rotation.y = Math.atan2(mx, mz); yo.children[2].rotation.x = Math.sin(t * 10) * 0.4; yo.children[3].rotation.x = -Math.sin(t * 10) * 0.4; }
        tgt.set(yo.position.x, 1.2, yo.position.z); camGoal.set(yo.position.x + Math.sin(yaw) * Math.cos(pitch) * dist, 1.2 + Math.sin(pitch) * dist, yo.position.z + Math.cos(yaw) * Math.cos(pitch) * dist);
        cerca = null; let best = 1.4; Object.keys(anc).forEach(id => { anc[id].ring.getWorldPosition(tmp); const d = Math.hypot(tmp.x - yo.position.x, tmp.z - yo.position.z); anc[id].ring.scale.setScalar(1 + Math.sin(t * 3) * 0.06); if (d < best) { best = d; cerca = id; } });
        if (cb.onCerca) cb.onCerca(cerca);
      } else if (actual) {
        const a = anc[actual].g; a.localToWorld(tgt.set(0, 1.4, 0)); a.localToWorld(camGoal.set(Math.sin(oy) * oz, 2.5, Math.cos(oy) * oz));
      }
      cam.position.lerp(camGoal, 1 - Math.pow(0.002, dt)); cam.lookAt(tgt); yo.visible = modo === 'walk';
      const B = EL.basurero; if (B.tapa) { const g = B.tapaGoal || 0; B.tapa.rotation.x += (-g - B.tapa.rotation.x) * Math.min(1, dt * 6); }
      EL.aforo.pp.forEach(p => { if (!p.visible) return; p.userData.t += dt; p.position.z += p.userData.dir * dt * 3.2; if (p.userData.t > 1) p.visible = false; });
      const R = EL.ruido; if (R.al) R.al.forEach((p, k) => { p.position.y = (R.lvl || 0) >= 70 ? Math.abs(Math.sin(t * 8 + k)) * 0.25 : 0; });
      const Al = EL.alarma; if (Al.son) { Al.flash.intensity = (Math.sin(t * 12) > 0) ? 8 : 0; Al.bz.forEach((r, k) => { r.material.opacity = 0.5 + 0.5 * Math.sin(t * 10 + k); }); }
      if (EL.gel.gota.visible) { EL.gel.gota.position.y = 0.92 - ((t * 1.2) % 0.25); }
      Object.keys(EL).forEach(k => { const E = EL[k]; if (E.anim) try { E.anim(dt, t); } catch (e) {} });
      spotM.forEach(m => { if (m.isMesh) m.scale.setScalar(1 + Math.sin(t * 4) * 0.12); });
      ren.render(sc, cam); requestAnimationFrame(loop);
    }
    API.resize(); requestAnimationFrame(loop);
    Object.keys(EL).forEach(k => API.sim(k, null));
    return API;
  }
  window.T3D_ESCENA = { crear };
})();
