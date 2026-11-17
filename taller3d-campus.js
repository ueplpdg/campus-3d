// Campus 3D de la U. E. P. «La Providencia»: distribución real (cancha, bloques, graderío, muro de piedra, ciudad).
(function () {
  const H2 = Math.PI / 2;
  const EST = {
    lab: { x: -13.5, z: -16.2, r: 0, w: 11, alto: 3.4, sy: 3.05, sz: 3.6, emb: true },
    labb: { x: 0, z: -16.2, r: 0, w: 11, alto: 3.4, sy: 3.05, sz: 3.6, emb: true },
    aula: { x: 13.5, z: -16.2, r: 0, w: 11, alto: 3.4, sy: 3.05, sz: 3.6, emb: true },
    bar: { x: -25, z: -9.6, r: H2, w: 11, alto: 3.4, sy: 3.05, sz: 3.6, emb: true },
    bano: { x: -25, z: 3.2, r: H2, w: 11, alto: 3.4, sy: 3.05, sz: 3.6, emb: true },
    pasillo: { x: 23.2, z: -3.6, r: -H2, w: 11, alto: 3.4, sy: 3.05, sz: 3.6, emb: true },
    patio: { x: 0, z: 9.0, r: Math.PI, w: 16, sin: true, sy: 4.6, sz: -1.2 }
  };
  const PROY = { cerradura: ['labb', -3.8, -3.3], templab: ['labb', 3.8, -3.3], riego: ['patio', -11, 0.35], basurero: ['patio', 0, 0.35], solar: ['patio', 11, 0.35] };

  function build(H) {
    const { T, sc, colis, cartel } = H;
    const M = (c, o) => new T.MeshLambertMaterial(Object.assign({ color: c }, o || {}));
    const mesh = (g, m, x, y, z, par, sh) => { const o = new T.Mesh(g, m); o.position.set(x, y, z); if (sh) { o.castShadow = true; o.receiveShadow = true; } (par || sc).add(o); return o; };
    const B = (w, h, d, m, x, y, z, sh) => mesh(new T.BoxGeometry(w, h, d), typeof m === 'string' ? M(m) : m, x, y + h / 2, z, sc, sh);
    const C = (x1, x2, z1, z2) => colis.push([Math.min(x1, x2), Math.max(x1, x2), Math.min(z1, z2), Math.max(z1, z2)]);
    const tex = (w, h, f, rep) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; f(cv.getContext('2d'), w, h); const t = new T.CanvasTexture(cv); t.colorSpace = T.SRGBColorSpace; if (rep) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; };
    const fachada = (cols, pisos, base, marco) => tex(cols * 64, pisos * 64, (c, w, h) => { c.fillStyle = base; c.fillRect(0, 0, w, h); for (let p = 0; p < pisos; p++) for (let i = 0; i < cols; i++) { const x = i * 64 + 10, y = p * 64 + 14; c.fillStyle = marco; c.fillRect(x - 3, y - 3, 50, 38); c.fillStyle = '#cfe9f4'; c.fillRect(x, y, 44, 32); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(x + 4, y + 3, 10, 26); } });
    let sd = 777; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };

    // Suelo, patio y cancha
    mesh(new T.PlaneGeometry(260, 260), M('#7e8a6a'), 0, -0.05, 0).rotation.x = -H2;
    const piso = mesh(new T.PlaneGeometry(52, 34), M('#c9c4ba'), 0, -0.02, -3); piso.rotation.x = -H2; piso.receiveShadow = true;
    const cancha = mesh(new T.PlaneGeometry(32, 17), new T.MeshLambertMaterial({ map: tex(1024, 544, (c, w, h) => {
      c.fillStyle = '#6d8fb5'; c.fillRect(0, 0, w, h); c.fillStyle = '#b64f5d'; c.fillRect(0, 0, w, h * 0.17); c.fillRect(0, h * 0.83, w, h * 0.17);
      c.fillStyle = '#5c8a6c'; c.beginPath(); c.arc(0, h / 2, h * 0.36, -H2, H2); c.fill(); c.beginPath(); c.arc(w, h / 2, h * 0.36, H2, Math.PI * 1.5); c.fill();
      c.fillStyle = '#b64f5d'; c.beginPath(); c.arc(w / 2, h / 2, h * 0.13, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#f4f4f4'; c.lineWidth = 5; c.strokeRect(8, 8, w - 16, h - 16); c.beginPath(); c.moveTo(w / 2, 8); c.lineTo(w / 2, h - 8); c.stroke();
      c.beginPath(); c.arc(w / 2, h / 2, h * 0.13, 0, Math.PI * 2); c.stroke(); c.strokeRect(8, h * 0.3, w * 0.1, h * 0.4); c.strokeRect(w - 8 - w * 0.1, h * 0.3, w * 0.1, h * 0.4);
      c.beginPath(); c.arc(8, h / 2, h * 0.36, -H2, H2); c.stroke(); c.beginPath(); c.arc(w - 8, h / 2, h * 0.36, H2, Math.PI * 1.5); c.stroke(); }) }), 0, 0.005, -0.3);
    cancha.rotation.x = -H2; cancha.receiveShadow = true;
    // Arcos de fútbol (sobre la línea de fondo) y tableros de básquet
    [-1, 1].forEach(s => { const gx = s * 15.6, bl = M('#f4f4f4');
      [-1.5, 1.5].forEach(z => { mesh(new T.CylinderGeometry(0.07, 0.07, 2.1, 8), bl, gx, 1.05, z - 0.3, sc, true); C(gx - 0.15, gx + 0.15, z - 0.45, z - 0.15); });
      mesh(new T.CylinderGeometry(0.07, 0.07, 3.1, 8), bl, gx, 2.1, -0.3).rotation.x = H2;
      const red = mesh(new T.PlaneGeometry(3.0, 2.1), new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.25, side: T.DoubleSide }), gx + s * 0.6, 1.05, -0.3); red.rotation.y = H2;
      const px = s * 17.4; mesh(new T.CylinderGeometry(0.1, 0.1, 3.4, 8), M('#2f3b44'), px, 1.7, -0.3, sc, true); C(px - 0.2, px + 0.2, -0.5, -0.1);
      B(1.5, 0.12, 0.12, '#2f3b44', px - s * 0.75, 3.3, -0.3); B(0.08, 1.05, 1.7, '#f4f4f4', px - s * 1.5, 2.8, -0.3);
      const aro = mesh(new T.TorusGeometry(0.24, 0.025, 6, 16), M('#e0562e'), px - s * 1.82, 3.05, -0.3); aro.rotation.x = H2; });

    const F_ = (n0, fp) => { if (H.fade) H.fade(sc.children.slice(n0).filter(m => m.isMesh), fp); }; let n0 = sc.children.length;
    // Bloques con aulas en planta baja (cortes abiertos hacia el patio)
    const azul = M('#7fc3dc'), azulO = M('#2f8fc0'), crema = M('#eadcb8'), vidrio = M('#a6e0f0', { transparent: true, opacity: 0.8 });
    const fN = new T.MeshLambertMaterial({ map: fachada(14, 2, '#86cde3', '#2f8fc0') });
    // Norte: 3 pisos. Planta baja = Laboratorio · Lab zona B · Aula
    B(41, 7, 9, [azul, azul, azul, azul, fN, azul], 0, 3.5, -16.4); C(-20.5, 20.5, -20.9, -20.5);
    [[-20, -19], [-8, -5.5], [5.5, 8], [19, 20.5]].forEach(([a, b]) => { B(b - a, 3.5, 9, azul, (a + b) / 2, 0, -16.4); C(a, b, -20.9, -11.9); });
    B(41, 3.5, 0.3, azul, 0, 0, -20.8);
    [3.5, 7.0, 10.5].forEach(y => B(41, 0.3, 2.4, azulO, 0, y - 0.3, -10.7));
    [3.5, 7.0].forEach(y => { B(41, 1.0, 0.08, vidrio, 0, y, -9.55); B(41, 0.12, 0.16, azulO, 0, y + 1.0, -9.55); });
    for (let x = -20; x <= 20; x += 4) { B(0.45, 10.5, 0.45, '#dff3fa', x, 0, -9.75, true); C(x - 0.25, x + 0.25, -10, -9.5); }
    [[-0.34, -12.2], [0.34, -16.8]].forEach(([rx, z]) => { B(41.6, 0.22, 5, '#a8423a', 0, 11.1, z).rotation.x = rx; });
    B(41, 0.9, 0.3, '#e8c547', 0, 10.5, -9.6);
    const sg = mesh(new T.PlaneGeometry(22, 0.8), new T.MeshBasicMaterial({ map: tex(1600, 58, (c, w, h) => { c.fillStyle = '#e8c547'; c.fillRect(0, 0, w, h); c.fillStyle = '#1f2a6b'; c.font = '800 40px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('UNIDAD EDUCATIVA PARTICULAR «LA PROVIDENCIA»', w / 2, h / 2 + 2); }) }), 0, 10.95, -9.43);
    // Escalera al extremo este
    for (let i = 0; i < 12; i++) B(2.2, 0.3 * (i + 1), 0.42, '#b9c6cc', 21.9, 0, -14.6 + i * 0.4); C(20.7, 23.1, -14.9, -9.9);
    F_(n0, [-20.5, 23.1, -21, -9.4]); n0 = sc.children.length;
    // Oeste: 3 pisos. Planta baja = Bar · Baños
    const fO = new T.MeshLambertMaterial({ map: fachada(7, 2, '#86cde3', '#2f8fc0') });
    B(9, 7, 29, [fO, azul, azul, azul, azul, azul], -25, 3.5, -3.5); B(0.3, 3.5, 29, azul, -29.4, 0, -3.5);
    [[-18, -15.1], [-4.1, -2.3], [8.7, 11]].forEach(([a, b]) => { B(9, 3.5, b - a, azul, -25, 0, (a + b) / 2); C(-29.5, -20.4, a, b); });
    C(-29.8, -29.3, -18, 11);
    [3.5, 7.0].forEach(y => { B(2.2, 0.3, 29, azulO, -19.4, y - 0.3, -3.5); B(0.08, 1.0, 29, vidrio, -18.35, y, -3.5); });
    [3.5, 7.0, 10.5].forEach((y, k) => { if (k === 2) B(9.6, 0.22, 30, '#a8423a', -25, y + 0.6, -3.5); });
    F_(n0, [-29.5, -18.3, -18, 11]); n0 = sc.children.length;
    // Este: 2 pisos (celeste abajo, crema arriba). Planta baja = Pasillo
    const fE = new T.MeshLambertMaterial({ map: fachada(6, 1, '#eadcb8', '#b9a47a') });
    B(8, 3.3, 22, [crema, fE, crema, crema, crema, crema], 23.4, 3.5, 1);
    [[-10, -9.1], [1.9, 12]].forEach(([a, b]) => { B(8, 3.5, b - a, azul, 23.4, 0, (a + b) / 2); C(19.4, 27.4, a, b); });
    B(0.3, 3.5, 22, azul, 27.3, 0, 1); C(27.1, 27.6, -10, 12);
    B(8.6, 0.2, 23, '#c9573f', 23.4, 6.9, 1).rotation.z = 0.12;

    F_(n0, [19.4, 27.4, -10, 12]); n0 = sc.children.length;
    // Muro de piedra con macetas y graderío techado (sur)
    const piedra = new T.MeshLambertMaterial({ map: tex(512, 128, (c, w, h) => { c.fillStyle = '#6f6d69'; c.fillRect(0, 0, w, h); let y = 0; while (y < h) { const rh = 14 + rnd() * 12; let x = -rnd() * 30; while (x < w) { const rw = 22 + rnd() * 30, v = 95 + rnd() * 60 | 0; c.fillStyle = 'rgb(' + v + ',' + (v - 4) + ',' + (v - 10) + ')'; c.fillRect(x + 2, y + 2, rw - 3, rh - 3); x += rw; } y += rh; } }, [5, 1]) });
    B(40, 3.2, 1, piedra, 0, 0, 10); C(-20, 20, 9.5, 10.5);
    for (let i = 0; i < 5; i++) B(40, 0.45 * (i + 1), 0.75, i % 2 ? '#3a78ad' : '#4a8cc4', 0, 3.2, 10.9 + i * 0.75);
    for (let x = -18; x <= 18; x += 6) { B(0.18, 3.8, 0.18, '#dcdcdc', x, 3.2, 10.35); B(0.18, 1.6, 0.18, '#dcdcdc', x, 5.4, 14.3); }
    B(41, 0.16, 4.9, M('#d9774a', { transparent: true, opacity: 0.55 }), 0, 6.9, 12.4).rotation.x = -0.13;
    for (let x = -18; x <= 18; x += 3) { if (Math.abs(x) < 2 || Math.abs(Math.abs(x) - 11) < 2) continue; B(0.5, 0.4, 0.5, '#caa24a', x, 3.2, 9.8); mesh(new T.SphereGeometry(0.35, 8, 6), M('#4f8a3c'), x, 3.85, 9.8); }
    F_(n0, [-21, 21, 5.8, 16]);
    // Ingreso principal (esquina sureste) y árboles
    B(0.4, 3.0, 0.4, '#1f2a6b', 21, 0, 12.5); B(0.4, 3.0, 0.4, '#1f2a6b', 25, 0, 12.5); B(4.4, 0.5, 0.4, '#1f2a6b', 23, 3.0, 12.5);
    const ing = cartel('INGRESO', { fs: 44, h: 0.4, bg: '#1f2a6b' }); ing.position.set(23, 3.9, 12.75); sc.add(ing);
    [[-27, 14], [27, 15], [-33, -6], [33, -2], [-10, 18], [10, 18]].forEach(([x, z]) => { mesh(new T.CylinderGeometry(0.2, 0.28, 2, 8), M('#7a5230'), x, 1, z, sc, true); mesh(new T.SphereGeometry(1.6, 12, 10), M('#3f8f3a'), x, 2.9, z, sc, true); });
    // Ciudad alrededor
    const techos = ['#b5473a', '#c65a3c', '#a8423a', '#d06f45'], muros = ['#e9e1d0', '#d8cdb8', '#f1ece2', '#cfd8dc', '#e6c9a8', '#b7c9d6'];
    for (let i = 0; i < 140; i++) { const a = rnd() * Math.PI * 2, d = 40 + rnd() * 70, x = Math.cos(a) * d, z = Math.sin(a) * d * 0.85 - 3;
      if (Math.abs(x) < 36 && z > -26 && z < 22) continue; const w = 5 + rnd() * 6, dd = 5 + rnd() * 6, alt = 3 + (rnd() * 3 | 0) * 3;
      B(w, alt, dd, muros[rnd() * muros.length | 0], x, 0, z); const tt = mesh(new T.ConeGeometry(Math.max(w, dd) * 0.72, 1.8, 4), M(techos[rnd() * techos.length | 0]), x, alt + 0.9, z); tt.rotation.y = Math.PI / 4; }
    [[-150, -140, 40], [-40, -170, 55], [70, -160, 48], [160, -110, 42], [-170, -30, 38]].forEach(([x, z, hh]) => mesh(new T.ConeGeometry(hh * 1.6, hh, 7), M('#6b7a4c'), x, hh / 2 - 2, z));
    // Luz interior de cada aula
    Object.keys(EST).forEach(k => { const E = EST[k]; if (!E.emb) return; const L = new T.PointLight('#fff2dc', 1.6, 12, 1.4); const lx = E.x + Math.sin(E.r) * -0.5, lz = E.z + Math.cos(E.r) * -0.5; L.position.set(lx, 3.0, lz); sc.add(L); window.T3D_CAMPUS.luces[k] = L; });
    // Mapa del campus (cartel junto al ingreso)
    const mp = cartel('🗺 LAB · LAB B · AULA (norte) · BAR · BAÑOS (oeste) · PASILLO (este) · PATIO (sur)', { fs: 26, h: 0.34, bg: 'rgba(10,26,58,.9)' }); mp.position.set(0, 0.9, 8.4); sc.add(mp);
  }
  window.T3D_CAMPUS = { EST, PROY, build, luces: {} };
})();
