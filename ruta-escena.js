// Ruta Apagón · escena 3D: salas tipo «backrooms» en secuencia, llaves, terminales, mesas, puertas y 2 jugadores.
(function () {
  async function crear(cont, o) {
    const T = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
    const RD = window.RUTA_DATOS, ROOMS = RD.ROOMS, SP = 16, RW = 12, RL = 10, HH = 3.2, NR = ROOMS.length;
    const ren = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    ren.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); ren.outputColorSpace = T.SRGBColorSpace; ren.toneMapping = T.ACESFilmicToneMapping; ren.toneMappingExposure = 0.92;
    ren.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;outline:none;touch-action:none'; cont.appendChild(ren.domElement);
    const sc = new T.Scene(); sc.fog = new T.Fog('#2a2410', 9, 30); sc.background = new T.Color('#2a2410');
    const cam = new T.PerspectiveCamera(66, 1, 0.08, 140);
    const hemi = new T.HemisphereLight('#fff6e0', '#4a4030', 0.75); sc.add(hemi);
    const sun = new T.DirectionalLight('#fff4e0', 0); sun.position.set(30, 40, 20); sc.add(sun);
    const L1 = new T.PointLight('#fff1c8', 24, 18, 1.4), L2 = new T.PointLight('#fff1c8', 14, 14, 1.4); sc.add(L1, L2);
    const MAT = {}, M = (c, x) => { const k = c + JSON.stringify(x || {}); return MAT[k] || (MAT[k] = new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.75, metalness: 0.05 }, x || {}))); };
    const MT = (map, x) => new T.MeshStandardMaterial(Object.assign({ map, roughness: 0.85, metalness: 0 }, x || {}));
    const uvS = (geo, sx, sy) => { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * sx, uv.getY(i) * sy); return geo; };
    const box = (w, h, d, m, p, x, y, z) => { const g = new T.Mesh(new T.BoxGeometry(w, h, d), m); g.position.set(x, y + h / 2, z); p.add(g); return g; };
    const cyl = (rt, rb, h, m, p, x, y, z, s) => { const g = new T.Mesh(new T.CylinderGeometry(rt, rb, h, s || 20), m); g.position.set(x, y + h / 2, z); p.add(g); return g; };
    const sph = (r, m, p, x, y, z) => { const g = new T.Mesh(new T.SphereGeometry(r, 20, 14), m); g.position.set(x, y, z); p.add(g); return g; };
    // ---------- texturas procedurales ----------
    const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t; };
    const noise = (g, w, h, a, n) => { for (let i = 0; i < (n || w * h / 5); i++) { g.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,' + a * Math.random() + ')' : 'rgba(0,0,0,' + a * Math.random() + ')'; g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2); } };
    const TX = {
      wallpaper: (a, b) => tex(256, 256, (g, w, h) => { g.fillStyle = a; g.fillRect(0, 0, w, h); g.fillStyle = b; for (let x = 0; x < w; x += 32) g.fillRect(x, 0, 9, h); g.strokeStyle = 'rgba(90,70,10,.13)'; g.lineWidth = 2; for (let y = 0; y < h; y += 32) for (let x = 0; x < w; x += 32) { g.beginPath(); g.moveTo(x + 16, y + 5); g.lineTo(x + 26, y + 16); g.lineTo(x + 16, y + 27); g.lineTo(x + 6, y + 16); g.closePath(); g.stroke(); } noise(g, w, h, 0.07); const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(60,40,0,.12)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }),
      paint: (c, base) => tex(256, 256, (g, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); noise(g, w, h, 0.05); if (base) { g.fillStyle = base; g.fillRect(0, h * 0.86, w, h * 0.14); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, h * 0.86, w, 3); } }),
      carpet: c => tex(256, 256, (g, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); noise(g, w, h, 0.22, w * h / 1.5); for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(60,40,10,.08)'; g.beginPath(); g.ellipse(Math.random() * w, Math.random() * h, 20 + Math.random() * 40, 10 + Math.random() * 30, 0, 0, 7); g.fill(); } }),
      tiles: (a, b, n, gr) => tex(256, 256, (g, w, h) => { const s = w / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { g.fillStyle = (i + j) % 2 && b ? b : a; g.fillRect(i * s, j * s, s, s); } noise(g, w, h, 0.06); g.strokeStyle = gr || 'rgba(0,0,0,.28)'; g.lineWidth = 2; for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, h); g.moveTo(0, i * s); g.lineTo(w, i * s); g.stroke(); } }),
      ceil: () => tex(256, 256, (g, w, h) => { g.fillStyle = '#e9e6dc'; g.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); } g.strokeStyle = '#a9a69a'; g.lineWidth = 4; g.strokeRect(0, 0, w, h); g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke(); }),
      wood: () => tex(256, 256, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = ['#a8784a', '#b5865a', '#9c6e42', '#ad7f52'][i % 4]; g.fillRect(0, i * 32, w, 32); } g.strokeStyle = 'rgba(60,30,10,.25)'; for (let i = 0; i < 70; i++) { const y = Math.random() * h; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(w / 3, y + 3, w * 2 / 3, y - 3, w, y + 1); g.stroke(); } g.fillStyle = 'rgba(0,0,0,.3)'; for (let i = 0; i <= 8; i++) g.fillRect(0, i * 32, w, 1.5); }),
      metal: dark => tex(256, 256, (g, w, h) => { g.fillStyle = dark ? '#3a3f45' : '#59616b'; g.fillRect(0, 0, w, h); noise(g, w, h, 0.12); g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 3; g.strokeRect(2, 2, w - 4, h - 4); g.fillStyle = 'rgba(255,255,255,.25)'; [[12, 12], [w - 12, 12], [12, h - 12], [w - 12, h - 12]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 4, 0, 7); g.fill(); }); if (dark) { g.strokeStyle = 'rgba(255,255,255,.06)'; for (let i = 0; i < w; i += 12) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 30, h); g.stroke(); } } }),
      brick: () => tex(256, 256, (g, w, h) => { g.fillStyle = '#cfc6b8'; g.fillRect(0, 0, w, h); for (let r = 0; r < 8; r++) for (let c = -1; c < 4; c++) { g.fillStyle = ['#b5523b', '#a94a35', '#bd5d44', '#9f4430'][(r + c + 8) % 4]; g.fillRect(c * 64 + (r % 2) * 32 + 2, r * 32 + 2, 60, 28); } noise(g, w, h, 0.1); }),
      concrete: () => tex(256, 256, (g, w, h) => { g.fillStyle = '#a7a59f'; g.fillRect(0, 0, w, h); noise(g, w, h, 0.18, w * h); g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2; g.strokeRect(0, 0, w, h); }),
      court: () => tex(512, 512, (g, w, h) => { g.fillStyle = '#2f6f9f'; g.fillRect(0, 0, w, h); g.fillStyle = '#b9483c'; g.fillRect(40, 40, w - 80, h - 80); noise(g, w, h, 0.06); g.strokeStyle = '#fff'; g.lineWidth = 6; g.strokeRect(40, 40, w - 80, h - 80); g.beginPath(); g.moveTo(w / 2, 40); g.lineTo(w / 2, h - 40); g.stroke(); g.beginPath(); g.arc(w / 2, h / 2, 60, 0, 7); g.stroke(); [40, w - 40].forEach(x => { g.beginPath(); g.arc(x, h / 2, 120, x < w / 2 ? -Math.PI / 2 : Math.PI / 2, x < w / 2 ? Math.PI / 2 : Math.PI * 1.5); g.stroke(); }); }),
      grass: () => tex(256, 256, (g, w, h) => { g.fillStyle = '#4f8a3c'; g.fillRect(0, 0, w, h); for (let i = 0; i < 9000; i++) { g.fillStyle = ['#5f9a46', '#447a33', '#6aa84f', '#3d6f2e'][i % 4]; g.fillRect(Math.random() * w, Math.random() * h, 1, 3); } }),
      lockers: () => tex(256, 256, (g, w, h) => { for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? '#2d5fa8' : '#3368b5'; g.fillRect(i * 64, 0, 64, h); g.strokeStyle = 'rgba(0,0,0,.4)'; g.lineWidth = 3; g.strokeRect(i * 64 + 2, 2, 60, h - 4); g.fillStyle = 'rgba(0,0,0,.35)'; for (let k = 0; k < 5; k++) g.fillRect(i * 64 + 16, 20 + k * 8, 32, 3); g.fillStyle = '#c9ccd2'; g.fillRect(i * 64 + 50, h / 2, 5, 18); } noise(g, w, h, 0.05); })
    };
    const ceilT = TX.ceil();
    const TH = {
      backrooms: { wall: TX.wallpaper('#cdb85c', '#c4ad52'), floor: TX.carpet('#8d7b3c'), fog: '#2d2610', luz: '#fff1b8', flick: true },
      lab: { wall: TX.paint('#dfe7ef', '#7a8fa6'), floor: TX.tiles('#d5dbe1', '#c3cbd3', 4), fog: '#101820', luz: '#eaf4ff' },
      pasillo: { wall: TX.paint('#efe3c8', '#8a6d48'), floor: TX.tiles('#d8cdb8', '#c9bda6', 4), fog: '#201b12', luz: '#fff3d6', flick: true },
      aula: { wall: TX.paint('#d3e6f6', '#557ea6'), floor: TX.wood(), fog: '#0f1824', luz: '#f2f8ff' },
      banos: { wall: TX.tiles('#f4f7f8', null, 8, 'rgba(110,135,145,.55)'), floor: TX.tiles('#8fb2c0', '#7fa3b1', 8), fog: '#0e1a1f', luz: '#eaffff' },
      bar: { wall: TX.paint('#f1dcb8', '#9a5a2c'), floor: TX.tiles('#c79b6d', '#b88b5e', 4), fog: '#20160c', luz: '#ffe9c8' },
      patio: { wall: TX.brick(), floor: TX.concrete(), open: true, sky: '#9cc9f0', fog: '#cfe3f3', luz: '#ffffff' },
      final: { wall: TX.metal(true), floor: TX.metal(false), fog: '#160909', luz: '#ffcfbf', flick: true },
      cancha: { wall: TX.brick(), floor: TX.court(), open: true, sky: '#9cc9f0', fog: '#cfe3f3', luz: '#ffffff' }
    };
    // ---------- carteles ----------
    function cartel(txt, o2) {
      o2 = o2 || {}; const c = document.createElement('canvas'), fs = o2.fs || 48, g0 = c.getContext('2d'); g0.font = '900 ' + fs + 'px "Archivo Black", Arial Black, sans-serif'; const w = Math.ceil(g0.measureText(txt).width) + fs; c.width = w; c.height = Math.round(fs * 1.6);
      const g = c.getContext('2d'); g.fillStyle = o2.bg || 'rgba(10,26,58,.88)'; const r = c.height / 2; g.beginPath(); g.moveTo(r, 0); g.lineTo(w - r, 0); g.arc(w - r, r, r, -Math.PI / 2, Math.PI / 2); g.lineTo(r, c.height); g.arc(r, r, r, Math.PI / 2, Math.PI * 1.5); g.fill();
      g.font = '900 ' + fs + 'px "Archivo Black", Arial Black, sans-serif'; g.fillStyle = o2.fg || '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, w / 2, c.height / 2 + 2);
      const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; const s = new T.Sprite(new T.SpriteMaterial({ map: t, depthTest: o2.dt !== false, transparent: true })); const hh = o2.h || 0.4; s.scale.set(hh * w / c.height, hh, 1); return s;
    }
    const plano = (w, h, draw, cw, ch) => { const t = tex(cw || 512, ch || 256, draw); t.wrapS = t.wrapT = T.ClampToEdgeWrapping; return new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshStandardMaterial({ map: t, roughness: 0.6, emissive: '#ffffff', emissiveMap: t, emissiveIntensity: 0.25 })); };
    // ---------- construcción de salas ----------
    const cols = [], walk = [], doors = [], term = {}, mesa = {}, keySpots = {}, lamps = [];
    const KS = [[-4.9, 3.9], [4.9, 3.9], [4.9, -3.9], [-0.8, 4.1]];
    const col = (x1, x2, z1, z2) => cols.push([x1, x2, z1, z2]);
    const libre = (x, z, r) => !KS.some(([a, b]) => Math.hypot(a - x, b - z) < (r || 1.1));
    function wallSeg(p, x1, z1, x2, z2, h, m, y0) { const L = Math.hypot(x2 - x1, z2 - z1); if (L < 0.01) return; const g = new T.Mesh(uvS(new T.BoxGeometry(L, h, 0.2), L / 2.2, h / 2.2), m); g.position.set((x1 + x2) / 2, (y0 || 0) + h / 2, (z1 + z2) / 2); g.rotation.y = -Math.atan2(z2 - z1, x2 - x1); p.add(g); }
    ROOMS.forEach((R, i) => {
      const cx = i * SP, th = TH[R.tema], g = new T.Group(); sc.add(g); const wm = MT(th.wall), D = 1.2;
      const fl = new T.Mesh(uvS(new T.PlaneGeometry(RW, RL), th.open ? RW / 4 : RW / 2.4, th.open ? RL / 4 : RL / 2.4), MT(th.floor, { roughness: R.tema === 'final' ? 0.5 : 0.9, metalness: R.tema === 'final' ? 0.4 : 0 })); if (R.tema === 'cancha') { fl.geometry = new T.PlaneGeometry(RW, RL); } fl.rotation.x = -Math.PI / 2; fl.position.set(cx, 0, 0); g.add(fl);
      if (!th.open) { const ce = new T.Mesh(uvS(new T.PlaneGeometry(RW, RL), RW / 2, RL / 2), MT(ceilT, { roughness: 1 })); ce.rotation.x = Math.PI / 2; ce.position.set(cx, HH, 0); g.add(ce);
        const pm = new T.MeshStandardMaterial({ color: '#ffffff', emissive: th.luz, emissiveIntensity: 1.6 }); for (let a = -1; a <= 1; a += 2) for (let b = -1; b <= 1; b += 2) { const pn = new T.Mesh(new T.BoxGeometry(1.2, 0.04, 0.6), pm); pn.position.set(cx + a * 2.6, HH - 0.03, b * 2.2); g.add(pn); } lamps.push({ i, pm, base: 1.6, flick: !!th.flick }); }
      const hw = th.open ? 1.4 : HH;
      wallSeg(g, cx - RW / 2, -RL / 2, cx + RW / 2, -RL / 2, hw, wm); wallSeg(g, cx - RW / 2, RL / 2, cx + RW / 2, RL / 2, hw, wm);
      [-1, 1].forEach(sd => { const x = cx + sd * RW / 2, has = sd < 0 ? i > 0 : i < NR - 1; if (!has) { wallSeg(g, x, -RL / 2, x, RL / 2, hw, wm); return; } wallSeg(g, x, -RL / 2, x, -D, hw, wm); wallSeg(g, x, D, x, RL / 2, hw, wm); if (!th.open) wallSeg(g, x, -D, x, D, HH - 2.5, wm, 2.5); });
      walk.push({ r: [cx - RW / 2 + 0.35, cx + RW / 2 - 0.35, -RL / 2 + 0.35, RL / 2 - 0.35], room: i });
      // corredor hacia la siguiente sala (estilo backrooms)
      if (i < NR - 1) { const x0 = cx + RW / 2, x1 = cx + SP - RW / 2, cm = MT(TH.backrooms.wall), cl = new T.Mesh(uvS(new T.PlaneGeometry(x1 - x0, 2.4), 2, 1), MT(TH.backrooms.floor)); cl.rotation.x = -Math.PI / 2; cl.position.set((x0 + x1) / 2, 0.002, 0); g.add(cl);
        wallSeg(g, x0, -D, x1, -D, HH, cm); wallSeg(g, x0, D, x1, D, HH, cm); const cc = new T.Mesh(new T.PlaneGeometry(x1 - x0, 2.4), MT(ceilT)); cc.rotation.x = Math.PI / 2; cc.position.set((x0 + x1) / 2, HH, 0); g.add(cc);
        const pm2 = new T.MeshStandardMaterial({ color: '#fff', emissive: '#fff1b8', emissiveIntensity: 1.4 }); const pn = new T.Mesh(new T.BoxGeometry(1.2, 0.04, 0.5), pm2); pn.position.set((x0 + x1) / 2, HH - 0.03, 0); g.add(pn); lamps.push({ i: i + 0.5, pm: pm2, base: 1.4, flick: true });
        // puerta
        const dg = new T.Group(); dg.position.set(x0 + 0.12, 0, 0); g.add(dg); const fm = M('#30343a', { metalness: 0.6, roughness: 0.4 });
        box(0.24, 2.5, 0.12, fm, dg, 0, 0, -D); box(0.24, 2.5, 0.12, fm, dg, 0, 0, D); box(0.24, 0.12, 2.52, fm, dg, 0, 2.5, 0);
        const lm = new T.MeshStandardMaterial({ color: '#330000', emissive: '#ff2a2a', emissiveIntensity: 2 }); box(0.26, 0.06, 2.3, lm, dg, 0, 2.42, 0);
        const pmat = M('#8f9aa6', { metalness: 0.7, roughness: 0.35 }), A = box(0.08, 2.4, 1.18, pmat, dg, 0, 0, -0.59), B = box(0.08, 2.4, 1.18, pmat, dg, 0, 0, 0.59);
        [A, B].forEach(p => { box(0.1, 0.06, 1.0, M('#222'), p, 0, 0.3, 0); });
        const sg = cartel('➜ ' + ROOMS[i + 1].n, { fs: 40, h: 0.34 }); sg.position.set(-0.3, 2.95, 0); dg.add(sg);
        doors.push({ i, A, B, lm, sg, open: 0, g: dg, x: x0 });
        walk.push({ r: [x0 - 0.5, x1 + 0.5, -D + 0.32, D - 0.32], door: i }); }
      decorar(R.tema, g, cx, i);
      if (i >= 1 && i <= 7) estacion(g, cx, i);
      keySpots[i] = KS.map(([a, b]) => [cx + a, b]);
    });
    function silla(p, x, z, r) { const m = M('#2b3a4a'); const s = new T.Group(); s.position.set(x, 0, z); s.rotation.y = r || 0; p.add(s); box(0.42, 0.05, 0.42, m, s, 0, 0.44, 0); box(0.42, 0.45, 0.05, m, s, 0, 0.47, -0.19); [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(([a, b]) => box(0.03, 0.44, 0.03, M('#888', { metalness: 0.6 }), s, a, 0, b)); }
    function mesaPC(p, x, z, w) { box(w || 1.6, 0.05, 0.7, M('#e9e4da'), p, x, 0.74, z); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => box(0.04, 0.74, 0.04, M('#666', { metalness: 0.6 }), p, x + a * ((w || 1.6) / 2 - 0.06), 0, z + b * 0.3)); box(0.5, 0.32, 0.03, M('#111'), p, x, 0.84, z - 0.15); const sc2 = new T.Mesh(new T.PlaneGeometry(0.46, 0.28), new T.MeshStandardMaterial({ color: '#0b2a4a', emissive: '#2a7fd0', emissiveIntensity: 0.9 })); sc2.position.set(x, 1.0, z - 0.134); p.add(sc2); box(0.4, 0.02, 0.14, M('#222'), p, x, 0.79, z + 0.08); col(x - (w || 1.6) / 2, x + (w || 1.6) / 2, z - 0.4, z + 0.4); }
    function arbol(p, x, z) { cyl(0.12, 0.18, 1.6, M('#6b4a2b'), p, x, 0, z); sph(0.9, M('#3f7f3a', { roughness: 0.9 }), p, x, 2.1, z); sph(0.6, M('#4c9445'), p, x + 0.4, 2.5, z + 0.2); col(x - 0.3, x + 0.3, z - 0.3, z + 0.3); }
    function banca(p, x, z) { box(1.6, 0.08, 0.4, M('#8a5a33'), p, x, 0.42, z); box(0.08, 0.42, 0.36, M('#444'), p, x - 0.7, 0, z); box(0.08, 0.42, 0.36, M('#444'), p, x + 0.7, 0, z); col(x - 0.85, x + 0.85, z - 0.25, z + 0.25); }
    function aro(p, x, z, d) { cyl(0.06, 0.06, 3.0, M('#666', { metalness: 0.6 }), p, x, 0, z); const t = box(1.2, 0.8, 0.05, M('#ffffff'), p, x + d * 0.3, 2.6, z); t.rotation.y = Math.PI / 2; const ri = new T.Mesh(new T.TorusGeometry(0.24, 0.025, 8, 24), M('#ff6a00')); ri.rotation.x = Math.PI / 2; ri.position.set(x + d * 0.6, 2.95, z); p.add(ri); col(x - 0.2, x + 0.2, z - 0.2, z + 0.2); }
    function decorar(tema, g, cx, i) {
      if (tema === 'backrooms') { const tb = plano(3.2, 1.8, (c, w, h) => { c.fillStyle = '#0a1a3a'; c.fillRect(0, 0, w, h); c.fillStyle = '#f0c419'; c.font = '900 44px Arial Black'; c.fillText('MISIÓN APAGÓN', 30, 70); c.fillStyle = '#fff'; c.font = '600 22px Arial'; ['El colegio se quedó sin energía.', 'Recorran las 7 salas en orden: en cada una', 'encuentren la LLAVE, abran el CANDADO y armen', 'una PIEZA de su proyecto. Al final, ¡el colegio', 'vuelve a la vida y se abre la cancha!'].forEach((t, k) => c.fillText(t, 30, 115 + k * 28)); }); tb.position.set(cx, 1.7, -RL / 2 + 0.12); g.add(tb); term[0] = { x: cx, z: -RL / 2 + 1 }; for (let k = 0; k < 5; k++) { const x = cx - 4.5 + Math.random() * 9, z = -3.5 + Math.random() * 7; if (Math.abs(z) > 1.6 && libre(x - cx, z)) { const c2 = box(0.5, 0.5, 0.5, M('#9a7b45'), g, x, 0, z); c2.rotation.y = Math.random(); col(x - 0.35, x + 0.35, z - 0.35, z + 0.35); } } }
      if (tema === 'lab') { [-3.4, -0.4, 2.8].forEach(x => { mesaPC(g, cx + x, 2.6); silla(g, cx + x, 3.35, Math.PI); }); box(0.9, 0.9, 0.7, M('#2b2f36'), g, cx + 4.6, 0, -1.6); box(0.6, 0.6, 0.5, M('#f0a726'), g, cx + 4.6, 0.9, -1.6); col(cx + 4.1, cx + 5.1, -2, -1.2); box(2.4, 2.0, 0.4, M('#c8ced6'), g, cx + 2.6, 0, -4.75); col(cx + 1.4, cx + 3.8, -5, -4.5); }
      if (tema === 'pasillo') { const lk = MT(TX.lockers(), { metalness: 0.3, roughness: 0.5 }); [[-2.4, 1], [2.2, 1]].forEach(([x]) => { const l = new T.Mesh(new T.BoxGeometry(3, 2, 0.5), lk); l.position.set(cx + x, 1, RL / 2 - 0.35); g.add(l); col(cx + x - 1.5, cx + x + 1.5, RL / 2 - 0.65, RL / 2); }); const l2 = new T.Mesh(new T.BoxGeometry(2.4, 2, 0.5), lk); l2.position.set(cx + 0.6, 1, -RL / 2 + 0.35); g.add(l2); col(cx - 0.6, cx + 1.8, -RL / 2, -RL / 2 + 0.65); banca(g, cx - 1.6, 2.4); cyl(0.32, 0.32, 0.8, M('#2a7f4f'), g, cx + 3.4, 0, -2.2); col(cx + 3.0, cx + 3.8, -2.6, -1.8); }
      if (tema === 'aula') { const wb = plano(3.4, 1.2, (c, w, h) => { c.fillStyle = '#f7f9fb'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2456b8'; c.lineWidth = 5; c.strokeRect(4, 4, w - 8, h - 8); c.fillStyle = '#1b3f8a'; c.font = '700 34px Arial'; c.fillText('ENTRADA → PROCESO → SALIDA', 30, 70); c.font = '600 26px Arial'; c.fillStyle = '#c8413a'; c.fillText('LED: pata larga (+) → 220 Ω → pin', 30, 130); c.fillStyle = '#222'; c.fillText('GND = 0 V · 5V = positivo', 30, 180); }); wb.position.set(cx + 1.2, 1.55, -RL / 2 + 0.12); g.add(wb); for (let r = 0; r < 2; r++) for (let k = 0; k < 3; k++) { const x = cx - 3.2 + k * 2.6, z = 1.6 + r * 1.8; if (!libre(x - cx, z, 0.9)) continue; box(1.0, 0.05, 0.55, M('#c99a5b'), g, x, 0.72, z); box(0.9, 0.72, 0.04, M('#7a8a99'), g, x, 0, z - 0.2); silla(g, x, z + 0.5, Math.PI); col(x - 0.55, x + 0.55, z - 0.32, z + 0.32); } }
      if (tema === 'banos') { for (let k = 0; k < 3; k++) { const x = cx - 3 + k * 1.6; box(0.7, 0.2, 0.45, M('#f8fbfc'), g, x, 0.75, RL / 2 - 0.4); cyl(0.07, 0.1, 0.75, M('#e9eef0'), g, x, 0, RL / 2 - 0.4); cyl(0.02, 0.02, 0.2, M('#ccc', { metalness: 1, roughness: 0.2 }), g, x, 0.95, RL / 2 - 0.25); const mi = new T.Mesh(new T.PlaneGeometry(0.6, 0.8), new T.MeshStandardMaterial({ color: '#cfe8f2', metalness: 0.9, roughness: 0.05 })); mi.position.set(x, 1.6, RL / 2 - 0.12); mi.rotation.y = Math.PI; g.add(mi); } col(cx - 3.5, cx + 0.5, RL / 2 - 0.7, RL / 2); for (let k = 0; k < 3; k++) { const x = cx + 2.2 + k * 1.1; box(0.06, 2, 1.4, M('#5a8fa6'), g, x - 0.55, 0, -RL / 2 + 0.75); box(1.05, 2, 0.06, M('#6aa0b6'), g, x, 0, -RL / 2 + 1.45); col(x - 0.6, x + 0.55, -RL / 2, -RL / 2 + 1.55); } }
      if (tema === 'bar') { box(4.2, 1.05, 0.7, M('#8a4b25'), g, cx - 0.4, 0, RL / 2 - 1.0); box(4.4, 0.06, 0.85, M('#e7d2ad'), g, cx - 0.4, 1.05, RL / 2 - 1.0); col(cx - 2.6, cx + 1.8, RL / 2 - 1.45, RL / 2); box(0.9, 1.9, 0.7, M('#eef2f5'), g, cx + 3.4, 0, RL / 2 - 0.5); const gl = new T.Mesh(new T.PlaneGeometry(0.75, 1.5), new T.MeshStandardMaterial({ color: '#cfeeff', transparent: true, opacity: 0.45, emissive: '#bfe6ff', emissiveIntensity: 0.4 })); gl.position.set(cx + 3.4, 1.0, RL / 2 - 0.86); gl.rotation.y = Math.PI; g.add(gl); col(cx + 2.9, cx + 3.9, RL / 2 - 0.9, RL / 2);
        const mn = plano(2.4, 1.1, (c, w, h) => { c.fillStyle = '#3b2412'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd166'; c.font = '900 40px Arial Black'; c.fillText('MENÚ', 30, 55); c.fillStyle = '#fff'; c.font = '600 24px Arial'; ['Empanada ........ $0,75', 'Jugo natural ..... $0,50', 'Sánduche ......... $1,00', 'Agua ............. $0,40'].forEach((t, k) => c.fillText(t, 30, 100 + k * 34)); }); mn.position.set(cx - 0.4, 2.2, RL / 2 - 0.12); mn.rotation.y = Math.PI; g.add(mn); [[-3.2, -1.6], [3.4, -2.4]].forEach(([x, z]) => { if (!libre(x, z)) return; cyl(0.5, 0.5, 0.05, M('#d9c3a0'), g, cx + x, 0.72, z); cyl(0.05, 0.05, 0.72, M('#555'), g, cx + x, 0, z); col(cx + x - 0.5, cx + x + 0.5, z - 0.5, z + 0.5); }); }
      if (tema === 'patio') { arbol(g, cx - 3.2, 2.4); arbol(g, cx + 3.4, 2.6); banca(g, cx - 2.6, -3.0); const gr = new T.Mesh(uvS(new T.PlaneGeometry(3, 2.4), 2, 2), MT(TX.grass())); gr.rotation.x = -Math.PI / 2; gr.position.set(cx, 0.01, 2.6); g.add(gr); for (let k = 0; k < 4; k++) { cyl(0.18, 0.15, 0.35, M('#8d4e2a'), g, cx - 1.1 + k * 0.7, 0, -4.4); sph(0.22, M('#4c9445'), g, cx - 1.1 + k * 0.7, 0.5, -4.4); } col(cx - 1.4, cx + 1.3, -4.7, -4.1); }
      if (tema === 'final') { for (let k = 0; k < 4; k++) cyl(0.12, 0.12, RW, M('#7a2a1a', { metalness: 0.6, roughness: 0.4 }), g, cx, HH - 0.3 - k * 0.22, -RL / 2 + 0.3 + k * 0.2).rotation.z = Math.PI / 2; box(2.2, 2.2, 1.2, M('#3a3f45', { metalness: 0.6, roughness: 0.4 }), g, cx + 3.4, 0, -3.6); for (let k = 0; k < 6; k++) { const ld = new T.Mesh(new T.SphereGeometry(0.06, 8, 6), new T.MeshStandardMaterial({ color: '#300', emissive: k % 2 ? '#ff3b30' : '#ffd166', emissiveIntensity: 2 })); ld.position.set(cx + 2.5 + k * 0.3, 1.8, -3.0); g.add(ld); } col(cx + 2.3, cx + 4.5, -4.2, -3.0); box(1.6, 1.2, 0.8, M('#2f3439'), g, cx - 3.6, 0, 3.6); col(cx - 4.4, cx - 2.8, 3.2, 4.0); }
      if (tema === 'cancha') { aro(g, cx - RW / 2 + 0.6, 0, 1); aro(g, cx + RW / 2 - 0.6, 0, -1); for (let k = 0; k < 3; k++) box(RW - 2, 0.4, 0.6, M('#9aa5ab'), g, cx, k * 0.4, -RL / 2 + 0.4 + k * 0.6); col(cx - RW / 2, cx + RW / 2, -RL / 2, -RL / 2 + 2.0); term[8] = { x: cx + RW / 2 - 1.6, z: 0 }; }
    }
    function estacion(g, cx, i) {
      const tx = cx - 3.6, tz = -RL / 2 + 0.9, tg = new T.Group(); tg.position.set(tx, 0, tz); g.add(tg);
      box(0.9, 1.0, 0.55, M('#262b33', { metalness: 0.5, roughness: 0.4 }), tg, 0, 0, 0); const cv = document.createElement('canvas'); cv.width = 256; cv.height = 160; const ct = new T.CanvasTexture(cv); ct.colorSpace = T.SRGBColorSpace;
      const scr = new T.Mesh(new T.PlaneGeometry(0.8, 0.5), new T.MeshStandardMaterial({ map: ct, emissive: '#ffffff', emissiveMap: ct, emissiveIntensity: 0.9 })); scr.position.set(0, 1.25, 0.12); scr.rotation.x = -0.35; tg.add(scr); box(0.86, 0.56, 0.06, M('#111'), tg, 0, 0.97, 0.08).rotation.x = -0.35;
      const lk = new T.Group(); lk.position.set(0, 1.0, 0.31); tg.add(lk); box(0.22, 0.2, 0.08, M('#d4af37', { metalness: 0.9, roughness: 0.25 }), lk, 0, -0.1, 0); const sh = new T.Mesh(new T.TorusGeometry(0.075, 0.018, 8, 20, Math.PI), M('#c0c6cc', { metalness: 1, roughness: 0.2 })); sh.position.set(0, 0.1, 0); lk.add(sh);
      col(tx - 0.55, tx + 0.55, tz - 0.4, tz + 0.4); term[i] = { x: tx, z: tz + 0.4, cv, ct, lk, est: '' };
      const mx = cx + 1.4, mz = -1.0, mg = new T.Group(); mg.position.set(mx, 0, mz); g.add(mg); box(2.2, 0.06, 1.1, M('#5c636c', { metalness: 0.4, roughness: 0.5 }), mg, 0, 0.82, 0); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => box(0.06, 0.82, 0.06, M('#2b2f36'), mg, a * 1.02, 0, b * 0.48));
      box(0.62, 0.03, 0.46, M('#0b5f8a'), mg, -0.2, 0.88, 0); box(0.16, 0.03, 0.12, M('#222'), mg, -0.15, 0.91, 0.05); box(0.14, 0.06, 0.12, M('#c0c6cc', { metalness: 0.8 }), mg, -0.48, 0.88, -0.12); box(0.5, 0.04, 0.3, M('#f2f2f2'), mg, 0.55, 0.88, 0.1);
      const ring = new T.Mesh(new T.RingGeometry(1.35, 1.5, 48), new T.MeshBasicMaterial({ color: '#5fd0e8', transparent: true, opacity: 0, side: T.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.set(0, 0.02, 0); mg.add(ring);
      const lbl = cartel(ROOMS[i].ico + ' ' + ROOMS[i].pieza.toUpperCase(), { fs: 36, h: 0.3 }); lbl.position.set(0, 1.6, 0); mg.add(lbl);
      col(mx - 1.15, mx + 1.15, mz - 0.6, mz + 0.6); mesa[i] = { x: mx, z: mz, ring, lbl };
    }
    function drawTerm(i, st) { const t = term[i]; if (!t || !t.cv || t.est === st) return; t.est = st; const g = t.cv.getContext('2d'), w = 256, h = 160; const C = { cerrado: ['#2a0b0b', '#ff6b6b', '🔒 CERRADO', 'Traigan la llave'], llave: ['#2a2205', '#ffd166', '🔑 INSERTEN', 'la llave (los dos)'], abierto: ['#06210f', '#7fe0a0', '✓ ABIERTO', 'Vayan a la mesa'], hecho: ['#06210f', '#7fe0a0', '✓ COMPLETO', ROOMS[i].pieza] }[st] || ['#111', '#888', '— — —', ''];
      g.fillStyle = C[0]; g.fillRect(0, 0, w, h); g.strokeStyle = C[1]; g.lineWidth = 6; g.strokeRect(5, 5, w - 10, h - 10); g.fillStyle = C[1]; g.font = '900 30px Arial Black'; g.textAlign = 'center'; g.fillText(C[2], w / 2, 72); g.font = '600 20px Arial'; g.fillStyle = '#fff'; g.fillText(C[3], w / 2, 112); t.ct.needsUpdate = true; t.lk.visible = st !== 'abierto' && st !== 'hecho'; }
    // ---------- llave ----------
    const llave = new T.Group(); sc.add(llave); const gold = new T.MeshStandardMaterial({ color: '#e8b923', metalness: 1, roughness: 0.25, emissive: '#7a5200', emissiveIntensity: 0.6 });
    const kh = new T.Mesh(new T.TorusGeometry(0.11, 0.035, 10, 24), gold); kh.position.y = 0.2; llave.add(kh); const ks = new T.Mesh(new T.BoxGeometry(0.04, 0.32, 0.04), gold); ks.position.y = -0.04; llave.add(ks); [0, 1].forEach(k => { const t = new T.Mesh(new T.BoxGeometry(0.08, 0.035, 0.04), gold); t.position.set(0.05, -0.12 + k * 0.08, 0); llave.add(t); });
    const kgl = new T.PointLight('#ffd166', 4, 2.4, 1.5); llave.add(kgl); const halo = new T.Mesh(new T.RingGeometry(0.3, 0.42, 32), new T.MeshBasicMaterial({ color: '#ffd166', transparent: true, opacity: 0.5, side: T.DoubleSide })); halo.rotation.x = -Math.PI / 2; halo.position.y = -0.33; llave.add(halo); llave.visible = false;
    // ---------- marcador de objetivo ----------
    const mk = new T.Mesh(new T.ConeGeometry(0.22, 0.42, 4), new T.MeshStandardMaterial({ color: '#5fd0e8', emissive: '#5fd0e8', emissiveIntensity: 1.6 })); mk.rotation.x = Math.PI; sc.add(mk); mk.visible = false;
    // ---------- jugadores ----------
    function avatar(cs, cp, nm) {
      const g = new T.Group(), sk = M('#d9a77c'), s = M(cs, { roughness: 0.8 }), pt = M(cp, { roughness: 0.85 }), u = {};
      ['L', 'R'].forEach((k, j) => { const lg = new T.Group(); lg.position.set(j ? 0.11 : -0.11, 0.8, 0); g.add(lg); box(0.17, 0.74, 0.19, pt, lg, 0, -0.76, 0); box(0.19, 0.08, 0.28, M('#1b1b1b'), lg, 0, -0.8, 0.04); u['leg' + k] = lg; });
      box(0.46, 0.58, 0.27, s, g, 0, 0.8, 0); box(0.47, 0.06, 0.28, M('#0a1a3a'), g, 0, 0.8, 0); box(0.2, 0.05, 0.02, M('#fff'), g, 0, 1.3, 0.14);
      ['L', 'R'].forEach((k, j) => { const ar = new T.Group(); ar.position.set(j ? 0.3 : -0.3, 1.34, 0); g.add(ar); box(0.13, 0.36, 0.15, s, ar, 0, -0.36, 0); box(0.11, 0.24, 0.12, sk, ar, 0, -0.6, 0); u['arm' + k] = ar; });
      box(0.12, 0.08, 0.12, sk, g, 0, 1.38, 0); sph(0.17, sk, g, 0, 1.6, 0); const hr = new T.Mesh(new T.SphereGeometry(0.18, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), M('#2a1a10')); hr.position.set(0, 1.62, -0.01); g.add(hr);
      [-0.06, 0.06].forEach(x => sph(0.022, M('#111'), g, x, 1.62, 0.155));
      const sd = new T.Mesh(new T.CircleGeometry(0.34, 24), new T.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.32, depthWrite: false })); sd.rotation.x = -Math.PI / 2; sd.position.y = 0.012; g.add(sd);
      const tg = cartel(nm, { fs: 40, h: 0.2, bg: cs }); tg.position.y = 2.0; g.add(tg); g.userData = u; sc.add(g); return g;
    }
    const P = [avatar('#2456b8', '#1b2a44', 'J1'), avatar('#c8413a', '#2a1b1b', 'J2')], pv = [{ x: -3.5, z: -0.7, a: 0, ph: 0 }, { x: -3.5, z: 0.7, a: 0, ph: 0 }];
    const KEYS = [{ u: 'KeyW', d: 'KeyS', l: 'KeyA', r: 'KeyD', a: 'KeyE' }, { u: 'ArrowUp', d: 'ArrowDown', l: 'ArrowLeft', r: 'ArrowRight', a: 'Enter' }];
    let keys = {}, paused = false, W = { est: 1, fase: 'llave', abiertas: 0, keySpot: 0, libre: false }, yaw = 0, dist = 5.2, camP = new T.Vector3(-10, 3, 0), near = null, nearK = '', roomNow = -1, lastToast = 0;
    const enArea = (x, z) => walk.find(w => x >= w.r[0] && x <= w.r[1] && z >= w.r[2] && z <= w.r[3] && (w.door == null || W.abiertas > w.door));
    const libreP = (x, z) => enArea(x, z) && !cols.some(c => x > c[0] - 0.28 && x < c[1] + 0.28 && z > c[2] - 0.28 && z < c[3] + 0.28);
    const roomOf = x => Math.max(0, Math.min(NR - 1, Math.round(x / SP)));
    const kd = e => { const t = e.target; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return; if (paused) return; if (/^Arrow|^Key[WASDE]$|^Enter$|^Space$/.test(e.code)) e.preventDefault(); if (!keys[e.code] && (e.code === 'KeyE' || e.code === 'Enter') && near) { const who = e.code === 'KeyE' ? 0 : 1; if (!near.both || near.ok) o.onAccion && o.onAccion(near, who); else o.onToast && o.onToast(near.falta); } keys[e.code] = true; };
    const ku = e => { keys[e.code] = false; };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    let drag = null; const cv = ren.domElement;
    cv.addEventListener('pointerdown', e => { drag = { x: e.clientX, y0: yaw }; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e => { if (drag) yaw = drag.y0 + (e.clientX - drag.x) * 0.006; });
    cv.addEventListener('pointerup', () => { drag = null; }); cv.addEventListener('contextmenu', e => e.preventDefault());
    cv.addEventListener('wheel', e => { e.preventDefault(); dist = Math.max(3.2, Math.min(9, dist + Math.sign(e.deltaY) * 0.5)); }, { passive: false });
    function aplicar() {
      doors.forEach(d => { const op = W.abiertas > d.i; d.lm.emissive.set(op ? '#2ee86d' : '#ff2a2a'); d.target = op ? 1 : 0; });
      for (let i = 1; i <= 7; i++) { const st = i < W.est ? 'hecho' : i > W.est ? 'cerrado' : W.fase === 'llave' ? 'cerrado' : W.fase === 'lock' ? 'llave' : 'abierto'; drawTerm(i, st); }
      const ks = keySpots[W.est]; llave.visible = W.est >= 1 && W.est <= 7 && W.fase === 'llave'; if (ks) { const [x, z] = ks[W.keySpot % ks.length]; llave.position.set(x, 0.42, z); }
    }
    function objetivo() { const r = roomOf((pv[0].x + pv[1].x) / 2); if (W.est > 7) return term[8] ? new T.Vector3(term[8].x, 2.6, term[8].z) : null; if (r < W.est || r === 0) { const d = doors[Math.max(r, 0)]; return d ? new T.Vector3(d.x, 3.4, 0) : null; } if (r > W.est) return null; if (W.fase === 'lock') return new T.Vector3(term[r].x, 2.3, term[r].z); if (W.fase === 'pieza') return new T.Vector3(mesa[r].x, 2.4, mesa[r].z); return null; }
    function cercania() {
      const r = roomOf((pv[0].x + pv[1].x) / 2), d = (p, x, z) => Math.hypot(p.x - x, p.z - z), both = (x, z, R) => { const a = d(pv[0], x, z) < R, b = d(pv[1], x, z) < R; return { ok: a && b, uno: a || b }; };
      let n = null;
      if (llave.visible && roomOf(llave.position.x) === r) { const a = d(pv[0], llave.position.x, llave.position.z), b = d(pv[1], llave.position.x, llave.position.z); if (Math.min(a, b) < 1.25) n = { tipo: 'llave', room: r, both: false, ok: true }; o.onKeyDist && o.onKeyDist(Math.min(a, b)); } else o.onKeyDist && o.onKeyDist(null);
      if (!n && r >= 1 && r <= 7 && r === W.est && W.fase === 'lock') { const b = both(term[r].x, term[r].z, 2.3); if (b.uno) n = { tipo: 'terminal', room: r, both: true, ok: b.ok, falta: 'El candado necesita a los DOS jugadores junto a la terminal.' }; }
      if (!n && r >= 1 && r <= 7 && r === W.est && W.fase === 'pieza') { const b = both(mesa[r].x, mesa[r].z, 2.4); if (b.uno) n = { tipo: 'mesa', room: r, both: true, ok: b.ok, falta: 'La mesa de trabajo necesita a los DOS jugadores.' }; }
      if (!n && r === 0 && term[0]) { const b = both(term[0].x, term[0].z, 2.4); if (b.uno) n = { tipo: 'tablero', room: 0, both: false, ok: true }; }
      if (!n && r === 8 && term[8]) { const b = both(term[8].x, term[8].z, 2.8); if (b.uno) n = { tipo: 'cancha', room: 8, both: false, ok: true }; }
      const k = n ? n.tipo + n.ok : ''; if (k !== nearK) { nearK = k; near = n; o.onNear && o.onNear(n); }
      if (r !== roomNow) { roomNow = r; o.onRoom && o.onRoom(r); const th = TH[ROOMS[r].tema]; sc.fog.color.set(th.fog); sc.fog.near = th.open ? 18 : 9; sc.fog.far = th.open ? 60 : 30; sc.background = new T.Color(th.open ? th.sky : th.fog); sun.intensity = th.open ? 2.4 : 0; hemi.intensity = th.open ? 1.2 : 0.75; L1.color.set(th.luz); L2.color.set(th.luz); }
    }
    let t0 = performance.now(), raf = 0, tt = 0;
    function loop() {
      raf = requestAnimationFrame(loop); const now = performance.now(), dt = Math.min(0.05, (now - t0) / 1000); t0 = now; tt += dt;
      const f = new T.Vector3(Math.cos(yaw), 0, Math.sin(yaw)), rt = new T.Vector3(-Math.sin(yaw), 0, Math.cos(yaw));
      if (!paused) pv.forEach((p, j) => { const K = KEYS[j], fw = (keys[K.u] ? 1 : 0) - (keys[K.d] ? 1 : 0), sd = (keys[K.r] ? 1 : 0) - (keys[K.l] ? 1 : 0); let vx = f.x * fw + rt.x * sd, vz = f.z * fw + rt.z * sd; const L = Math.hypot(vx, vz); const A = P[j];
        if (L > 0) { vx /= L; vz /= L; const sp = 3.3 * dt, nx = p.x + vx * sp, nz = p.z + vz * sp, q = pv[1 - j], sep = Math.hypot(nx - q.x, nz - q.z);
          if (sep > 7.5 && sep > Math.hypot(p.x - q.x, p.z - q.z)) { if (now - lastToast > 4000) { lastToast = now; o.onToast && o.onToast('¡No se separen! Son un equipo: avancen juntos.'); } }
          else { if (libreP(nx, p.z)) p.x = nx; if (libreP(p.x, nz)) p.z = nz; } const ta = Math.atan2(vx, vz); let da = ta - p.a; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI; p.a += da * Math.min(1, dt * 12); p.ph += dt * 10; }
        else p.ph *= 0.85;
        A.position.set(p.x, 0, p.z); A.rotation.y = p.a; const sw = L > 0 ? Math.sin(p.ph) * 0.6 : 0, u = A.userData; u.legL.rotation.x = sw; u.legR.rotation.x = -sw; u.armL.rotation.x = -sw * 0.8; u.armR.rotation.x = sw * 0.8; A.position.y = L > 0 ? Math.abs(Math.sin(p.ph)) * 0.04 : 0; });
      const mid = new T.Vector3((pv[0].x + pv[1].x) / 2, 0, (pv[0].z + pv[1].z) / 2), spr = Math.hypot(pv[0].x - pv[1].x, pv[0].z - pv[1].z), dd = dist + spr * 0.35;
      const want = new T.Vector3(mid.x - f.x * dd, 1.9 + dd * 0.22, mid.z - f.z * dd), ar = enArea(mid.x, mid.z), r = roomOf(mid.x), th = TH[ROOMS[r].tema];
      if (ar) { want.x = Math.max(ar.r[0] + 0.05, Math.min(ar.r[1] - 0.05, want.x)); want.z = Math.max(ar.r[2] - 0.1, Math.min(ar.r[3] + 0.1, want.z)); if (ar.door != null) { want.x = Math.max(ar.r[0] - 4, want.x); } }
      if (!th.open || (ar && ar.door != null)) want.y = Math.min(HH - 0.3, want.y);
      camP.lerp(want, Math.min(1, dt * 5)); cam.position.copy(camP); cam.lookAt(mid.x + f.x * 1.2, 1.05, mid.z + f.z * 1.2);
      L1.position.set(r * SP, HH - 0.4, 0); L2.position.set(r * SP + (mid.x > r * SP ? 8 : -8), HH - 0.4, 0);
      lamps.forEach(lp => { if (!lp.flick) return; const k = Math.random() < 0.012 ? 0.15 : 1; lp.pm.emissiveIntensity += (lp.base * k - lp.pm.emissiveIntensity) * 0.5; });
      if (TH[ROOMS[r].tema].flick) L1.intensity = 24 * (0.85 + Math.random() * 0.15 * (Math.random() < 0.02 ? -3 : 1)); else L1.intensity = 24;
      doors.forEach(d => { d.open += ((d.target || 0) - d.open) * Math.min(1, dt * 3); d.A.position.z = -0.59 - d.open * 1.15; d.B.position.z = 0.59 + d.open * 1.15; });
      if (llave.visible) { llave.rotation.y += dt * 2; llave.position.y = 0.45 + Math.sin(tt * 3) * 0.06; halo.material.opacity = 0.35 + Math.sin(tt * 4) * 0.2; }
      for (let i = 1; i <= 7; i++) if (mesa[i]) { mesa[i].ring.material.opacity = i === W.est && W.fase === 'pieza' ? 0.5 + Math.sin(tt * 4) * 0.3 : 0; if (term[i].lk.visible) term[i].lk.rotation.y = i === W.est && W.fase === 'lock' ? Math.sin(tt * 3) * 0.4 : 0; }
      const ob = objetivo(); mk.visible = !!ob; if (ob) { mk.position.set(ob.x, ob.y + Math.sin(tt * 3) * 0.12, ob.z); mk.rotation.y += dt * 2; }
      cercania(); ren.render(sc, cam);
    }
    const API = {
      resize() { const w = cont.clientWidth || 800, h = cont.clientHeight || 600; ren.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); },
      setMundo(m) { W = Object.assign({}, W, m); aplicar(); nearK = '#'; },
      spawn(room) { const x = room * SP - 1.6; pv[0].x = x; pv[0].z = -0.8; pv[1].x = x; pv[1].z = 0.8; pv.forEach(p => { p.a = Math.PI / 2; }); yaw = 0; camP.set(x - 4, 2.8, 0); },
      pausa(b) { paused = !!b; keys = {}; },
      destruir() { cancelAnimationFrame(raf); window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); ro.disconnect(); ren.dispose(); if (cv.parentNode) cv.parentNode.removeChild(cv); }
    };
    const ro = new ResizeObserver(() => API.resize()); ro.observe(cont); API.resize(); aplicar(); loop(); setTimeout(() => API.resize(), 200);
    return API;
  }
  window.RUTA_ESCENA = { crear };
})();
