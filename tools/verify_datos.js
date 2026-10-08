/* Verificación de los datos de la landing contra el snapshot real del juego. */
const fs = require('fs');
const js = fs.readFileSync(__dirname + '/../data.js', 'utf8');
const get = (name) => {
  const x = js.match(new RegExp('const ' + name + ' = \\[[\\s\\S]*?\\n\\];'));
  if(!x) throw new Error('no encontrado: ' + name);
  return new Function(x[0] + '; return ' + name)();
};
const D = { ZONAS: get('ZONAS'), JEFES: get('JEFES'), CLASES: get('CLASES'), RAZAS: get('RAZAS'), NUMEROS: get('NUMEROS'), FRASES: get('FRASES') };
D.CITA = new Function(js.match(/const CITA = \{[\s\S]*?\};/)[0] + '; return CITA')();
const snap = JSON.parse(fs.readFileSync(__dirname + '/../../docs/lore/SNAPSHOT_ESTRUCTURAL.json', 'utf8'));
const c = snap.counts;
const num = (k) => D.NUMEROS.find(n => n.c === k).v;
let fails = 0;
const chk = (n, a, b) => { const ok = a === b; if (!ok) fails++; console.log((ok ? 'OK   ' : 'FALLO') + ' ' + n + ': ' + a + (ok ? '' : ' (esperado ' + b + ')')); };

chk('zonas', D.ZONAS.length, c.zonas);
chk('jefes', D.JEFES.length, 32);
chk('clases', D.CLASES.length, 7);
chk('razas', D.RAZAS.length, 6);
chk('habilidades', num('habilidades'), c.habilidades);
chk('objetos', num('objetos'), c.objetos);
chk('recetas', num('recetas de crafteo'), c.recetas);
chk('misiones', num('misiones encadenadas'), c.misiones);
chk('enemigos', num('enemigos con IA'), c.enemigos);
chk('mazmorras', num('mazmorras'), 9);
console.log(fails ? fails + ' FALLOS' : '--- TODO COINCIDE CON EL CODIGO ---');
console.log('jefes raid:', D.JEFES.filter(b => b.k === 'raid').length,
  '| campana:', D.JEFES.filter(b => b.r === 0).length,
  '| nv50+:', D.JEFES.filter(b => b.l >= 50).length);
const nom = a => { const n = a.map(x => x.n); return new Set(n).size === n.length ? 'OK' : 'DUPLICADOS'; };
console.log('nombres de jefe unicos:', nom(D.JEFES));
console.log('nombres de zona unicos:', nom(D.ZONAS));
console.log('frases marquesina:', D.FRASES.length, '| cita ok:', D.CITA.t.length > 20 && D.CITA.s.length > 10);
/* escenas: cada zona con tipo valido 1-5 */
const tipos = new Set(D.ZONAS.map(z => z.s));
console.log('tipos de escena usados:', [...tipos].sort().join(','), '| todos en 1-5:', [...tipos].every(t => t >= 1 && t <= 5));
const peligros = new Set(D.ZONAS.map(z => z.d.toLowerCase()));
console.log('peligros:', [...peligros].join(', '));
