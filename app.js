/* ============ Crónicas de Auria — landing · lógica ============ */
'use strict';

const $ = (id) => document.getElementById(id);
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- título biselado a dos capas, reveal por palabra ---------- */
(function titulo(){
  const front = $('titleFront'), back = $('titleBack');
  const palabras = 'Crónicas de Auria'.split(' ');
  const pintar = (el) => palabras.map((w,i) =>
    `<span class="word" style="--wd:${0.25 + i*0.14}s">${w}</span>`).join(' ');
  front.innerHTML = pintar(front);
  back.innerHTML = pintar(back);
})();

/* ---------- estrellas y brasas del hero ---------- */
(function ambient(){
  const stars = $('stars');
  let html = '';
  for(let i=0;i<95;i++){
    const sz = Math.random() < .85 ? 1 : 2;
    html += `<span class="star" style="left:${(Math.random()*100).toFixed(2)}%;top:${(Math.random()*66).toFixed(2)}%;width:${sz}px;height:${sz}px;--dur:${(2.4+Math.random()*4.5).toFixed(1)}s;--delay:${(Math.random()*4).toFixed(1)}s"></span>`;
  }
  stars.innerHTML = html;

  const embers = $('embers');
  let e = '';
  for(let i=0;i<26;i++){
    const sz = (2 + Math.random()*2).toFixed(1);
    e += `<span class="ember" style="left:${(Math.random()*100).toFixed(2)}%;width:${sz}px;height:${sz}px;--dur:${(7+Math.random()*8).toFixed(1)}s;--delay:${(Math.random()*9).toFixed(1)}s;--drift:${(Math.random()*90-45).toFixed(0)}px"></span>`;
  }
  embers.innerHTML = e;
})();

/* ---------- marquesina de fórmulas ---------- */
(function marquee(){
  const track = $('diceTrack');
  const mitad = FRASES.map(f => `<span><i>◆</i>${f}</span>`).join('');
  track.innerHTML = mitad + mitad;
})();

