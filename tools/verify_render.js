/* Verificación del render real de la landing con jsdom (sin navegador). */
const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync(__dirname + '/../index.html', 'utf8');
const errores = [];

const dom = new JSDOM(html, {
  url: 'file:///' + __dirname.replace(/\\/g, '/') + '/../index.html',
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true,
  beforeParse(win) {
    win.matchMedia = (q) => ({ matches:false, media:q, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){} });
    win.IntersectionObserver = class { constructor(cb){} observe(){} unobserve(){} disconnect(){} };
    win.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 0);
    win.addEventListener('error', (e) => errores.push('window: ' + (e.error ? e.error.message : e.message)));
    const origErr = win.console.error;
    win.console.error = (...a) => { errores.push('console.error: ' + a.join(' ')); origErr(...a); };
  }
});
const { window } = dom;
const doc = window.document;
const $ = (s) => doc.querySelector(s);
const $$ = (s) => [...doc.querySelectorAll(s)];
const r = (s) => $$(s).length;

const faltan = [];
function espera(nombre, fn, ms) {
  return new Promise(res => {
    const t0 = Date.now();
    (function check(){
      let ok = false;
      try { ok = fn(); } catch(e) { ok = false; }
      if(ok) return res(nombre + ': OK');
      if(Date.now() - t0 > ms) { faltan.push(nombre); return res(nombre + ': FALLA'); }
      setTimeout(check, 60);
    })();
  });
}

(async () => {
  const R = {};

  await espera('titulo por palabras', () => r('#titleFront .word') === 3, 3000);
  R.titulo_texto = $('#titleFront').textContent;
  R.titulo_back = $('#titleBack').textContent;
  R.palabras = r('#titleFront .word');

  await espera('estrellas y brasas', () => r('.star') === 95 && r('.ember') === 26, 2000);
  R.estrellas = r('.star');
  R.brasas = r('.ember');

  await espera('marquesina', () => r('#diceTrack span') === 20, 2000);
  R.marquesina = r('#diceTrack span');

  await espera('escena de zona', () => r('#zoneScene svg') === 1, 3000);
  R.escena_svg = r('#zoneScene svg');
  R.zona = $('#zoneName').textContent;
  R.zona_dots = r('.dot');
  R.zona_tags = r('#zoneTags .tag');
  R.contador = $('#zoneCounter').textContent;

  await espera('jefes', () => r('.boss') === 32, 2000);
  R.jefes = r('.boss');
  R.jefes_raid = r('.boss .kind.raid');
  R.sigilos = r('.boss .sigil');

  await espera('clases y razas', () => r('.class-card') === 7 && r('.race') === 6, 2000);
  R.clases = r('.class-card');
  R.razas = r('.race');

  await espera('numeros', () => r('.num-item .big') === 9, 2000);
  R.numeros = r('.num-item .big');

  await espera('arena de combate', () => r('#csLog .ln') >= 1, 3000);
  R.elementos = r('.elem');
  R.log_lineas = r('#csLog .ln');
  R.log_texto = $('#csLog').textContent.slice(0, 60);
  R.hp_heroe = $('#hpHeroV').textContent;
  R.hp_jefe = $('#hpBossV').textContent;
  R.ronda = $('#csRound').textContent;

  await espera('cita', () => $('#cita').textContent.length > 20, 1000);
  R.cita = $('#cita').textContent.slice(0, 50);
  R.cita_src = $('#citaSrc').textContent;

  /* interacciones */
  const dotsAntes = $('#zoneName').textContent;
  $('#zoneNext').click();
  const dotsDespues = $('#zoneName').textContent;
  R.carrusel_gira = dotsAntes !== dotsDespues;
  R.zona_tras_flecha = dotsDespues;

  $('#bossFilter .chip[data-f="raid"]').click();
  R.filtro_raid = r('.boss');
  R.filtro_raid_ok = r('.boss .kind.raid') === r('.boss');
  $('#bossFilter .chip[data-f="all"]').click();
  R.filtro_all = r('.boss');

  $('#rollBtn').click();
  R.log_tras_tirar = r('#csLog .ln');

  /* responsive móvil */
  R.tiene_burger = !!$('#burger');
  R.menu_items = r('#menu li');

  R.errores = errores;
  R.fallos = faltan;

  console.log(JSON.stringify(R, null, 1));
  window.close();
})();
