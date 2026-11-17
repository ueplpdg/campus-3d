// Retos v3 que no existían como componentes sueltos: diagramas de flujo, reglas, interrogatorio, Mastermind, compuertas, Raven, regla cambiante, Einstein y rutas.
(function () {
  function make(React) {
    if (make.c) return make.c;
    const { useState, useMemo } = React, h = React.createElement;
    const J1 = '#5fd0e8', J2 = '#ff8fd0', OK = '#7fe0a0', ER = '#ff7b72', TX = '#e8f4f8', MU = '#9fb3c0', PAN = '#0f1b26', BG = '#0a141d', LN = 'rgba(232,244,248,.18)', AM = '#f0a726';
    const HEAD = "'Archivo Black',sans-serif", MONO = "'IBM Plex Mono',monospace";
    const D = (st, ...c) => h('div', { style: st }, ...c);
    const T = (t, st) => h('div', { style: Object.assign({ fontSize: 16, lineHeight: 1.45, color: TX }, st || {}) }, t);
    const Btn = (t, on, st, dis) => h('button', { onClick: on, disabled: !!dis, style: Object.assign({ background: dis ? '#24323d' : OK, color: dis ? MU : '#06140b', border: 'none', borderRadius: 10, padding: '12px 18px', fontWeight: 800, fontSize: 16, cursor: dis ? 'default' : 'pointer', fontFamily: 'inherit' }, st || {}) }, t);
    const Chip = (t, on, act, col) => h('button', { onClick: act, style: { background: on ? (col || J1) : PAN, color: on ? '#06140b' : TX, border: '2px solid ' + (on ? (col || J1) : LN), borderRadius: 999, padding: '8px 14px', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' } }, t);
    const Card = (st, ...c) => D(Object.assign({ background: PAN, border: '1px solid ' + LN, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }, st || {}), ...c);
    const Row = (st, ...c) => D(Object.assign({ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }, st || {}), ...c);
    const Wrap = (como, ...c) => D({ display: 'flex', flexDirection: 'column', gap: 14, color: TX }, Card({ background: '#10222e', borderColor: J1 }, D({ fontSize: 12, letterSpacing: '.12em', fontWeight: 700, color: J1 }, 'CÓMO SE JUEGA'), T(como)), ...c);
    const useFin = p => { const [done, setDone] = useState(false); return (ok, eff, txt) => { if (done || p.fin) return; if (ok) setDone(true); p.onFin(ok, eff, txt); }; };
    const rnd = p => p.h || { int: (a, b) => a + Math.floor(Math.random() * (b - a + 1)), pick: a => a[Math.floor(Math.random() * a.length)], shuffle: a => a.slice().sort(() => Math.random() - 0.5) };

    // ---------- Diagramas de flujo ----------
    const PA = () => (window.ESC_FLUJO && window.ESC_FLUJO.PA) || [];
    const pasosDe = x => [['oval', 'INICIO'], ['rect', x.set], ['io', x.leer], ['rombo', '¿' + x.v.n + ' ' + x.op + ' ' + x.k + ' ' + x.v.u + '?'], ['rect', 'SÍ → ' + x.si], ['rect', 'NO → ' + x.no], ['oval', 'Volver a leer (para siempre)']];
    const FORMA = { oval: { r: 999, bg: '#1d2f3d', tag: 'INICIO / FIN' }, rect: { r: 6, bg: '#13283a', tag: 'ACCIÓN' }, io: { r: 6, bg: '#251d3a', tag: 'LEER DATO' }, rombo: { r: 6, bg: '#3a2a12', tag: 'PREGUNTA' } };
    const Bloque = (f, t, st, extra) => D(Object.assign({ background: FORMA[f].bg, border: '2px solid ' + (f === 'rombo' ? AM : f === 'io' ? '#b8a4ff' : f === 'oval' ? J1 : '#5d8fb5'), borderRadius: FORMA[f].r, padding: f === 'rombo' ? '12px 34px' : '10px 16px', clipPath: f === 'rombo' ? 'polygon(8% 0,92% 0,100% 50%,92% 100%,8% 100%,0 50%)' : 'none', textAlign: 'center', fontWeight: 700, fontSize: 15, color: TX, minWidth: 200 }, st || {}), D({ fontSize: 10, letterSpacing: '.12em', color: MU, marginBottom: 3 }, FORMA[f].tag), t, extra || null);
    const Flecha = () => D({ width: 2, height: 14, background: LN, alignSelf: 'center' });
    const cmp = (v, op, k) => op === '<' ? v < k : op === '>' ? v > k : op === '<=' ? v <= k : op === '>=' ? v >= k : v === k;
    function Orden(p) {
      const fin = useFin(p), R = rnd(p), [x] = useState(() => R.pick(PA())), all = pasosDe(x), base = p.tier === 1 ? all.slice(1, 5) : p.tier === 2 ? all.slice(0, 6) : all;
      const [mez] = useState(() => { let m; do { m = R.shuffle(base.map((_, i) => i)); } while (m.every((v, i) => v === i)); return m; }), [seq, setSeq] = useState([]), [int, setInt] = useState(0);
      const ok = () => { const bad = seq.findIndex((v, i) => v !== i); if (bad < 0) return fin(true, int ? 0.75 : 1, '¡Orden correcto! Así piensa un programador: paso a paso.'); setInt(int + 1); p.snd && p.snd('err'); p.onErr('El paso ' + (bad + 1) + ' no va ahí. ' + (bad === 0 ? 'Todo empieza configurando o en INICIO.' : 'Pregúntense: ¿qué tiene que pasar antes?')); setSeq(seq.slice(0, bad)); };
      return Wrap('Proyecto: ' + x.nombre + '. Toquen los pasos en el orden en que el Arduino los hace. Se arma el diagrama abajo.',
        Row({}, ...mez.map(i => h('button', { key: i, disabled: seq.includes(i), onClick: () => setSeq(seq.concat([i])), style: { background: seq.includes(i) ? '#16222c' : PAN, color: seq.includes(i) ? MU : TX, border: '2px solid ' + (seq.includes(i) ? LN : J1), borderRadius: 8, padding: '10px 12px', fontWeight: 700, cursor: seq.includes(i) ? 'default' : 'pointer', fontSize: 14, fontFamily: 'inherit' } }, base[i][1]))),
        D({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }, ...seq.map((i, k) => D({ display: 'flex', flexDirection: 'column', alignItems: 'center' }, k ? Flecha() : null, Bloque(base[i][0], base[i][1])))),
        Row({}, Btn('Comprobar', ok, null, seq.length < base.length), Btn('Borrar el último', () => setSeq(seq.slice(0, -1)), { background: PAN, color: TX, border: '2px solid ' + LN }, !seq.length)));
    }
    function Armar(p) {
      const fin = useFin(p), R = rnd(p), [x] = useState(() => R.pick(PA())), otros = PA().filter(o => o.id !== x.id), pasos = pasosDe(x).slice(1, 6);
      const [opts] = useState(() => pasos.map(([f, t], i) => { const o = R.pick(otros), alt = pasosDe(o)[i + 1][1], alt2 = i === 2 ? '¿' + x.v.n + ' ' + (x.op === '<' ? '>' : '<') + ' ' + x.k + ' ' + x.v.u + '?' : i === 3 ? 'SÍ → ' + x.no : i === 4 ? 'NO → ' + x.si : pasosDe(R.pick(otros))[i + 1][1]; return R.shuffle([t, alt].concat(p.tier >= 2 ? [alt2] : [])); }));
      const [v, setV] = useState({}), [int, setInt] = useState(0);
      const ok = () => { const mal = pasos.filter(([, t], i) => v[i] !== t).length; if (!mal) return fin(true, int ? 0.75 : 1, '¡Diagrama armado! Cada figura tiene su significado.'); setInt(int + 1); p.onErr(mal + ' figura' + (mal > 1 ? 's no tienen' : ' no tiene') + ' el texto correcto. Recuerden el objetivo: ' + x.spec); };
      return Wrap('Proyecto: ' + x.nombre + '. ' + x.spec + ' Elijan el texto de cada figura.',
        D({ display: 'flex', flexDirection: 'column', alignItems: 'center' }, Bloque('oval', 'INICIO'), ...pasos.map(([f], i) => D({ display: 'flex', flexDirection: 'column', alignItems: 'center' }, Flecha(), Bloque(f, h('select', { value: v[i] || '', onChange: e => setV(Object.assign({}, v, { [i]: e.target.value })), style: { maxWidth: 320, padding: '6px 8px', borderRadius: 8, fontSize: 14, fontWeight: 600 } }, h('option', { value: '' }, '— elegir —'), ...opts[i].map(o => h('option', { key: o, value: o }, o)))))), Flecha(), Bloque('oval', '↺ Volver a leer')),
        Btn('Comprobar el diagrama', ok, null, pasos.some((_, i) => !v[i])));
    }
    function Decision(p) {
      const fin = useFin(p), R = rnd(p), [x] = useState(() => R.pick(PA())), [op, setOp] = useState(''), [k, setK] = useState(''), [res, setRes] = useState(null), [int, setInt] = useState(0);
      const vals = useMemo(() => { const s = [x.k - x.v.paso * 3, x.k, x.k + x.v.paso * 3, x.v.min, x.v.max]; if (p.tier >= 2) s.push(x.k - x.v.paso, x.k + x.v.paso); return [...new Set(s.filter(n => n >= x.v.min && n <= x.v.max))]; }, [x]);
      const probar = () => { const kk = Number(k), r = vals.map(n => ({ n, esp: cmp(n, x.op, x.k), obt: cmp(n, op, kk) })); setRes(r); const bien = r.every(t => t.esp === t.obt); if (bien) fin(true, int ? 0.75 : 1, 'El rombo decide bien en todas las situaciones, incluso en el límite.'); else { setInt(int + 1); p.onErr('Fallan ' + r.filter(t => t.esp !== t.obt).length + ' situaciones. Miren la tabla: ¿qué pasa justo en el límite?'); } };
      return Wrap(x.spec + ' Programen la pregunta del rombo: elijan la comparación y el número límite. Se prueba con valores reales.',
        D({ display: 'flex', justifyContent: 'center' }, Bloque('rombo', h('span', null, '¿' + x.v.n + ' ', h('select', { value: op, onChange: e => setOp(e.target.value), style: { fontSize: 16, fontWeight: 800 } }, h('option', { value: '' }, '?'), ...['<', '>', '<=', '>=', '=='].map(o => h('option', { key: o, value: o }, o))), ' ', h('input', { value: k, onChange: e => setK(e.target.value.replace(/[^\d.]/g, '')), style: { width: 70, fontSize: 16, fontWeight: 800, textAlign: 'center' } }), ' ' + x.v.u + '?'))),
        Row({ justifyContent: 'center', gap: 20 }, T('SÍ → ' + x.si, { color: OK, fontWeight: 700 }), T('NO → ' + x.no, { color: ER, fontWeight: 700 })),
        Btn('▶ Probar con valores reales', probar, null, !op || k === ''),
        res ? Card({}, ...res.map(t => Row({ justifyContent: 'space-between', borderTop: '1px solid ' + LN, paddingTop: 6 }, T(x.v.n + ' = ' + t.n + ' ' + x.v.u, { fontFamily: MONO }), T('debía: ' + (t.esp ? x.si : x.no), { color: MU, fontSize: 14 }), T(t.esp === t.obt ? '✓' : '✗', { color: t.esp === t.obt ? OK : ER, fontWeight: 800 })))) : null);
    }
    function Sigue(p) {
      const fin = useFin(p), R = rnd(p), [x] = useState(() => R.pick(PA())), n = p.tier === 1 ? 3 : p.tier === 2 ? 4 : 6;
      const [vals] = useState(() => R.shuffle([x.k, x.k - x.v.paso * 2, x.k + x.v.paso * 2, x.v.min + x.v.paso, x.v.max - x.v.paso, x.k + x.v.paso]).slice(0, n).map(v => Math.max(x.v.min, Math.min(x.v.max, v))));
      const [r, setR] = useState({}), [ver, setVer] = useState(false), [int, setInt] = useState(0);
      const ok = () => { setVer(true); const mal = vals.filter((v, i) => r[i] !== (cmp(v, x.op, x.k) ? 'si' : 'no')).length; if (!mal) return fin(true, int ? 0.75 : 1, '¡Siguieron el diagrama como el Arduino!'); setInt(int + 1); p.onErr(mal + ' respuesta' + (mal > 1 ? 's' : '') + ' incorrecta' + (mal > 1 ? 's' : '') + '. Comparen el valor con ' + x.k + ' usando «' + x.op + '».'); };
      return Wrap('Sigan el diagrama con el dedo. Para cada lectura del sensor, ¿qué hace el sistema?',
        D({ display: 'flex', flexDirection: 'column', alignItems: 'center' }, ...pasosDe(x).slice(1, 6).map(([f, t], i) => D({ display: 'flex', flexDirection: 'column', alignItems: 'center' }, i ? Flecha() : null, Bloque(f, t)))),
        ...vals.map((v, i) => Card({ padding: 10 }, Row({ justifyContent: 'space-between' }, T(x.v.n + ' = ' + v + ' ' + x.v.u, { fontFamily: MONO, fontWeight: 700 }), Row({}, Chip(x.si, r[i] === 'si', () => setR(Object.assign({}, r, { [i]: 'si' })), OK), Chip(x.no, r[i] === 'no', () => setR(Object.assign({}, r, { [i]: 'no' })), ER), ver ? T(r[i] === (cmp(v, x.op, x.k) ? 'si' : 'no') ? '✓' : '✗', { color: r[i] === (cmp(v, x.op, x.k) ? 'si' : 'no') ? OK : ER, fontWeight: 800 }) : null)))),
        Btn('Comprobar', ok, null, vals.some((_, i) => !r[i])));
    }
    const SENS = { Humedad: 'Sensor de humedad del suelo', Distancia: 'Sensor ultrasónico', Luz: 'Fotorresistencia LDR', Temperatura: 'Sensor de temperatura LM35', Ruido: 'Sensor de sonido', Movimiento: 'Sensor PIR', UV: 'Sensor UV' };
    const actDe = t => t.replace(/^(Encender|Apagar|Abrir|Cerrar|Prender|Activar|Sonar|Detener|Girar|Mover|Soltar|Mantener)\s+(el|la|los|las)?\s*/i, '').replace(/^./, c => c.toUpperCase());
    function Aparato(p) {
      const fin = useFin(p), R = rnd(p), [x] = useState(() => R.pick(PA())), otros = PA().filter(o => o.id !== x.id);
      const sen = SENS[x.v.n] || 'Sensor de ' + x.v.n.toLowerCase(), act = actDe(x.si);
      const [oS] = useState(() => R.shuffle([sen].concat([...new Set(otros.map(o => SENS[o.v.n] || 'Sensor de ' + o.v.n.toLowerCase()))].filter(s => s !== sen).slice(0, p.tier + 1)))), [oA] = useState(() => R.shuffle([act].concat([...new Set(otros.map(o => actDe(o.si)))].filter(a => a !== act).slice(0, p.tier + 1))));
      const [pin] = useState(() => R.pick(['A0', 'A1', 'D2', 'D7'])), [sS, setS] = useState(''), [sA, setA] = useState(''), [sP, setP] = useState(''), [sV, setV] = useState(x.v.min), [int, setInt] = useState(0), listo = sS === sen && sA === act;
      const ana = !/Movimiento/.test(x.v.n), pinOk = ana ? /^A/.test(sP) : /^D/.test(sP);
      const ok = () => { const e = []; if (sS !== sen) e.push('El bloque «' + x.leer + '» necesita el sensor que mide ' + x.v.n.toLowerCase() + '.'); if (sA !== act) e.push('La acción «' + x.si + '» la hace: ' + act.toLowerCase() + '.'); if (p.tier >= 2 && !pinOk) e.push(ana ? 'Un sensor que da muchos valores va a un pin analógico (A0–A5).' : 'Un sensor de sí/no va a un pin digital (D2–D13).'); if (!e.length) return fin(true, int ? 0.75 : 1, '¡El diagrama ya tiene cuerpo! Muevan el sensor para verlo funcionar.'); setInt(int + 1); p.onErr(e.join(' ')); };
      const on = listo && cmp(sV, x.op, x.k);
      return Wrap('Cada bloque del diagrama se convierte en una pieza real. Elijan el sensor del bloque «leer» y el actuador de la acción' + (p.tier >= 2 ? ', y el pin del Arduino.' : '.'),
        Row({ alignItems: 'stretch', gap: 12 }, Card({ flex: '1 1 240px' }, Bloque('io', x.leer), h('select', { value: sS, onChange: e => setS(e.target.value), style: { padding: 8, borderRadius: 8, fontSize: 14 } }, h('option', { value: '' }, '— ¿qué sensor? —'), ...oS.map(o => h('option', { key: o, value: o }, o))), p.tier >= 2 ? h('select', { value: sP, onChange: e => setP(e.target.value), style: { padding: 8, borderRadius: 8, fontSize: 14 } }, h('option', { value: '' }, '— ¿qué pin? —'), ...['A0', 'A1', 'D2', 'D7', '5V', 'GND'].map(o => h('option', { key: o, value: o }, o))) : null),
          Card({ flex: '1 1 240px' }, Bloque('rect', 'SÍ → ' + x.si), h('select', { value: sA, onChange: e => setA(e.target.value), style: { padding: 8, borderRadius: 8, fontSize: 14 } }, h('option', { value: '' }, '— ¿qué actuador? —'), ...oA.map(o => h('option', { key: o, value: o }, o))))),
        Card({ alignItems: 'center' }, T('Simulación: ' + x.v.n + ' = ' + sV + ' ' + x.v.u, { fontFamily: MONO, fontWeight: 700 }), h('input', { type: 'range', min: x.v.min, max: x.v.max, step: x.v.paso, value: sV, onChange: e => setV(Number(e.target.value)), style: { width: '100%' } }),
          D({ width: 90, height: 90, borderRadius: 45, background: on ? OK : '#22303a', boxShadow: on ? '0 0 30px ' + OK : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: on ? '#06140b' : MU, textAlign: 'center', fontSize: 13, transition: 'all .3s' }, listo ? (on ? x.si : x.no) : 'sin piezas')),
        Btn('Comprobar', ok, null, !sS || !sA || (p.tier >= 2 && !sP)));
    }
    function Error_(p) {
      const fin = useFin(p), R = rnd(p), [x] = useState(() => R.pick(PA())), nE = p.tier === 3 ? 2 : 1;
      const [dg] = useState(() => { const ps = pasosDe(x).map(a => a.slice()), errs = R.shuffle([3, 4, 6, 2]).slice(0, nE);
        errs.forEach(i => { if (i === 3) ps[3][1] = '¿' + x.v.n + ' ' + (x.op === '<' ? '>' : '<') + ' ' + x.k + ' ' + x.v.u + '?'; if (i === 4) { ps[4][1] = 'SÍ → ' + x.no; ps[5][1] = 'NO → ' + x.si; } if (i === 6) ps[6][1] = 'FIN'; if (i === 2) ps[2][1] = 'Esperar 1 hora'; }); return { ps, errs }; });
      const [sel, setSel] = useState([]), [int, setInt] = useState(0), EX = { 3: 'La comparación del rombo está al revés.', 4: 'Las acciones del SÍ y del NO están cambiadas.', 6: 'Un sistema automático nunca termina: debe volver a leer.', 2: 'Antes de decidir hay que leer el sensor.' };
      const ok = () => { const bien = sel.length === dg.errs.length && dg.errs.every(i => sel.includes(i === 4 ? 4 : i) || (i === 4 && sel.includes(5))); if (bien) return fin(true, int ? 0.75 : 1, dg.errs.map(i => EX[i]).join(' ')); setInt(int + 1); p.onErr('Todavía no. Lean el objetivo: ' + x.spec + ' Hay ' + nE + ' error' + (nE > 1 ? 'es' : '') + '.'); };
      return Wrap(x.spec + ' Este diagrama tiene ' + nE + ' error' + (nE > 1 ? 'es' : '') + '. Toquen la figura que está mal.',
        D({ display: 'flex', flexDirection: 'column', alignItems: 'center' }, ...dg.ps.map(([f, t], i) => D({ display: 'flex', flexDirection: 'column', alignItems: 'center' }, i ? Flecha() : null, h('div', { onClick: () => setSel(sel.includes(i) ? sel.filter(z => z !== i) : sel.length < nE ? sel.concat([i]) : [i]), style: { cursor: 'pointer', outline: sel.includes(i) ? '3px solid ' + AM : 'none', borderRadius: 10 } }, Bloque(f, t))))),
        Btn('Comprobar', ok, null, sel.length !== nE));
    }

    // ---------- Cerradura de reglas (series) ----------
    function Reglas(p) {
      const fin = useFin(p), G = window.V3GEN, R = rnd(p), [d] = useState(() => G.genReglas(p.tier, R)), vis = p.tier === 3 ? 4 : 3;
      const [a, setA] = useState(['+', 1]), [b, setB] = useState(['+', 1]), [modo, setModo] = useState(p.tier === 1 ? '' : 'luego'), [usarB, setUB] = useState(p.tier >= 2), [int, setInt] = useState(0), [prueba, setPrueba] = useState(null);
      const rule = { a, b: usarB ? b : null, modo: usarB ? modo : '' };
      const probar = () => { const s = G.serie(rule, d.s[0], d.s.length); setPrueba(s); if (s.every((v, i) => v === d.s[i])) return fin(true, int < 2 ? 1 : int < 4 ? 0.75 : 0.5, '¡La cerradura se abre! Encontraron la regla escondida.'); setInt(int + 1); const k = s.findIndex((v, i) => v !== d.s[i]); p.onErr('La máquina generó ' + s[k] + ' donde debía ir ' + d.s[k] + '. Ajusten la regla.'); };
      const OpSel = (o, set) => Row({}, ...['+', '−', '×'].map(x => Chip(x, o[0] === x, () => set([x, o[1]]), J1)), h('input', { type: 'number', min: 1, max: 12, value: o[1], onChange: e => set([o[0], Math.max(1, Math.min(12, Number(e.target.value) || 1))]), style: { width: 64, fontSize: 18, fontWeight: 800, textAlign: 'center', padding: 6, borderRadius: 8 } }));
      return Wrap('La serie sigue una regla escondida. Armen la regla con fichas: la máquina genera la serie con su regla y la compara. ' + (p.tier >= 2 ? 'Puede tener dos pasos («luego») o pasos que se turnan («alterna»).' : ''),
        Row({ justifyContent: 'center', gap: 10 }, ...d.s.map((v, i) => D({ minWidth: 58, padding: '10px 6px', borderRadius: 10, textAlign: 'center', fontFamily: MONO, fontSize: 22, fontWeight: 800, background: i < vis ? '#173042' : PAN, color: i < vis ? TX : MU, border: '2px solid ' + (prueba ? (prueba[i] === v ? OK : ER) : LN) }, i < vis ? String(v) : '?'))),
        Card({}, T('Paso A', { fontWeight: 800, color: J1 }), OpSel(a, setA), p.tier >= 2 ? Row({}, Chip('Un solo paso', !usarB, () => setUB(false)), Chip('Dos pasos', usarB, () => setUB(true))) : null,
          usarB ? T('Paso B', { fontWeight: 800, color: J2 }) : null, usarB ? OpSel(b, setB) : null, usarB ? Row({}, Chip('A luego B (cada vez)', modo === 'luego', () => setModo('luego'), J2), Chip('A y B se turnan', modo === 'alterna', () => setModo('alterna'), J2)) : null),
        prueba ? T('Su máquina: ' + prueba.join(', '), { fontFamily: MONO, color: MU }) : null, Btn('▶ Generar la serie', probar));
    }
    // ---------- Sala de interrogatorio ----------
    function Interrog(p) {
      const fin = useFin(p), G = window.V3GEN, R = rnd(p), [d] = useState(() => G.genInterrog(p.tier, R)), [v, setV] = useState({}), [int, setInt] = useState(0);
      const ok = () => { const mal = d.nom.filter((_, i) => v[i] !== d.sol[i]).length; if (!mal) return fin(true, int ? 0.75 : 1, 'Caso resuelto: los leales dicen siempre la verdad y los saboteadores siempre mienten.'); setInt(int + 1); p.onErr('Hay ' + mal + ' error' + (mal > 1 ? 'es' : '') + '. Prueben suponer que alguien es leal y revisen si todo es coherente.'); };
      return Wrap('Los LEALES siempre dicen la verdad; los SABOTEADORES siempre mienten. Lean lo que dice cada sospechoso y descubran quién es quién.',
        ...d.nom.map((n, i) => Card({ borderColor: v[i] === true ? OK : v[i] === false ? ER : LN }, Row({ justifyContent: 'space-between' }, D({ fontFamily: HEAD, fontSize: 20 }, '🕵 ' + n), Row({}, Chip('Leal', v[i] === true, () => setV(Object.assign({}, v, { [i]: true })), OK), Chip('Saboteador', v[i] === false, () => setV(Object.assign({}, v, { [i]: false })), ER))), T('«' + d.st[i].t + '»', { fontStyle: 'italic' }))),
        Btn('Acusar', ok, null, d.nom.some((_, i) => v[i] == null)));
    }
    // ---------- Terminal Mastermind ----------
    const COLS = ['#ff5d5d', '#ffd166', '#7fe0a0', '#5fd0e8', '#b8a4ff', '#ff8fd0'];
    function Master(p) {
      const fin = useFin(p), G = window.V3GEN, R = rnd(p), [d] = useState(() => G.genMaster(p.tier, R)), [cur, setCur] = useState(Array(d.L).fill(-1)), [hist, setHist] = useState([]);
      const probar = () => { const c = d.code, g = cur; let neg = 0, bla = 0; const rc = [], rg = []; c.forEach((x, i) => { if (g[i] === x) neg++; else { rc.push(x); rg.push(g[i]); } }); rg.forEach(x => { const k = rc.indexOf(x); if (k >= 0) { bla++; rc.splice(k, 1); } });
        const hs = hist.concat([{ g: g.slice(), neg, bla }]); setHist(hs); setCur(Array(d.L).fill(-1));
        if (neg === d.L) return fin(true, hs.length <= d.obj ? 1 : hs.length <= d.obj + 2 ? 0.75 : 0.5, '¡Código descifrado en ' + hs.length + ' intentos! Razonar con las pistas vale más que probar al azar.');
        if (hs.length >= d.max) { p.onFin(false, 0, 'Se acabaron los intentos. El código era otro: vuelvan a intentarlo con un código nuevo.'); return; } };
      return Wrap('Adivinen el código de ' + d.L + ' colores' + (d.rep ? ' (se pueden repetir)' : ' (sin repetir)') + '. ● = color en su lugar · ○ = color correcto en otro lugar. Tienen ' + d.max + ' intentos; la meta es ' + d.obj + ' o menos.',
        Card({}, Row({ justifyContent: 'center' }, ...cur.map((c, i) => h('button', { key: i, onClick: () => { const n = cur.slice(); n[i] = (n[i] + 1) % d.K; setCur(n); }, style: { width: 54, height: 54, borderRadius: 27, background: c < 0 ? '#22303a' : COLS[c], border: '3px solid ' + LN, cursor: 'pointer' } }))), T('Toquen cada círculo para cambiar su color.', { color: MU, fontSize: 13, textAlign: 'center' }),
          Row({ justifyContent: 'center' }, ...COLS.slice(0, d.K).map((c, i) => D({ width: 22, height: 22, borderRadius: 11, background: c }))), Btn('Probar código', probar, null, cur.some(c => c < 0))),
        ...hist.slice().reverse().map((x, k) => Row({ justifyContent: 'space-between', background: PAN, borderRadius: 10, padding: '8px 12px' }, T('#' + (hist.length - k), { color: MU, fontFamily: MONO }), Row({}, ...x.g.map(c => D({ width: 22, height: 22, borderRadius: 11, background: COLS[c] }))), T('● ' + x.neg + '   ○ ' + x.bla, { fontFamily: MONO, fontWeight: 800 }))));
    }
    // ---------- Compuertas lógicas ----------
    function Compuertas(p) {
      const fin = useFin(p), G = window.V3GEN, R = rnd(p), [d] = useState(() => G.genCompuertas(p.tier, R)), [g, setG] = useState(Array(d.slots).fill('')), [int, setInt] = useState(0);
      const listo = g.every(Boolean), sal = listo ? d.filas.map(f => G.cpEval(d.slots === 1 ? 1 : 2, g, f)) : null;
      const ok = () => { if (sal.every((v, i) => v === d.tabla[i])) return fin(true, int ? 0.75 : 1, '¡Circuito correcto! Así deciden los chips por dentro.'); setInt(int + 1); p.onErr('La salida no coincide en ' + sal.filter((v, i) => v !== d.tabla[i]).length + ' filas. AND = las dos · OR = al menos una · XOR = solo una.'); };
      const B = v => D({ width: 30, textAlign: 'center', fontFamily: MONO, fontWeight: 800, color: v ? OK : MU }, v ? '1' : '0');
      return Wrap('Elijan la compuerta lógica de cada caja para que la salida coincida con la tabla objetivo. ' + (d.slots === 2 ? 'La primera compuerta junta A y B; la segunda junta ese resultado con C.' : ''),
        Row({ justifyContent: 'center', gap: 14 }, ...g.map((x, i) => Card({ alignItems: 'center', borderColor: AM }, T(i ? 'Compuerta 2 (resultado, C)' : 'Compuerta 1 (A, B)', { fontSize: 13, color: MU }), Row({ justifyContent: 'center' }, ...d.opts.map(o => Chip(o, x === o, () => { const n = g.slice(); n[i] = o; setG(n); }, AM)))))),
        Card({}, Row({ fontSize: 12, color: MU, fontWeight: 700 }, ...['A', 'B', 'C'].slice(0, d.n).map(c => D({ width: 30, textAlign: 'center' }, c)), D({ width: 70, textAlign: 'center' }, 'OBJETIVO'), D({ width: 70, textAlign: 'center' }, 'SU CIRCUITO')),
          ...d.filas.map((f, i) => Row({ borderTop: '1px solid ' + LN, paddingTop: 4 }, ...f.map(B), D({ width: 70, display: 'flex', justifyContent: 'center' }, B(d.tabla[i])), D({ width: 70, display: 'flex', justifyContent: 'center', background: sal ? (sal[i] === d.tabla[i] ? 'rgba(127,224,160,.15)' : 'rgba(255,123,114,.15)') : 'none', borderRadius: 6 }, sal ? B(sal[i]) : T('·', { color: MU }))))),
        Btn('Comprobar', ok, null, !listo));
    }
    // ---------- Matriz de Raven ----------
    function Raven(p) {
      const fin = useFin(p), X = window.ESC_RETOS, R = rnd(p), [d] = useState(() => X.genRaven(p.tier, R)), [v, setV] = useState({ fig: 0, num: 1, fill: 0 }), [int, setInt] = useState(0), FG = X.FIG, FV = X.FIG_V;
      const celda = (c, key, hi) => D({ key, width: 92, height: 92, borderRadius: 10, background: PAN, border: '2px solid ' + (hi ? AM : LN), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, fontSize: 26, color: c.fill === 2 ? AM : J1, flexWrap: 'wrap', padding: 6 }, ...[...Array(c.num)].map((_, i) => h('span', { key: i, style: { opacity: c.fill === 2 ? 0.75 : 1 } }, c.fill === 1 ? FV[c.fig] : FG[c.fig])));
      const ok = () => { if (v.fig === d.resp.fig && v.num === d.resp.num && v.fill === d.resp.fill) return fin(true, int ? 0.75 : 1, 'Regla descubierta: ' + d.desc + '.'); setInt(int + 1); const m = []; if (v.fig !== d.resp.fig) m.push('la figura'); if (v.num !== d.resp.num) m.push('la cantidad'); if (v.fill !== d.resp.fill) m.push('el relleno'); p.onErr('Revisen ' + m.join(' y ') + '. Comparen fila por fila.'); };
      return Wrap('Cada fila y columna sigue una regla de figura, cantidad y relleno. Construyan la pieza que falta con las perillas.',
        D({ display: 'grid', gridTemplateColumns: 'repeat(3, 92px)', gap: 8, justifyContent: 'center' }, ...d.celdas.map((c, i) => i < 8 ? celda(c, i) : celda(v, i, true))),
        Card({}, Row({}, T('Figura:', { width: 90 }), ...FG.map((f, i) => Chip(f, v.fig === i, () => setV(Object.assign({}, v, { fig: i }))))), Row({}, T('Cantidad:', { width: 90 }), ...[1, 2, 3].map(n => Chip(String(n), v.num === n, () => setV(Object.assign({}, v, { num: n }))))), Row({}, T('Relleno:', { width: 90 }), ...['lleno', 'vacío', 'claro'].map((t, i) => Chip(t, v.fill === i, () => setV(Object.assign({}, v, { fill: i })))))),
        Btn('Colocar la pieza', ok));
    }
    // ---------- La regla cambió ----------
    function Wcst(p) {
      const fin = useFin(p), X = window.ESC_RETOS, R = rnd(p), [d] = useState(() => X.genWcst(p.tier, R)), [st, setSt] = useState({ i: 0, r: 0, racha: 0, n: 0, err: 0, fb: null });
      const carta = d.cartas[st.i % d.cartas.length], fig = (c, k) => D({ key: k, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', alignItems: 'center', width: 110, height: 130, background: '#f4f6fa', borderRadius: 10, border: '3px solid ' + LN, fontSize: 28, color: X.WC_COL[c.color] }, ...[...Array(c.numero)].map((_, i) => h('span', { key: i }, X.WC_FIG[c.forma])));
      const poner = k => { if (p.fin) return; const ok = X.pilaDe(carta, d.reglas[st.r]) === k; let { r, racha, n, err } = st; n++; if (ok) { racha++; if (racha >= d.K) { r++; racha = 0; } } else { racha = 0; err++; }
        p.snd && p.snd(ok ? 'ok' : 'err');
        if (r >= d.reglas.length) { setSt({ i: st.i + 1, r, racha, n, err, fb: true }); return fin(true, err <= d.reglas.length * 2 ? 1 : err <= d.reglas.length * 4 ? 0.75 : 0.5, 'Descubrieron las ' + d.reglas.length + ' reglas con ' + err + ' errores. La flexibilidad mental es cambiar de estrategia cuando algo deja de funcionar.'); }
        if (n >= d.max) { p.onFin(false, 0, 'Se acabaron las tarjetas. Cuando empiecen a fallar, prueben otro criterio: color, forma o cantidad.'); return; }
        setSt({ i: st.i + 1, r, racha, n, err, fb: ok }); };
      return Wrap('Pongan cada tarjeta en una de las 4 pilas. El juego solo dice «bien» o «mal»: descubran el criterio (color, forma o cantidad). ¡Cuidado: la regla cambia sin avisar!' + (d.avisa ? ' (En este nivel les avisamos cuando cambia.)' : ''),
        Row({ justifyContent: 'center', gap: 10 }, ...X.WC_PILAS.map((c, k) => h('div', { key: k, onClick: () => poner(k), style: { cursor: 'pointer' } }, fig(c, k)))),
        Row({ justifyContent: 'center', gap: 18 }, fig(carta, 'c'), D({ display: 'flex', flexDirection: 'column', gap: 6 }, T(st.fb == null ? 'Toquen una pila' : st.fb ? '✓ ¡Bien!' : '✗ No', { fontFamily: HEAD, fontSize: 26, color: st.fb == null ? MU : st.fb ? OK : ER }), T('Reglas descubiertas: ' + st.r + ' / ' + d.reglas.length, { color: MU }), T('Tarjetas: ' + st.n + ' / ' + d.max, { color: MU }), d.avisa && st.racha === 0 && st.r > 0 && st.fb ? T('¡La regla acaba de cambiar!', { color: AM, fontWeight: 700 }) : null)));
    }
    // ---------- Rejilla de Einstein ----------
    function Einstein(p) {
      const fin = useFin(p), X = window.ESC_RETOS, R = rnd(p), [d] = useState(() => X.genEinstein(p.tier, R)), [m, setM] = useState({}), [int, setInt] = useState(0);
      const cyc = k => setM(Object.assign({}, m, { [k]: m[k] === 'si' ? 'no' : m[k] === 'no' ? '' : 'si' }));
      const tabla = (cols, pre) => Card({ overflowX: 'auto' }, D({ display: 'grid', gridTemplateColumns: '110px repeat(' + cols.length + ', minmax(64px,1fr))', gap: 4 }, D({}), ...cols.map(c => T(c, { fontSize: 13, fontWeight: 700, textAlign: 'center', color: MU })),
        ...d.P.flatMap((pn, i) => [T(pn, { fontWeight: 700 })].concat(cols.map((_, j) => { const k = pre + i + '_' + j, v = m[k]; return h('button', { key: k, onClick: () => cyc(k), style: { height: 40, borderRadius: 8, border: '2px solid ' + LN, background: v === 'si' ? 'rgba(127,224,160,.25)' : v === 'no' ? 'rgba(255,123,114,.15)' : PAN, color: v === 'si' ? OK : ER, fontSize: 20, fontWeight: 800, cursor: 'pointer' } }, v === 'si' ? '✓' : v === 'no' ? '✗' : ''); })))));
      const ok = () => { let bien = d.P.every((_, i) => d.A.every((_, j) => (m['a' + i + '_' + j] === 'si') === (d.solA[i] === j))); if (d.dos) bien = bien && d.P.every((_, i) => d.B.every((_, j) => (m['b' + i + '_' + j] === 'si') === (d.solB[i] === j)));
        if (bien) return fin(true, int ? 0.75 : 1, '¡Deducción perfecta! Usaron cada pista para descartar.'); setInt(int + 1); p.onErr('Todavía hay casillas mal. Cada persona tiene exactamente un ✓ por tabla. Revisen las pistas una por una.'); };
      return Wrap('Usen las pistas para descubrir qué proyecto hace cada estudiante' + (d.dos ? ' y qué día lo presenta' : '') + '. Toquen una casilla: ✓ (sí) → ✗ (no) → vacía. Solo cuentan los ✓.',
        Card({ borderColor: AM }, T('PISTAS', { fontSize: 12, letterSpacing: '.12em', fontWeight: 700, color: AM }), ...d.pistas.map((t, i) => T((i + 1) + '. ' + t))), tabla(d.A, 'a'), d.dos ? tabla(d.B, 'b') : null, Btn('Comprobar', ok));
    }
    // ---------- Rutas de la ciudad ----------
    function Rutas(p) {
      const fin = useFin(p), X = window.ESC_RETOS, R = rnd(p), [d] = useState(() => X.genRutas(p.tier, R)), [ruta, setRuta] = useState([d.ini]), [int, setInt] = useState(0);
      const S = 90, pos = id => [(id % d.C) * S + 40, Math.floor(id / d.C) * S + 40], suma = ruta.slice(1).reduce((a, n, i) => a + X.aristaEntre(d, ruta[i], n).w, 0), last = ruta[ruta.length - 1];
      const tocar = id => { if (id === last) return; const k = ruta.indexOf(id); if (k >= 0) return setRuta(ruta.slice(0, k + 1)); const e = X.aristaEntre(d, last, id); if (!e) return p.onErr('Solo pueden avanzar a una esquina vecina, por una calle.'); if (e.obra) return p.onErr('Esa calle está en obra 🚧: busquen otro camino.'); setRuta(ruta.concat([id])); };
      const ok = () => { if (suma === d.opt) return fin(true, int ? 0.75 : 1, '¡Ruta más corta: ' + suma + ' minutos! Así calculan las apps de mapas.'); setInt(int + 1); p.onErr('Su ruta tarda ' + suma + ' min. Existe una más corta. Prueben otras calles.'); };
      const W = (d.C - 1) * S + 80, Hh = (d.F - 1) * S + 80;
      return Wrap('El robot de reparto sale del COLEGIO 🏫 y debe llegar a la CASA 🏠 lo más rápido posible. Cada calle tiene su tiempo en minutos. Toquen las esquinas para trazar la ruta.',
        Card({ alignItems: 'center' }, h('svg', { viewBox: '0 0 ' + W + ' ' + Hh, style: { width: '100%', maxWidth: W * 1.2, height: 'auto' } },
          ...Object.values(d.aristas).map((e, i) => { const [x1, y1] = pos(e.a), [x2, y2] = pos(e.b), en = ruta.some((n, k) => k && ((ruta[k - 1] === e.a && n === e.b) || (ruta[k - 1] === e.b && n === e.a))); return h('g', { key: 'e' + i }, h('line', { x1, y1, x2, y2, stroke: e.obra ? ER : en ? OK : '#41525c', strokeWidth: en ? 7 : 4, strokeDasharray: e.obra ? '8 6' : 'none' }), h('text', { x: (x1 + x2) / 2 + (e.dir === 'v' ? 10 : 0), y: (y1 + y2) / 2 - (e.dir === 'h' ? 8 : 0), fill: e.obra ? ER : TX, fontSize: 16, fontWeight: 700, fontFamily: 'monospace' }, e.obra ? '🚧' : e.w)); }),
          ...[...Array(d.C * d.F).keys()].map(id => { const [x, y] = pos(id), on = ruta.includes(id); return h('g', { key: 'n' + id, onClick: () => tocar(id), style: { cursor: 'pointer' } }, h('circle', { cx: x, cy: y, r: 16, fill: id === d.ini ? J1 : id === d.fin ? AM : on ? OK : '#22303a', stroke: TX, strokeWidth: 2 }), id === d.ini || id === d.fin ? h('text', { x, y: y + 6, textAnchor: 'middle', fontSize: 16 }, id === d.ini ? '🏫' : '🏠') : null); })),
          T('Tiempo de su ruta: ' + suma + ' min', { fontFamily: HEAD, fontSize: 20 })),
        Row({}, Btn('Enviar al robot', ok, null, last !== d.fin), Btn('Borrar ruta', () => setRuta([d.ini]), { background: PAN, color: TX, border: '2px solid ' + LN })));
    }
    make.c = { orden: Orden, armar: Armar, decision: Decision, sigue: Sigue, aparato: Aparato, error: Error_, reglas: Reglas, interrog: Interrog, master: Master, compuertas: Compuertas, raven: Raven, wcst: Wcst, einstein: Einstein, rutas: Rutas };
    return make.c;
  }
  window.V3_RETOS = { make };
})();
