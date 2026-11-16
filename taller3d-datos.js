// Taller 3D · datos: componentes, proyectos, simulación y verificación.
(function () {
  const D = ['D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13'], A = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'], PWM = ['D3', 'D5', 'D6', 'D9', 'D10', 'D11'];
  const COMP = {
    led_r: { n: 'LED rojo', k: 'S', col: '#ff4a3d', pins: [['+ (ánodo)', 'anodo'], ['− (cátodo)', 'catodo']], q: 'Se enciende para avisar.' },
    led_a: { n: 'LED amarillo', k: 'S', col: '#ffc531', pins: [['+ (ánodo)', 'anodo'], ['− (cátodo)', 'catodo']], q: 'Luz de precaución.' },
    led_v: { n: 'LED verde', k: 'S', col: '#38d26b', pins: [['+ (ánodo)', 'anodo'], ['− (cátodo)', 'catodo']], q: 'Luz de «todo bien».' },
    led_b: { n: 'LED blanco (lámpara)', k: 'S', col: '#f4f1e0', pins: [['+ (ánodo)', 'anodo'], ['− (cátodo)', 'catodo']], q: 'Ilumina un espacio.' },
    buzzer: { n: 'Buzzer', k: 'S', col: '#2b2b2b', pins: [['+', 'dig'], ['−', 'gnd']], q: 'Suena como alarma.' },
    servo: { n: 'Servomotor', k: 'S', col: '#3a7be0', pins: [['Señal', 'pwm'], ['VCC', 'vcc'], ['GND', 'gnd']], q: 'Gira a un ángulo (0° a 180°).' },
    rele_b: { n: 'Relé + bomba de agua', k: 'S', col: '#2f6fd0', pins: [['IN', 'dig'], ['VCC', 'vcc'], ['GND', 'gnd']], q: 'El relé enciende la bomba.' },
    rele_g: { n: 'Relé + mini bomba de gel', k: 'S', col: '#2f6fd0', pins: [['IN', 'dig'], ['VCC', 'vcc'], ['GND', 'gnd']], q: 'Empuja el gel.' },
    rele_v: { n: 'Relé + electroválvula', k: 'S', col: '#2f6fd0', pins: [['IN', 'dig'], ['VCC', 'vcc'], ['GND', 'gnd']], q: 'Abre o cierra el agua.' },
    hc: { n: 'Sensor ultrasónico HC-SR04', k: 'E', col: '#2a9fd6', pins: [['VCC', 'vcc'], ['Trig', 'dig'], ['Echo', 'dig'], ['GND', 'gnd']], q: 'Mide distancia (cm).' },
    pir: { n: 'Sensor de movimiento PIR', k: 'E', col: '#f2f2f2', pins: [['VCC', 'vcc'], ['OUT', 'dig'], ['GND', 'gnd']], q: 'Detecta movimiento de personas.' },
    ir: { n: 'Sensor infrarrojo IR', k: 'E', col: '#1d1d1d', pins: [['VCC', 'vcc'], ['GND', 'gnd'], ['OUT', 'dig']], q: 'Detecta algo muy cerca (sí/no).' },
    ldr: { n: 'Fotorresistencia LDR', k: 'E', col: '#e3a24a', pins: [['Pata 1', 'p5'], ['Pata 2', 'div']], q: 'Mide la luz (0 a 1023).' },
    hum: { n: 'Sensor de humedad de suelo', k: 'E', col: '#c9a43a', pins: [['VCC', 'vcc'], ['GND', 'gnd'], ['AO', 'ana']], q: 'Mide qué tan mojada está la tierra (%).' },
    son: { n: 'Sensor de sonido', k: 'E', col: '#2251a8', pins: [['VCC', 'vcc'], ['GND', 'gnd'], ['AO', 'ana']], q: 'Mide el ruido (dB).' },
    uv: { n: 'Sensor UV', k: 'E', col: '#7a3fc9', pins: [['VCC', 'vcc'], ['GND', 'gnd'], ['OUT', 'ana']], q: 'Mide la radiación ultravioleta (0 a 11).' },
    btn: { n: 'Pulsador', k: 'E', col: '#d23b3b', pins: [['Pata 1', 'p5'], ['Pata 2', 'pull']], q: 'Se presiona (sí/no).' },
    lm35: { n: 'Sensor de temperatura LM35', k: 'E', col: '#333', pins: [], q: 'Mide temperatura.' },
    motor: { n: 'Motor DC', k: 'S', col: '#999', pins: [], q: 'Gira sin parar.' },
    pot: { n: 'Potenciómetro', k: 'E', col: '#3b6', pins: [], q: 'Perilla que se gira a mano.' },
    lcd: { n: 'Pantalla LCD', k: 'S', col: '#4a7', pins: [], q: 'Muestra texto.' },
    rfid: { n: 'Lector RFID', k: 'E', col: '#36c', pins: [], q: 'Lee tarjetas.' }
  };
  const RES = { r220: 'Resistencia 220 Ω', r10k: 'Resistencia 10 kΩ' };
  const ROL = {
    vcc: { ok: t => t === '5V', r: '', tx: 'va a 5V (alimentación)' },
    gnd: { ok: t => t === 'GND', r: '', tx: 'va a GND (tierra)' },
    catodo: { ok: t => t === 'GND', r: '', tx: 'la pata corta (−) del LED va a GND' },
    p5: { ok: t => t === '5V', r: '', tx: 'esta pata va a 5V' },
    dig: { ok: t => D.includes(t), r: '', tx: 'va a un pin digital (D2 a D13)' },
    pwm: { ok: t => PWM.includes(t), r: '', tx: 'el servo necesita un pin con ~ (PWM): D3, D5, D6, D9, D10 o D11' },
    ana: { ok: t => A.includes(t), r: '', tx: 'un dato que tiene muchos valores va a un pin analógico (A0 a A5)' },
    anodo: { ok: t => D.includes(t), r: '220', tx: 'la pata larga (+) va a un pin digital PASANDO por una resistencia de 220 Ω (si no, el LED se quema)' },
    pull: { ok: t => D.includes(t), r: '10k', tx: 'va a un pin digital y, con una resistencia de 10 kΩ, a GND (resistencia pull-down: así el pin lee 0 cuando nadie presiona)' },
    div: { ok: t => A.includes(t), r: '10k', tx: 'va a un pin analógico y, con una resistencia de 10 kΩ, a GND (divisor de voltaje)' }
  };
  const SEN = r => ['dig', 'pwm', 'ana', 'anodo', 'pull', 'div'].includes(r);

  const P = [
    { id: 'aforo', n: 'Aforo del bar', lugar: 'Bar', tipo: 'contador', ico: '👥',
      historia: 'En el recreo, el bar se llena tanto que nadie puede moverse. La señora del bar quiere un aviso automático: luz verde si todavía se puede entrar y luz roja cuando ya hay más de 20 personas.',
      objetivo: 'Contar a las personas que entran y salen, y prender la luz roja cuando haya más de 20.',
      criterios: ['Cuenta +1 al entrar y −1 al salir', 'Con 20 o menos: verde', 'Con 21 o más: rojo'],
      inst: [{ i: 'ir_e', c: 'ir', lab: 'IR de entrada', spot: 'pe', por: 'Debe estar en el marco de la puerta, del lado por donde se entra.' }, { i: 'ir_s', c: 'ir', lab: 'IR de salida', spot: 'ps', por: 'Debe estar en el otro lado del marco, por donde se sale.' }, { i: 'lr', c: 'led_r', lab: 'LED rojo', spot: 'pan', por: 'Las luces deben verse desde afuera, sobre la puerta.' }, { i: 'lv', c: 'led_v', lab: 'LED verde', spot: 'pan', por: 'Las luces deben verse desde afuera, sobre la puerta.' }],
      res: { r220: 2 }, dist: ['lm35', 'motor', 'pot'],
      spots: [{ id: 'pe', lab: 'Marco: lado de entrada', pos: [-1.05, 1.0, 0.18] }, { id: 'ps', lab: 'Marco: lado de salida', pos: [1.05, 1.0, 0.18] }, { id: 'pan', lab: 'Panel sobre la puerta', pos: [0, 2.65, 0.2] }, { id: 'mos', lab: 'Debajo del mostrador', pos: [2.4, 0.5, 1.2], mal: 'Desde ahí no se ve a las personas que cruzan la puerta.' }, { id: 'tec', lab: 'Techo del bar', pos: [0, 3.1, 1.4], mal: 'El sensor IR solo detecta cosas muy cercanas; en el techo no ve a nadie.' }],
      flujo: [['ini', 'PERSONAS ← 0', ['PERSONAS ← 20', 'Prender LED rojo']], ['leer', 'Leer los sensores IR de la puerta', ['Leer la temperatura', 'Prender LED verde']], ['e', '¿Alguien entró? SÍ → PERSONAS ← PERSONAS + 1', ['¿Alguien entró? SÍ → PERSONAS ← 0', '¿Alguien entró? SÍ → PERSONAS ← PERSONAS − 1']], ['s', '¿Alguien salió? SÍ → PERSONAS ← PERSONAS − 1', ['¿Alguien salió? SÍ → PERSONAS ← PERSONAS + 1', '¿Alguien salió? SÍ → FIN']], ['preg', '¿PERSONAS > 20?', ['¿PERSONAS < 20?', '¿Hay alguien en la puerta?']], ['si', 'Prender LED rojo y apagar el verde', ['Prender LED verde y apagar el rojo', 'Apagar las dos luces']], ['no', 'Prender LED verde y apagar el rojo', ['Prender LED rojo y apagar el verde', 'FIN']], ['rep', 'Volver a «Leer los sensores» (para siempre)', ['FIN', 'Volver a «PERSONAS ← 0»']]],
      slots: { ini: [[0, 20, 1], 0], e: [['+1', '−1', '0'], '+1'], s: [['−1', '+1', '0'], '−1'], op: [['>', '<', '=='], '>'], n: [[10, 20, 30], 20], si: [['rojo', 'verde'], 'rojo'], no: [['verde', 'rojo'], 'verde'] },
      salida: { rojo: { lr: 1, lv: 0 }, verde: { lr: 0, lv: 1 } },
      tests: [{ seq: 'e'.repeat(19).split(''), txt: 'Entran 19 personas' }, { seq: ['e', 'e', 'e'], txt: 'Entran 3 más (22)' }, { seq: ['s', 's'], txt: 'Salen 2 (20)' }, { seq: ['e'], txt: 'Entra 1 (21)' }, { seq: ['s', 's', 's'], txt: 'Salen 3 (18)' }],
      reflex: '¿Qué pasaría si el sensor de salida se daña y nunca cuenta a los que salen?'
    },
    { id: 'agua', n: 'Dispensador de agua', lugar: 'Bar', tipo: 'dos', ico: '🚰',
      historia: 'El dispensador de agua del bar se queda abierto y se riega el agua en el piso. Debe servir solo cuando alguien presiona el botón Y hay un vaso debajo.',
      objetivo: 'Encender la bomba solo si el botón está presionado Y hay un vaso.',
      criterios: ['Botón + vaso → sirve', 'Sin vaso → no sirve', 'Sin botón → no sirve'],
      inst: [{ i: 'bt', c: 'btn', lab: 'Pulsador', spot: 'boton', por: 'El botón debe estar al frente, a la altura de la mano.' }, { i: 'iv', c: 'ir', lab: 'IR del vaso', spot: 'vaso', por: 'Debe estar en la base, donde se pone el vaso.' }, { i: 'rb', c: 'rele_b', lab: 'Relé + bomba', spot: 'interno', por: 'La bomba y el relé van dentro del mueble, protegidos del agua.' }],
      res: { r10k: 1 }, dist: ['servo', 'lm35', 'lcd'],
      spots: [{ id: 'boton', lab: 'Frente, a la altura de la mano', pos: [0.28, 1.02, 0.36] }, { id: 'vaso', lab: 'Base del vaso', pos: [0, 0.72, 0.42] }, { id: 'interno', lab: 'Dentro del mueble', pos: [-0.3, 0.35, 0.36] }, { id: 'arr', lab: 'Encima del botellón', pos: [0, 2.0, 0], mal: 'Nadie alcanzaría a usarlo ahí arriba.' }],
      flujo: [['leer', 'Leer el botón y el sensor del vaso', ['Encender la bomba', 'Leer la humedad']], ['preg', '¿botón presionado Y hay vaso?', ['¿botón presionado O hay vaso?', '¿hay vaso?']], ['si', 'Encender la bomba', ['Apagar la bomba', 'Sonar el buzzer']], ['no', 'Apagar la bomba', ['Encender la bomba', 'FIN']], ['rep', 'Volver a leer (para siempre)', ['FIN', 'Esperar 1 hora']]],
      a: { k: 'bt', n: 'botón presionado', dig: true }, b: { k: 'iv', n: 'hay vaso', dig: true },
      slots: { lg: [['Y', 'O'], 'Y'], si: [['Encender la bomba', 'Apagar la bomba'], 'Encender la bomba'], no: [['Apagar la bomba', 'Encender la bomba'], 'Apagar la bomba'] },
      salida: { 'Encender la bomba': { rb: 1 }, 'Apagar la bomba': { rb: 0 } },
      tests: [{ a: 1, b: 1, txt: 'Botón presionado y vaso' }, { a: 1, b: 0, txt: 'Botón presionado sin vaso' }, { a: 0, b: 1, txt: 'Vaso sin presionar' }, { a: 0, b: 0, txt: 'Nada' }],
      reflex: '¿Por qué conviene usar «Y» y no «O» en este dispensador?'
    },
    { id: 'ruido', n: 'Semáforo de ruido', lugar: 'Aula', tipo: 'tramos', ico: '🔊', u: 'dB', min: 30, max: 100,
      historia: 'En el aula hay tanto ruido que no se escucha al profesor. Un semáforo de ruido avisa a todos: verde = bien, amarillo = cuidado, rojo = demasiado ruido.',
      objetivo: 'Verde con menos de 55 dB, amarillo de 55 a 69 dB y rojo con 70 dB o más.',
      criterios: ['< 55 dB → verde', '55 a 69 dB → amarillo', '70 dB o más → rojo'],
      inst: [{ i: 'sn', c: 'son', lab: 'Sensor de sonido', spot: 'cen', por: 'Debe estar en el centro, para escuchar a toda el aula por igual.' }, { i: 'lv', c: 'led_v', lab: 'LED verde', spot: 'fre', por: 'Las luces deben verse desde todos los puestos: junto a la pizarra.' }, { i: 'la', c: 'led_a', lab: 'LED amarillo', spot: 'fre', por: 'Las luces deben verse desde todos los puestos: junto a la pizarra.' }, { i: 'lr', c: 'led_r', lab: 'LED rojo', spot: 'fre', por: 'Las luces deben verse desde todos los puestos: junto a la pizarra.' }],
      res: { r220: 3 }, dist: ['pir', 'motor', 'pot'],
      spots: [{ id: 'cen', lab: 'Sobre la pizarra, al centro', pos: [0, 2.75, 0.1] }, { id: 'fre', lab: 'Junto a la pizarra (visible)', pos: [2.1, 1.8, 0.12] }, { id: 'pue', lab: 'Afuera, junto a la puerta', pos: [-4.2, 1.3, 2.2], mal: 'Ahí mediría el ruido del pasillo, no el del aula.' }, { id: 'arm', lab: 'Detrás del armario', pos: [-2.6, 1.0, 0.1], mal: 'Nadie vería las luces y el armario tapa el sonido.' }],
      flujo: [['leer', 'Leer el ruido (dB)', ['Prender LED verde', 'Leer la luz']], ['preg', '¿ruido < 55?', ['¿ruido > 55?', '¿ruido < 70?']], ['si', 'Prender LED verde', ['Prender LED rojo', 'Prender LED amarillo']], ['preg2', '¿ruido < 70?', ['¿ruido < 55?', '¿ruido > 100?']], ['si2', 'Prender LED amarillo', ['Prender LED verde', 'Apagar todo']], ['no2', 'Prender LED rojo', ['Prender LED verde', 'FIN']], ['rep', 'Volver a leer (para siempre)', ['FIN', 'Esperar 1 hora']]],
      slots: { n1: [[40, 55, 70], 55], n2: [[55, 70, 90], 70], c1: [['verde', 'amarillo', 'rojo'], 'verde'], c2: [['amarillo', 'verde', 'rojo'], 'amarillo'], c3: [['rojo', 'amarillo', 'verde'], 'rojo'] },
      salida: { verde: { lv: 1, la: 0, lr: 0 }, amarillo: { lv: 0, la: 1, lr: 0 }, rojo: { lv: 0, la: 0, lr: 1 } },
      tests: [{ v: 45, txt: 'Trabajo en silencio' }, { v: 62, txt: 'Conversación en grupos' }, { v: 78, txt: 'Gritos' }, { v: 54, txt: 'Casi en el límite' }, { v: 70, txt: 'Justo 70 dB' }, { v: 35, txt: 'Examen' }],
      reflex: '¿Por qué el sensor va en el centro del aula y no junto a una ventana?'
    },
    { id: 'luzbano', n: 'Luz del baño con sensor', lugar: 'Baños', tipo: 'dos', ico: '💡',
      historia: 'La luz del baño queda prendida todo el día, aunque no haya nadie o entre sol por la ventana. Debe prenderse solo si alguien entra Y está oscuro.',
      objetivo: 'Encender la lámpara solo si hay movimiento Y la luz es menor a 300.',
      criterios: ['Movimiento + oscuro → prende', 'Movimiento de día → apagada', 'Sin nadie → apagada'],
      inst: [{ i: 'pr', c: 'pir', lab: 'Sensor PIR', spot: 'esq', por: 'El PIR debe estar alto en una esquina, mirando hacia la puerta, para ver a quien entra.' }, { i: 'ld', c: 'ldr', lab: 'LDR', spot: 'ven', por: 'El LDR debe estar junto a la ventana para medir la luz natural.' }, { i: 'lb', c: 'led_b', lab: 'Lámpara', spot: 'tec', por: 'La lámpara va en el techo para iluminar todo el baño.' }],
      res: { r220: 1, r10k: 1 }, dist: ['son', 'buzzer', 'lm35'],
      spots: [{ id: 'esq', lab: 'Esquina alta, mirando a la puerta', pos: [-1.5, 2.7, 0.15] }, { id: 'ven', lab: 'Junto a la ventana', pos: [1.6, 1.15, 0.15] }, { id: 'tec', lab: 'Techo', pos: [0, 3.0, 1.3] }, { id: 'cub', lab: 'Dentro de un cubículo', pos: [-1.3, 1.0, 1.6], mal: 'Solo vería ese cubículo: no detecta a quien entra al baño.' }],
      flujo: [['leer', 'Leer el PIR y la luz (LDR)', ['Encender la lámpara', 'Leer el ruido']], ['preg', '¿hay movimiento Y luz < 300?', ['¿hay movimiento O luz < 300?', '¿luz > 300?']], ['si', 'Encender la lámpara', ['Apagar la lámpara', 'Sonar el buzzer']], ['no', 'Apagar la lámpara', ['Encender la lámpara', 'FIN']], ['rep', 'Volver a leer (para siempre)', ['FIN', 'Esperar 1 día']]],
      a: { k: 'pr', n: 'hay movimiento', dig: true }, b: { k: 'ld', n: 'luz', u: '', min: 0, max: 1023 },
      slots: { op: [['<', '>'], '<'], n: [[100, 300, 900], 300], lg: [['Y', 'O'], 'Y'], si: [['Encender la lámpara', 'Apagar la lámpara'], 'Encender la lámpara'], no: [['Apagar la lámpara', 'Encender la lámpara'], 'Apagar la lámpara'] },
      salida: { 'Encender la lámpara': { lb: 1 }, 'Apagar la lámpara': { lb: 0 } },
      tests: [{ a: 1, b: 100, txt: 'Entra alguien de noche' }, { a: 1, b: 700, txt: 'Entra alguien a mediodía' }, { a: 0, b: 100, txt: 'Noche sin nadie' }, { a: 1, b: 250, txt: 'Tarde nublada, entra alguien' }, { a: 1, b: 350, txt: 'Mañana clara, entra alguien' }, { a: 0, b: 800, txt: 'Día sin nadie' }],
      reflex: '¿Cuánta energía ahorra el colegio si la luz solo se prende cuando hace falta?'
    },
    { id: 'llave', n: 'Llave de agua inteligente', lugar: 'Baños', tipo: 'umbral', ico: '🚿', u: 'cm', min: 0, max: 100,
      historia: 'Muchos estudiantes dejan la llave abierta. Una llave inteligente abre el agua solo mientras hay manos debajo del grifo.',
      objetivo: 'Abrir el agua si las manos están a menos de 12 cm; si no, cerrarla.',
      criterios: ['Manos cerca → abre', 'Sin manos → cierra'],
      inst: [{ i: 'hc', c: 'hc', lab: 'Ultrasónico', spot: 'gri', por: 'Debe estar debajo del grifo apuntando al lavabo, donde se ponen las manos.' }, { i: 'rv', c: 'rele_v', lab: 'Relé + electroválvula', spot: 'tub', por: 'La electroválvula va en la tubería, debajo del lavabo.' }],
      res: {}, dist: ['pir', 'led_r', 'lm35'],
      spots: [{ id: 'gri', lab: 'Debajo del grifo', pos: [0, 0.98, 0.12] }, { id: 'tub', lab: 'Tubería bajo el lavabo', pos: [0, 0.35, 0.34] }, { id: 'esp', lab: 'Detrás del espejo', pos: [0, 1.75, -0.2], mal: 'El espejo bloquea el sonido del ultrasónico: no vería las manos.' }],
      flujo: [['leer', 'Medir la distancia a las manos', ['Abrir el agua', 'Leer la luz']], ['preg', '¿distancia < 12 cm?', ['¿distancia > 12 cm?', '¿hay agua?']], ['si', 'Abrir el agua', ['Cerrar el agua', 'Sonar el buzzer']], ['no', 'Cerrar el agua', ['Abrir el agua', 'FIN']], ['rep', 'Volver a medir (para siempre)', ['FIN', 'Esperar 1 hora']]],
      sen: { k: 'hc', n: 'distancia' },
      slots: { op: [['<', '>'], '<'], n: [[2, 12, 60], 12], si: [['Abrir el agua', 'Cerrar el agua'], 'Abrir el agua'], no: [['Cerrar el agua', 'Abrir el agua'], 'Cerrar el agua'] },
      salida: { 'Abrir el agua': { rv: 1 }, 'Cerrar el agua': { rv: 0 } },
      tests: [{ v: 5, txt: 'Manos bajo el grifo' }, { v: 40, txt: 'Alguien pasa cerca' }, { v: 10, txt: 'Manos un poco más arriba' }, { v: 90, txt: 'Nadie' }, { v: 13, txt: 'Justo afuera del rango' }, { v: 3, txt: 'Lavando un vaso' }],
      reflex: '¿Cuántos litros se ahorrarían en un día en todo el colegio?'
    },
    { id: 'riego', n: 'Riego de la maceta', lugar: 'Patio', tipo: 'umbral', ico: '🌱', u: '%', min: 0, max: 100,
      historia: 'Las plantas del patio se secan en vacaciones y en los días de sol. Un sistema de riego automático debe regar solo cuando la tierra está seca.',
      objetivo: 'Encender la bomba si la humedad es menor a 30 %; si no, apagarla.',
      criterios: ['Tierra seca (< 30 %) → riega', 'Tierra húmeda → no riega'],
      inst: [{ i: 'hm', c: 'hum', lab: 'Sensor de humedad', spot: 'tie', por: 'Mide la humedad de la TIERRA: debe ir enterrado en la maceta.' }, { i: 'rb', c: 'rele_b', lab: 'Relé + bomba', spot: 'tan', por: 'La bomba va junto al tanque de agua.' }],
      res: {}, dist: ['ldr', 'servo', 'lm35'],
      spots: [{ id: 'tie', lab: 'Enterrado en la tierra', pos: [0.12, 0.5, 0.2] }, { id: 'tan', lab: 'Junto al tanque', pos: [1.05, 0.95, 0.3] }, { id: 'hoj', lab: 'Sobre las hojas', pos: [0, 1.25, 0], mal: 'Las hojas no dicen si la tierra está seca: el sensor mide la humedad del suelo.' }, { id: 'pis', lab: 'En el piso, al sol', pos: [-1.0, 0.06, 0.7], mal: 'En el piso no mide la tierra de la planta.' }],
      flujo: [['leer', 'Leer la humedad de la tierra', ['Encender la bomba', 'Leer la hora']], ['preg', '¿humedad < 30 %?', ['¿humedad > 30 %?', '¿hay sol?']], ['si', 'Encender la bomba', ['Apagar la bomba', 'Prender LED rojo']], ['no', 'Apagar la bomba', ['Encender la bomba', 'FIN']], ['rep', 'Volver a leer (para siempre)', ['FIN', 'Esperar 1 semana']]],
      sen: { k: 'hm', n: 'humedad' },
      slots: { op: [['<', '>'], '<'], n: [[10, 30, 80], 30], si: [['Encender la bomba', 'Apagar la bomba'], 'Encender la bomba'], no: [['Apagar la bomba', 'Encender la bomba'], 'Apagar la bomba'] },
      salida: { 'Encender la bomba': { rb: 1 }, 'Apagar la bomba': { rb: 0 } },
      tests: [{ v: 20, txt: 'Tierra seca' }, { v: 45, txt: 'Tierra húmeda' }, { v: 75, txt: 'Después de llover' }, { v: 28, txt: 'Casi seca' }, { v: 31, txt: 'Justo arriba del límite' }, { v: 5, txt: 'Muy seca' }],
      reflex: '¿Qué pasaría si se usa «>» en lugar de «<»?'
    },
    { id: 'basurero', n: 'Basurero automático', lugar: 'Patio', tipo: 'umbral', ico: '🗑️', u: 'cm', min: 0, max: 200,
      historia: 'Nadie quiere tocar la tapa del basurero con las manos. Un basurero automático abre la tapa cuando alguien acerca la mano o la basura.',
      objetivo: 'Abrir la tapa si algo está a menos de 30 cm; si no, cerrarla.',
      criterios: ['Mano cerca → abre (servo 90°)', 'Nadie cerca → cierra (servo 0°)'],
      inst: [{ i: 'hc', c: 'hc', lab: 'Ultrasónico', spot: 'fre', por: 'Debe estar en el frente de la tapa mirando hacia afuera, para ver la mano.' }, { i: 'sv', c: 'servo', lab: 'Servomotor', spot: 'bis', por: 'El servo va en la bisagra para levantar la tapa.' }],
      res: {}, dist: ['pir', 'buzzer', 'hum'],
      spots: [{ id: 'fre', lab: 'Frente de la tapa', pos: [0, 0.8, 0.42] }, { id: 'bis', lab: 'Bisagra de la tapa', pos: [0, 1.0, -0.4] }, { id: 'den', lab: 'Dentro del basurero', pos: [0.45, 0.5, 0], mal: 'Adentro mediría la basura, no la mano de la persona.' }],
      flujo: [['leer', 'Medir la distancia', ['Abrir la tapa', 'Leer el ruido']], ['preg', '¿distancia < 30 cm?', ['¿distancia > 30 cm?', '¿está lleno?']], ['si', 'Abrir la tapa (servo 90°)', ['Cerrar la tapa (servo 0°)', 'Sonar el buzzer']], ['no', 'Cerrar la tapa (servo 0°)', ['Abrir la tapa (servo 90°)', 'FIN']], ['rep', 'Volver a medir (para siempre)', ['FIN', 'Esperar 1 hora']]],
      sen: { k: 'hc', n: 'distancia' },
      slots: { op: [['<', '>'], '<'], n: [[5, 30, 150], 30], si: [['Abrir la tapa', 'Cerrar la tapa'], 'Abrir la tapa'], no: [['Cerrar la tapa', 'Abrir la tapa'], 'Cerrar la tapa'] },
      salida: { 'Abrir la tapa': { sv: 90 }, 'Cerrar la tapa': { sv: 0 } },
      tests: [{ v: 15, txt: 'Mano acercándose' }, { v: 50, txt: 'Alguien pasa' }, { v: 120, txt: 'Nadie' }, { v: 25, txt: 'Mano a 25 cm' }, { v: 35, txt: 'A 35 cm' }, { v: 3, txt: 'Basura sobre la tapa' }],
      reflex: '¿Por qué un servomotor y no un motor DC para la tapa?'
    },
    { id: 'solar', n: 'Semáforo solar', lugar: 'Patio', tipo: 'tramos', ico: '☀️', u: 'UV', min: 0, max: 11,
      historia: 'En el recreo el sol es muy fuerte. El semáforo solar mide la radiación UV y avisa: verde = sin riesgo, amarillo = usa gorra, rojo = protector solar y sombra.',
      objetivo: 'Verde con UV menor a 3, amarillo de 3 a 7 y rojo con 8 o más.',
      criterios: ['UV < 3 → verde', 'UV 3 a 7 → amarillo', 'UV 8 o más → rojo'],
      inst: [{ i: 'uv', c: 'uv', lab: 'Sensor UV', spot: 'top', por: 'El sensor UV debe estar en lo alto del poste, al sol directo.' }, { i: 'lv', c: 'led_v', lab: 'LED verde', spot: 'pan', por: 'Las luces van en el panel, a la altura de los ojos.' }, { i: 'la', c: 'led_a', lab: 'LED amarillo', spot: 'pan', por: 'Las luces van en el panel, a la altura de los ojos.' }, { i: 'lr', c: 'led_r', lab: 'LED rojo', spot: 'pan', por: 'Las luces van en el panel, a la altura de los ojos.' }],
      res: { r220: 3 }, dist: ['ldr', 'lm35', 'motor'],
      spots: [{ id: 'top', lab: 'Parte alta del poste, al sol', pos: [0, 2.75, 0] }, { id: 'pan', lab: 'Panel del poste', pos: [0, 1.65, 0.2] }, { id: 'som', lab: 'Bajo el techo (sombra)', pos: [-1.5, 1.9, -0.5], mal: 'A la sombra el sensor UV mediría casi 0 aunque haya mucho sol.' }, { id: 'sue', lab: 'En el piso', pos: [0.9, 0.06, 0.6], mal: 'En el piso se ensucia, lo pisan y no recibe el sol directo.' }],
      flujo: [['leer', 'Leer el índice UV', ['Prender LED rojo', 'Leer la temperatura']], ['preg', '¿UV < 3?', ['¿UV > 3?', '¿UV < 8?']], ['si', 'Prender LED verde', ['Prender LED rojo', 'Prender LED amarillo']], ['preg2', '¿UV < 8?', ['¿UV < 3?', '¿UV > 11?']], ['si2', 'Prender LED amarillo', ['Prender LED verde', 'Apagar todo']], ['no2', 'Prender LED rojo', ['Prender LED verde', 'FIN']], ['rep', 'Volver a leer (para siempre)', ['FIN', 'Esperar 1 día']]],
      slots: { n1: [[3, 6, 11], 3], n2: [[3, 8, 11], 8], c1: [['verde', 'amarillo', 'rojo'], 'verde'], c2: [['amarillo', 'verde', 'rojo'], 'amarillo'], c3: [['rojo', 'amarillo', 'verde'], 'rojo'] },
      salida: { verde: { lv: 1, la: 0, lr: 0 }, amarillo: { lv: 0, la: 1, lr: 0 }, rojo: { lv: 0, la: 0, lr: 1 } },
      tests: [{ v: 1, txt: 'Mañana temprano' }, { v: 4, txt: 'Media mañana' }, { v: 9, txt: 'Mediodía' }, { v: 3, txt: 'UV justo 3' }, { v: 7, txt: 'UV 7' }, { v: 8, txt: 'UV justo 8' }],
      reflex: '¿Qué consejo darías a tus compañeros cuando el semáforo está en rojo?'
    },
    { id: 'gel', n: 'Dispensador de gel', lugar: 'Laboratorio', tipo: 'umbral', ico: '🧴', dig: true,
      historia: 'Para entrar al laboratorio, todos deben ponerse gel, pero tocar el dispensador ensucia. Debe soltar gel solo cuando hay una mano debajo.',
      objetivo: 'Activar la bomba de gel si el sensor IR detecta una mano; si no, apagarla.',
      criterios: ['Mano debajo → suelta gel', 'Sin mano → no suelta'],
      inst: [{ i: 'ir', c: 'ir', lab: 'Sensor IR', spot: 'boq', por: 'El IR va debajo de la boquilla, donde se pone la mano.' }, { i: 'rg', c: 'rele_g', lab: 'Relé + bomba de gel', spot: 'caj', por: 'La bomba va dentro de la caja del dispensador.' }],
      res: {}, dist: ['hc', 'led_v', 'pot'],
      spots: [{ id: 'boq', lab: 'Debajo de la boquilla', pos: [0, 0.98, 0.3] }, { id: 'caj', lab: 'Dentro de la caja', pos: [0, 1.38, 0.28] }, { id: 'pue', lab: 'En la puerta', pos: [-1.8, 1.2, 0.3], mal: 'Soltaría gel cada vez que alguien pasa por la puerta.' }, { id: 'tec', lab: 'En el techo', pos: [0, 3.0, 0.9], mal: 'El IR solo detecta cosas muy cerca: desde el techo no ve la mano.' }],
      flujo: [['leer', 'Leer el sensor IR', ['Activar la bomba', 'Medir la temperatura']], ['preg', '¿hay una mano?', ['¿no hay mano?', '¿es de día?']], ['si', 'Activar la bomba 1 segundo', ['Apagar la bomba', 'Prender LED verde']], ['no', 'Apagar la bomba', ['Activar la bomba 1 segundo', 'FIN']], ['rep', 'Volver a leer (para siempre)', ['FIN', 'Esperar 1 hora']]],
      sen: { k: 'ir', n: 'hay mano' },
      slots: { n: [['SÍ', 'NO'], 'SÍ'], si: [['Activar la bomba', 'Apagar la bomba'], 'Activar la bomba'], no: [['Apagar la bomba', 'Activar la bomba'], 'Apagar la bomba'] },
      salida: { 'Activar la bomba': { rg: 1 }, 'Apagar la bomba': { rg: 0 } },
      tests: [{ v: 1, txt: 'Mano debajo' }, { v: 0, txt: 'Nadie' }, { v: 1, txt: 'Otra mano' }, { v: 0, txt: 'Pasa alguien lejos' }],
      reflex: '¿Por qué conviene que suelte gel solo 1 segundo?'
    },
    { id: 'alarma', n: 'Alarma del laboratorio', lugar: 'Laboratorio', tipo: 'dos', ico: '🚨',
      historia: 'El laboratorio tiene equipos caros. Fuera de clases, si alguien entra, debe sonar una alarma. Se arma con un botón al salir.',
      objetivo: 'Sonar el buzzer y prender el LED rojo si hay movimiento Y la alarma está armada.',
      criterios: ['Armada + movimiento → suena', 'Desarmada → no suena', 'Sin movimiento → no suena'],
      inst: [{ i: 'pr', c: 'pir', lab: 'Sensor PIR', spot: 'esq', por: 'El PIR va alto en una esquina, mirando hacia la puerta.' }, { i: 'bt', c: 'btn', lab: 'Pulsador para armar', spot: 'int', por: 'El botón para armar va junto a la puerta, por dentro.' }, { i: 'bz', c: 'buzzer', lab: 'Buzzer', spot: 'tec', por: 'El buzzer va en el centro del techo para que se escuche en todo el laboratorio.' }, { i: 'lr', c: 'led_r', lab: 'LED rojo', spot: 'plu', por: 'La luz roja va sobre la puerta.' }],
      res: { r220: 1, r10k: 1 }, dist: ['hc', 'son', 'lcd'],
      spots: [{ id: 'esq', lab: 'Esquina alta, mirando a la puerta', pos: [1.7, 2.7, 0.15] }, { id: 'int', lab: 'Junto a la puerta, por dentro', pos: [-0.55, 1.2, 0.15] }, { id: 'tec', lab: 'Centro del techo', pos: [0, 3.05, 1.6] }, { id: 'plu', lab: 'Sobre la puerta', pos: [-1.6, 2.65, 0.15] }, { id: 'mes', lab: 'Sobre una mesa', pos: [1.3, 0.95, 1.7], mal: 'Ahí lo moverían o lo taparían con mochilas.' }],
      flujo: [['leer', 'Leer el PIR y si la alarma está armada', ['Sonar el buzzer', 'Leer la luz']], ['preg', '¿hay movimiento Y está armada?', ['¿hay movimiento O está armada?', '¿está armada?']], ['si', 'Sonar el buzzer y prender LED rojo', ['Silencio y LED apagado', 'Abrir la puerta']], ['no', 'Silencio y LED apagado', ['Sonar el buzzer y prender LED rojo', 'FIN']], ['rep', 'Volver a leer (para siempre)', ['FIN', 'Esperar 1 día']]],
      a: { k: 'pr', n: 'hay movimiento', dig: true }, b: { k: 'bt', n: 'alarma armada', dig: true },
      slots: { lg: [['Y', 'O'], 'Y'], si: [['Sonar y prender', 'Silencio'], 'Sonar y prender'], no: [['Silencio', 'Sonar y prender'], 'Silencio'] },
      salida: { 'Sonar y prender': { bz: 1, lr: 1 }, Silencio: { bz: 0, lr: 0 } },
      tests: [{ a: 1, b: 1, txt: 'Alguien entra de noche (armada)' }, { a: 1, b: 0, txt: 'Clase normal (desarmada)' }, { a: 0, b: 1, txt: 'Noche sin nadie' }, { a: 0, b: 0, txt: 'Recreo sin nadie' }],
      reflex: '¿Qué pasaría si se usa «O»? ¿Se podría dar clases?'
    }
  ];

  const cmp = (v, op, n) => op === '<' ? v < n : op === '>' ? v > n : op === '==' ? v === n : op === '>=' ? v >= n : v <= n;
  // Ejecuta el programa (slots) con una entrada y devuelve la salida (nombre de estado).
  function correr(p, sl, t, st) {
    if (p.tipo === 'umbral') { if (p.dig) return (t.v ? 'SÍ' : 'NO') === sl.n ? sl.si : sl.no; return cmp(t.v, sl.op, Number(sl.n)) ? sl.si : sl.no; }
    if (p.tipo === 'dos') { const a = !!t.a, b = p.b.dig ? !!t.b : cmp(t.b, sl.op, Number(sl.n)); return (sl.lg === 'Y' ? a && b : a || b) ? sl.si : sl.no; }
    if (p.tipo === 'tramos') return t.v < Number(sl.n1) ? sl.c1 : t.v < Number(sl.n2) ? sl.c2 : sl.c3;
    if (p.tipo === 'contador') { const d = { '+1': 1, '−1': -1, '0': 0 }; st.c += t === 'e' ? d[sl.e] : d[sl.s]; return cmp(st.c, sl.op, Number(sl.n)) ? sl.si : sl.no; }
  }
  const sol = p => { const o = {}; Object.keys(p.slots).forEach(k => { o[k] = p.slots[k][1]; }); return o; };
  // Corre todos los casos de prueba con el programa del estudiante y con la solución.
  function probar(p, sl) {
    const S = sol(p), out = [];
    if (p.tipo === 'contador') { const a = { c: Number(sl.ini) }, b = { c: 0 }; p.tests.forEach(t => { let ok = true, ga, gb; t.seq.forEach(ev => { ga = correr(p, sl, ev, a); gb = correr(p, S, ev, b); if (ga !== gb) ok = false; }); out.push({ txt: t.txt, esp: gb + ' (' + b.c + ')', obt: ga + ' (' + a.c + ')', ok, c: a.c, sal: ga, seq: t.seq }); }); return out; }
    p.tests.forEach(t => { const ga = correr(p, sl, t), gb = correr(p, S, t); out.push({ txt: t.txt, t, esp: gb, obt: ga, ok: ga === gb, sal: ga }); });
    return out;
  }
  function revisarConex(p, con) {
    const err = [], usados = {};
    p.inst.forEach(it => { const C = COMP[it.c]; C.pins.forEach(([pl, rol], k) => { const c = con[it.i + '.' + k], R = ROL[rol]; const nom = it.lab + ' · ' + pl;
      if (!c || !c.to) { err.push({ k: it.i + '.' + k, t: nom + ': falta conectar. Regla: ' + R.tx + '.' }); return; }
      if (!R.ok(c.to)) err.push({ k: it.i + '.' + k, t: nom + ' está en ' + c.to + ', pero ' + R.tx + '.' });
      else if ((c.r || '') !== R.r) err.push({ k: it.i + '.' + k, t: nom + (R.r ? ': falta la resistencia de ' + (R.r === '220' ? '220 Ω' : '10 kΩ') + '. ' + R.tx + '.' : ': aquí no va resistencia.') });
      if (SEN(rol) && c.to) { if (usados[c.to]) err.push({ k: it.i + '.' + k, t: nom + ' usa ' + c.to + ', que ya está ocupado por ' + usados[c.to] + '. Cada señal necesita su propio pin.' }); else usados[c.to] = nom; } }); });
    return err;
  }
  // Pines de señal de cada instancia (para los bloques).
  const pinesSenal = p => { const o = []; p.inst.forEach(it => COMP[it.c].pins.forEach(([pl, rol], k) => { if (SEN(rol)) o.push({ key: it.i + '.' + k, lab: it.lab + (COMP[it.c].pins.filter(x => SEN(x[1])).length > 1 ? ' · ' + pl : ''), rol }); })); return o; };
  // Lista de materiales necesaria (componentes + resistencias).
  const necesita = p => { const o = {}; p.inst.forEach(it => { o[it.c] = (o[it.c] || 0) + 1; }); Object.keys(p.res || {}).forEach(r => { o[r] = p.res[r]; }); return o; };
  // Genera código Arduino a partir de los bloques.
  function codigo(p, sl, pins) {
    const P = k => (pins[k] || '?').replace(/^D/, ''), L = [], decl = [];
    p.inst.forEach(it => COMP[it.c].pins.forEach(([pl, rol], k) => { if (SEN(rol)) decl.push('const int ' + (it.i + (rol === 'dig' && it.c === 'hc' ? (k === 1 ? '_trig' : '_echo') : '')).toUpperCase() + ' = ' + P(it.i + '.' + k) + ';'); }));
    L.push('// ' + p.n + ' · U. E. P. La Providencia'); decl.forEach(x => L.push(x));
    if (p.inst.some(i => i.c === 'servo')) L.unshift('#include <Servo.h>');
    L.push('', 'void setup() {'); p.inst.forEach(it => { const C = COMP[it.c]; if (C.k === 'S' && it.c !== 'servo') L.push('  pinMode(' + it.i.toUpperCase() + ', OUTPUT);'); if (C.k === 'E' && it.c !== 'hc' && !['ldr', 'hum', 'son', 'uv'].includes(it.c)) L.push('  pinMode(' + it.i.toUpperCase() + ', INPUT);'); }); L.push('}', '', 'void loop() {');
    const act = (estado, ind) => { const s = p.salida[estado] || {}; Object.keys(s).forEach(k => { const it = p.inst.find(x => x.i === k); if (it.c === 'servo') L.push(ind + 'tapa.write(' + s[k] + ');'); else L.push(ind + 'digitalWrite(' + k.toUpperCase() + ', ' + (s[k] ? 'HIGH' : 'LOW') + ');'); }); };
    const leer = it => it.c === 'hc' ? 'medirDistancia()' : ['ldr', 'hum', 'son', 'uv'].includes(it.c) ? 'analogRead(' + it.i.toUpperCase() + ')' : 'digitalRead(' + it.i.toUpperCase() + ')';
    if (p.tipo === 'umbral') { const it = p.inst.find(x => x.i === p.sen.k); L.push('  int dato = ' + leer(it) + ';'); L.push('  if (dato ' + (p.dig ? '== ' + (sl.n === 'SÍ' ? 'HIGH' : 'LOW') : (sl.op || '?') + ' ' + sl.n) + ') {'); act(sl.si, '    '); L.push('  } else {'); act(sl.no, '    '); L.push('  }'); }
    if (p.tipo === 'dos') { const a = p.inst.find(x => x.i === p.a.k), b = p.inst.find(x => x.i === p.b.k); L.push('  int a = ' + leer(a) + ';', '  int b = ' + leer(b) + ';'); L.push('  if (a == HIGH ' + (sl.lg === 'Y' ? '&&' : '||') + ' ' + (p.b.dig ? 'b == HIGH' : 'b ' + sl.op + ' ' + sl.n) + ') {'); act(sl.si, '    '); L.push('  } else {'); act(sl.no, '    '); L.push('  }'); }
    if (p.tipo === 'tramos') { const it = p.inst.find(x => COMP[x.c].k === 'E'); L.push('  int dato = ' + leer(it) + ';'); L.push('  if (dato < ' + sl.n1 + ') {'); act(sl.c1, '    '); L.push('  } else if (dato < ' + sl.n2 + ') {'); act(sl.c2, '    '); L.push('  } else {'); act(sl.c3, '    '); L.push('  }'); }
    if (p.tipo === 'contador') { L.splice(L.indexOf('void setup() {') - 1, 0, 'int personas = ' + sl.ini + ';'); L.push('  if (digitalRead(IR_E) == LOW) { personas = personas ' + (sl.e === '+1' ? '+ 1' : sl.e === '−1' ? '- 1' : '+ 0') + '; delay(500); }'); L.push('  if (digitalRead(IR_S) == LOW) { personas = personas ' + (sl.s === '−1' ? '- 1' : sl.s === '+1' ? '+ 1' : '+ 0') + '; delay(500); }'); L.push('  if (personas ' + sl.op + ' ' + sl.n + ') {'); act(sl.si, '    '); L.push('  } else {'); act(sl.no, '    '); L.push('  }'); }
    L.push('  delay(100);', '}'); return L.join('\n');
  }
  const CURSO = {
    '8vo': { nombre: '8vo EGB', ops: 2, prefPin: true, guia: true, codigo: false, ohm: false, req: 2 },
    '9no': { nombre: '9no EGB', ops: 3, prefPin: false, guia: false, codigo: false, ohm: false, req: 3 },
    '10mo': { nombre: '10mo EGB', ops: 3, prefPin: false, guia: false, codigo: true, ohm: false, req: 3 },
    '3BGU': { nombre: '3ro BGU', ops: 3, prefPin: false, guia: false, codigo: true, ohm: true, req: 3 }
  };
  const FASES = ['Misión', 'Elegir', 'Ubicar', 'Conectar', 'Diagrama', 'Bloques', 'Probar'];
  window.T3D_DATOS = { COMP, RES, ROL, P, D, A, PWM, SEN, correr, probar, sol, revisarConex, pinesSenal, necesita, codigo, CURSO, FASES, cmp };
})();
