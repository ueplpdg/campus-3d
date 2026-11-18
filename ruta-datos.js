// Ruta Apagón · estaciones, teoría, acertijos por curso e íconos de componentes.
(function () {
  const R = {};
  R.ROOMS = [
    { id: 'inicio', n: 'VESTÍBULO', tema: 'backrooms' },
    { id: 'lab', n: 'LABORATORIO', tema: 'lab', pieza: 'Componentes', ico: '🧰', obj: 'Elijan los componentes del proyecto y clasifíquenlos en entradas y salidas.' },
    { id: 'pasillo', n: 'PASILLO', tema: 'pasillo', pieza: 'Ubicación', ico: '📍', obj: 'Decidan dónde va instalado cada componente en el lugar real.' },
    { id: 'aula', n: 'AULA', tema: 'aula', pieza: 'Conexiones', ico: '🔌', obj: 'Conecten cada pata de cada componente al pin correcto del Arduino.' },
    { id: 'banos', n: 'BAÑOS', tema: 'banos', pieza: 'Diagrama', ico: '🔷', obj: 'Armen el diagrama de flujo del sistema.' },
    { id: 'bar', n: 'BAR', tema: 'bar', pieza: 'Programa', ico: '💻', obj: 'Programen la decisión del rombo y completen el código de Arduino.' },
    { id: 'patio', n: 'PATIO', tema: 'patio', pieza: 'Pruebas', ico: '🧪', obj: 'Prueben el sistema en situaciones reales y reparen la falla sorpresa.' },
    { id: 'final', n: 'SALA DE MÁQUINAS', tema: 'final', pieza: 'Ficha técnica', ico: '📄', obj: 'Documenten el proyecto y devuelvan la energía al colegio.' },
    { id: 'cancha', n: 'CANCHA', tema: 'cancha' }
  ];
  R.TEO = {
    1: ['ENTRADA (sensor): MIDE algo del ambiente y le avisa al Arduino: luz, distancia, temperatura, movimiento, humedad, ruido, humo, agua, un carnet.', 'PROCESO: el Arduino lee las entradas, decide con su programa y da órdenes.', 'SALIDA (actuador): HACE algo en el mundo: LED, buzzer, servomotor, relé que enciende una bomba, un ventilador o lámparas.', 'Un proyecto lleva solo lo necesario: componentes de más cuestan dinero y complican el circuito.'],
    2: ['Un sensor va donde ocurre lo que mide, apuntando hacia ahí.', 'Lejos de interferencias: sol directo, calor de motores, CPU o proyector, agua, golpes u objetos que lo tapen.', 'Un actuador va donde se necesita su efecto: la luz donde se ve, la alarma donde se escucha, el servo junto al mecanismo.', 'Lo que funciona con 110 V (relés de lámparas) va dentro del tablero eléctrico, nunca expuesto.'],
    3: ['Colores de cable: ROJO = 5V (positivo) · NEGRO = GND (tierra, 0 V) · VERDE = señal digital · NARANJA = señal PWM (~) · AZUL = señal analógica.', 'LED: pata LARGA (+, ánodo) a un pin digital PASANDO por una resistencia de 220 Ω; pata corta (−, cátodo) a GND.', 'Ley de Ohm: R = V ÷ I → (5 V − 2 V) ÷ 0,015 A = 200 Ω → se usa 220 Ω.', 'Sensores de muchos valores (LDR, humedad, temperatura) van a A0–A5. Sensores de sí/no (PIR, IR, pulsador) van a D2–D13. El servo va a un pin con ~ (PWM).', 'Pulsador y LDR necesitan una resistencia de 10 kΩ. Los módulos con placa ya traen la suya.', 'Cada señal necesita su propio pin. 5V y GND sí se pueden compartir.'],
    4: ['Todo sistema automático repite tres pasos: LEER la entrada → DECIDIR (rombo) → ACTUAR con la salida.', 'Óvalo = INICIO. Paralelogramo = leer datos. Rombo = pregunta de Sí o No. Rectángulo = acción.', 'Del rombo salen dos caminos: SÍ y NO. Cada uno lleva a una acción distinta.', 'Al final, la flecha vuelve a leer: el sistema funciona para siempre (loop).'],
    5: ['El rombo se programa con un signo y un límite: «mayor a 28» → > 28 · «menor a 3» → < 3.', 'setup() se ejecuta UNA vez: ahí va pinMode(pin, OUTPUT) para salidas e INPUT para sensores digitales.', 'loop() se repite siempre: leer → if (decidir) → actuar.', 'digitalWrite(pin, HIGH) enciende (5 V); LOW apaga (0 V). digitalRead lee sí/no; analogRead lee de 0 a 1023.', 'Un = guarda un valor; == compara. Arduino distingue mayúsculas: digitalWrite ≠ digitalwrite.'],
    6: ['Probar es comprobar que el sistema hace lo que pide el objetivo en TODAS las situaciones, también en los casos límite.', 'Si algo falla, se busca la causa paso a paso: ¿llega la señal del sensor? ¿el programa manda la orden? ¿el actuador está bien conectado y alimentado?', 'El monitor serial del Arduino muestra los valores que lee el sensor: es la herramienta principal para encontrar fallas.'],
    7: ['La ficha técnica documenta el proyecto para que otra persona pueda construirlo, usarlo y repararlo.', 'Incluye: problema, objetivo, materiales y costo, ubicación, conexiones, diagrama, código, pruebas y conclusiones.', 'Las conclusiones responden: ¿funcionó? ¿qué aprendimos? ¿qué fue lo más difícil y cómo lo resolvimos?']
  };
  R.MINTXT = { '8vo': [40, 50, 30], '9no': [50, 60, 40], '10mo': [60, 80, 40], '3BGU': [80, 110, 60] };
  R.HUECOS = { '8vo': [4, 0], '9no': [5, 0], '10mo': [6, 0.5], '3BGU': [6, 0.5] };

  // ---------- Acertijos ----------
  const opt = (q, ok, otros, ex, cat, vis) => ({ cat, q, vis, ans: ok, opts: [ok].concat(otros), ex });
  const pad = (q, ans, ex, cat, vis) => ({ cat, q, vis, ans: String(ans), keypad: true, ex });
  const VERBAL = [
    () => opt('MÉDICO es a HOSPITAL como DOCENTE es a…', 'COLEGIO', ['LIBRO', 'ALUMNO', 'PIZARRA'], 'Relación: profesional → lugar donde trabaja. El médico trabaja en el hospital; el docente, en el colegio.'),
    () => opt('OJO es a VER como OÍDO es a…', 'ESCUCHAR', ['SONIDO', 'OREJA', 'HABLAR'], 'Relación: órgano → función. El ojo sirve para ver; el oído, para escuchar.'),
    () => opt('TERMÓMETRO es a TEMPERATURA como BALANZA es a…', 'PESO', ['LONGITUD', 'TIEMPO', 'VOLUMEN'], 'Relación: instrumento → lo que mide.'),
    () => opt('ARDUINO es a CEREBRO como SENSOR es a…', 'SENTIDOS', ['MÚSCULOS', 'HUESOS', 'SANGRE'], 'El Arduino decide como el cerebro; el sensor percibe el entorno como los sentidos.'),
    () => opt('SEMILLA es a ÁRBOL como HUEVO es a…', 'AVE', ['NIDO', 'YEMA', 'CÁSCARA'], 'Relación: origen → ser que se forma.'),
    () => opt('LLAVE es a CERRADURA como CONTRASEÑA es a…', 'CUENTA', ['TECLADO', 'NÚMERO', 'SECRETO'], 'Relación: lo que abre → lo que se abre.'),
    () => opt('¿Qué palabra NO pertenece al grupo? MANZANA · PERA · ZANAHORIA · UVA', 'ZANAHORIA', ['MANZANA', 'PERA', 'UVA'], 'Las demás son frutas; la zanahoria es una hortaliza (raíz).'),
    () => opt('¿Qué palabra NO pertenece al grupo? LED · BUZZER · SERVO · SENSOR', 'SENSOR', ['LED', 'BUZZER', 'SERVO'], 'LED, buzzer y servo son salidas (actúan); el sensor es una entrada (mide).'),
    () => opt('¿Qué palabra NO pertenece al grupo? TRIÁNGULO · CUADRADO · CUBO · PENTÁGONO', 'CUBO', ['TRIÁNGULO', 'CUADRADO', 'PENTÁGONO'], 'El cubo es un cuerpo de 3 dimensiones; los demás son figuras planas.'),
    () => opt('¿Qué palabra NO pertenece al grupo? QUITO · CUENCA · GUAYAQUIL · LIMA', 'LIMA', ['QUITO', 'CUENCA', 'GUAYAQUIL'], 'Lima es una ciudad de Perú; las demás son de Ecuador.'),
    () => opt('¿Qué palabra NO pertenece al grupo? ALEGRE · CONTENTO · FELIZ · CANSADO', 'CANSADO', ['ALEGRE', 'CONTENTO', 'FELIZ'], 'Las demás expresan alegría; «cansado» no.'),
    () => opt('Sinónimo de EFÍMERO:', 'PASAJERO', ['ETERNO', 'ENORME', 'FRÁGIL'], 'Efímero = que dura poco tiempo = pasajero.'),
    () => opt('Antónimo de ESCASO:', 'ABUNDANTE', ['POCO', 'RARO', 'CARO'], 'Escaso = que hay poco. Lo contrario es abundante.'),
    () => opt('Sinónimo de PERSPICAZ:', 'AGUDO', ['LENTO', 'TÍMIDO', 'TERCO'], 'Perspicaz = que percibe y entiende rápido = agudo.'),
    () => opt('Antónimo de OPTIMISTA:', 'PESIMISTA', ['ALEGRE', 'REALISTA', 'IDEALISTA'], 'El optimista espera lo mejor; el pesimista, lo peor.'),
    () => opt('Sinónimo de INNOVAR:', 'RENOVAR', ['COPIAR', 'REPETIR', 'OLVIDAR'], 'Innovar = introducir novedades = renovar.'),
    () => opt('Completen: «Aunque el examen era difícil, ella lo resolvió con gran ______.»', 'SOLTURA', ['DIFICULTAD', 'TRISTEZA', 'LENTITUD'], '«Aunque» anuncia un contraste: difícil ↔ con soltura (facilidad).'),
    () => opt('Completen: «El sensor es muy ______: detecta cambios mínimos de luz.»', 'SENSIBLE', ['LENTO', 'PESADO', 'BARATO'], 'Detectar cambios mínimos = ser sensible.'),
    () => opt('Completen: «Para ______ energía, la luz se apaga cuando no hay nadie.»', 'AHORRAR', ['GASTAR', 'MEDIR', 'VENDER'], 'Apagar la luz sin gente sirve para ahorrar energía.')
  ];
  const LOGICO = [
    () => opt('Ana es más alta que Beto. Beto es más alto que Carla. ¿Quién es la más baja?', 'Carla', ['Ana', 'Beto', 'No se puede saber'], 'Ordenen: Ana > Beto > Carla. La más baja es Carla.'),
    () => opt('Todos los robots usan energía. El dron es un robot. Entonces…', 'El dron usa energía', ['Todo lo que usa energía es robot', 'El dron no es robot', 'No se puede saber'], 'Si TODOS los robots usan energía y el dron es robot, el dron usa energía. Lo contrario no se deduce.'),
    () => opt('Si llueve, el patio se moja. El patio NO está mojado. Entonces…', 'No llovió', ['Llovió', 'Va a llover', 'No se puede saber'], 'Si hubiera llovido, estaría mojado. Como no lo está, no llovió.'),
    () => opt('Tres cajas: «manzanas», «peras» y «mixta». TODAS las etiquetas están mal. Sacan una fruta de la caja «mixta» y es una pera. ¿Qué tiene la caja «mixta»?', 'Solo peras', ['Mixta', 'Solo manzanas', 'No se sabe'], 'La etiqueta «mixta» está mal, así que no es mixta. Salió una pera: tiene solo peras.'),
    () => opt('En una fila, Diana está delante de Elena y detrás de Fabián. ¿Quién está primero?', 'Fabián', ['Diana', 'Elena', 'No se sabe'], 'Fabián → Diana → Elena.'),
    () => opt('Si hoy es miércoles, ¿qué día será dentro de 10 días?', 'Sábado', ['Viernes', 'Domingo', 'Jueves'], '7 días después vuelve a ser miércoles; 3 más: jueves, viernes, sábado.'),
    () => pad('Un caracol sube 3 m de día y resbala 2 m de noche en un pozo de 10 m. ¿En qué día sale?', 8, 'Cada día completo avanza 1 m (sube 3, baja 2). Al amanecer del día 8 está a 7 m; ese día sube 3 m, llega a 10 m y sale antes de resbalar.'),
    () => pad('Cuatro amigos se saludan dándose la mano, una vez cada pareja. ¿Cuántos apretones hay?', 6, 'Cada uno saluda a 3: 4 × 3 = 12, pero cada saludo se contó dos veces: 12 ÷ 2 = 6.'),
    () => opt('Pedro dice: «Yo no rompí el vidrio». Luis dice: «Pedro lo rompió». Solo uno dice la verdad y solo uno lo rompió (Pedro o Luis). ¿Quién lo rompió?', 'Pedro', ['Luis', 'Los dos', 'No se sabe'], 'Si lo rompió Pedro: Pedro miente y Luis dice la verdad (uno solo dice la verdad ✓). Si lo rompió Luis, los dos dirían la verdad ✗.')
  ];
  const sel = (r, a) => a[Math.floor(r() * a.length)];
  const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
  function serie(r, nivel) {
    const t = int(r, 0, nivel >= 3 ? 4 : nivel >= 2 ? 3 : 1); let a = [], s;
    if (t === 0) { const x = int(r, 2, 20), d = int(r, 3, 9); a = [0, 1, 2, 3, 4].map(i => x + d * i); s = 'Cada número suma ' + d + '.'; }
    else if (t === 1) { const x = int(r, 1, 4), k = int(r, 2, 3); a = [0, 1, 2, 3, 4].map(i => x * Math.pow(k, i)); s = 'Cada número se multiplica por ' + k + '.'; }
    else if (t === 2) { const x = int(r, 10, 30), p = int(r, 4, 9), q = int(r, 1, 3); a = [x]; for (let i = 1; i < 5; i++) a.push(a[i - 1] + (i % 2 ? p : -q)); s = 'Se alterna: +' + p + ', −' + q + '.'; }
    else if (t === 3) { const x = int(r, 1, 4); a = [0, 1, 2, 3, 4].map(i => (x + i) * (x + i)); s = 'Son cuadrados: ' + x + '², ' + (x + 1) + '², ' + (x + 2) + '²…'; }
    else { a = [int(r, 1, 3), int(r, 2, 5)]; for (let i = 2; i < 5; i++) a.push(a[i - 1] + a[i - 2]); s = 'Cada número es la suma de los dos anteriores.'; }
    return pad('Descubran el número que falta en la serie para abrir el candado:', a[4], s + ' El siguiente es ' + a[4] + '.', 'Numérico', a.slice(0, 4).join('   ') + '   ?');
  }
  function numerico(r) {
    const t = int(r, 0, 4);
    if (t === 0) return serie(r, 3);
    if (t === 1) { const P = sel(r, [40, 60, 80, 120, 150, 200]), D = sel(r, [10, 20, 25, 30, 40, 50].filter(d => P * d % 100 === 0)); return pad('Un parlante cuesta $' + P + ' y tiene ' + D + ' % de descuento. ¿Cuántos dólares se pagan?', P - P * D / 100, D + ' % de ' + P + ' = ' + (P * D / 100) + '. Se paga ' + P + ' − ' + (P * D / 100) + ' = ' + (P - P * D / 100) + '.', 'Numérico'); }
    if (t === 2) { const a = sel(r, [2, 3, 4]), d = sel(r, [12, 18, 24]), b = sel(r, [6, 8, 12].filter(x => a * d % x === 0 && x !== a)); return pad(a + ' técnicos instalan los sensores del colegio en ' + d + ' días. ¿En cuántos días lo harían ' + b + ' técnicos (al mismo ritmo)?', a * d / b, 'Más técnicos → menos días (proporción inversa): ' + a + ' × ' + d + ' = ' + (a * d) + ' días-técnico; ' + (a * d) + ' ÷ ' + b + ' = ' + (a * d / b) + '.', 'Numérico'); }
    if (t === 3) { const k = sel(r, [2, 3, 4]), x = int(r, 6, 14), s = x * (k + 1); return pad('La edad de Ana es ' + ['', '', 'el doble', 'el triple', 'el cuádruple'][k] + ' de la de Luis. Juntos suman ' + s + ' años. ¿Cuántos años tiene Ana?', k * x, 'Luis = x, Ana = ' + k + 'x. x + ' + k + 'x = ' + s + ' → ' + (k + 1) + 'x = ' + s + ' → x = ' + x + '. Ana = ' + (k * x) + '.', 'Numérico'); }
    const v = sel(r, [40, 50, 60, 80]), h1 = sel(r, [2, 3]), h2 = sel(r, [4, 5, 6]); return pad('Un bus recorre ' + (v * h1) + ' km en ' + h1 + ' horas. A la misma velocidad, ¿cuántos km recorre en ' + h2 + ' horas?', v * h2, 'Velocidad = ' + (v * h1) + ' ÷ ' + h1 + ' = ' + v + ' km/h. En ' + h2 + ' h: ' + v + ' × ' + h2 + ' = ' + (v * h2) + ' km.', 'Numérico');
  }
  function abstracto(r) {
    const t = int(r, 0, 3);
    if (t === 0) { const A = ['↑', '→', '↓', '←'], s0 = int(r, 0, 3), g = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) g.push(A[(s0 + i + j) % 4]); const ok = g[8]; g[8] = '?'; return { cat: 'Abstracto', q: 'Cada flecha gira 90° en sentido horario hacia la derecha y hacia abajo. ¿Qué flecha falta?', grid: g, ans: ok, opts: A.slice(), ex: 'En cada fila y en cada columna la flecha gira un cuarto de vuelta. La que falta es ' + ok + '.' }; }
    if (t === 1) { const S = sel(r, ['●', '■', '▲']), g = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) g.push(S.repeat(i + j + 1)); const ok = g[8]; g[8] = '?'; return { cat: 'Abstracto', q: 'Observen cómo cambia la cantidad de figuras. ¿Qué celda falta?', grid: g, ans: ok, opts: [ok, S.repeat(4), S.repeat(6), S.repeat(3)], ex: 'Hacia la derecha y hacia abajo aumenta una figura. La última celda tiene 5.' }; }
    if (t === 2) { const V = [['○', '◐', '●'], ['□', '◧', '■'], ['△', '◭', '▲']], ord = [0, 1, 2].sort(() => r() - 0.5), g = []; ord.forEach(i => V[i].forEach(x => g.push(x))); const ok = g[8]; g[8] = '?'; const F = V[ord[2]]; return { cat: 'Abstracto', q: 'Cada fila tiene una figura que se va rellenando. ¿Qué figura falta?', grid: g, ans: ok, opts: [ok, F[0], F[1], V[ord[0]][2]], ex: 'En cada fila: vacía → mitad → llena. La que falta es ' + ok + ' llena.' }; }
    const C = ['◐', '◓', '◑', '◒'], s0 = int(r, 0, 3), seq = [0, 1, 2, 3, 4].map(i => C[(s0 + i) % 4]); return { cat: 'Abstracto', q: 'El círculo gira en cada paso. ¿Cuál sigue?', vis: seq.slice(0, 4).join('   ') + '   ?', ans: seq[4], opts: C.slice(), ex: 'Gira un cuarto de vuelta en cada paso; después de 4 pasos vuelve a la misma posición.' };
  }
  function cesar(r, k) {
    const w = sel(r, ['LED', 'PIN', 'SERVO', 'RELE', 'SENSOR', 'CABLE', 'PILA', 'MOTOR']), enc = w.split('').map(c => String.fromCharCode((c.charCodeAt(0) - 65 + k) % 26 + 65)).join('');
    const otros = ['LED', 'PIN', 'SERVO', 'RELE', 'SENSOR', 'CABLE', 'PILA', 'MOTOR'].filter(x => x !== w && x.length === w.length).concat(['ROBOT', 'BOMBA', 'LUZ', 'GND'].filter(x => x !== w)).slice(0, 3);
    return opt('Mensaje cifrado: cada letra se cambió por la que está ' + k + ' lugar' + (k > 1 ? 'es' : '') + ' después en el abecedario (A → ' + String.fromCharCode(65 + k) + '). ¿Qué palabra es?', w, otros, 'Retrocedan ' + k + ' letra' + (k > 1 ? 's' : '') + ' cada símbolo: ' + enc + ' → ' + w + '.', 'Lógico', enc);
  }
  function patron(r, nivel) {
    const C = ['🔴', '🟢', '🔵', '🟡'], L = nivel >= 2 ? int(r, 3, 4) : 3, base = []; for (let i = 0; i < L; i++) base.push(C[(i * (nivel >= 2 ? 2 : 1) + int(r, 0, 0)) % 4]);
    if (nivel >= 2) base[L - 1] = base[0];
    const seq = []; for (let i = 0; i < 9; i++) seq.push(base[i % L]); const ok = seq[8];
    return opt('Las luces del tablero siguen un patrón. ¿De qué color es la siguiente?', ok, C.filter(x => x !== ok).slice(0, 3), 'El patrón se repite cada ' + L + ' luces: ' + base.join(' ') + '.', 'Lógico', seq.slice(0, 8).join(' ') + ' ?');
  }
  function candado(r) { const l = int(r, 1, 4), m = int(r, 0, 9); return pad('Candado de 3 dígitos: el primero es el DOBLE del último; el del medio es ' + m + '; los tres suman ' + (3 * l + m) + '.', '' + 2 * l + m + l, 'Si el último es x, el primero es 2x: 2x + ' + m + ' + x = ' + (3 * l + m) + ' → 3x = ' + (3 * l) + ' → x = ' + l + '. Código: ' + (2 * l) + m + l + '.', 'Lógico'); }
  function ohm(r) { const [V, Vl, I] = sel(r, [[5, 2, 0.015], [5, 3, 0.01], [5, 2, 0.02], [9, 3, 0.02], [5, 2, 0.01]]), R0 = Math.round((V - Vl) / I); return pad('Un LED funciona con ' + Vl + ' V y ' + String(I).replace('.', ',') + ' A. La fuente da ' + V + ' V. ¿Qué resistencia necesita, en ohmios? (R = V ÷ I)', R0, 'La resistencia recibe ' + V + ' − ' + Vl + ' = ' + (V - Vl) + ' V. R = ' + (V - Vl) + ' ÷ ' + String(I).replace('.', ',') + ' = ' + R0 + ' Ω.', 'Numérico'); }
  function delayR(r) { const on = sel(r, [250, 500, 1000]), off = sel(r, [250, 500, 1000]), s = sel(r, [10, 20, 30]).valueOf(), n = Math.floor(s * 1000 / (on + off)); return pad('Un LED hace: encender → delay(' + on + ') → apagar → delay(' + off + '), y se repite. ¿Cuántas veces se enciende en ' + s + ' segundos?', n, 'Cada ciclo dura ' + on + ' + ' + off + ' = ' + (on + off) + ' ms. ' + (s * 1000) + ' ÷ ' + (on + off) + ' = ' + n + ' ciclos.', 'Numérico'); }
  function corriente(r) { const n = int(r, 3, 8), mA = sel(r, [10, 15, 20]); return pad('Cada LED consume ' + mA + ' mA. ¿Cuántos mA consumen ' + n + ' LED encendidos a la vez?', n * mA, n + ' × ' + mA + ' = ' + (n * mA) + ' mA.', 'Numérico'); }
  const deduc8 = [0, 1, 2, 4, 5];
  const PLAN = {
    '8vo': [r => serie(r, 1), r => patron(r, 1), r => cesar(r, 1), r => LOGICO[sel(r, deduc8)](), r => candado(r), r => patron(r, 2), r => serie(r, 2)],
    '9no': [r => serie(r, 2), r => patron(r, 2), r => cesar(r, 1), r => candado(r), r => delayR(r), r => LOGICO[sel(r, deduc8)](), r => corriente(r)],
    '10mo': [r => serie(r, 3), r => ohm(r), r => cesar(r, 2), r => candado(r), r => delayR(r), r => corriente(r), r => ohm(r)],
    '3BGU': [[numerico, r => sel(r, VERBAL)()], [r => sel(r, LOGICO)(), abstracto], [numerico, abstracto], [r => sel(r, VERBAL)(), r => sel(r, LOGICO)()], [abstracto, numerico], [r => sel(r, LOGICO)(), r => sel(r, VERBAL)()], [numerico, abstracto]]
  };
  R.acertijos = function (curso, s, r) {
    const P = PLAN[curso] || PLAN['9no'], g = P[(s - 1) % 7], lst = Array.isArray(g) ? g.map(f => f(r)) : [g(r)];
    return lst.map(x => { x.cat = x.cat || (curso === '3BGU' ? 'Razonamiento' : 'Lógica'); if (x.opts) { const o = x.opts.slice(); for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; } x.opts = o; } return x; });
  };

  // ---------- Íconos de componentes (SVG) ----------
  const LC = { led_r: '#ff3b30', led_a: '#ffc531', led_v: '#2ee86d', led_b: '#f5f7ff' };
  R.svgComp = function (c) {
    const s = b => '<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' + b + '</svg>';
    const pcb = (col, extra) => '<rect x="8" y="14" width="48" height="34" rx="4" fill="' + (col || '#1f5fa8') + '" stroke="#0a1a3a" stroke-width="2"/>' + [0, 1, 2].map(i => '<rect x="' + (22 + i * 8) + '" y="48" width="4" height="10" fill="#c9a227"/>').join('') + (extra || '');
    if (LC[c]) return s('<path d="M20 34 a12 12 0 0 1 24 0 V44 H20 Z" fill="' + LC[c] + '" stroke="#0a1a3a" stroke-width="2"/><rect x="17" y="44" width="30" height="5" rx="1" fill="#cfd6dd"/><rect x="25" y="49" width="3" height="13" fill="#9aa5ab"/><rect x="36" y="49" width="3" height="9" fill="#9aa5ab"/>');
    if (c === 'buzzer') return s('<circle cx="32" cy="30" r="17" fill="#1b1f24" stroke="#0a1a3a" stroke-width="2"/><circle cx="32" cy="30" r="4" fill="#444"/><path d="M50 18 q6 12 0 24 M55 13 q9 17 0 34" fill="none" stroke="#f0a726" stroke-width="2.5"/><rect x="26" y="47" width="3" height="12" fill="#9aa5ab"/><rect x="35" y="47" width="3" height="12" fill="#9aa5ab"/>');
    if (c === 'servo') return s('<rect x="10" y="22" width="44" height="24" rx="3" fill="#1e63c6" stroke="#0a1a3a" stroke-width="2"/><circle cx="22" cy="22" r="7" fill="#fff" stroke="#0a1a3a" stroke-width="2"/><rect x="20" y="8" width="5" height="16" rx="2" fill="#fff" stroke="#0a1a3a" stroke-width="1.5"/><path d="M54 36 h6" stroke="#f0a726" stroke-width="3"/>');
    if (/^rele/.test(c)) return s(pcb('#1a4f8f', '<rect x="14" y="18" width="22" height="22" rx="2" fill="#1e88e5" stroke="#0a1a3a"/><text x="25" y="33" font-size="8" text-anchor="middle" fill="#fff" font-family="monospace">5V</text><rect x="40" y="20" width="12" height="18" fill="#2e7d32"/>'));
    if (c === 'hc') return s(pcb('#1565c0', '<circle cx="22" cy="31" r="9" fill="#cfd6dd" stroke="#0a1a3a" stroke-width="2"/><circle cx="42" cy="31" r="9" fill="#cfd6dd" stroke="#0a1a3a" stroke-width="2"/><circle cx="22" cy="31" r="4" fill="#555"/><circle cx="42" cy="31" r="4" fill="#555"/>'));
    if (c === 'pir') return s(pcb('#2e7d32', '<path d="M18 40 a14 14 0 0 1 28 0 Z" fill="#f4f4f4" stroke="#0a1a3a" stroke-width="2"/><path d="M24 34 l16 0 M22 38 l20 0" stroke="#ccc"/>'));
    if (c === 'ir') return s(pcb('#37474f', '<circle cx="24" cy="30" r="5" fill="#222"/><circle cx="38" cy="30" r="5" fill="#cfd6dd"/>'));
    if (c === 'ldr') return s('<circle cx="32" cy="28" r="15" fill="#f6d27a" stroke="#0a1a3a" stroke-width="2"/><path d="M22 24 h20 M22 28 h20 M22 32 h20" stroke="#c0392b" stroke-width="2"/><rect x="26" y="43" width="3" height="16" fill="#9aa5ab"/><rect x="35" y="43" width="3" height="16" fill="#9aa5ab"/>');
    if (c === 'hum') return s('<rect x="16" y="6" width="32" height="18" rx="3" fill="#1565c0" stroke="#0a1a3a" stroke-width="2"/><path d="M22 24 V58 l3 4 l3 -4 V24 M36 24 V58 l3 4 l3 -4 V24" fill="#c9a227" stroke="#0a1a3a" stroke-width="1.5"/>');
    if (c === 'son') return s(pcb('#c62828', '<circle cx="24" cy="31" r="9" fill="#cfd6dd" stroke="#0a1a3a" stroke-width="2"/><circle cx="44" cy="31" r="4" fill="#1e88e5"/>'));
    if (c === 'uv') return s(pcb('#6a1b9a', '<circle cx="32" cy="30" r="7" fill="#e1bee7" stroke="#0a1a3a"/><path d="M32 16 v4 M32 40 v4 M18 30 h4 M42 30 h4" stroke="#fff" stroke-width="2"/>'));
    if (c === 'btn') return s('<rect x="16" y="20" width="32" height="26" rx="3" fill="#263238" stroke="#0a1a3a" stroke-width="2"/><circle cx="32" cy="33" r="8" fill="#e53935" stroke="#0a1a3a" stroke-width="2"/><rect x="18" y="46" width="3" height="12" fill="#9aa5ab"/><rect x="43" y="46" width="3" height="12" fill="#9aa5ab"/>');
    if (c === 'lm35') return s('<path d="M20 14 h24 v26 a12 6 0 0 1 -24 0 Z" fill="#222" stroke="#0a1a3a" stroke-width="2"/><text x="32" y="30" font-size="7" text-anchor="middle" fill="#ddd" font-family="monospace">LM35</text>' + [0, 1, 2].map(i => '<rect x="' + (24 + i * 7) + '" y="44" width="3" height="16" fill="#9aa5ab"/>').join(''));
    if (c === 'tarjeta') return s('<rect x="10" y="16" width="44" height="30" rx="4" fill="#2a62c9" stroke="#0a1a3a" stroke-width="2"/><path d="M22 31 a10 10 0 0 1 20 0 M26 31 a6 6 0 0 1 12 0" fill="none" stroke="#fff" stroke-width="2.5"/>');
    if (c === 'gas') return s(pcb('#37474f', '<circle cx="32" cy="31" r="12" fill="#9aa3ad" stroke="#0a1a3a" stroke-width="2"/><path d="M24 31 h16 M32 23 v16" stroke="#666"/>'));
    if (c === 'agua_s') return s('<rect x="18" y="6" width="28" height="52" rx="3" fill="#c0392b" stroke="#0a1a3a" stroke-width="2"/>' + [0, 1, 2, 3, 4].map(i => '<rect x="23" y="' + (12 + i * 8) + '" width="18" height="3" fill="#c9a227"/>').join(''));
    return s(pcb('#455a64', '<rect x="22" y="22" width="20" height="16" rx="2" fill="#222"/>'));
  };
  R.PINF = { anodo: 'Pata LARGA del LED (+, ánodo)', catodo: 'Pata CORTA del LED (−, cátodo)', vcc: 'Alimentación del módulo (+)', p5: 'Pata que va al positivo', gnd: 'Tierra del módulo (−, 0 V)', dig: 'Señal digital: solo SÍ o NO (HIGH / LOW)', pwm: 'Señal de control del servo (pulsos)', ana: 'Señal analógica: muchos valores (0 a 1023)', pull: 'Pata de señal del pulsador', div: 'Pata de señal de la LDR' };
  R.FICHA = {
  arduino: ['🟦', 'Arduino UNO (el cerebro)', 'PROCESO', 'Microcontrolador ATmega328P a 16 MHz. Pines digitales D0–D13: HIGH = 5 V, LOW = 0 V, máximo 20 mA cada uno. Los pines con ~ (D3, D5, D6, D9, D10, D11) dan PWM, para servos. Pines analógicos A0–A5: leen de 0 a 1023 (0 V a 5 V). Se alimenta por USB a 5 V.'],
  led: ['💡', 'LED', 'SALIDA', 'Diodo que emite luz. Funciona con unos 2 V (rojo, amarillo) a 3 V (verde, blanco) y 10–20 mA. Pata LARGA = ánodo (+) hacia el pin; pata corta = cátodo (−) a GND. Siempre con resistencia de 220 Ω: R = (5 V − 2 V) ÷ 0,015 A = 200 Ω → 220 Ω. Se maneja con digitalWrite(pin, HIGH).'],
  buzzer: ['🔊', 'Buzzer activo', 'SALIDA', 'Suena cuando recibe 5 V (HIGH): unos 2 300 Hz y 85 dB a 10 cm. Pata + a un pin digital y − a GND. Uso: alarmas y avisos.'],
  servo: ['⚙️', 'Servomotor SG90', 'SALIDA', 'Gira a un ángulo exacto entre 0° y 180°. Cables: marrón = GND, rojo = 5 V, naranja = señal (pin con ~). Con la librería Servo: tapa.write(90). Fuerza 1,8 kg·cm; puede consumir hasta 650 mA, por eso conviene una fuente externa de 5 V.'],
  rele: ['🔌', 'Módulo relé', 'SALIDA', 'Interruptor que el Arduino controla: con HIGH en IN cierra su contacto (se oye un «clic») y enciende un aparato de más potencia (bomba, ventilador, lámparas de 110 V). El aparato se conecta a los bornes COM y NO (normalmente abierto) con su propia fuente. ¡Nunca tocar los bornes de 110 V!'],
  hc: ['📏', 'Ultrasónico HC-SR04', 'ENTRADA', 'Emite un sonido de 40 kHz (Trig) y mide cuánto tarda el eco en volver (Echo). Rango 2–400 cm, precisión 3 mm, cono de unos 15°. Distancia (cm) = tiempo del eco (µs) ÷ 58. Funciona a 5 V.'],
  pir: ['🚶', 'Sensor de movimiento PIR', 'ENTRADA', 'Detecta el calor (infrarrojo) del cuerpo humano cuando se mueve. Alcance hasta 7 m, ángulo de 110°. Salida digital: HIGH = hay movimiento. Perilla Tx: cuánto dura la señal (3 s a 5 min); perilla Sx: sensibilidad. Al encender tarda 1 minuto en estabilizarse.'],
  ir: ['📡', 'Sensor infrarrojo IR', 'ENTRADA', 'Emite luz infrarroja y detecta su reflejo: ve objetos a 2–30 cm (se ajusta con su perilla). Salida digital (sí / no). Funciona a 3,3–5 V.'],
  ldr: ['☀️', 'Fotorresistencia LDR', 'ENTRADA', 'Su resistencia cambia con la luz: unos 1 MΩ en oscuridad y 1 kΩ a pleno sol. Con una resistencia de 10 kΩ (divisor de voltaje) va a un pin analógico: analogRead da 0 (oscuro) a 1023 (mucha luz). Referencias: noche < 200, aula iluminada 500–800.'],
  hum: ['🌱', 'Sensor de humedad de suelo', 'ENTRADA', 'Dos puntas que miden cuánto conduce la tierra (el agua conduce). analogRead 0–1023 se convierte a %: 0 % seco, 100 % encharcado. Una maceta necesita riego cuando baja de 30–40 %. Se calibra con tierra seca y mojada.'],
  son: ['🎤', 'Sensor de sonido', 'ENTRADA', 'Micrófono con amplificador: analogRead indica la intensidad del ruido y se calibra a decibeles (dB). Referencias: biblioteca 40 dB, conversación 60 dB, aula ruidosa 80 dB. Según la OMS, más de 85 dB por mucho tiempo daña el oído.'],
  uv: ['🌞', 'Sensor de radiación UV', 'ENTRADA', 'Mide la radiación ultravioleta del sol como índice UV (OMS): 0–2 bajo, 3–5 moderado, 6–7 alto, 8–10 muy alto, 11 o más extremo. En Ecuador, sobre la línea equinoccial, a mediodía el índice suele llegar a 11 o más.'],
  btn: ['🔘', 'Pulsador', 'ENTRADA', 'Conecta solo mientras se presiona. Necesita una resistencia de 10 kΩ (pull-down) para que el pin lea LOW cuando está suelto. digitalRead da HIGH al presionar.'],
  lm35: ['🌡️', 'Sensor de temperatura LM35', 'ENTRADA', 'Entrega 10 mV por cada °C (25 °C → 0,25 V). Rango −55 °C a 150 °C, precisión ±0,5 °C. En Arduino: °C = analogRead × 0,488. Patas: VCC (5 V), salida (a un pin analógico) y GND.'],
  tarjeta: ['💳', 'Lector de tarjeta RFID', 'ENTRADA', 'Lee el chip del carnet sin contacto (13,56 MHz, a 3–5 cm). En este proyecto el módulo compara el carnet con la lista de autorizados y da HIGH si es válido.'],
  gas: ['💨', 'Sensor de humo y gas MQ-2', 'ENTRADA', 'Detecta humo, gas de cocina (GLP) y alcohol. Tiene un calentador interno: necesita 1–2 minutos para calentarse. analogRead: aire limpio 100–200; con humo, más de 400.'],
  agua_s: ['💧', 'Sensor de agua', 'ENTRADA', 'Pistas metálicas: cuando el agua las une, conduce y el valor sube. analogRead: seco 0–100, unas gotas unos 300, charco más de 500. Con el tiempo se oxida.'],
  res: ['〰️', 'Resistencias', 'COMPONENTE', '220 Ω (rojo-rojo-café): una por cada LED, limita la corriente. 10 kΩ (café-negro-naranja): para el pulsador (pull-down) y la LDR (divisor de voltaje). Los módulos con placa (PIR, HC-SR04, relé, sensores con AO) ya traen sus resistencias.']
};
  R.FK = c => /^led/.test(c) ? 'led' : /^rele/.test(c) ? 'rele' : c;
  window.RUTA_DATOS = R;
})();
