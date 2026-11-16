// Taller 3D v2 · proyectos nuevos, componentes, precios, espacios 3D y mejoras del código.
(function () {
  const D = window.T3D_DATOS; if (!D) return;
  const C = D.COMP;
  C.lm35 = { n: 'Sensor de temperatura LM35', k: 'E', col: '#333', pins: [['VCC', 'vcc'], ['OUT', 'ana'], ['GND', 'gnd']], q: 'Mide la temperatura (°C).' };
  Object.assign(C, {
    tarjeta: { n: 'Lector de tarjeta (sale SÍ/NO)', k: 'E', col: '#2a62c9', pins: [['VCC', 'vcc'], ['OUT', 'dig'], ['GND', 'gnd']], q: 'Da HIGH cuando lee un carnet autorizado.' },
    gas: { n: 'Sensor de humo/gas MQ-2', k: 'E', col: '#9aa3ad', pins: [['VCC', 'vcc'], ['GND', 'gnd'], ['AO', 'ana']], q: 'Mide humo o gas en el aire (0 a 1023).' },
    agua_s: { n: 'Sensor de agua', k: 'E', col: '#c0392b', pins: [['VCC', 'vcc'], ['GND', 'gnd'], ['AO', 'ana']], q: 'Detecta agua sobre sus pistas (0 seco a 1023 mojado).' },
    rele_f: { n: 'Relé + ventilador', k: 'S', col: '#2f6fd0', pins: [['IN', 'dig'], ['VCC', 'vcc'], ['GND', 'gnd']], q: 'El relé enciende un ventilador.' },
    rele_p: { n: 'Relé + motor del rollo de papel', k: 'S', col: '#2f6fd0', pins: [['IN', 'dig'], ['VCC', 'vcc'], ['GND', 'gnd']], q: 'Gira el rollo y saca papel.' },
    rele_l: { n: 'Relé + lámparas del aula', k: 'S', col: '#2f6fd0', pins: [['IN', 'dig'], ['VCC', 'vcc'], ['GND', 'gnd']], q: 'Prende las lámparas de 110 V.' }
  });
  const ANA = ['ldr', 'hum', 'son', 'uv', 'lm35', 'gas', 'agua_s'];
  const PRECIO = { led_r: 0.15, led_a: 0.15, led_v: 0.15, led_b: 0.3, buzzer: 1, servo: 4.5, rele_b: 8, rele_g: 8, rele_v: 9, rele_f: 9, rele_p: 10, rele_l: 3, hc: 3, pir: 3.5, ir: 2, ldr: 0.5, hum: 3, son: 3.5, uv: 8, btn: 0.25, lm35: 3, tarjeta: 9, gas: 4.5, agua_s: 1.5, r220: 0.05, r10k: 0.05 };
  Object.keys(D.CURSO).forEach(k => { D.CURSO[k].req = 1; });
  D.CURSO['8vo'].huecos = 4; D.CURSO['9no'].huecos = 6; D.CURSO['10mo'].huecos = 7; D.CURSO['3BGU'].huecos = 9;
  D.CURSO['8vo'].escribir = 0; D.CURSO['9no'].escribir = 0; D.CURSO['10mo'].escribir = 0.5; D.CURSO['3BGU'].escribir = 1;
  D.CURSO['8vo'].minTxt = [20, 20, 40]; D.CURSO['9no'].minTxt = [30, 30, 60]; D.CURSO['10mo'].minTxt = [30, 30, 60]; D.CURSO['3BGU'].minTxt = [40, 40, 90];

  const rep = ['rep', 'Volver a leer (para siempre)', ['FIN', 'Esperar 1 hora']];
  const NEW = [
    { id: 'cerradura', n: 'Cerradura del laboratorio', lugar: 'Laboratorio', tipo: 'umbral', ico: '🔐', dig: true,
      historia: 'El laboratorio tiene computadoras y herramientas caras, y la llave se pierde. La cerradura inteligente se abre solo cuando alguien autorizado acerca su carnet al lector.',
      objetivo: 'Abrir la cerradura (servo 90°) si el lector detecta un carnet autorizado; si no, mantenerla cerrada (servo 0°).',
      criterios: ['Carnet autorizado → abre', 'Sin carnet → cerrada', 'Carnet no registrado → cerrada'],
      inst: [{ i: 'tj', c: 'tarjeta', lab: 'Lector de tarjeta', spot: 'lec', por: 'El lector va afuera, junto a la puerta, a la altura de la mano.' }, { i: 'sv', c: 'servo', lab: 'Servomotor (cerrojo)', spot: 'mar', por: 'El servo va en el marco, donde está el cerrojo de la puerta.' }],
      res: {}, dist: ['hum', 'son', 'led_a'],
      spots: [{ id: 'lec', lab: 'Junto a la puerta, afuera', pos: [0.95, 1.2, 0.16] }, { id: 'mar', lab: 'En el marco, junto al cerrojo', pos: [0.52, 1.05, 0.1] }, { id: 'tec', lab: 'En el techo', pos: [0, 2.9, 0.8], mal: 'Desde el techo nadie puede acercar el carnet al lector.' }, { id: 'pis', lab: 'Debajo de la puerta', pos: [0, 0.08, 0.35], mal: 'Ahí se golpea con los pies y se moja al trapear.' }],
      flujo: [['leer', 'Leer el lector de tarjetas', ['Abrir la cerradura', 'Medir la temperatura']], ['preg', '¿el carnet está autorizado?', ['¿hay alguien cerca?', '¿es de noche?']], ['si', 'Abrir la cerradura (servo 90°)', ['Cerrar la cerradura (servo 0°)', 'Sonar la alarma']], ['no', 'Mantener cerrada (servo 0°)', ['Abrir la cerradura (servo 90°)', 'FIN']], rep],
      sen: { k: 'tj', n: 'carnet autorizado' },
      slots: { n: [['SÍ', 'NO'], 'SÍ'], si: [['Abrir la cerradura', 'Cerrar la cerradura'], 'Abrir la cerradura'], no: [['Cerrar la cerradura', 'Abrir la cerradura'], 'Cerrar la cerradura'] },
      salida: { 'Abrir la cerradura': { sv: 90 }, 'Cerrar la cerradura': { sv: 0 } },
      tests: [{ v: 1, txt: 'El docente pasa su carnet' }, { v: 0, txt: 'Nadie en la puerta' }, { v: 0, txt: 'Carnet no registrado' }, { v: 1, txt: 'Estudiante autorizado' }],
      reflex: '¿Qué pasaría si se va la luz? ¿Cómo saldría la gente del laboratorio?' },
    { id: 'ventana', n: 'Ventana automática', lugar: 'Laboratorio', tipo: 'umbral', ico: '🪟', u: '°C', min: 10, max: 40,
      historia: 'A mediodía, con 20 computadoras encendidas, el laboratorio se calienta y nadie se concentra. La ventana debe abrirse sola cuando hace calor y cerrarse cuando está fresco.',
      objetivo: 'Abrir la ventana (servo 90°) si la temperatura es mayor a 28 °C; si no, cerrarla (servo 0°).',
      criterios: ['Más de 28 °C → abre', '28 °C o menos → cierra'],
      inst: [{ i: 'tm', c: 'lm35', lab: 'Sensor LM35', spot: 'par', por: 'El LM35 va en la pared, a 1,5 m, lejos del sol y de las computadoras: así mide el aire del laboratorio.' }, { i: 'sv', c: 'servo', lab: 'Servomotor de la ventana', spot: 'bis', por: 'El servo va en la bisagra de la ventana para empujarla.' }],
      res: {}, dist: ['ldr', 'hc', 'buzzer'],
      spots: [{ id: 'par', lab: 'Pared, a 1,5 m de altura', pos: [-1.35, 1.5, 0.1] }, { id: 'bis', lab: 'Bisagra de la ventana', pos: [0, 2.12, 0.12] }, { id: 'sol', lab: 'En el vidrio, al sol', pos: [0.5, 1.5, 0.14], mal: 'Al sol directo mediría mucho más calor que el real del laboratorio.' }, { id: 'pc', lab: 'Encima del CPU', pos: [1.55, 0.62, 0.45], mal: 'El CPU calienta: mediría su calor, no el del aire del laboratorio.' }],
      flujo: [['leer', 'Leer la temperatura', ['Abrir la ventana', 'Leer la luz']], ['preg', '¿temperatura > 28 °C?', ['¿temperatura < 28 °C?', '¿está lloviendo?']], ['si', 'Abrir la ventana (servo 90°)', ['Cerrar la ventana (servo 0°)', 'Sonar el buzzer']], ['no', 'Cerrar la ventana (servo 0°)', ['Abrir la ventana (servo 90°)', 'FIN']], rep],
      sen: { k: 'tm', n: 'temperatura' },
      slots: { op: [['>', '<'], '>'], n: [[20, 28, 40], 28], si: [['Abrir la ventana', 'Cerrar la ventana'], 'Abrir la ventana'], no: [['Cerrar la ventana', 'Abrir la ventana'], 'Cerrar la ventana'] },
      salida: { 'Abrir la ventana': { sv: 90 }, 'Cerrar la ventana': { sv: 0 } },
      tests: [{ v: 22, txt: 'Mañana fresca' }, { v: 31, txt: 'Mediodía caluroso' }, { v: 28, txt: 'Justo 28 °C' }, { v: 29, txt: '29 °C' }, { v: 18, txt: 'Día de lluvia' }, { v: 35, txt: 'Clase con todas las PC' }],
      reflex: '¿Qué otro sensor agregarían para que la ventana se cierre si empieza a llover?' },
    { id: 'templab', n: 'Control de temperatura', lugar: 'Laboratorio', tipo: 'tramos', ico: '🌡️', u: '°C', min: 10, max: 40,
      historia: 'Las computadoras se dañan con el calor. El laboratorio necesita un control: verde si todo está bien, ventilador si se calienta y alerta roja si hace demasiado calor.',
      objetivo: 'Menos de 24 °C: luz verde. De 24 a 27 °C: encender el ventilador. 28 °C o más: ventilador y luz roja de alerta.',
      criterios: ['< 24 °C → verde', '24 a 27 °C → ventilador', '28 °C o más → ventilador + rojo'],
      inst: [{ i: 'tm', c: 'lm35', lab: 'Sensor LM35', spot: 'par', por: 'El LM35 va en la pared del centro, a 1,5 m, lejos de las ventanas.' }, { i: 'rf', c: 'rele_f', lab: 'Relé + ventilador', spot: 'tec', por: 'El ventilador va en el techo, en el centro, para mover todo el aire.' }, { i: 'lv', c: 'led_v', lab: 'LED verde', spot: 'pan', por: 'Las luces van en un panel visible, junto a la puerta.' }, { i: 'lr', c: 'led_r', lab: 'LED rojo', spot: 'pan', por: 'Las luces van en un panel visible, junto a la puerta.' }],
      res: { r220: 2 }, dist: ['ldr', 'hum', 'servo'],
      spots: [{ id: 'par', lab: 'Pared del centro, a 1,5 m', pos: [-0.9, 1.5, 0.1] }, { id: 'tec', lab: 'Centro del techo', pos: [0, 2.85, 1.0] }, { id: 'pan', lab: 'Panel junto a la puerta', pos: [1.1, 1.75, 0.1] }, { id: 'ven', lab: 'Junto a la ventana, al sol', pos: [-1.8, 1.4, 0.2], mal: 'El sol lo calienta: el ventilador se prendería aunque el aire esté fresco.' }],
      flujo: [['leer', 'Leer la temperatura', ['Encender el ventilador', 'Leer la luz']], ['preg', '¿temperatura < 24 °C?', ['¿temperatura > 24 °C?', '¿hay alguien?']], ['si', 'Luz verde: todo normal', ['Encender el ventilador', 'Sonar la alarma']], ['preg2', '¿temperatura < 28 °C?', ['¿temperatura < 24 °C?', '¿temperatura > 40 °C?']], ['si2', 'Encender el ventilador', ['Luz verde: todo normal', 'Apagar todo']], ['no2', 'Ventilador + luz roja de alerta', ['Luz verde: todo normal', 'FIN']], rep],
      slots: { n1: [[20, 24, 30], 24], n2: [[26, 28, 35], 28], c1: [['Todo normal (verde)', 'Encender ventilador', 'Ventilador y alerta roja'], 'Todo normal (verde)'], c2: [['Encender ventilador', 'Todo normal (verde)', 'Ventilador y alerta roja'], 'Encender ventilador'], c3: [['Ventilador y alerta roja', 'Encender ventilador', 'Todo normal (verde)'], 'Ventilador y alerta roja'] },
      salida: { 'Todo normal (verde)': { lv: 1, rf: 0, lr: 0 }, 'Encender ventilador': { lv: 0, rf: 1, lr: 0 }, 'Ventilador y alerta roja': { lv: 0, rf: 1, lr: 1 } },
      tests: [{ v: 21, txt: 'Mañana fresca' }, { v: 25, txt: 'Clase normal' }, { v: 30, txt: 'Mediodía con todas las PC' }, { v: 24, txt: 'Justo 24 °C' }, { v: 28, txt: 'Justo 28 °C' }, { v: 33, txt: 'Día muy caluroso' }],
      reflex: '¿Por qué conviene tener tres niveles y no solo «prendido» o «apagado»?' },
    { id: 'impresora', n: 'Vigilante de la impresora 3D', lugar: 'Laboratorio', tipo: 'umbral', ico: '🖨️', u: '', min: 0, max: 1023,
      historia: 'La impresora 3D trabaja horas y a veces se queda sola. Si el filamento se recalienta, sale humo. El vigilante debe dar la alarma apenas detecte humo.',
      objetivo: 'Sonar el buzzer y prender el LED rojo si el sensor de humo marca más de 400; si no, todo apagado.',
      criterios: ['Humo (> 400) → alarma', 'Aire limpio → silencio'],
      inst: [{ i: 'gs', c: 'gas', lab: 'Sensor de humo MQ-2', spot: 'sob', por: 'El humo sube: el sensor va encima de la impresora.' }, { i: 'bz', c: 'buzzer', lab: 'Buzzer', spot: 'pue', por: 'La alarma va junto a la puerta para que la escuche quien pasa.' }, { i: 'lr', c: 'led_r', lab: 'LED rojo', spot: 'pue', por: 'La luz roja va junto a la puerta, visible desde afuera.' }],
      res: { r220: 1 }, dist: ['lm35', 'pir', 'servo'],
      spots: [{ id: 'sob', lab: 'Encima de la impresora', pos: [0, 1.75, 0.05] }, { id: 'pue', lab: 'Pared, junto a la puerta', pos: [1.3, 1.7, 0.1] }, { id: 'deb', lab: 'Debajo de la mesa', pos: [0, 0.3, 0.3], mal: 'El humo sube: debajo de la mesa tardaría mucho en detectarlo.' }, { id: 'fue', lab: 'Afuera del laboratorio', pos: [-1.6, 1.2, 0.5], mal: 'Afuera el humo ya se diluyó: detectaría el incendio demasiado tarde.' }],
      flujo: [['leer', 'Leer el sensor de humo', ['Sonar la alarma', 'Leer la temperatura']], ['preg', '¿humo > 400?', ['¿humo < 400?', '¿la impresora está prendida?']], ['si', 'Sonar el buzzer y prender LED rojo', ['Silencio y LED apagado', 'Abrir la puerta']], ['no', 'Silencio y LED apagado', ['Sonar el buzzer y prender LED rojo', 'FIN']], rep],
      sen: { k: 'gs', n: 'humo' },
      slots: { op: [['>', '<'], '>'], n: [[100, 400, 1000], 400], si: [['Alarma de humo', 'Todo en calma'], 'Alarma de humo'], no: [['Todo en calma', 'Alarma de humo'], 'Todo en calma'] },
      salida: { 'Alarma de humo': { bz: 1, lr: 1 }, 'Todo en calma': { bz: 0, lr: 0 } },
      tests: [{ v: 120, txt: 'Imprimiendo normal' }, { v: 650, txt: 'Sale humo del filamento' }, { v: 400, txt: 'Lectura justo 400' }, { v: 900, txt: 'Mucho humo' }, { v: 200, txt: 'Alguien abre la puerta' }, { v: 450, txt: 'Humo leve' }],
      reflex: '¿Qué más debería hacer el sistema, además de sonar, para evitar un incendio?' },
    { id: 'refri', n: 'Refri de bebidas del bar', lugar: 'Bar', tipo: 'umbral', ico: '🧃', u: '°C', min: 0, max: 30,
      historia: 'Si la refrigeradora del bar se queda mal cerrada, las bebidas y los yogures se calientan y se dañan. La alarma debe avisar a la señora del bar.',
      objetivo: 'Sonar el buzzer y prender el LED rojo si adentro hay más de 8 °C; si no, todo apagado.',
      criterios: ['Más de 8 °C → alarma', '8 °C o menos → silencio'],
      inst: [{ i: 'tm', c: 'lm35', lab: 'Sensor LM35', spot: 'den', por: 'El sensor va dentro de la refrigeradora, entre las bebidas.' }, { i: 'bz', c: 'buzzer', lab: 'Buzzer', spot: 'fue', por: 'La alarma va afuera, en la puerta, para que la escuchen.' }, { i: 'lr', c: 'led_r', lab: 'LED rojo', spot: 'fue', por: 'La luz roja va afuera, en la puerta del refri.' }],
      res: { r220: 1 }, dist: ['ldr', 'pir', 'servo'],
      spots: [{ id: 'den', lab: 'Dentro, entre las bebidas', pos: [0, 1.0, 0.1] }, { id: 'fue', lab: 'Afuera, en la puerta', pos: [0.32, 1.65, 0.44] }, { id: 'mot', lab: 'Junto al motor (atrás)', pos: [0, 0.3, -0.48], mal: 'El motor calienta: mediría su calor, no el de las bebidas.' }, { id: 'mos', lab: 'Sobre el mostrador', pos: [1.3, 1.05, 0.4], mal: 'Mediría el aire del bar, no el de adentro del refri.' }],
      flujo: [['leer', 'Leer la temperatura de adentro', ['Sonar la alarma', 'Contar personas']], ['preg', '¿temperatura > 8 °C?', ['¿temperatura < 8 °C?', '¿la puerta está abierta?']], ['si', 'Sonar el buzzer y prender LED rojo', ['Silencio y LED apagado', 'Apagar el refri']], ['no', 'Silencio y LED apagado', ['Sonar el buzzer y prender LED rojo', 'FIN']], rep],
      sen: { k: 'tm', n: 'temperatura' },
      slots: { op: [['>', '<'], '>'], n: [[4, 8, 20], 8], si: [['Alarma: se calienta', 'Temperatura correcta'], 'Alarma: se calienta'], no: [['Temperatura correcta', 'Alarma: se calienta'], 'Temperatura correcta'] },
      salida: { 'Alarma: se calienta': { bz: 1, lr: 1 }, 'Temperatura correcta': { bz: 0, lr: 0 } },
      tests: [{ v: 4, txt: 'Refri funcionando' }, { v: 12, txt: 'Puerta mal cerrada' }, { v: 8, txt: 'Justo 8 °C' }, { v: 6, txt: 'Recién cargado' }, { v: 15, txt: 'Se fue la luz' }, { v: 9, txt: '9 °C' }],
      reflex: '¿Cuánto dinero pierde el bar si se dañan las bebidas de un día?' },
    { id: 'luzaula', n: 'Lámparas del aula según el sol', lugar: 'Aula', tipo: 'umbral', ico: '🔆', u: '', min: 0, max: 1023,
      historia: 'Las lámparas del aula se quedan prendidas aunque entre mucho sol, y se gasta energía. Deben prenderse solo cuando la luz natural no alcanza.',
      objetivo: 'Encender las lámparas si la luz es menor a 400; si no, apagarlas.',
      criterios: ['Poca luz (< 400) → prende', 'Buena luz → apaga'],
      inst: [{ i: 'ld', c: 'ldr', lab: 'LDR', spot: 'pup', por: 'El LDR mide la luz que llega a los pupitres, lejos de las lámparas.' }, { i: 'rl', c: 'rele_l', lab: 'Relé de las lámparas', spot: 'tab', por: 'El relé de 110 V va dentro del tablero eléctrico del aula.' }],
      res: { r10k: 1 }, dist: ['pir', 'lm35', 'buzzer'],
      spots: [{ id: 'pup', lab: 'Pared, a la altura de los pupitres', pos: [0.7, 1.0, 0.1] }, { id: 'tab', lab: 'Tablero eléctrico', pos: [-1.1, 1.6, 0.12] }, { id: 'lam', lab: 'Junto a las lámparas del techo', pos: [0, 2.85, 0.9], mal: 'Al prenderse, las lámparas lo iluminan y se apagarían solas: prende y apaga sin parar.' }, { id: 'pis', lab: 'En el piso', pos: [0.4, 0.06, 0.7], mal: 'Un relé de 110 V en el piso es peligroso: va dentro del tablero.' }],
      flujo: [['leer', 'Leer la luz (LDR)', ['Encender las lámparas', 'Leer la temperatura']], ['preg', '¿luz < 400?', ['¿luz > 400?', '¿hay estudiantes?']], ['si', 'Encender las lámparas', ['Apagar las lámparas', 'Sonar el buzzer']], ['no', 'Apagar las lámparas', ['Encender las lámparas', 'FIN']], rep],
      sen: { k: 'ld', n: 'luz' },
      slots: { op: [['<', '>'], '<'], n: [[100, 400, 900], 400], si: [['Encender las lámparas', 'Apagar las lámparas'], 'Encender las lámparas'], no: [['Apagar las lámparas', 'Encender las lámparas'], 'Apagar las lámparas'] },
      salida: { 'Encender las lámparas': { rl: 1 }, 'Apagar las lámparas': { rl: 0 } },
      tests: [{ v: 150, txt: 'Día muy nublado' }, { v: 800, txt: 'Mañana soleada' }, { v: 350, txt: 'Tarde gris' }, { v: 400, txt: 'Lectura justo 400' }, { v: 900, txt: 'Mediodía' }, { v: 50, txt: 'Tormenta' }],
      reflex: '¿Por qué el LDR no debe estar cerca de las lámparas? Expliquen qué pasaría.' },
    { id: 'ventaula', n: 'Ventilador inteligente del aula', lugar: 'Aula', tipo: 'dos', ico: '🌀',
      historia: 'En el aula del tercer piso hace mucho calor, pero el ventilador se queda prendido en el recreo, cuando no hay nadie. Debe funcionar solo si hay estudiantes Y hace calor.',
      objetivo: 'Encender el ventilador si hay movimiento Y la temperatura es mayor a 26 °C.',
      criterios: ['Estudiantes + calor → prende', 'Aula vacía → apagado', 'Fresco → apagado'],
      inst: [{ i: 'pr', c: 'pir', lab: 'Sensor PIR', spot: 'esq', por: 'El PIR va alto en una esquina, mirando hacia los pupitres.' }, { i: 'tm', c: 'lm35', lab: 'Sensor LM35', spot: 'par', por: 'El LM35 va en la pared lateral, a 1,5 m, lejos del proyector.' }, { i: 'rf', c: 'rele_f', lab: 'Relé + ventilador', spot: 'tec', por: 'El ventilador va en el centro del techo.' }],
      res: {}, dist: ['ldr', 'son', 'led_v'],
      spots: [{ id: 'esq', lab: 'Esquina alta, mirando a los pupitres', pos: [1.25, 2.6, 0.12] }, { id: 'par', lab: 'Pared lateral, a 1,5 m', pos: [-0.9, 1.5, 0.1] }, { id: 'tec', lab: 'Centro del techo', pos: [0, 2.85, 1.0] }, { id: 'pro', lab: 'Junto al proyector', pos: [0.2, 2.3, 1.6], mal: 'El proyector calienta el aire: el sensor mediría más calor del real.' }],
      flujo: [['leer', 'Leer el PIR y la temperatura', ['Encender el ventilador', 'Leer la luz']], ['preg', '¿hay movimiento Y temperatura > 26 °C?', ['¿hay movimiento O temperatura > 26 °C?', '¿temperatura < 26 °C?']], ['si', 'Encender el ventilador', ['Apagar el ventilador', 'Abrir la ventana']], ['no', 'Apagar el ventilador', ['Encender el ventilador', 'FIN']], rep],
      a: { k: 'pr', n: 'hay movimiento', dig: true }, b: { k: 'tm', n: 'temperatura', u: '°C', min: 10, max: 40 },
      slots: { op: [['>', '<'], '>'], n: [[20, 26, 35], 26], lg: [['Y', 'O'], 'Y'], si: [['Encender el ventilador', 'Apagar el ventilador'], 'Encender el ventilador'], no: [['Apagar el ventilador', 'Encender el ventilador'], 'Apagar el ventilador'] },
      salida: { 'Encender el ventilador': { rf: 1 }, 'Apagar el ventilador': { rf: 0 } },
      tests: [{ a: 1, b: 30, txt: 'Clase con calor' }, { a: 1, b: 22, txt: 'Clase fresca' }, { a: 0, b: 31, txt: 'Recreo caluroso, aula vacía' }, { a: 1, b: 27, txt: 'Clase a 27 °C' }, { a: 1, b: 26, txt: 'Clase a 26 °C' }, { a: 0, b: 20, txt: 'Noche' }],
      reflex: '¿Cuántas horas al día se ahorrarían si el ventilador se apaga en el recreo?' },
    { id: 'papel', n: 'Dispensador de papel', lugar: 'Baños', tipo: 'umbral', ico: '🧻', u: 'cm', min: 0, max: 100,
      historia: 'Del dispensador de papel se desperdician rollos enteros y tocarlo pasa los microbios. Debe soltar una porción solo cuando se acerca una mano.',
      objetivo: 'Encender el motor si algo está a menos de 10 cm; si no, detenerlo.',
      criterios: ['Mano a menos de 10 cm → suelta papel', 'Sin mano → no suelta'],
      inst: [{ i: 'hc', c: 'hc', lab: 'Ultrasónico', spot: 'deb', por: 'El ultrasónico va debajo de la salida del papel, mirando hacia donde se pone la mano.' }, { i: 'rp', c: 'rele_p', lab: 'Relé + motor del rollo', spot: 'den', por: 'El motor va dentro de la caja, junto al rollo.' }],
      res: {}, dist: ['pir', 'led_v', 'lm35'],
      spots: [{ id: 'deb', lab: 'Debajo de la salida del papel', pos: [0, 0.95, 0.28] }, { id: 'den', lab: 'Dentro de la caja', pos: [0, 1.32, 0.12] }, { id: 'pue', lab: 'En la puerta del baño', pos: [-1.3, 1.2, 0.35], mal: 'Soltaría papel cada vez que alguien entra al baño.' }, { id: 'tec', lab: 'En el techo', pos: [0, 2.9, 0.8], mal: 'Desde el techo mediría la distancia a cualquier persona, no a la mano.' }],
      flujo: [['leer', 'Medir la distancia', ['Soltar papel', 'Leer la luz']], ['preg', '¿distancia < 10 cm?', ['¿distancia > 10 cm?', '¿se acabó el papel?']], ['si', 'Girar el motor y soltar papel', ['Detener el motor', 'Sonar el buzzer']], ['no', 'Detener el motor', ['Girar el motor y soltar papel', 'FIN']], ['rep', 'Volver a medir (para siempre)', ['FIN', 'Esperar 1 hora']]],
      sen: { k: 'hc', n: 'distancia' },
      slots: { op: [['<', '>'], '<'], n: [[3, 10, 50], 10], si: [['Soltar papel', 'Detener el motor'], 'Soltar papel'], no: [['Detener el motor', 'Soltar papel'], 'Detener el motor'] },
      salida: { 'Soltar papel': { rp: 1 }, 'Detener el motor': { rp: 0 } },
      tests: [{ v: 5, txt: 'Mano debajo' }, { v: 40, txt: 'Alguien pasa' }, { v: 10, txt: 'Mano justo a 10 cm' }, { v: 8, txt: 'Mano a 8 cm' }, { v: 80, txt: 'Baño vacío' }, { v: 2, txt: 'Mano muy cerca' }],
      reflex: '¿Cuánto papel se ahorraría el colegio en un mes?' },
    { id: 'luzpasillo', n: 'Luces del pasillo', lugar: 'Pasillo', tipo: 'dos', ico: '🚶',
      historia: 'En la tarde, el pasillo del segundo piso queda oscuro y nadie apaga las luces al irse. Deben prenderse solo si alguien pasa Y está oscuro.',
      objetivo: 'Encender la lámpara si hay movimiento Y la luz es menor a 300.',
      criterios: ['Alguien pasa de noche → prende', 'Alguien pasa de día → apagada', 'Sin nadie → apagada'],
      inst: [{ i: 'pr', c: 'pir', lab: 'Sensor PIR', spot: 'tec', por: 'El PIR va en el techo, mirando a lo largo del pasillo.' }, { i: 'ld', c: 'ldr', lab: 'LDR', spot: 'ven', por: 'El LDR va junto a la ventana para medir la luz natural.' }, { i: 'lb', c: 'led_b', lab: 'Lámpara', spot: 'lam', por: 'La lámpara va en el techo, en el centro del pasillo.' }],
      res: { r220: 1, r10k: 1 }, dist: ['son', 'buzzer', 'hc'],
      spots: [{ id: 'tec', lab: 'Techo, mirando al pasillo', pos: [-0.9, 2.9, 0.8] }, { id: 'ven', lab: 'Junto a la ventana', pos: [1.45, 1.3, 0.12] }, { id: 'lam', lab: 'Centro del techo', pos: [0, 3.0, 1.6] }, { id: 'col', lab: 'Detrás de la columna', pos: [-1.6, 1.4, 0.9], mal: 'La columna le tapa la vista: no ve a quien pasa.' }],
      flujo: [['leer', 'Leer el PIR y la luz (LDR)', ['Encender la lámpara', 'Leer el ruido']], ['preg', '¿hay movimiento Y luz < 300?', ['¿hay movimiento O luz < 300?', '¿luz > 300?']], ['si', 'Encender la lámpara', ['Apagar la lámpara', 'Sonar el buzzer']], ['no', 'Apagar la lámpara', ['Encender la lámpara', 'FIN']], rep],
      a: { k: 'pr', n: 'hay movimiento', dig: true }, b: { k: 'ld', n: 'luz', u: '', min: 0, max: 1023 },
      slots: { op: [['<', '>'], '<'], n: [[100, 300, 900], 300], lg: [['Y', 'O'], 'Y'], si: [['Encender la lámpara', 'Apagar la lámpara'], 'Encender la lámpara'], no: [['Apagar la lámpara', 'Encender la lámpara'], 'Apagar la lámpara'] },
      salida: { 'Encender la lámpara': { lb: 1 }, 'Apagar la lámpara': { lb: 0 } },
      tests: [{ a: 1, b: 120, txt: 'Pasa alguien a las 18:00' }, { a: 1, b: 750, txt: 'Pasa alguien a las 10:00' }, { a: 0, b: 100, txt: 'Noche sin nadie' }, { a: 1, b: 280, txt: 'Tarde nublada' }, { a: 1, b: 320, txt: 'Tarde clara' }, { a: 0, b: 800, txt: 'Mañana sin nadie' }],
      reflex: '¿En qué otros lugares del colegio servirían estas luces?' },
    { id: 'mojado', n: 'Aviso de piso mojado', lugar: 'Pasillo', tipo: 'umbral', ico: '⚠️', u: '', min: 0, max: 1023,
      historia: 'Junto al bebedero del pasillo el piso se moja y alguien ya se resbaló. El sistema debe avisar con luz amarilla y un pitido cuando detecta agua.',
      objetivo: 'Prender el LED amarillo y el buzzer si el sensor de agua marca más de 300; si no, apagarlos.',
      criterios: ['Agua (> 300) → aviso', 'Piso seco → sin aviso'],
      inst: [{ i: 'ag', c: 'agua_s', lab: 'Sensor de agua', spot: 'pis', por: 'El sensor va en el piso, junto al bebedero, donde cae el agua.' }, { i: 'la', c: 'led_a', lab: 'LED amarillo', spot: 'par', por: 'El aviso va en la pared, a la altura de los ojos.' }, { i: 'bz', c: 'buzzer', lab: 'Buzzer', spot: 'par', por: 'El buzzer va junto a la luz de aviso.' }],
      res: { r220: 1 }, dist: ['hum', 'pir', 'servo'],
      spots: [{ id: 'pis', lab: 'Piso junto al bebedero', pos: [0.1, 0.06, 0.55] }, { id: 'par', lab: 'Pared, a la altura de los ojos', pos: [0.95, 1.6, 0.1] }, { id: 'tec', lab: 'En el techo', pos: [0, 2.9, 0.8], mal: 'El agua cae al piso: en el techo nunca se moja.' }, { id: 'den', lab: 'Dentro del bebedero', pos: [0, 0.9, 0], mal: 'Adentro siempre hay agua: daría el aviso todo el tiempo.' }],
      flujo: [['leer', 'Leer el sensor de agua', ['Prender el aviso', 'Leer la luz']], ['preg', '¿agua > 300?', ['¿agua < 300?', '¿hay alguien?']], ['si', 'Prender luz amarilla y buzzer', ['Apagar el aviso', 'Abrir la llave']], ['no', 'Apagar el aviso', ['Prender luz amarilla y buzzer', 'FIN']], rep],
      sen: { k: 'ag', n: 'agua' },
      slots: { op: [['>', '<'], '>'], n: [[50, 300, 1000], 300], si: [['Aviso: piso mojado', 'Sin aviso'], 'Aviso: piso mojado'], no: [['Sin aviso', 'Aviso: piso mojado'], 'Sin aviso'] },
      salida: { 'Aviso: piso mojado': { la: 1, bz: 1 }, 'Sin aviso': { la: 0, bz: 0 } },
      tests: [{ v: 20, txt: 'Piso seco' }, { v: 650, txt: 'Se derramó agua' }, { v: 300, txt: 'Lectura justo 300' }, { v: 500, txt: 'Charco pequeño' }, { v: 100, txt: 'Piso trapeado y seco' }, { v: 900, txt: 'Bebedero goteando' }],
      reflex: '¿Qué más podría hacer el colegio para evitar que la gente se resbale?' }
  ];
  NEW.forEach(p => { if (!D.P.find(x => x.id === p.id)) D.P.push(p); });
  const solar = D.P.find(p => p.id === 'solar'); if (solar) solar.ejemplo = { imp: 'En el recreo los estudiantes pasan mucho tiempo al sol y en Ecuador el índice UV llega a 11 o más. Sin un aviso, nadie sabe cuándo usar protector, gorra o sombra.', mej: 'Agregar una pantalla con el valor exacto y un mensaje, y un panel solar para que funcione sin cables.', con: 'Un sensor UV y tres LED bastan para cuidar la piel de todo el colegio. El algoritmo con dos preguntas (UV < 3 y UV < 8) separa los tres niveles de riesgo y lo comprobamos con seis situaciones reales.' };

  // ---------- Código Arduino más completo ----------
  const c0 = D.codigo;
  D.codigo = function (p, sl, pins, aj) {
    let L = c0(p, sl, pins).split('\n'); const up = s => s.toUpperCase();
    p.inst.forEach(it => { if (ANA.includes(it.c) && !['ldr', 'hum', 'son', 'uv'].includes(it.c)) { const K = up(it.i); L = L.filter(l => l.trim() !== 'pinMode(' + K + ', INPUT);').map(l => l.split('digitalRead(' + K + ')').join('analogRead(' + K + ')')); } });
    p.inst.filter(i => i.c === 'lm35').forEach(it => { const K = 'analogRead(' + up(it.i) + ')'; L = L.map(l => /^  int \w+ = /.test(l) && l.includes(K) ? l.replace(K, K + ' * 0.488') + '  // LM35: 10 mV por °C' : l); });
    const sv = p.inst.find(i => i.c === 'servo'), hc = p.inst.find(i => i.c === 'hc'), iS = L.indexOf('void setup() {');
    const add = [];
    if (sv) add.push('  tapa.attach(' + up(sv.i) + ');');
    if (hc) add.push('  pinMode(' + up(hc.i) + '_TRIG, OUTPUT);', '  pinMode(' + up(hc.i) + '_ECHO, INPUT);');
    add.push('  Serial.begin(9600);');
    if (iS >= 0) L.splice(iS + 1, 0, ...add);
    if (sv) { const k = L.findIndex(l => l.startsWith('#include')); L.splice(k + 1, 0, 'Servo tapa;'); }
    const iD = L.findIndex(l => /^  int (dato|a) = /.test(l)); if (iD >= 0) { const v = /^  int a/.test(L[iD]) ? 'b' : 'dato'; const j = v === 'b' ? iD + 1 : iD; L.splice(j + 1, 0, '  Serial.println(' + v + ');'); }
    const dl = L.lastIndexOf('  delay(100);'); if (dl >= 0 && aj && aj.loop != null) L[dl] = '  delay(' + aj.loop + ');';
    if (hc) L.push('', 'long medirDistancia() {', '  digitalWrite(' + up(hc.i) + '_TRIG, LOW);', '  delayMicroseconds(2);', '  digitalWrite(' + up(hc.i) + '_TRIG, HIGH);', '  delayMicroseconds(10);', '  digitalWrite(' + up(hc.i) + '_TRIG, LOW);', '  return pulseIn(' + up(hc.i) + '_ECHO, HIGH) / 58;', '}');
    return L.join('\n');
  };

  // ---------- Ajustes mecánicos y de calibración ----------
  const AJ = {
    ang: { n: 'Ángulo de apertura del servo', u: '°', min: 0, max: 180, step: 5, ok: [80, 100], def: 30, ex: 'Con poco ángulo no abre del todo; cerca de 180° fuerza el mecanismo y puede romperlo. Alrededor de 90° es lo correcto.' },
    inc: { n: 'Inclinación del ultrasónico', u: '°', min: 0, max: 60, step: 5, ok: [0, 15], def: 40, ex: 'El HC-SR04 mide en un cono de unos 15°. Muy inclinado, mide el piso o la pared en vez de la mano.' },
    pir: { n: 'Retardo del PIR (perilla naranja)', u: 's', min: 1, max: 300, step: 1, ok: [5, 30], def: 200, ex: 'Es cuánto tiempo mantiene la señal después de detectar. Muy largo: queda prendido minutos sin nadie. Muy corto: se apaga mientras alguien está quieto.' },
    act: { n: 'Tiempo que se activa el motor o la bomba', u: 's', min: 0, max: 20, step: 0.5, ok: [0.5, 3], def: 10, ex: 'Debe alcanzar para una porción (de gel, papel o agua) sin desperdiciar. Entre medio segundo y 3 segundos.' },
    hz: { n: 'Tono del buzzer', u: 'Hz', min: 100, max: 8000, step: 100, ok: [1500, 3500], def: 200, ex: 'El oído humano escucha mejor entre 1500 y 3500 Hz: ahí la alarma se nota aunque haya ruido en el colegio.' },
    mues: { n: 'Lecturas que se promedian', u: '', min: 1, max: 50, step: 1, ok: [5, 20], def: 1, ex: 'Promediar varias lecturas quita el «ruido» del sensor. Con 1 sola el valor salta; con 50 el sistema se vuelve lento.' },
    loop: { n: 'Pausa del loop (delay)', u: 'ms', min: 0, max: 3000, step: 50, ok: [50, 500], def: 2000, ex: 'Si la pausa es muy larga, el sistema reacciona tarde; si es 0, el Arduino lee miles de veces por segundo y satura el monitor serial. Entre 50 y 500 ms es ideal.' }
  };
  D.ajustes = function (p, n) {
    const has = c => p.inst.some(i => c.includes(i.c)), out = [];
    if (has(['servo'])) out.push('ang'); if (has(['hc'])) out.push('inc'); if (has(['pir'])) out.push('pir'); if (has(['rele_g', 'rele_b', 'rele_v', 'rele_p'])) out.push('act'); if (has(['buzzer'])) out.push('hz'); if (has(ANA)) out.push('mues');
    const sel = out.slice(0, Math.max(1, (n || 3) - 1)); sel.push('loop'); return sel.map(k => Object.assign({ k }, AJ[k]));
  };
  D.ANA = ANA; D.PRECIO = PRECIO;

  // ---------- Fallas sorpresa ----------
  D.fallas = function (p) {
    const sen = p.inst.find(i => C[i.c].k === 'E'), led = p.inst.find(i => /^led/.test(i.c)), sv = p.inst.find(i => i.c === 'servo'), rl = p.inst.find(i => /^rele/.test(i.c)), an = p.inst.find(i => ANA.includes(i.c)), out = [];
    if (sen) out.push({ t: 'cable', sin: 'Ya instalado, el sistema se queda siempre igual aunque cambie la situación. El monitor serial muestra que el ' + sen.lab + ' lee siempre 0.', causas: ['El cable de señal del ' + sen.lab + ' se soltó de su pin', 'El diagrama de flujo está mal', 'Al Arduino le falta el programa'], arreglos: ['Revisar y volver a conectar la pata de señal a su pin, y comprobar con el monitor serial', 'Cambiar el Arduino por uno nuevo', 'Borrar el programa y escribirlo otra vez'] });
    if (led) out.push({ t: 'led', sin: 'El ' + led.lab + ' nunca se enciende, pero el monitor serial muestra que el programa sí manda la orden de encender.', causas: ['El LED está conectado al revés (pata larga y corta cambiadas)', 'El sensor está dañado', 'Falta un delay en el código'], arreglos: ['Dar vuelta al LED: pata larga (+) hacia el pin con la resistencia de 220 Ω y pata corta (−) a GND', 'Cambiar el sensor por otro', 'Poner más resistencias en serie'] });
    if (sv) out.push({ t: 'servo', sin: 'Cada vez que el servo se mueve, tiembla y el Arduino se reinicia solo.', causas: ['El servo pide más corriente de la que da el Arduino', 'El código tiene un error de escritura', 'El sensor está mal ubicado'], arreglos: ['Alimentar el servo con una fuente externa de 5 V y unir los GND', 'Conectar el servo a un pin analógico', 'Desconectar el GND del servo'] });
    if (rl) out.push({ t: 'rele', sin: 'Se escucha el «clic» del relé cuando debe activarse, pero el aparato no funciona.', causas: ['Falta conectar el aparato a los bornes COM y NO del relé, con su propia alimentación', 'El sensor está desconectado', 'Falta un comentario en el código'], arreglos: ['Conectar el aparato a COM y NO del relé y darle su propia fuente', 'Cambiar el diagrama de flujo', 'Poner un LED en lugar del relé'] });
    if (an) out.push({ t: 'calib', sin: 'En el lugar real, cuando el valor está cerca del límite, el sistema se prende y se apaga sin parar.', causas: ['La lectura del sensor oscila («ruido») justo alrededor del umbral', 'El cable de 5 V está suelto', 'El LED está al revés'], arreglos: ['Promediar varias lecturas o usar dos límites (histéresis) para que no cambie a cada rato', 'Quitar el sensor', 'Subir el delay del loop a 1 hora'] });
    return out;
  };

  // ---------- Espacios y maquetas 3D ----------
  const EST = { labb: { x: 28, z: 11, r: Math.PI, w: 14, n: 'LABORATORIO · ZONA B', c: '#8e5be0', pared: '#e4dcf5' }, pasillo: { x: 32, z: -11, r: 0, w: 11, n: 'PASILLO', c: '#d9534f', pared: '#f1e3d3' } };
  const PROY = { cerradura: ['labb', -4.4, -3.3], ventana: ['labb', 0, -3.6], templab: ['labb', 4.4, -3.3], impresora: ['lab', 0, -3.3], refri: ['bar', -4.6, -3.3], luzaula: ['aula', -4.4, -3.4], ventaula: ['aula', 4.2, -3.4], papel: ['bano', 0.3, -3.6], luzpasillo: ['pasillo', -2.5, -3.3], mojado: ['pasillo', 2.6, -3.3] };
  const glass = (T, c, o) => new T.MeshStandardMaterial({ color: c || '#bfe6ff', transparent: true, opacity: o || 0.35, roughness: 0.05, metalness: 0.1 });
  const lbl = (H, g, x, y, z, t) => { const c = H.cartel(t || '--', { fs: 36, h: 0.26 }); c.position.set(x, y, z); g.add(c); return c; };
  const fan = (H, g, x, y, z) => { const f = new H.T.Group(); f.position.set(x, y, z); g.add(f); H.cyl(0.08, 0.08, 0.1, '#ddd', f, 0, -0.05, 0); for (let k = 0; k < 4; k++) { const b = H.box(0.5, 0.02, 0.1, '#e9eef5', f, 0, -0.03, 0); b.position.x = 0; b.geometry.translate(0.26, 0, 0); b.rotation.y = k * Math.PI / 2; } H.cyl(0.02, 0.02, 0.4, '#888', g, x, y, z); return f; };
  const buzz = (H, g, x, y, z) => { const r = []; H.cyl(0.07, 0.07, 0.05, '#222', g, x, y, z); for (let k = 0; k < 3; k++) { const m = new H.T.Mesh(new H.T.RingGeometry(0.1 + k * 0.07, 0.12 + k * 0.07, 24), new H.T.MeshBasicMaterial({ color: '#ffd23f', transparent: true, opacity: 0, side: H.T.DoubleSide })); m.position.set(x, y + 0.05, z + 0.06); g.add(m); r.push(m); } return r; };
  const on = (m, v) => { if (m) m.emissiveIntensity = v ? 2.2 : 0; };
  const pared = (H, g, w, h, c) => H.box(w || 3.6, h || 2.8, 0.06, c || '#ffffff', g, 0, 0, -0.12);
  const M3D = {
    cerradura(H, g, E) { pared(H, g, 3.2, 2.9, '#e4dcf5'); [-1, 1].forEach(s => H.box(0.14, 2.3, 0.18, '#6d4c33', g, s * 0.6, 0, 0)); H.box(1.34, 0.14, 0.18, '#6d4c33', g, 0, 2.3, 0);
      const pv = new H.T.Group(); pv.position.set(-0.52, 0, 0.02); g.add(pv); const pu = H.box(1.02, 2.26, 0.05, '#9b7653', pv, 0.51, 0.02, 0); H.sph(0.04, '#d4af37', pv, 0.9, 1.05, 0.05);
      H.box(0.12, 0.18, 0.04, '#2a62c9', g, 0.95, 1.12, 0.14); E.lv = H.lamp('#2ee86d'); H.sph(0.035, E.lv, g, 0.95, 1.26, 0.17); E.lbl = lbl(H, g, 0, 2.75, 0.2, 'CERRADO');
      E.car = H.box(0.08, 0.12, 0.01, '#fff', g, 1.2, 1.15, 0.3); E.car.visible = false; E.pv = pv; E.ang = 0;
      E.upd = (o, i, s) => { E.goal = (o.sv || 0) * Math.PI / 180; on(E.lv, o.sv); E.car.visible = !!i.v; E.lbl.userData.set(!s ? 'LECTOR' : o.sv ? 'ABIERTO' : 'CERRADO'); };
      E.anim = dt => { E.ang += ((E.goal || 0) - E.ang) * Math.min(1, dt * 4); E.pv.rotation.y = E.ang; }; },
    ventana(H, g, E) { pared(H, g, 3.6, 2.9, '#e4dcf5'); H.box(1.7, 0.1, 0.16, '#ddd', g, 0, 0.98, 0); H.box(1.7, 0.1, 0.16, '#ddd', g, 0, 2.1, 0); [-1, 1].forEach(s => H.box(0.1, 1.22, 0.16, '#ddd', g, s * 0.8, 0.98, 0));
      H.box(0.7, 1.0, 0.02, glass(H.T), g, -0.4, 1.06, 0.02); const pv = new H.T.Group(); pv.position.set(0.4, 2.08, 0.05); g.add(pv); H.box(0.72, 1.06, 0.03, glass(H.T, '#cfeeff', 0.45), pv, 0, -1.06, 0);
      H.box(0.5, 0.75, 0.5, '#2b2f36', g, 1.55, 0, 0.45); E.lbl = lbl(H, g, -1.35, 1.82, 0.12, '-- °C'); E.pv = pv; E.ang = 0;
      E.upd = (o, i, s) => { E.goal = (o.sv || 0) / 90 * 0.9; E.lbl.userData.set(s && i.v != null ? i.v + ' °C' : '-- °C'); };
      E.anim = dt => { E.ang += ((E.goal || 0) - E.ang) * Math.min(1, dt * 3); E.pv.rotation.x = -E.ang; }; },
    templab(H, g, E) { pared(H, g, 3.2, 2.9, '#e4dcf5'); E.f = fan(H, g, 0, 2.95, 1.0); H.box(0.5, 0.5, 0.04, '#222', g, 1.1, 1.5, 0.02); E.lv = H.lamp('#2ee86d'); E.lr = H.lamp('#ff3b30'); H.sph(0.07, E.lv, g, 1.0, 1.8, 0.07); H.sph(0.07, E.lr, g, 1.2, 1.8, 0.07);
      for (let k = 0; k < 3; k++) { H.box(0.8, 0.05, 0.5, '#f0f0f0', g, -1.3 + k * 0.05, 0.75, 1.3); H.box(0.32, 0.24, 0.03, '#111', g, -1.3, 0.8, 1.15); } E.lbl = lbl(H, g, -0.9, 1.85, 0.12, '-- °C');
      E.upd = (o, i, s) => { on(E.lv, o.lv); on(E.lr, o.lr); E.spin = !!o.rf; E.lbl.userData.set(s && i.v != null ? i.v + ' °C' : '-- °C'); };
      E.anim = (dt, t) => { if (E.spin) E.f.rotation.y += dt * 14; if (E.lr.emissiveIntensity) E.lr.emissiveIntensity = Math.sin(t * 8) > 0 ? 2.2 : 0.4; }; },
    impresora(H, g, E) { H.box(1.2, 0.05, 0.7, '#f0f0f0', g, 0, 0.75, 0.2); [-1, 1].forEach(a => [-1, 1].forEach(b => H.cyl(0.03, 0.03, 0.75, '#777', g, a * 0.55, 0, 0.2 + b * 0.3)));
      H.box(0.55, 0.06, 0.5, '#333', g, 0, 0.8, 0.2); [-1, 1].forEach(s => H.box(0.05, 0.6, 0.05, '#333', g, s * 0.26, 0.86, 0)); H.box(0.6, 0.05, 0.05, '#333', g, 0, 1.44, 0); H.box(0.1, 0.12, 0.12, '#f0a726', g, 0, 1.3, 0.05); H.cyl(0.12, 0.12, 0.08, '#e74c3c', g, 0.45, 1.0, -0.05);
      E.humo = []; for (let k = 0; k < 6; k++) { const m = new H.T.Mesh(new H.T.SphereGeometry(0.08 + k * 0.02, 10, 8), new H.T.MeshStandardMaterial({ color: '#777', transparent: true, opacity: 0 })); m.position.set(0, 1.1, 0.1); g.add(m); E.humo.push(m); }
      E.lr = H.lamp('#ff3b30'); H.box(0.3, 0.3, 0.04, '#eee', g, 1.3, 1.55, 0.02); H.sph(0.06, E.lr, g, 1.3, 1.78, 0.06); E.rg = buzz(H, g, 1.3, 1.55, 0.06); E.lbl = lbl(H, g, 0, 2.05, 0.1, 'HUMO --');
      E.upd = (o, i, s) => { on(E.lr, o.lr); E.son = !!o.bz; E.hv = s && i.v != null ? i.v : 0; E.lbl.userData.set(s && i.v != null ? 'HUMO ' + i.v : 'HUMO --'); if (!o.bz) E.rg.forEach(r => { r.material.opacity = 0; }); };
      E.anim = (dt, t) => { const k = Math.min(1, (E.hv || 0) / 700); E.humo.forEach((m, j) => { const ph = (t * 0.5 + j / 6) % 1; m.position.y = 1.15 + ph * 0.9; m.position.x = Math.sin(t + j) * 0.1; m.material.opacity = k * 0.5 * (1 - ph); }); if (E.son) E.rg.forEach((r, j) => { r.material.opacity = 0.5 + 0.5 * Math.sin(t * 10 + j); }); }; },
    refri(H, g, E) { H.box(0.9, 1.9, 0.8, '#f2f4f7', g, 0, 0, 0); H.box(0.8, 1.6, 0.02, glass(H.T, '#dff4ff', 0.4), g, 0, 0.2, 0.41); for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) H.cyl(0.05, 0.05, 0.25, ['#e74c3c', '#f1c40f', '#27ae60', '#3498db'][c], g, -0.27 + c * 0.18, 0.3 + r * 0.5, 0.15);
      E.lr = H.lamp('#ff3b30'); H.sph(0.05, E.lr, g, 0.25, 1.7, 0.44); E.rg = buzz(H, g, 0.38, 1.6, 0.44); E.lbl = lbl(H, g, 0, 2.2, 0.3, '-- °C'); E.esc = H.box(0.8, 0.02, 0.02, '#8fd3ff', g, 0, 1.55, 0.42);
      E.upd = (o, i, s) => { on(E.lr, o.lr); E.son = !!o.bz; E.lbl.userData.set(s && i.v != null ? i.v + ' °C' : '-- °C'); E.esc.material.color.set(s && i.v > 8 ? '#ff8a65' : '#8fd3ff'); if (!o.bz) E.rg.forEach(r => { r.material.opacity = 0; }); };
      E.anim = (dt, t) => { if (E.son) E.rg.forEach((r, j) => { r.material.opacity = 0.5 + 0.5 * Math.sin(t * 10 + j); }); }; },
    luzaula(H, g, E) { pared(H, g, 3.6, 2.9, '#cfe3f5'); E.ven = new H.T.MeshStandardMaterial({ color: '#bfe6ff', transparent: true, opacity: 0.8 }); H.box(1.1, 0.9, 0.03, E.ven, g, 0.9, 1.3, 0.0); H.box(0.4, 0.5, 0.12, '#9aa5ab', g, -1.1, 1.35, 0.05);
      E.lm = [-0.7, 0.7].map(x => { const m = H.lamp('#fff4d6'); H.box(0.9, 0.06, 0.25, m, g, x, 2.92, 1.0); return m; }); E.pl = new H.T.PointLight('#fff4d6', 0, 6); E.pl.position.set(0, 2.6, 1.2); g.add(E.pl); E.lbl = lbl(H, g, 0.7, 0.72, 0.12, 'LUZ --');
      E.upd = (o, i, s) => { E.lm.forEach(m => { m.emissiveIntensity = o.rl ? 1.8 : 0; }); E.pl.intensity = o.rl ? 5 : 0; const v = s && i.v != null ? i.v : 600; E.ven.color.set(v < 300 ? '#2a3550' : v < 600 ? '#a9b8c8' : '#cfeeff'); E.lbl.userData.set(s && i.v != null ? 'LUZ ' + i.v : 'LUZ --'); }; },
    ventaula(H, g, E) { pared(H, g, 3.6, 2.9, '#cfe3f5'); E.f = fan(H, g, 0, 2.95, 1.0); E.p = H.persona('#3498db', g); E.p.position.set(0.3, 0, 1.4); E.p.visible = false; H.box(0.9, 0.06, 0.6, '#c99a5b', g, 0.3, 0.75, 1.9); E.lbl = lbl(H, g, -0.9, 1.85, 0.12, '-- °C');
      E.upd = (o, i, s) => { E.spin = !!o.rf; E.p.visible = !!i.a; E.lbl.userData.set(s && i.b != null ? i.b + ' °C' : '-- °C'); };
      E.anim = dt => { if (E.spin) E.f.rotation.y += dt * 14; }; },
    papel(H, g, E) { pared(H, g, 3.0, 2.9, '#d6f0f4'); H.box(0.42, 0.5, 0.25, '#f5f5f5', g, 0, 1.05, 0.05); H.cyl(0.1, 0.1, 0.36, '#fff', g, 0, 1.2, 0.08); E.hoja = H.box(0.3, 0.3, 0.01, '#ffffff', g, 0, 0.72, 0.2); E.hoja.visible = false;
      E.mano = H.box(0.12, 0.05, 0.2, '#e0b48a', g, 0, 0.85, 1.0); E.lbl = lbl(H, g, 0, 1.75, 0.15, '-- cm');
      E.upd = (o, i, s) => { E.hoja.visible = !!o.rp; const v = s && i.v != null ? i.v : 80; E.mano.position.z = 0.25 + Math.min(1, v / 80) * 1.2; E.lbl.userData.set(s && i.v != null ? i.v + ' cm' : '-- cm'); };
      E.anim = (dt, t) => { if (E.hoja.visible) E.hoja.position.y = 0.7 - ((t * 0.6) % 0.2); }; },
    luzpasillo(H, g, E) { pared(H, g, 4.0, 2.9, '#f1e3d3'); E.ven = new H.T.MeshStandardMaterial({ color: '#bfe6ff', transparent: true, opacity: 0.8 }); H.box(0.9, 0.9, 0.03, E.ven, g, 1.45, 1.1, 0); H.box(0.35, 2.9, 0.35, '#e7d7c4', g, -1.6, 0, 0.6);
      E.lb = H.lamp('#fff4d6'); H.box(1.0, 0.06, 0.25, E.lb, g, 0, 2.95, 1.6); E.pl = new H.T.PointLight('#fff4d6', 0, 6); E.pl.position.set(0, 2.6, 1.6); g.add(E.pl); E.p = H.persona('#e67e22', g); E.p.visible = false; E.lbl = lbl(H, g, 1.45, 1.75, 0.12, 'LUZ --');
      E.upd = (o, i, s) => { E.lb.emissiveIntensity = o.lb ? 1.8 : 0; E.pl.intensity = o.lb ? 6 : 0; E.p.visible = !!i.a; const b = s && i.b != null ? i.b : 600; E.ven.color.set(b < 300 ? '#1b2440' : b < 600 ? '#e7a96b' : '#bfe6ff'); E.lbl.userData.set(s && i.b != null ? 'LUZ ' + i.b : 'LUZ --'); };
      E.anim = (dt, t) => { if (E.p.visible) E.p.position.x = Math.sin(t * 0.8) * 1.2; }; },
    mojado(H, g, E) { pared(H, g, 3.2, 2.9, '#f1e3d3'); H.box(0.5, 0.9, 0.4, '#c9d1d9', g, 0, 0, 0); H.cyl(0.03, 0.03, 0.1, '#888', g, 0, 0.9, 0.1);
      E.ch = new H.T.Mesh(new H.T.CircleGeometry(0.5, 24), new H.T.MeshStandardMaterial({ color: '#5fb3ff', transparent: true, opacity: 0 })); E.ch.rotation.x = -Math.PI / 2; E.ch.position.set(0.1, 0.075, 0.6); g.add(E.ch);
      E.la = H.lamp('#ffc531'); H.box(0.32, 0.32, 0.04, '#222', g, 0.95, 1.45, 0.02); H.sph(0.07, E.la, g, 0.95, 1.62, 0.07); E.rg = buzz(H, g, 0.95, 1.4, 0.06); E.lbl = lbl(H, g, 0.95, 2.05, 0.12, 'AGUA --');
      E.upd = (o, i, s) => { on(E.la, o.la); E.son = !!o.bz; const v = s && i.v != null ? i.v : 0; E.ch.material.opacity = Math.min(0.8, v / 900); E.lbl.userData.set(s && i.v != null ? 'AGUA ' + i.v : 'AGUA --'); if (!o.bz) E.rg.forEach(r => { r.material.opacity = 0; }); };
      E.anim = (dt, t) => { if (E.son) { E.rg.forEach((r, j) => { r.material.opacity = 0.5 + 0.5 * Math.sin(t * 10 + j); }); E.la.emissiveIntensity = Math.sin(t * 6) > 0 ? 2.2 : 0.3; } }; }
  };
  window.T3D_EXTRA = { EST, PROY, M3D };
})();
