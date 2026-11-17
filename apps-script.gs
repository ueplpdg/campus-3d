// Campus 3D · U. E. P. La Providencia · Apps Script (pegar completo en Extensiones → Apps Script)
// Cambie la clave del docente por la suya:
var CLAVE_DOCENTE = '1234';
var COLS3D = ['Codigo','Actualizado','Curso','Paralelo','PC','Integrantes','Proyecto actual','Fase','Completos','Nota','Detalle','Fallos','Pistas','Ayuda','Apoyo','Avance JSON'];

function doGet(e) {
  if (e.parameter.t3ds != null) return t3dSesion_(e.parameter.t3ds, e.parameter.id);
  if (e.parameter.t3did != null) return t3dGet_(e.parameter.t3did);
  if (e.parameter.t3dlista != null) return t3dLista_(e.parameter.t3dlista);
  return json_({ ok: true, app: 'Campus 3D' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.modo === 't3d') return t3dGuardar_(d);
    if (d.modo === 't3dadm') return t3dAdm_(d);
    if (d.modo === 't3dco') return t3dCo_(d);
    return ContentService.createTextOutput('modo desconocido');
  } finally { lock.releaseLock(); }
}

function buscar_(sh, id) {
  var n = sh.getLastRow(), r = 0;
  if (n < 2) return 0;
  sh.getRange(2, 1, n - 1, 1).getValues().forEach(function (x, i) { if (x[0] === id) r = i + 2; });
  return r;
}

function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function hoja3d_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName('Taller 3D') || ss.insertSheet('Taller 3D');
  if (sh.getLastRow() === 0) { sh.appendRow(COLS3D); sh.setFrozenRows(1); }
  return sh;
}

function t3dEstado_() {
  var P = PropertiesService.getScriptProperties(), ctl = { on: false, p: '', f: 0 }, ab = null, cfg = null;
  try { cfg = JSON.parse(P.getProperty('t3d_cfg') || 'null'); } catch (x) {}
  try { ctl = JSON.parse(P.getProperty('t3d_ctl') || '{"on":false,"p":"","f":0}'); } catch (x) {}
  try { ab = JSON.parse(P.getProperty('t3d_ab') || 'null'); } catch (x) {}
  return { abierta: P.getProperty('t3d_on') === '1', codigo: P.getProperty('t3d_cod') || '', ctl: ctl, abiertos: ab, cfg: cfg };
}

function t3dSesion_(cod, id) {
  var E = t3dEstado_(), r = { abierta: E.abierta, ok: E.abierta && String(cod || '').trim() === E.codigo, ctl: E.ctl, abiertos: E.abiertos, cfg: E.cfg };
  if (id) { var sh = hoja3d_(), f = buscar_(sh, String(id).toUpperCase()); if (f) { var v = sh.getRange(f, 14, 1, 2).getValues()[0]; r.ayuda = String(v[0] || 'NO'); r.apoyo = String(v[1] || 'No'); } }
  return json_(r);
}

function t3dGet_(id) {
  id = String(id || '').toUpperCase().trim();
  var sh = hoja3d_(), f = buscar_(sh, id);
  if (!f) return json_({ data: null });
  var v = sh.getRange(f, 1, 1, COLS3D.length).getValues()[0], data = null;
  try { data = JSON.parse(String(v[15] || 'null')); } catch (x) {}
  return json_({ data: data, ayuda: String(v[13] || 'NO'), apoyo: String(v[14] || 'No') });
}

function t3dGuardar_(d) {
  var sh = hoja3d_(), id = String(d.id || '').toUpperCase(), f = buscar_(sh, id), old = f ? sh.getRange(f, 1, 1, COLS3D.length).getValues()[0] : null;
  var ayuda = d.pedirAyuda ? 'SÍ' : d.cancelarAyuda ? 'NO' : (old ? old[13] : 'NO'), apoyo = old ? (old[14] || 'No') : 'No';
  var v = [id, new Date(), d.curso, d.par, d.pc, d.integrantes, d.actual, d.fase, d.completos, d.nota, d.detalle, d.fallos, d.pistas, ayuda || 'NO', apoyo, d.json];
  if (f) sh.getRange(f, 1, 1, COLS3D.length).setValues([v]); else sh.appendRow(v);
  return ContentService.createTextOutput('ok');
}

function t3dLista_(clave) {
  if (String(clave) !== String(CLAVE_DOCENTE)) return json_({ error: 'clave' });
  var sh = hoja3d_(), n = sh.getLastRow(), rows = [];
  if (n > 1) sh.getRange(2, 1, n - 1, 15).getValues().forEach(function (v) {
    rows.push({ id: v[0], visto: v[1] ? Utilities.formatDate(new Date(v[1]), Session.getScriptTimeZone(), 'dd/MM HH:mm') : '', ts: v[1] ? new Date(v[1]).getTime() : 0, curso: v[2], par: v[3], pc: v[4], integrantes: v[5], actual: v[6], fase: v[7], completos: v[8], nota: v[9], detalle: v[10], fallos: v[11], pistas: v[12], ayuda: v[13], apoyo: v[14] });
  });
  return json_({ rows: rows, sesion: t3dEstado_() });
}

function t3dAdm_(d) {
  if (String(d.clave) !== String(CLAVE_DOCENTE)) return ContentService.createTextOutput('clave');
  var P = PropertiesService.getScriptProperties();
  if (d.accion === 'sesion') { if (d.codigo) P.setProperty('t3d_cod', String(d.codigo)); P.setProperty('t3d_on', d.abierta ? '1' : '0'); }
  if (d.accion === 'cfg') P.setProperty('t3d_cfg', JSON.stringify(d.cfg || null));
  if (d.accion === 'abiertos') P.setProperty('t3d_ab', JSON.stringify(d.lista || null));
  if (d.accion === 'ctl') P.setProperty('t3d_ctl', JSON.stringify({ on: !!d.on, p: d.p || '', f: Number(d.f || 0) }));
  if (d.accion === 'apoyo' || d.accion === 'ayuda') { var sh = hoja3d_(), f = buscar_(sh, String(d.id).toUpperCase()); if (f) { if (d.accion === 'apoyo') sh.getRange(f, 15).setValue(d.on ? 'Sí' : 'No'); else sh.getRange(f, 14).setValue('NO'); } }
  return ContentService.createTextOutput('ok');
}

function t3dCo_(d) {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName('Coevaluación 3D') || ss.insertSheet('Coevaluación 3D');
  if (sh.getLastRow() === 0) { sh.appendRow(['Fecha', 'Curso', 'Paralelo', 'Código evaluador', 'Evaluadores', 'Código evaluado', 'Evaluados', 'Proyecto', 'Problema real (1-4)', 'Funciona (1-4)', 'Ficha clara (1-4)', 'Conclusiones (1-4)', 'Nota /10', 'Comentario']); sh.setFrozenRows(1); }
  sh.appendRow([new Date(), d.curso, d.par, d.evaluador, d.evaluadores, d.evaluado, d.evaluados, d.proyecto, d.c1, d.c2, d.c3, d.c4, d.nota, d.comentario]);
  return ContentService.createTextOutput('ok');
}
