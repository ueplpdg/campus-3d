// Generadores de retos (extraídos del Escape del Laboratorio).
(function () {
const GATES = { AND: (a, b) => a && b, OR: (a, b) => a || b, XOR: (a, b) => a !== b, NAND: (a, b) => !(a && b), NOR: (a, b) => !(a || b) };
function cpEval(tier, g, ins) { const a = GATES[g[0]](ins[0], ins[1]); return tier === 1 ? a : GATES[g[1]](a, ins[2]); }
function cpFilas(n) { return [...Array(1 << n).keys()].map(m => [...Array(n).keys()].map(i => !!((m >> (n - 1 - i)) & 1))); }
const CP_OPTS = { 1: ['AND', 'OR', 'XOR', 'NAND'], 2: ['AND', 'OR', 'XOR'], 3: ['AND', 'OR', 'XOR', 'NAND', 'NOR'] };
const MM = { 1: { L: 3, K: 4, rep: false, max: 7, obj: 4 }, 2: { L: 4, K: 5, rep: false, max: 8, obj: 5 }, 3: { L: 4, K: 6, rep: true, max: 9, obj: 6 } };
const NOMBRES = ['ARIA', 'BRUNO', 'CIRO', 'DANA', 'ELIO', 'FARA'];
function aplicar(op, x) { return op[0] === '+' ? x + op[1] : op[0] === '−' ? x - op[1] : x * op[1]; }
function serie(r, x0, n) {
  const out = [x0]; let x = x0, k = 0;
  for (let i = 1; i < n; i++) {
    const A = [r.a[0], r.a[1] + (r.crece || 0) * k];
    if (r.b && r.modo === 'luego') { x = aplicar(r.b, aplicar(A, x)); k++; }
    else if (r.b && r.modo === 'alterna') { if (i % 2 === 1) { x = aplicar(A, x); k++; } else x = aplicar(r.b, x); }
    else { x = aplicar(A, x); k++; }
    out.push(x);
  }
  return out;
}
function rng(seed) { let s = seed >>> 0 || 1; return function () { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function Hh(r) { const int = (a, b) => a + Math.floor(r() * (b - a + 1)); const pick = a => a[Math.floor(r() * a.length)]; const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const x = a[i]; a[i] = a[j]; a[j] = x; } return a; }; return { int, pick, shuffle }; }
function genReglas(tier, h) {
  for (let it = 0; it < 300; it++) {
    let r, x0;
    if (tier === 1) { if (h.int(0, 1)) { r = { a: ['+', h.int(3, 9)] }; x0 = h.int(1, 15); } else { r = { a: ['×', h.pick([2, 3])] }; x0 = r.a[1] === 2 ? h.int(1, 6) : h.int(1, 2); } }
    else if (tier === 2) { const t = h.int(0, 2); if (t === 0) { r = { a: ['×', 2], b: ['+', h.int(1, 5)], modo: 'luego' }; x0 = h.int(1, 4); } else if (t === 1) { const b = h.int(1, 3); r = { a: ['×', 2], b: ['−', b], modo: 'luego' }; x0 = h.int(b + 1, b + 4); } else { r = { a: ['+', h.int(1, 3)], b: ['×', 2], modo: 'luego' }; x0 = h.int(1, 3); } }
    else { const t = h.int(0, 2); if (t === 0) { r = { a: ['+', h.int(2, 6)], b: ['×', 2], modo: 'alterna' }; x0 = h.int(1, 5); } else if (t === 1) { const b = h.int(2, 5); r = { a: ['+', b + h.int(2, 5)], b: ['−', b], modo: 'alterna' }; x0 = h.int(1, 9); } else { r = { a: ['+', h.int(1, 4)], crece: h.int(1, 3) }; x0 = h.int(1, 9); } }
    const s = serie(r, x0, 7);
    if (s.every(v => v > 0 && v < 2000)) return { r, s };
  }
  return { r: { a: ['+', 3] }, s: serie({ a: ['+', 3] }, 2, 7) };
}
function genInterrog(tier, h) {
  const n = tier + 1;
  for (let it = 0; it < 4000; it++) {
    const nom = h.shuffle(NOMBRES).slice(0, n);
    const st = nom.map((_, s) => {
      const otros = [...Array(n).keys()].filter(i => i !== s), Y = h.pick(otros), otros2 = otros.filter(i => i !== Y), L = [];
      L.push({ t: nom[Y] + ' es leal.', f: a => a[Y] }, { t: nom[Y] + ' es saboteador.', f: a => !a[Y] });
      L.push({ t: 'Al menos uno de nosotros dos, ' + nom[Y] + ' y yo, es saboteador.', f: a => !a[Y] || !a[s] });
      L.push({ t: nom[Y] + ' y yo somos del mismo tipo.', f: a => a[Y] === a[s] });
      if (tier >= 2 && otros2.length) { const Z = h.pick(otros2); L.push({ t: nom[Y] + ' y ' + nom[Z] + ' son del mismo tipo.', f: a => a[Y] === a[Z] }, { t: nom[Y] + ' y ' + nom[Z] + ' son de distinto tipo.', f: a => a[Y] !== a[Z] }); }
      if (tier >= 3) { const k = h.int(1, 2); L.push({ t: 'Entre los cuatro hay exactamente ' + (k === 1 ? 'un leal.' : 'dos leales.'), f: a => a.filter(Boolean).length === k }, { t: 'Entre nosotros hay más saboteadores que leales.', f: a => a.filter(x => !x).length > a.filter(Boolean).length }); }
      return h.pick(L);
    });
    const sols = [];
    for (let m = 0; m < (1 << n); m++) { const a = [...Array(n).keys()].map(i => !!((m >> i) & 1)); if (st.every((q, s) => a[s] ? q.f(a) : !q.f(a))) sols.push(a); }
    if (sols.length === 1 && (tier === 1 || sols[0].some(Boolean) && sols[0].some(x => !x))) return { nom, st, sol: sols[0] };
  }
  return null;
}
function genMaster(tier, h) { const c = MM[tier]; const code = c.rep ? [...Array(c.L)].map(() => h.int(0, c.K - 1)) : h.shuffle([...Array(c.K).keys()]).slice(0, c.L); return Object.assign({ code }, c); }
function genCompuertas(tier, h) {
  const opts = CP_OPTS[tier], n = tier === 1 ? 2 : 3, slots = tier === 1 ? 1 : 2, filas = cpFilas(n);
  const combos = slots === 1 ? opts.map(a => [a]) : [].concat(...opts.map(a => opts.map(b => [a, b])));
  const tabla = g => filas.map(f => cpEval(tier, g, f));
  for (let it = 0; it < 300; it++) {
    const sol = h.pick(combos), t = tabla(sol), key = t.join();
    if (t.every(Boolean) || t.every(x => !x)) continue;
    if (combos.filter(c => tabla(c).join() === key).length === 1) return { n, slots, opts, sol, tabla: t, filas };
  }
  return { n: 2, slots: 1, opts: CP_OPTS[1], sol: ['AND'], tabla: tabla.call(null, ['AND']), filas: cpFilas(2) };
}
window.V3GEN = { GATES, cpEval, cpFilas, CP_OPTS, MM, NOMBRES, aplicar, serie, rng, Hh, genReglas, genInterrog, genMaster, genCompuertas };
})();