/* ---------- escenas SVG por tipo de zona ---------- */
function escena(tipo, lvl){
  const id = 'g' + tipo + lvl;
  const cielos = {1:'#101827', 2:'#0b1220', 3:'#0d0f1c', 4:'#12131f', 5:'#160f1e'};
  const cielo = cielos[tipo] || '#0b1220';
  const lunaY = 30 + (lvl % 5) * 8;

  let capas = '';
  if(tipo === 1){                                   /* pueblo */
    capas = `
      <rect x="0" y="205" width="400" height="95" fill="#070b13"/>
      <g fill="#0e1626"><polygon points="40,215 90,160 140,215"/><polygon points="120,215 170,150 220,215"/><polygon points="250,215 300,165 350,215"/></g>
      <g fill="#f3cf7a"><rect x="82" y="196" width="7" height="9" opacity=".5"/><rect x="162" y="192" width="7" height="9" opacity=".4"/><rect x="292" y="198" width="7" height="9" opacity=".45"/></g>
      <rect x="0" y="238" width="400" height="4" fill="#05070c"/>
      <g fill="#0a1018"><polygon points="360,215 385,190 400,215"/></g>`;
  } else if(tipo === 2){                            /* bosque */
    let arboles = '';
    for(let i=0;i<16;i++){
      const x = (i*26 + (i%3)*8) % 400, h = 70 + ((i*41)%70), w = 15 + (i%3)*3;
      arboles += `<polygon points="${x},240 ${x+w/2},${240-h} ${x+w},240" fill="#0b1420"/>
                  <polygon points="${x+2},240 ${x+w/2},${240-h+22} ${x+w-2},240" fill="#080e18"/>`;
    }
    capas = `<rect x="0" y="222" width="400" height="78" fill="#070b13"/>${arboles}
      <circle cx="${70+lvl*4}" cy="52" r="1.4" fill="#fff" opacity=".7"/>`;
  } else if(tipo === 3){                            /* cueva / cripta */
    capas = `
      <path d="M0,300 L0,180 Q40,120 80,180 L90,300 Z" fill="#0c1420"/>
      <path d="M400,300 L400,160 Q360,110 320,165 L315,300 Z" fill="#0a1119"/>
      <path d="M110,300 L110,205 Q145,165 175,200 L180,300 Z" fill="#0b1320" opacity=".9"/>
      <path d="M220,300 L220,195 Q255,155 285,190 L290,300 Z" fill="#0a1019" opacity=".9"/>
      <rect x="0" y="268" width="400" height="32" fill="#05070c"/>
      <g fill="#f3cf7a"><ellipse cx="${150+lvl*3}" cy="252" rx="4" ry="2.4" opacity=".55"/><ellipse cx="${260-lvl*2}" cy="258" rx="3" ry="2" opacity=".4"/></g>`;
  } else if(tipo === 4){                            /* ruinas / fortaleza */
    capas = `
      <rect x="0" y="262" width="400" height="38" fill="#05070c"/>
      <g fill="#0d1524"><rect x="52" y="150" width="22" height="115"/><rect x="150" y="120" width="26" height="145"/><rect x="252" y="165" width="20" height="100"/><rect x="330" y="140" width="24" height="125"/></g>
      <g fill="#0a1119"><polygon points="40,150 63,128 86,150"/><polygon points="136,120 163,96 190,120"/><polygon points="240,165 262,142 284,165"/><polygon points="318,140 342,116 366,140"/></g>
      <g fill="#f3cf7a" opacity=".3"><rect x="156" y="200" width="8" height="12"/><rect x="58" y="215" width="7" height="10"/></g>`;
  } else {                                          /* vacío / eclipse */
    capas = `
      <ellipse cx="200" cy="300" rx="240" ry="46" fill="#0b0e18"/>
      <g stroke="#5c6d94" stroke-width="1" opacity=".28" fill="none">
        <path d="M40,300 q30,-60 90,-40"/><path d="M330,300 q-34,-52 -96,-34"/>
      </g>
      <g fill="#f3cf7a" opacity=".5"><polygon points="110,240 116,254 128,254 118,263 122,277 110,268 98,277 102,263 92,254 104,254"/></g>
      <circle cx="200" cy="262" r="14" fill="#05070c" stroke="#d4b062" stroke-opacity=".5"/>`;
  }

  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Escena de la zona">
    <defs>
      <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${cielo}"/><stop offset="1" stop-color="#05070c"/>
      </linearGradient>
      <radialGradient id="${id}h" cx=".78" cy=".1" r=".7">
        <stop offset="0" stop-color="#f3cf7a" stop-opacity=".14"/><stop offset="1" stop-color="#f3cf7a" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="400" height="300" fill="url(#${id})"/>
    <rect width="400" height="300" fill="url(#${id}h)"/>
    <circle cx="${(72 + (lvl*7)%260)}" cy="${lunaY}" r="${lvl>60?15:11}" fill="#05070c" stroke="#d4b062" stroke-opacity=".45"/>
    <circle cx="${(120 + (lvl*11)%250)}" cy="${lunaY-14}" r="1.2" fill="#fff" opacity=".8"/>
    <circle cx="${(300 - (lvl*5)%200)}" cy="${lunaY+18}" r="1" fill="#fff" opacity=".6"/>
    <circle cx="${(210 + (lvl*13)%160)}" cy="${lunaY-26}" r="1.5" fill="#fff" opacity=".7"/>
    <circle cx="60" cy="${lunaY+40}" r="1" fill="#fff" opacity=".5"/>
    ${capas}
  </svg>`;
}

/* ---------- carrusel de zonas ---------- */
let zi = 0, autoZona = null;
function pintarZona(){
  const z = ZONAS[zi];
  const sc = $('zoneScene');
  sc.innerHTML = escena(z.s, z.l);
  requestAnimationFrame(() => sc.classList.add('on'));

  $('zoneName').textContent = z.n;
  $('zoneDesc').textContent = z.x;
  $('zonePlateName').textContent = z.n;
  $('zonePlateMeta').textContent = `nivel ${z.l} · peligro ${z.d.toLowerCase()}`;
  $('zoneTags').innerHTML =
    `<span class="tag lvl">Nivel ${z.l}</span>` +
    `<span class="tag d-${z.d.toLowerCase()}">Peligro ${z.d}</span>` +
    `<span class="tag">${z.p} puntos de interés</span>`;
  $('zoneCounter').textContent = `${String(zi+1).padStart(2,'0')} / ${ZONAS.length}`;
  document.querySelectorAll('.dot').forEach((d,i) => d.classList.toggle('active', i === zi));
}
(function zonas(){
  const dots = $('zoneDots');
  dots.innerHTML = ZONAS.map((_,i) =>
    `<button class="dot" data-i="${i}" aria-label="Ir a la zona ${i+1}"></button>`).join('');
  dots.addEventListener('click', e => {
    const b = e.target.closest('.dot'); if(!b) return;
    zi = +b.dataset.i; pararAuto(); pintarZona();
  });
  $('zonePrev').addEventListener('click', () => { zi = (zi-1+ZONAS.length)%ZONAS.length; pararAuto(); pintarZona(); });
  $('zoneNext').addEventListener('click', () => { zi = (zi+1)%ZONAS.length; pararAuto(); pintarZona(); });
  pintarZona();
  if(!REDUCED) autoZona = setInterval(() => { zi = (zi+1)%ZONAS.length; pintarZona(); }, 7000);
})();
function pararAuto(){ if(autoZona){ clearInterval(autoZona); autoZona = null; } }

/* ---------- cita ---------- */
(function cita(){
  $('cita').textContent = CITA.t;
  $('citaSrc').textContent = CITA.s;
})();

/* ---------- galería de jefes ---------- */
const SIGNO = `<svg class="sigil" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="3"/><polygon points="50,12 88,76 12,76" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" stroke-width="3"/></svg>`;
(function jefes(){
  const grid = $('bossGrid');
  function pintar(f){
    const lista = JEFES.filter(b => {
      if(f === 'all') return true;
      if(f === 'campana') return b.r === 0;
      if(f === 'raid') return b.k === 'raid';
      if(f === 'alto') return b.l >= 50;
    });
    grid.innerHTML = lista.map(b => `
      <article class="boss">
        <span class="lvl">nv ${b.l}</span>
        <h3>${b.n}</h3>
        <p class="kind ${b.k==='raid'?'raid':''}">${b.k==='raid' ? 'Raid · botín garantizado' : b.k==='minijefe' ? 'Mini-jefe' : 'Jefe de zona'}</p>
        <p class="desc">${b.x}</p>
        ${SIGNO}
      </article>`).join('');
  }
  $('bossFilter').addEventListener('click', e => {
    const c = e.target.closest('.chip'); if(!c) return;
    document.querySelectorAll('#bossFilter .chip').forEach(x => x.classList.toggle('on', x === c));
    pintar(c.dataset.f);
  });
  pintar('all');
})();

/* ---------- arena de combate ---------- */
(function combate(){
  /* ciclo de elementos (4 giran; luz y oscuridad se anulan, quietas) */
  const elems = ['Fuego','Aire','Tierra','Agua','Luz','Oscuridad'];
  $('elemCycle').innerHTML = elems.map((e,i) =>
    `<span class="elem${i===0?' active':''}" data-i="${i}">${e}</span>`).join('');
  let ei = 0;
  if(!REDUCED) setInterval(() => {
    ei = (ei+1) % 4;
    document.querySelectorAll('.elem').forEach((el,i) => el.classList.toggle('active', i === ei));
  }, 1500);

  /* estado del combate simulado */
  const heroe = { nombre:'Aren', hp:120, hpMax:120, mp:34, mpMax:40 };
  const jefe  = { nombre:'El Devorador', hp:420, hpMax:420, fase:1 };
  let ronda = 1, enCurso = false;

  const habilidades = [
    {n:'golpe_poderoso', e:'1d20+strength', base:14},
    {n:'runa_menor',     e:'1d20+magic',    base:11},
    {n:'sello_aurico',   e:'1d20+magic',    base:16}
  ];
  const estados = ['veneno','quemadura','fortaleza','sello'];

  function pintarBarras(golpeA){
    $('hpHero').style.width  = Math.max(0, heroe.hp/heroe.hpMax*100) + '%';
    $('hpHeroV').textContent= `${Math.max(0,heroe.hp)} / ${heroe.hpMax}`;
    $('mpHero').style.width = heroe.mp/heroe.mpMax*100 + '%';
    $('hpBoss').style.width = Math.max(0, jefe.hp/jefe.hpMax*100) + '%';
    $('hpBossV').textContent= `${Math.max(0,jefe.hp)} / ${jefe.hpMax}`;
    $('phBoss').style.width = (100 - (jefe.fase-1)*33) + '%';
    $('csRound').textContent = ronda;
    if(golpeA === 'heroe'){
      const f = $('fBoss'); f.classList.remove('hit'); void f.offsetWidth; f.classList.add('hit');
    } else if(golpeA === 'jefe'){
      const f = $('fHero'); f.classList.remove('hit'); void f.offsetWidth; f.classList.add('hit');
    }
  }
  function pintarEstado(){
    const delHeroe = heroe.hp < heroe.hpMax*0.7 ? `<span class="st quemadura">quemadura</span>` : '';
    $('stHero').innerHTML = delHeroe || '<span class="st fortaleza">sello áurico</span>';
    $('stBoss').innerHTML = jefe.fase > 1
      ? '<span class="st sello">fase ' + jefe.fase + '</span><span class="st veneno">veneno</span>'
      : '<span class="st sello">fase 1</span>';
  }
  function linea(html, cls){
    const log = $('csLog');
    const div = document.createElement('div');
    div.className = 'ln' + (cls ? ' ' + cls : '');
    div.innerHTML = html;
    log.prepend(div);
    while(log.children.length > 5) log.lastElementChild.remove();
  }

  function turnoHeroe(){
    const h = habilidades[Math.floor(Math.random()*habilidades.length)];
    const nat = 1 + Math.floor(Math.random()*20);
    const mod = 8 + Math.floor(Math.random()*6);
    const total = nat + mod;
    $('dieExpr').innerHTML = `${h.n} · <b>${h.e}</b>`;
    $('die1').textContent = nat; $('die2').textContent = '+' + mod;

    if(nat === 20){
      const dmg = Math.round(h.base * 2.1);
      jefe.hp -= dmg;
      linea(`<b>${h.n}</b> impacta — ¡crítico natural! <b>${dmg}</b> de daño al Devorador`, 'crit');
    } else if(nat === 1){
      linea(`<b>${h.n}</b> — pifia natural, el turno se pierde`, 'fumble');
    } else {
      const dmg = Math.max(1, h.base - 4 + Math.floor(Math.random()*8));
      jefe.hp -= dmg;
      const est = Math.random() < .3 ? ' · aplica veneno' : '';
      linea(`<b>${h.n}</b> ${total} vs evasión — <b>${dmg}</b> de daño${est}`, 'dmg');
    }
    heroe.mp = Math.min(heroe.mpMax, heroe.mp + 3);
    pintarBarras('heroe'); pintarEstado();
    return jefe.hp > 0;
  }
  function turnoJefe(){
    const nat = 1 + Math.floor(Math.random()*20);
    if(nat <= 2){
      linea('El Devorador falla — su golpe se pierde en la oscuridad', 'fumble');
    } else {
      const dmg = 9 + Math.floor(Math.random()*12);
      heroe.hp -= dmg;
      linea(`El Devorador golpea — <b>${dmg}</b> de daño a Aren`, 'dmg');
    }
    pintarBarras('jefe'); pintarEstado();
    return heroe.hp > 0;
  }
  function fase(){
    const tercio = jefe.hp / jefe.hpMax;
    const nueva = tercio > .66 ? 1 : tercio > .33 ? 2 : 3;
    if(nueva !== jefe.fase){
      jefe.fase = nueva;
      linea(`El Devorador cambia de forma — <b>fase ${nueva}</b>`, 'info');
      pintarBarras();
    }
  }

  function paso(){
    ronda++;
    $('csTurn').textContent = 'turno del grupo';
    if(!turnoHeroe()){ fin('victoria'); return; }
    fase();
    $('csTurn').textContent = 'turno enemigo';
    if(!turnoJefe()){ fin('derrota'); return; }
    pintarBarras(); pintarEstado();
  }
  function fin(res){
    enCurso = false;
    clearInterval(timer);
    $('csTurn').textContent = res === 'victoria' ? 'victoria' : 'derrota';
    linea(res === 'victoria'
      ? '<b>Victoria</b> — el Devorador se deshace. El registro guarda la partida.'
      : '<b>Derrota</b> — el combate se puede repetir desde el último acceso.', res === 'victoria' ? 'crit' : 'fumble');
    setTimeout(reiniciar, 6000);
  }
  let timer = null;
  function reiniciar(){
    heroe.hp = heroe.hpMax; heroe.mp = heroe.mpMax; jefe.hp = jefe.hpMax; jefe.fase = 1; ronda = 1;
    $('csLog').innerHTML = '';
    linea('Comienza el combate — Aren contra el Devorador', 'info');
    pintarBarras(); pintarEstado();
  }

  $('rollBtn').addEventListener('click', () => { if(!enCurso) paso(); });
  $('autoBtn').addEventListener('click', () => {
    if(enCurso){ clearInterval(timer); enCurso = false; $('autoBtn').textContent = 'Ver combate'; return; }
    enCurso = true; $('autoBtn').textContent = 'Detener';
    timer = setInterval(() => { if(!enCurso) return; paso(); }, 2100);
  });

  /* primera tirada al entrar en pantalla */
  pintarBarras(); pintarEstado();
  linea('Comienza el combate — Aren contra el Devorador', 'info');
  setTimeout(() => { if(!enCurso) paso(); }, REDUCED ? 0 : 2200);
})();

/* ---------- clases y razas ---------- */
(function personajes(){
  $('classGrid').innerHTML = CLASES.map(c => `
    <article class="class-card">
      <h3>${c.n}</h3>
      <p class="role">${c.r}</p>
      <p class="skills">${c.x}</p>
      <p class="pasiva"><b>Pasiva</b>${c.p}</p>
    </article>`).join('');
  $('raceStrip').innerHTML = RAZAS.map(r => `
    <div class="race"><div class="n">${r.n}</div><div class="x">${r.x}</div></div>`).join('');
})();

/* ---------- contadores animados ---------- */
(function numeros(){
  $('numGrid').innerHTML = NUMEROS.map(n => `
    <div class="num-item"><div class="big" data-to="${n.v}">0</div><div class="cap">${n.c}</div></div>`).join('');
  const io = new IntersectionObserver(es => {
    es.forEach(en => {
      if(!en.isIntersecting) return;
      const el = en.target, to = +el.dataset.to, t0 = performance.now(), dur = 1500;
      (function tick(t){
        const k = Math.min(1, (t - t0)/dur), eased = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(to * eased).toLocaleString('es-ES');
        if(k < 1) requestAnimationFrame(tick);
      })(t0);
      io.unobserve(el);
    });
  }, { threshold:.4 });
  document.querySelectorAll('.num-item .big').forEach(el => io.observe(el));
})();

/* ---------- revelado en scroll ---------- */
(function reveals(){
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold:.12, rootMargin:'0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
})();

/* ---------- parallax, halo, progreso, nav activa ---------- */
(function capas(){
  const ridges = [...document.querySelectorAll('.ridge')];
  const eclipse = $('eclipse');
  const nav = document.querySelector('nav');
  const halo = $('halo');
  const prog = $('progress');
  let ticking = false;

  function frame(){
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (h > 0 ? (y/h*100) : 0) + '%';
    if(!REDUCED){
      ridges.forEach(r => { r.style.transform = `translateY(${y * +r.dataset.parallax}px)`; });
      if(eclipse) eclipse.style.transform = `translateY(${y * 0.08}px)`;
    }
    nav.style.background = y > 40 ? 'rgba(8,11,17,.94)' : 'rgba(8,11,17,.55)';
    ticking = false;
  }
  addEventListener('scroll', () => { if(!ticking){ requestAnimationFrame(frame); ticking = true; } }, { passive:true });
  frame();

  if(matchMedia('(pointer:fine)').matches && !REDUCED){
    addEventListener('pointermove', e => {
      halo.style.setProperty('--mx', e.clientX + 'px');
      halo.style.setProperty('--my', e.clientY + 'px');
      halo.classList.add('on');
    }, { passive:true });
  }

  /* sección activa en la nav */
  const secciones = [...document.querySelectorAll('section[id]')];
  const enlaces = [...document.querySelectorAll('nav ul a[href^="#"]')];
  const spy = new IntersectionObserver(es => {
    es.forEach(e => {
      if(!e.isIntersecting) return;
      enlaces.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin:'-40% 0px -55% 0px' });
  secciones.forEach(s => spy.observe(s));
})();

/* ---------- menú móvil ---------- */
(function menu(){
  const burger = $('burger'), ul = $('menu');
  burger.addEventListener('click', () => {
    const open = ul.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  ul.addEventListener('click', e => {
    if(e.target.tagName === 'A'){ ul.classList.remove('open'); burger.setAttribute('aria-expanded','false'); }
  });
})();
