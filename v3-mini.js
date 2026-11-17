// Minijuegos 2.5D en la cancha: fútbol, penales, básquet, tenis y paintball (2 jugadores, 1 teclado).
(function () {
  const ISO = [13, 15, 15], nI = Math.hypot(ISO[0], ISO[2]), F = [-ISO[0] / nI, -ISO[2] / nI], Rr = [ISO[2] / nI, -ISO[0] / nI];
  const K1 = { u: 'KeyW', d: 'KeyS', l: 'KeyA', r: 'KeyD', a: 'KeyE', b: 'KeyQ', c: 'KeyF' }, K2 = { u: 'ArrowUp', d: 'ArrowDown', l: 'ArrowLeft', r: 'ArrowRight', a: 'Enter', b: 'ShiftRight', c: 'Slash' };
  const dirK = (keys, K) => { const f = (keys[K.u] ? 1 : 0) - (keys[K.d] ? 1 : 0), s = (keys[K.r] ? 1 : 0) - (keys[K.l] ? 1 : 0); if (!f && !s) return null; const x = F[0] * f + Rr[0] * s, z = F[1] * f + Rr[1] * s, n = Math.hypot(x, z); return [x / n, z / n]; };
  const legs = (P, t, on) => { P.children[2].rotation.x = on ? Math.sin(t * 11) * 0.45 : P.children[2].rotation.x * 0.8; P.children[3].rotation.x = on ? -Math.sin(t * 11) * 0.45 : P.children[3].rotation.x * 0.8; };
  function base(o, foco) { const C = { foco, objs: [], H: null, a: 0, b: 0, fin: false, msg: '', hud() { o.onHud && o.onHud({ a: C.a, b: C.b, msg: C.msg, extra: C.extra || '' }); },
    add(m) { C.objs.push(m); return m; }, destroy() { C.objs.forEach(m => m.parent && m.parent.remove(m)); if (C.H) { C.H.yo.position.set(-0.9, 0, 3); C.H.yo2.position.set(0.9, 0, 3); } }, terminar(t) { if (C.fin) return; C.fin = true; C.msg = t; C.hud(); setTimeout(() => o.onEnd && o.onEnd({ a: C.a, b: C.b, msg: t }), 1800); } }; return C; }
  const bola = (H, C, r, col) => { const m = new H.T.Mesh(new H.T.SphereGeometry(r, 20, 14), new H.T.MeshStandardMaterial({ color: col, roughness: 0.5 })); m.castShadow = true; H.sc.add(m); return C.add(m); };

  // ---------- FÚTBOL 1 vs 1 ----------
  function futbol(o) {
    const C = base(o, [0, -0.3, 11]); let B, v = [0, 0], cool = [0, 0], pausaG = 0;
    const X0 = -15.4, X1 = 15.4, Z0 = -8.4, Z1 = 7.8, GZ = [-1.8, 1.2];
    C.init = H => { C.H = H; B = bola(H, C, 0.24, '#ffffff'); H.yo.position.set(-5, 0, -0.3); H.yo2.position.set(5, 0, -0.3); H.yo.rotation.y = Math.PI / 2; H.yo2.rotation.y = -Math.PI / 2; B.position.set(0, 0.24, -0.3); C.msg = 'Primero en anotar 3 goles · J1 ataca a la derecha'; C.extra = 'Patear: J1 E · J2 ENTER'; C.hud(); };
    const reset = () => { B.position.set(0, 0.24, -0.3); v = [0, 0]; C.H.yo.position.set(-5, 0, -0.3); C.H.yo2.position.set(5, 0, -0.3); pausaG = 1.2; };
    const patear = k => { if (cool[k] > 0 || C.fin) return; const P = k ? C.H.yo2 : C.H.yo, dx = B.position.x - P.position.x, dz = B.position.z - P.position.z, d = Math.hypot(dx, dz); if (d > 1.15) return; cool[k] = 0.35; const ang = P.rotation.y, sp = 13; v = [Math.sin(ang) * sp * 0.7 + dx / d * sp * 0.3, Math.cos(ang) * sp * 0.7 + dz / d * sp * 0.3]; };
    C.key = c => { if (c === K1.a) patear(0); if (c === K2.a) patear(1); };
    C.update = (dt, t, keys) => { if (C.fin) return; cool = cool.map(x => x - dt); if (pausaG > 0) { pausaG -= dt; return; }
      [[C.H.yo, K1], [C.H.yo2, K2]].forEach(([P, K]) => { const d = dirK(keys, K); legs(P, t, !!d); if (!d) return; P.position.x = Math.max(X0 - 0.5, Math.min(X1 + 0.5, P.position.x + d[0] * 5.4 * dt)); P.position.z = Math.max(Z0, Math.min(Z1, P.position.z + d[1] * 5.4 * dt)); P.rotation.y = Math.atan2(d[0], d[1]);
        const dx = B.position.x - P.position.x, dz = B.position.z - P.position.z, dd = Math.hypot(dx, dz); if (dd < 0.6) { v[0] += dx / (dd || 1) * 2.5; v[1] += dz / (dd || 1) * 2.5; } });
      B.position.x += v[0] * dt; B.position.z += v[1] * dt; v = v.map(x => x * Math.pow(0.45, dt)); B.rotation.z -= v[0] * dt * 3; B.rotation.x += v[1] * dt * 3;
      const enArco = B.position.z > GZ[0] && B.position.z < GZ[1];
      if (B.position.x > X1 + 0.2 && enArco) { C.a++; C.msg = '¡GOOOL de J1!'; C.hud(); if (C.a >= 3) return C.terminar('¡Gana J1 ' + C.a + ' a ' + C.b + '!'); return reset(); }
      if (B.position.x < X0 - 0.2 && enArco) { C.b++; C.msg = '¡GOOOL de J2!'; C.hud(); if (C.b >= 3) return C.terminar('¡Gana J2 ' + C.b + ' a ' + C.a + '!'); return reset(); }
      if (B.position.x > X1 || B.position.x < X0) { v[0] = -v[0] * 0.7; B.position.x = Math.max(X0, Math.min(X1, B.position.x)); }
      if (B.position.z > Z1 || B.position.z < Z0) { v[1] = -v[1] * 0.7; B.position.z = Math.max(Z0, Math.min(Z1, B.position.z)); } };
    return C;
  }

  // ---------- PENALES ----------
  function penales(o) {
    const C = base(o, [11, -0.3, 6]); let B, turno = 0, n = [0, 0], fase = 'apunta', aim = 0, ad = 1, tv = 0, dest = null, tiro = null, buzo = 0;
    const GX = 15.6, PZ = -0.3;
    const colocar = () => { const S = turno ? C.H.yo2 : C.H.yo, A = turno ? C.H.yo : C.H.yo2; S.position.set(8.6, 0, PZ); S.rotation.y = Math.PI / 2; A.position.set(GX - 0.4, 0, PZ); A.rotation.y = -Math.PI / 2; B.position.set(9.4, 0.24, PZ); fase = 'apunta'; buzo = 0; dest = null;
      C.msg = 'Patea J' + (turno + 1) + ' (' + (turno ? 'ENTER' : 'E') + ') · Ataja J' + (2 - turno) + ' con ' + (turno ? '← →' : 'A D') + ' justo al patear'; C.extra = 'Tiros: J1 ' + n[0] + '/5 · J2 ' + n[1] + '/5'; C.hud(); };
    C.init = H => { C.H = H; B = bola(H, C, 0.24, '#ffffff'); const m = C.add(new H.T.Mesh(new H.T.SphereGeometry(0.12, 10, 8), new H.T.MeshBasicMaterial({ color: '#ffd23f' }))); H.sc.add(m); C.mira = m; colocar(); };
    C.key = c => { if (fase !== 'apunta' || C.fin) return; if ((turno === 0 && c === K1.a) || (turno === 1 && c === K2.a)) { fase = 'vuela'; tv = 0; tiro = aim; const kk = turno ? K1 : K2, keys = C.keys || {}; buzo = keys[kk.l] ? -1 : keys[kk.r] ? 1 : 0; } };
    C.update = (dt, t, keys) => { C.keys = keys; if (C.fin) return; const A = turno ? C.H.yo : C.H.yo2;
      if (fase === 'apunta') { aim += ad * dt * 1.6; if (Math.abs(aim) > 1) ad = -ad; C.mira.position.set(GX, 0.9, PZ + aim * 1.35); }
      if (fase === 'vuela') { tv += dt; const k = Math.min(1, tv / 0.55); B.position.x = 9.4 + (GX - 9.4) * k; B.position.z = PZ + tiro * 1.35 * k; B.position.y = 0.24 + Math.sin(k * Math.PI) * 0.5; A.position.z = PZ + buzo * Math.min(1, tv * 3) * 1.1; A.rotation.z = -buzo * Math.min(1, tv * 3) * 0.9;
        if (k >= 1) { const ataja = Math.abs((PZ + tiro * 1.35) - A.position.z) < 0.75; if (!ataja && Math.abs(tiro) < 1.05) { if (turno) C.b++; else C.a++; C.msg = '¡GOL de J' + (turno + 1) + '!'; } else C.msg = ataja ? '¡ATAJADA de J' + (2 - turno) + '!' : 'Afuera…';
          n[turno]++; C.hud(); fase = 'espera'; tv = 0; } }
      if (fase === 'espera') { tv += dt; if (tv > 1.4) { A.rotation.z = 0; if (n[0] >= 5 && n[1] >= 5) { if (C.a === C.b && n[0] < 10) { /* muerte súbita */ } else return C.terminar(C.a === C.b ? 'Empate ' + C.a + ' a ' + C.b : '¡Gana J' + (C.a > C.b ? 1 : 2) + ' ' + Math.max(C.a, C.b) + ' a ' + Math.min(C.a, C.b) + '!'); } turno = 1 - turno; colocar(); } } };
    return C;
  }

  // ---------- BÁSQUET (tiros con barra de fuerza) ----------
  function basket(o) {
    const C = base(o, [12, -0.3, 6]); let B, turno = 0, n = [0, 0], fase = 'carga', pw = 0, pd = 1, tv = 0, ok = false, desde = null;
    const HX = 15.58, HY = 3.05, HZ = -0.3, DIST = [4.2, 5.6, 6.8, 4.2, 6.8];
    const colocar = () => { const S = turno ? C.H.yo2 : C.H.yo, O = turno ? C.H.yo : C.H.yo2, d = DIST[n[turno] % DIST.length]; S.position.set(HX - d, 0, HZ); S.rotation.y = Math.PI / 2; O.position.set(HX - d - 1.5, 0, HZ + 3); B.position.set(HX - d + 0.3, 1.6, HZ); fase = 'carga'; pw = 0; desde = d;
      C.msg = 'Lanza J' + (turno + 1) + ': presiona ' + (turno ? 'ENTER' : 'E') + ' cuando la barra esté en VERDE'; C.extra = 'Tiros: J1 ' + n[0] + '/5 · J2 ' + n[1] + '/5'; C.hud(); };
    C.init = H => { C.H = H; B = bola(H, C, 0.26, '#e0662e'); const bg = C.add(new H.T.Mesh(new H.T.PlaneGeometry(0.25, 2), new H.T.MeshBasicMaterial({ color: '#222', transparent: true, opacity: 0.8, depthTest: false }))); const ok0 = C.add(new H.T.Mesh(new H.T.PlaneGeometry(0.27, 0.36), new H.T.MeshBasicMaterial({ color: '#2ee86d', depthTest: false }))); const bar = C.add(new H.T.Mesh(new H.T.PlaneGeometry(0.3, 0.06), new H.T.MeshBasicMaterial({ color: '#ffd23f', depthTest: false })));
      [bg, ok0, bar].forEach(m => { m.renderOrder = 10; H.sc.add(m); }); C.ui = { bg, ok0, bar }; colocar(); };
    const zona = () => { const c = 0.25 + (desde - 4.2) * 0.12, w = Math.max(0.08, 0.2 - n[turno] * 0.015); return [c - w / 2, c + w / 2]; };
    C.key = c => { if (fase !== 'carga' || C.fin) return; if ((turno === 0 && c === K1.a) || (turno === 1 && c === K2.a)) { const z = zona(); ok = pw >= z[0] && pw <= z[1]; fase = 'vuela'; tv = 0; } };
    C.update = (dt, t) => { if (C.fin) return; const S = turno ? C.H.yo2 : C.H.yo, z = zona(), cam = [S.position.x - 1.2, S.position.z - 1.2];
      [C.ui.bg, C.ui.ok0, C.ui.bar].forEach(m => m.quaternion.set(0, 0, 0, 1)); C.ui.bg.lookAt(C.ui.bg.position.x + ISO[0], C.ui.bg.position.y + ISO[1], C.ui.bg.position.z + ISO[2]); [C.ui.ok0, C.ui.bar].forEach(m => m.quaternion.copy(C.ui.bg.quaternion));
      const bx = S.position.x - 0.9, bz = S.position.z + 0.9; C.ui.bg.position.set(bx, 2, bz); C.ui.ok0.position.set(bx, 1 + (z[0] + z[1]) / 2 * 2, bz); C.ui.ok0.scale.y = (z[1] - z[0]) * 2 / 0.36; C.ui.bar.position.set(bx, 1 + pw * 2, bz);
      if (fase === 'carga') { pw += pd * dt * 0.9; if (pw > 1 || pw < 0) { pd = -pd; pw = Math.max(0, Math.min(1, pw)); } }
      if (fase === 'vuela') { tv += dt; const k = Math.min(1, tv / 0.9), x0 = HX - desde + 0.3, tx = ok ? HX - 0.05 : HX + (pw > z[1] ? 0.6 : -0.7); B.position.x = x0 + (tx - x0) * k; B.position.y = 1.6 + (HY + 0.15 - 1.6) * k + Math.sin(k * Math.PI) * 1.6; B.position.z = HZ;
        if (k >= 1) { if (ok) { if (turno) C.b += desde > 6 ? 3 : 2; else C.a += desde > 6 ? 3 : 2; C.msg = '¡CANASTA de J' + (turno + 1) + '! +' + (desde > 6 ? 3 : 2); } else C.msg = pw > z[1] ? 'Muy fuerte: rebotó en el tablero' : 'Le faltó fuerza'; n[turno]++; C.hud(); fase = 'cae'; tv = 0; } }
      if (fase === 'cae') { tv += dt; B.position.y = Math.max(0.26, B.position.y - dt * 4); if (tv > 1.2) { if (n[0] >= 5 && n[1] >= 5) return C.terminar(C.a === C.b ? 'Empate ' + C.a + ' a ' + C.b : '¡Gana J' + (C.a > C.b ? 1 : 2) + ' con ' + Math.max(C.a, C.b) + ' puntos!'); turno = 1 - turno; colocar(); } } };
    return C;
  }

  // ---------- TENIS ----------
  function tenis(o) {
    const C = base(o, [0, -0.3, 10]); let B, fly = null, saca = 0, esperaS = 1, sombra;
    const X = 11, Z0 = -6, Z1 = 5.4;
    C.init = H => { C.H = H; const red = C.add(new H.T.Mesh(new H.T.BoxGeometry(0.08, 0.95, 11.6), new H.T.MeshStandardMaterial({ color: '#f4f4f4', transparent: true, opacity: 0.6 }))); red.position.set(0, 0.47, -0.3); H.sc.add(red);
      B = bola(H, C, 0.16, '#d7f542'); sombra = C.add(new H.T.Mesh(new H.T.CircleGeometry(0.18, 16), new H.T.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.3 }))); sombra.rotation.x = -Math.PI / 2; H.sc.add(sombra);
      H.yo.position.set(-X + 1, 0, -0.3); H.yo2.position.set(X - 1, 0, -0.3); C.msg = 'Golpear: J1 E · J2 ENTER cuando la pelota esté cerca · 5 puntos gana'; C.hud(); };
    const lanzar = (de, haciaJ2) => { const dx = haciaJ2 ? 1 : -1, tz = Z0 + 0.8 + Math.random() * (Z1 - Z0 - 1.6), tx = dx * (3 + Math.random() * 5); fly = { p0: [de.x, 1.1, de.z], b: [tx, tz], t: 0, T: 0.9, pre: true, dir: haciaJ2, v: [(tx - de.x) / 0.9, (tz - de.z) / 0.9] }; };
    C.key = c => { if (C.fin) return; [[C.H.yo, K1, 0], [C.H.yo2, K2, 1]].forEach(([P, K, k]) => { if (c !== K.a) return; if (!fly && esperaS <= 0 && saca === k) { lanzar(P.position, k === 0); return; }
      if (fly && fly.dir === (k === 1) && Math.hypot(B.position.x - P.position.x, B.position.z - P.position.z) < 1.7 && B.position.y < 2.4 && !fly.pre) lanzar(B.position, k === 0); }); };
    C.update = (dt, t, keys) => { if (C.fin) return; esperaS -= dt;
      [[C.H.yo, K1, -1], [C.H.yo2, K2, 1]].forEach(([P, K, s]) => { const d = dirK(keys, K); legs(P, t, !!d); if (!d) return; P.position.x = s < 0 ? Math.max(-X - 1, Math.min(-0.8, P.position.x + d[0] * 5 * dt)) : Math.min(X + 1, Math.max(0.8, P.position.x + d[0] * 5 * dt)); P.position.z = Math.max(Z0, Math.min(Z1, P.position.z + d[1] * 5 * dt)); P.rotation.y = Math.atan2(d[0], d[1]); });
      if (!fly) { const S = saca ? C.H.yo2 : C.H.yo; B.position.set(S.position.x + (saca ? -0.4 : 0.4), 1.3 + Math.abs(Math.sin(t * 4)) * 0.4, S.position.z); C.extra = 'Saca J' + (saca + 1) + ' (' + (saca ? 'ENTER' : 'E') + ')'; }
      else { fly.t += dt; const k = fly.t / fly.T; if (fly.pre) { B.position.x = fly.p0[0] + fly.v[0] * fly.t; B.position.z = fly.p0[2] + fly.v[1] * fly.t; B.position.y = 0.16 + (1 - k) * fly.p0[1] * 0.4 + Math.sin(Math.min(1, k) * Math.PI) * 2.2; if (k >= 1) { fly.pre = false; fly.t = 0; } }
        else { B.position.x += fly.v[0] * dt * 0.8; B.position.z += fly.v[1] * dt * 0.8; B.position.y = 0.16 + Math.sin(Math.min(1, fly.t / 0.8) * Math.PI) * 1.5; if (fly.t > 0.85 || Math.abs(B.position.x) > X + 2) { if (fly.dir) C.a++; else C.b++; C.msg = 'Punto para J' + (fly.dir ? 1 : 2); saca = fly.dir ? 1 : 0; fly = null; esperaS = 1; C.hud(); if (C.a >= 5 || C.b >= 5) C.terminar('¡Gana J' + (C.a > C.b ? 1 : 2) + ' ' + Math.max(C.a, C.b) + ' a ' + Math.min(C.a, C.b) + '!'); } } }
      sombra.position.set(B.position.x, 0.02, B.position.z); };
    return C;
  }

  // ---------- PAINTBALL ----------
  function paintball(o) {
    const C = base(o, [0, -0.3, 11]); const CUB = [[-6, -3.5, 1.8, 1.1], [-6, 3, 1.8, 1.1], [6, -3.5, 1.8, 1.1], [6, 3, 1.8, 1.1], [0, -0.3, 1.2, 2.6], [-11, -0.3, 1, 2], [11, -0.3, 1, 2], [-2.5, -6, 2.4, 0.8], [2.5, 5.4, 2.4, 0.8]];
    const X = 15, Z0 = -8.3, Z1 = 7.7; let J, balas = [], ronda = 1, rw = [0, 0], entre = 1.5, chal = null, chalT = 0;
    const col = ['#2f7bff', '#ff4a3d'];
    const mk = () => [{ hp: 100, ar: 50, mun: 12, rec: 0, cd: 0, head: false }, { hp: 100, ar: 50, mun: 12, rec: 0, cd: 0, head: false }];
    const tapa = (x, z, y) => CUB.some(([cx, cz, w, d]) => y < 1.25 && Math.abs(x - cx) < w / 2 && Math.abs(z - cz) < d / 2);
    const mancha = (x, y, z, c, plano) => { const m = C.add(new C.H.T.Mesh(new C.H.T.CircleGeometry(0.22 + Math.random() * 0.15, 12), new C.H.T.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.85 }))); if (plano) { m.rotation.x = -Math.PI / 2; m.position.set(x, 0.02, z); } else { m.position.set(x, y, z); m.lookAt(x + ISO[0], y + ISO[1], z + ISO[2]); } C.H.sc.add(m); };
    const reset = () => { J = mk(); C.H.yo.position.set(-13, 0, -0.3); C.H.yo2.position.set(13, 0, -0.3); C.H.yo.rotation.y = Math.PI / 2; C.H.yo2.rotation.y = -Math.PI / 2; C.H.yo.rotation.z = C.H.yo2.rotation.z = 0; entre = 1.5; C.msg = 'Ronda ' + ronda + ' · ¡Prepárense!'; C.hud(); };
    C.init = H => { C.H = H; CUB.forEach(([x, z, w, d], i) => { const m = C.add(new H.T.Mesh(new H.T.BoxGeometry(w, i === 4 ? 1.9 : 1.2, d), new H.T.MeshStandardMaterial({ color: i === 4 ? '#6b7a4c' : '#a8814f' }))); m.position.set(x, (i === 4 ? 1.9 : 1.2) / 2, z); m.castShadow = true; H.sc.add(m); });
      chal = C.add(new H.T.Mesh(new H.T.BoxGeometry(0.6, 0.4, 0.4), new H.T.MeshStandardMaterial({ color: '#2b2b2b', emissive: '#f0a726', emissiveIntensity: 0.5 }))); chal.position.set(0, 0.4, 3.2); H.sc.add(chal);
      C.bars = [0, 1].map(k => { const g = new H.T.Group(); const bg = new H.T.Mesh(new H.T.PlaneGeometry(1.2, 0.16), new H.T.MeshBasicMaterial({ color: '#111', depthTest: false })), hp = new H.T.Mesh(new H.T.PlaneGeometry(1.2, 0.12), new H.T.MeshBasicMaterial({ color: '#2ee86d', depthTest: false })), ar = new H.T.Mesh(new H.T.PlaneGeometry(1.2, 0.07), new H.T.MeshBasicMaterial({ color: '#5fd0e8', depthTest: false })); hp.position.z = ar.position.z = 0.001; ar.position.y = -0.12; [bg, hp, ar].forEach(m => { m.renderOrder = 10; g.add(m); }); H.sc.add(g); C.add(g); return { g, hp, ar }; });
      reset(); C.extra = 'J1: E disparar · Q recargar · F (mantener) apuntar a la cabeza  |  J2: ENTER disparar · SHIFT der. recargar · - (mantener) cabeza'; C.hud(); };
    const disparar = k => { const S = J[k], P = k ? C.H.yo2 : C.H.yo, O = k ? C.H.yo : C.H.yo2; if (entre > 0 || S.hp <= 0 || S.rec > 0 || S.cd > 0 || C.fin) return; if (S.mun <= 0) { S.rec = 1.6; return; } S.mun--; S.cd = 0.28;
      let ang = P.rotation.y; const dx = O.position.x - P.position.x, dz = O.position.z - P.position.z, a2 = Math.atan2(dx, dz); let df = ((a2 - ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI; const cono = S.head ? 0.08 : 0.32; if (Math.abs(df) < cono) ang = a2 + (Math.random() - 0.5) * (S.head ? 0.04 : 0.1);
      const m = new C.H.T.Mesh(new C.H.T.SphereGeometry(0.07, 8, 6), new C.H.T.MeshBasicMaterial({ color: col[k] })); m.position.set(P.position.x + Math.sin(ang) * 0.5, S.head ? 1.55 : 1.0, P.position.z + Math.cos(ang) * 0.5); C.H.sc.add(m); C.add(m); balas.push({ m, v: [Math.sin(ang) * 22, Math.cos(ang) * 22], k, head: S.head, vida: 1.2 }); };
    C.key = c => { if (c === K1.a) disparar(0); if (c === K2.a) disparar(1); if (c === K1.b && J[0].mun < 12) J[0].rec = 1.6; if (c === K2.b && J[1].mun < 12) J[1].rec = 1.6; };
    C.update = (dt, t, keys) => { if (C.fin) return; entre -= dt; if (entre <= 0 && entre > -dt * 1.5) { C.msg = '¡A pintar!'; C.hud(); }
      chalT -= dt; chal.visible = chalT <= 0; chal.rotation.y += dt * 2;
      [[C.H.yo, K1, 0], [C.H.yo2, K2, 1]].forEach(([P, K, k]) => { const S = J[k]; S.cd -= dt; if (S.rec > 0) { S.rec -= dt; if (S.rec <= 0) S.mun = 12; } S.head = !!keys[K.c] || (k === 1 && !!keys.Minus);
        if (S.hp <= 0) { P.rotation.z = Math.min(1.4, P.rotation.z + dt * 4); return; } const d = entre > 0 ? null : dirK(keys, K); legs(P, t, !!d);
        if (d) { const sp = (S.head ? 2.2 : 4.8) * dt, nx = P.position.x + d[0] * sp, nz = P.position.z + d[1] * sp; if (!CUB.some(([cx, cz, w, dd]) => Math.abs(nx - cx) < w / 2 + 0.35 && Math.abs(nz - cz) < dd / 2 + 0.35)) { P.position.x = Math.max(-X, Math.min(X, nx)); P.position.z = Math.max(Z0, Math.min(Z1, nz)); } P.rotation.y = Math.atan2(d[0], d[1]); }
        if (chal.visible && Math.hypot(P.position.x - chal.position.x, P.position.z - chal.position.z) < 0.8) { S.ar = 50; chalT = 15; C.msg = 'J' + (k + 1) + ' recogió un chaleco'; C.hud(); }
        const B = C.bars[k]; B.g.position.set(P.position.x, 2.75, P.position.z); B.g.lookAt(P.position.x + ISO[0], 2.75 + ISO[1], P.position.z + ISO[2]); B.hp.scale.x = Math.max(0.001, S.hp / 100); B.hp.position.x = -0.6 * (1 - S.hp / 100); B.ar.scale.x = Math.max(0.001, S.ar / 50); B.ar.position.x = -0.6 * (1 - S.ar / 50); });
      balas = balas.filter(b => { b.vida -= dt; b.m.position.x += b.v[0] * dt; b.m.position.z += b.v[1] * dt; const p = b.m.position, O = b.k ? C.H.yo : C.H.yo2, S = J[1 - b.k];
        if (tapa(p.x, p.z, p.y)) { mancha(p.x, p.y, p.z, col[b.k]); b.m.parent && b.m.parent.remove(b.m); return false; }
        if (S.hp > 0) { const dd = Math.hypot(p.x - O.position.x, p.z - O.position.z); if (dd < (b.head ? 0.26 : 0.45)) { let dmg = b.head ? 60 : 25; if (!b.head && S.ar > 0) { const ab = Math.min(S.ar, dmg * 0.6); S.ar -= ab; dmg -= ab; } S.hp = Math.max(0, S.hp - dmg); mancha(O.position.x, 0, O.position.z, col[b.k], true); C.msg = (b.head ? '🎯 ¡DISPARO A LA CABEZA! ' : '') + 'J' + (2 - b.k) + ' recibió ' + Math.round(dmg) + ' de daño'; C.hud();
          if (S.hp <= 0) { rw[b.k]++; if (b.k) C.b = rw[1]; else C.a = rw[0]; C.msg = '¡J' + (2 - b.k) + ' fue PINTADO! Ronda para J' + (b.k + 1); C.hud(); if (rw[b.k] >= 2) C.terminar('¡J' + (b.k + 1) + ' gana el paintball ' + rw[b.k] + ' a ' + rw[1 - b.k] + '!'); else setTimeout(() => { ronda++; reset(); }, 1800); }
          b.m.parent && b.m.parent.remove(b.m); return false; } }
        if (b.vida <= 0 || Math.abs(p.x) > X + 1 || p.z < Z0 - 1 || p.z > Z1 + 1) { mancha(p.x, 0, p.z, col[b.k], true); b.m.parent && b.m.parent.remove(b.m); return false; } return true; });
      C.extra = 'J1 ❤ ' + J[0].hp + ' 🛡 ' + Math.round(J[0].ar) + ' 🎨 ' + (J[0].rec > 0 ? 'recargando…' : J[0].mun + '/12') + '   ·   J2 ❤ ' + J[1].hp + ' 🛡 ' + Math.round(J[1].ar) + ' 🎨 ' + (J[1].rec > 0 ? 'recargando…' : J[1].mun + '/12');
      if (Math.floor(t * 4) !== C._tt) { C._tt = Math.floor(t * 4); C.hud(); } };
    return C;
  }

  const MINI = { futbol: { n: 'Fútbol 1 vs 1', ico: '⚽', f: futbol, ctrl: 'Moverse: J1 W A S D · J2 flechas. Patear: J1 E · J2 ENTER. Gana quien mete 3 goles.' },
    penales: { n: 'Penales', ico: '🥅', f: penales, ctrl: 'El que patea presiona su tecla cuando la mira amarilla esté donde quiere. El arquero mantiene izquierda o derecha justo en ese momento.' },
    basket: { n: 'Básquet', ico: '🏀', f: basket, ctrl: 'Presionen su tecla (J1 E · J2 ENTER) cuando la barra amarilla esté en la zona verde. Desde lejos vale 3.' },
    tenis: { n: 'Tenis', ico: '🎾', f: tenis, ctrl: 'Muévanse en su lado de la cancha y golpeen (J1 E · J2 ENTER) cuando la pelota haya rebotado cerca. Gana quien llega a 5.' },
    paintball: { n: 'Paintball', ico: '🎨', f: paintball, ctrl: 'Disparar: J1 E · J2 ENTER. Recargar: J1 Q · J2 SHIFT derecho. Apuntar a la cabeza (más daño, más lento): mantener J1 F · J2 tecla «-». El chaleco absorbe parte del daño del cuerpo. Gana quien pinta al otro en 2 rondas.' } };
  window.V3_MINI = { MINI, crear: (id, o) => MINI[id].f(o) };
})();
