/* ============ Crónicas de Auria — landing · lógica v2 ============ */
'use strict';

const $ = (id) => document.getElementById(id);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = window.matchMedia('(pointer: fine)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- intro: loader → body.ready ---------- */
(function intro(){
  const loader = $('loader');
  const html = document.documentElement;
  html.classList.add('loading');
  const t0 = performance.now();
  let hecho = false;
  function listo(){
    if(hecho) return; hecho = true;
    const espera = REDUCED ? 0 : Math.max(0, 1250 - (performance.now() - t0));
    setTimeout(() => {
      loader && loader.classList.add('out');
      html.classList.remove('loading');
      document.body.classList.add('ready');
    }, espera);
  }
  if(document.readyState === 'complete') listo();
  else addEventListener('load', listo, { once:true });
  setTimeout(listo, 2600);           /* nunca bloquear más de ~2,6 s */
})();

/* ---------- título: letra a letra en 3D + capa de brillo ---------- */
(function titulo(){
  const front = $('titleFront'), back = $('titleBack');
  const palabras = 'Crónicas de Auria'.split(' ');
  let n = 0;
  const pintar = () => palabras.map(w =>
    `<span class="word">${[...w].map(c => `<span class="ch" style="--cd:${(0.35 + (n++)*0.045).toFixed(3)}s">${c}</span>`).join('')}</span>`
  ).join(' ');
  front.innerHTML = pintar(); n = 0;
  back.innerHTML = pintar();
  $$('.ch', front).forEach(c => c.setAttribute('aria-hidden', 'true'));
})();

/* ---------- cielo del hero en canvas: estrellas, brasas, estrellas fugaces ---------- */
(function cielo(){
  const cv = $('skyCanvas'); if(!cv || !cv.getContext) return;
  const ctx = cv.getContext('2d');
  const hero = $('hero');
  let W = 0, H = 0, DPR = 1, stars = [], embers = [], shoot = null, visible = true, mx = 0, my = 0, tmx = 0, tmy = 0;

  function size(){
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const nS = Math.round(clamp(W * H / 9000, 60, 220));
    stars = Array.from({ length:nS }, () => ({
      x: Math.random() * W, y: Math.random() * H * 0.7,
      r: Math.random() < .85 ? Math.random() * .8 + .35 : Math.random() * 1.1 + .9,
      z: Math.random() * .8 + .2, p: Math.random() * Math.PI * 2, s: .6 + Math.random() * 1.6
    }));
    const nE = Math.round(clamp(W / 40, 14, 40));
    embers = Array.from({ length:nE }, () => nuevaBrasa(true));
  }
  function nuevaBrasa(inicial){
    return { x: Math.random() * W, y: inicial ? Math.random() * H : H + 10,
      r: 1 + Math.random() * 1.8, vy: .25 + Math.random() * .6, w: Math.random() * Math.PI * 2,
      ws: .005 + Math.random() * .015, a: 0, life: 0, max: 400 + Math.random() * 500 };
  }
  function fugaz(){
    const x = Math.random() * W * .7 + W * .1, y = Math.random() * H * .3;
    shoot = { x, y, vx: 7 + Math.random() * 4, vy: 2.4 + Math.random() * 1.6, l: 0 };
  }

  function draw(t){
    ctx.clearRect(0, 0, W, H);
    mx = lerp(mx, tmx, .05); my = lerp(my, tmy, .05);
    /* estrellas con paralaje según profundidad */
    for(const s of stars){
      const tw = REDUCED ? .7 : .45 + .55 * Math.sin(t * .001 * s.s + s.p);
      const x = s.x + mx * s.z * 18, y = s.y + my * s.z * 12;
      ctx.globalAlpha = clamp(tw, .08, 1) * (.4 + s.z * .6);
      ctx.fillStyle = '#e6ecf8';
      ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.283); ctx.fill();
      if(s.r > 1.4 && tw > .85){
        ctx.globalAlpha = (tw - .85) * 2;
        ctx.fillRect(x - s.r * 3, y - .3, s.r * 6, .6);
        ctx.fillRect(x - .3, y - s.r * 3, .6, s.r * 6);
      }
    }
    /* estrella fugaz */
    if(!REDUCED){
      if(!shoot && Math.random() < .0035) fugaz();
      if(shoot){
        shoot.x += shoot.vx; shoot.y += shoot.vy; shoot.l++;
        const g = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - shoot.vx * 14, shoot.y - shoot.vy * 14);
        g.addColorStop(0, 'rgba(255,246,216,.95)'); g.addColorStop(1, 'rgba(255,246,216,0)');
        ctx.globalAlpha = Math.max(0, 1 - shoot.l / 70);
        ctx.strokeStyle = g; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(shoot.x - shoot.vx * 14, shoot.y - shoot.vy * 14); ctx.stroke();
        if(shoot.l > 70 || shoot.x > W + 50) shoot = null;
      }
      /* brasas */
      ctx.globalCompositeOperation = 'lighter';
      for(let i = 0; i < embers.length; i++){
        const e = embers[i];
        e.life++; e.y -= e.vy; e.w += e.ws; e.x += Math.sin(e.w) * .4 + mx * .15;
        const k = e.life / e.max;
        e.a = k < .1 ? k * 10 : k > .7 ? Math.max(0, (1 - k) / .3) : 1;
        const rg = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 4);
        rg.addColorStop(0, 'rgba(255,230,160,.9)'); rg.addColorStop(.35, 'rgba(243,190,90,.35)'); rg.addColorStop(1, 'rgba(243,170,60,0)');
        ctx.globalAlpha = e.a * .85;
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.arc(e.x, e.y, e.r * 4, 0, 6.283); ctx.fill();
        if(e.life > e.max || e.y < -20) embers[i] = nuevaBrasa(false);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  let raf = 0;
  function loop(t){ draw(t); raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0; }
  function arrancar(){ if(!raf && !REDUCED) raf = requestAnimationFrame(loop); }

  size();
  if(REDUCED) draw(0); else arrancar();
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { size(); if(REDUCED) draw(0); }, 150); });
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if(visible) arrancar(); }).observe(hero);
  document.addEventListener('visibilitychange', () => { if(!document.hidden && visible) arrancar(); });
  if(FINE && !REDUCED){
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      tmx = (e.clientX - r.left) / r.width - .5; tmy = (e.clientY - r.top) / r.height - .5;
      hero.style.setProperty('--hx', tmx.toFixed(3)); hero.style.setProperty('--hy', tmy.toFixed(3));
    }, { passive:true });
  }
})();

/* ---------- marquesina doble ---------- */
(function marquee(){
  const fila = (arr) => { const m = arr.map(f => `<span><i>◆</i>${f}</span>`).join(''); return m + m; };
  $('diceTrack').innerHTML = fila(FRASES);
  const nombres = ZONAS.map(z => z.n);
  $('diceTrack2').innerHTML = fila(nombres);
})();

/* ---------- escenas SVG por tipo de zona ---------- */
function escena(tipo, lvl){
  const id = 'g' + tipo + '_' + lvl;
  const cielos = {1:'#101827', 2:'#0b1220', 3:'#0d0f1c', 4:'#12131f', 5:'#160f1e'};
  const cielo = cielos[tipo] || '#0b1220';
  const lunaY = 30 + (lvl % 5) * 8;

  let capas = '';
  if(tipo === 1){                                   /* pueblo */
    capas = `
      <rect x="0" y="205" width="400" height="95" fill="#070b13"/>
      <g fill="#0e1626" class="drift"><polygon points="40,215 90,160 140,215"/><polygon points="120,215 170,150 220,215"/><polygon points="250,215 300,165 350,215"/></g>
      <g fill="#f3cf7a"><rect class="lamp" x="82" y="196" width="7" height="9"/><rect class="lamp" style="animation-delay:1.1s" x="162" y="192" width="7" height="9"/><rect class="lamp" style="animation-delay:2s" x="292" y="198" width="7" height="9"/></g>
      <rect x="0" y="238" width="400" height="4" fill="#05070c"/>
      <g fill="#0a1018"><polygon points="360,215 385,190 400,215"/></g>`;
  } else if(tipo === 2){                            /* bosque */
    let arboles = '';
    for(let i=0;i<16;i++){
      const x = (i*26 + (i%3)*8) % 400, h = 70 + ((i*41)%70), w = 15 + (i%3)*3;
      arboles += `<polygon points="${x},240 ${x+w/2},${240-h} ${x+w},240" fill="#0b1420"/>
                  <polygon points="${x+2},240 ${x+w/2},${240-h+22} ${x+w-2},240" fill="#080e18"/>`;
    }
    let luciernagas = '';
    for(let i=0;i<7;i++) luciernagas += `<circle class="tw" cx="${30 + (i*53 + lvl*7)%340}" cy="${200 + (i*17)%35}" r="1.3" fill="#f3cf7a"/>`;
    capas = `<rect x="0" y="222" width="400" height="78" fill="#070b13"/>${arboles}${luciernagas}`;
  } else if(tipo === 3){                            /* cueva / cripta */
    capas = `
      <path d="M0,300 L0,180 Q40,120 80,180 L90,300 Z" fill="#0c1420"/>
      <path d="M400,300 L400,160 Q360,110 320,165 L315,300 Z" fill="#0a1119"/>
      <path d="M110,300 L110,205 Q145,165 175,200 L180,300 Z" fill="#0b1320" opacity=".9"/>
      <path d="M220,300 L220,195 Q255,155 285,190 L290,300 Z" fill="#0a1019" opacity=".9"/>
      <rect x="0" y="268" width="400" height="32" fill="#05070c"/>
      <g fill="#f3cf7a"><ellipse class="lamp" cx="${150+lvl*3}" cy="252" rx="4" ry="2.4"/><ellipse class="lamp" style="animation-delay:1.6s" cx="${260-lvl*2}" cy="258" rx="3" ry="2"/></g>`;
  } else if(tipo === 4){                            /* ruinas / fortaleza */
    capas = `
      <rect x="0" y="262" width="400" height="38" fill="#05070c"/>
      <g fill="#0d1524"><rect x="52" y="150" width="22" height="115"/><rect x="150" y="120" width="26" height="145"/><rect x="252" y="165" width="20" height="100"/><rect x="330" y="140" width="24" height="125"/></g>
      <g fill="#0a1119"><polygon points="40,150 63,128 86,150"/><polygon points="136,120 163,96 190,120"/><polygon points="240,165 262,142 284,165"/><polygon points="318,140 342,116 366,140"/></g>
      <g fill="#f3cf7a"><rect class="lamp" x="156" y="200" width="8" height="12"/><rect class="lamp" style="animation-delay:1.3s" x="58" y="215" width="7" height="10"/></g>`;
  } else {                                          /* vacío / eclipse */
    capas = `
      <ellipse cx="200" cy="300" rx="240" ry="46" fill="#0b0e18"/>
      <g stroke="#5c6d94" stroke-width="1" opacity=".28" fill="none" class="drift">
        <path d="M40,300 q30,-60 90,-40"/><path d="M330,300 q-34,-52 -96,-34"/>
      </g>
      <g fill="#f3cf7a" class="tw"><polygon points="110,240 116,254 128,254 118,263 122,277 110,268 98,277 102,263 92,254 104,254"/></g>
      <circle cx="200" cy="262" r="14" fill="#05070c" stroke="#d4b062" stroke-opacity=".5"/>
      <g fill="#c98fdb"><rect class="tw" x="70" y="200" width="5" height="5" transform="rotate(20 72 202)"/><rect class="tw" x="300" y="215" width="4" height="4" transform="rotate(-15 302 217)"/><rect class="tw" x="250" y="180" width="3" height="3"/></g>`;
  }

  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Escena de la zona">
    <defs>
      <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${cielo}"/><stop offset="1" stop-color="#05070c"/>
      </linearGradient>
      <radialGradient id="${id}h" cx=".78" cy=".1" r=".7">
        <stop offset="0" stop-color="#f3cf7a" stop-opacity=".16"/><stop offset="1" stop-color="#f3cf7a" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="400" height="300" fill="url(#${id})"/>
    <rect width="400" height="300" fill="url(#${id}h)"/>
    <circle cx="${(72 + (lvl*7)%260)}" cy="${lunaY}" r="${lvl>60?15:11}" fill="#05070c" stroke="#d4b062" stroke-opacity=".5"/>
    <circle class="tw" cx="${(120 + (lvl*11)%250)}" cy="${lunaY-14}" r="1.2" fill="#fff"/>
    <circle class="tw" cx="${(300 - (lvl*5)%200)}" cy="${lunaY+18}" r="1" fill="#fff"/>
    <circle class="tw" cx="${(210 + (lvl*13)%160)}" cy="${lunaY-26}" r="1.5" fill="#fff"/>
    <circle class="tw" cx="60" cy="${lunaY+40}" r="1" fill="#fff"/>
    <circle class="tw" cx="${(340 - (lvl*3)%90)}" cy="${lunaY+6}" r="1.1" fill="#fff"/>
    ${capas}
  </svg>`;
}

/* ---------- carrusel de zonas: transición circular, temporizador, gestos ---------- */
(function zonas(){
  const frame = $('zoneFrame'), scenes = $('zoneScenes'), swap = $('zoneSwap'), timer = $('zoneTimer');
  const wrapZonas = frame.closest('.zones');
  let zi = 0, dir = 1, primera = true;

  function textos(z){
    $('zoneName').textContent = z.n;
    $('zoneDesc').textContent = z.x;
    $('zonePlateName').textContent = z.n;
    $('zonePlateMeta').textContent = `nivel ${z.l} · peligro ${z.d.toLowerCase()}`;
    $('zoneTags').innerHTML =
      `<span class="tag lvl">Nivel ${z.l}</span>` +
      `<span class="tag d-${z.d.toLowerCase()}">Peligro ${z.d}</span>` +
      `<span class="tag">${z.p} puntos de interés</span>`;
    $('zoneCounter').innerHTML = `<b>${String(zi+1).padStart(2,'0')}</b> / ${ZONAS.length}`;
    $$('.dot').forEach((d,i) => { d.classList.toggle('active', i === zi); d.setAttribute('aria-current', i === zi ? 'true' : 'false'); });
  }

  function pintar(){
    const z = ZONAS[zi];
    /* escena nueva entra con un círculo que se abre desde el lado de la dirección */
    const nueva = document.createElement('div');
    nueva.className = 'scene';
    nueva.style.setProperty('--cx', dir > 0 ? '85%' : '15%');
    nueva.innerHTML = escena(z.s, z.l);
    $$('.scene', scenes).forEach(v => { v.classList.add('leaving'); setTimeout(() => v.remove(), 1200); });
    scenes.appendChild(nueva);
    requestAnimationFrame(() => requestAnimationFrame(() => nueva.classList.add('on')));

    if(primera || REDUCED){ textos(z); primera = false; }
    else {
      swap.classList.add('out'); frame.classList.add('swapping');
      setTimeout(() => { textos(z); swap.classList.remove('out'); frame.classList.remove('swapping'); }, 320);
    }
    reiniciarTimer();
  }
  function ir(n, d){ dir = d || (n > zi ? 1 : -1); zi = (n + ZONAS.length) % ZONAS.length; pintar(); }

  function reiniciarTimer(){
    if(REDUCED) return;
    timer.classList.remove('run'); void timer.offsetWidth; timer.classList.add('run');
  }
  timer.addEventListener('animationend', () => ir(zi + 1, 1));

  const dots = $('zoneDots');
  dots.innerHTML = ZONAS.map((z,i) =>
    `<button class="dot" data-i="${i}" aria-label="Ir a ${z.n}"></button>`).join('');
  dots.addEventListener('click', e => { const b = e.target.closest('.dot'); if(b) ir(+b.dataset.i); });
  $('zonePrev').addEventListener('click', () => ir(zi - 1, -1));
  $('zoneNext').addEventListener('click', () => ir(zi + 1, 1));
  frame.addEventListener('keydown', e => {
    if(e.key === 'ArrowLeft'){ e.preventDefault(); ir(zi - 1, -1); }
    if(e.key === 'ArrowRight'){ e.preventDefault(); ir(zi + 1, 1); }
  });

  /* deslizar en táctil */
  let sx = null;
  frame.addEventListener('pointerdown', e => { sx = e.clientX; });
  frame.addEventListener('pointerup', e => {
    if(sx === null) return; const dx = e.clientX - sx; sx = null;
    if(Math.abs(dx) > 40) ir(zi + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });

  /* inclinación suave + paralaje de la escena con el ratón */
  if(FINE && !REDUCED){
    frame.addEventListener('pointermove', e => {
      const r = frame.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      frame.style.setProperty('--ry', (x * 6).toFixed(2) + 'deg');
      frame.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
      scenes.style.transform = `translate(${(-x * 14).toFixed(1)}px, ${(-y * 10).toFixed(1)}px)`;
    });
    frame.addEventListener('pointerleave', () => {
      frame.style.setProperty('--ry', '0deg'); frame.style.setProperty('--rx', '0deg');
      scenes.style.transform = '';
    });
  }

  /* pausar cuando no se ve */
  new IntersectionObserver(es => wrapZonas.classList.toggle('paused', !es[0].isIntersecting), { threshold:.2 }).observe(frame);
  pintar();
})();

/* ---------- cita: se ilumina palabra a palabra con el scroll ---------- */
(function cita(){
  const q = $('cita');
  const palabras = CITA.t.split(' ');
  q.innerHTML = palabras.map(w => `<span class="qw">${w}</span>`).join(' ');
  $('citaSrc').textContent = CITA.s;
  const spans = $$('.qw', q);
  const claves = ['enemigo:', 'Auria', 'nombre.'];
  spans.forEach(s => { if(claves.includes(s.textContent)) s.dataset.hot = '1'; });
  if(REDUCED){ spans.forEach(s => s.classList.add('lit')); return; }
  function upd(){
    const r = q.getBoundingClientRect();
    const k = clamp((innerHeight * .85 - r.top) / (innerHeight * .5), 0, 1);
    const n = Math.round(k * spans.length);
    spans.forEach((s,i) => { s.classList.toggle('lit', i < n); s.classList.toggle('hot', i < n && !!s.dataset.hot); });
  }
  addEventListener('scroll', () => requestAnimationFrame(upd), { passive:true });
  upd();
})();

/* ---------- inclinación 3D reutilizable ---------- */
function tilt(el, max = 7){
  if(!FINE || REDUCED || el.dataset.tilt) return;
  el.dataset.tilt = '1';
  el.classList.add('tilt');
  if(!el.querySelector('.glare')) el.insertAdjacentHTML('afterbegin', '<span class="glare" aria-hidden="true"></span>');
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', ((x - .5) * max).toFixed(2) + 'deg');
    el.style.setProperty('--rx', ((.5 - y) * max).toFixed(2) + 'deg');
    el.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
    el.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
  });
  el.addEventListener('pointerleave', () => { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); });
}

/* ---------- galería de jefes: filtro con indicador deslizante y transición ---------- */
const SIGNO = `<svg class="sigil" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="3"/><polygon points="50,12 88,76 12,76" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" stroke-width="3"/></svg>`;
(function jefes(){
  const grid = $('bossGrid'), ind = $('chipInd'), filtro = $('bossFilter'), cuenta = $('bossCount');
  let actual = 'all', bloqueo = false;

  function lista(f){
    return JEFES.filter(b => {
      if(f === 'all') return true;
      if(f === 'campana') return b.r === 0;
      if(f === 'raid') return b.k === 'raid';
      if(f === 'alto') return b.l >= 50;
    });
  }
  function contar(to){
    const el = cuenta.querySelector('b');
    const from = el ? +el.textContent : 0;
    cuenta.innerHTML = `<b>${from}</b>jefes`;
    const b = cuenta.querySelector('b'), t0 = performance.now(), dur = REDUCED ? 1 : 500;
    (function tick(t){
      const k = Math.min(1, (t - t0) / dur);
      b.textContent = Math.round(lerp(from, to, 1 - Math.pow(1 - k, 3)));
      if(k < 1) requestAnimationFrame(tick);
    })(t0);
  }
  function pintar(f){
    const l = lista(f);
    grid.innerHTML = l.map((b,i) => `
      <article class="boss${b.k==='raid'?' raid-c':''}" style="--i:${Math.min(i,14)}">
        <span class="lvl">nv ${b.l}</span>
        <h3>${b.n}</h3>
        <p class="kind ${b.k==='raid'?'raid':''}">${b.k==='raid' ? 'Raid · botín garantizado' : b.k==='minijefe' ? 'Mini-jefe' : 'Jefe de zona'}</p>
        <p class="desc">${b.x}</p>
        ${SIGNO}
      </article>`).join('');
    $$('.boss', grid).forEach(el => tilt(el, 8));
    contar(l.length);
  }
  function moverInd(){
    const on = filtro.querySelector('.chip.on'); if(!on) return;
    ind.style.width = on.offsetWidth + 'px';
    ind.style.transform = `translateX(${on.offsetLeft}px)`;
  }
  filtro.addEventListener('click', e => {
    const c = e.target.closest('.chip'); if(!c || c.dataset.f === actual || bloqueo) return;
    actual = c.dataset.f;
    $$('.chip', filtro).forEach(x => { x.classList.toggle('on', x === c); x.setAttribute('aria-pressed', x === c); });
    moverInd();
    if(REDUCED){ pintar(actual); return; }
    bloqueo = true;
    const viejos = $$('.boss', grid);
    viejos.forEach((el,i) => { el.style.setProperty('--i', Math.min(i,14)); el.classList.add('out'); });
    grid.style.minHeight = grid.offsetHeight + 'px';
    setTimeout(() => { pintar(actual); bloqueo = false; setTimeout(() => grid.style.minHeight = '', 700); }, 300);
  });
  addEventListener('resize', moverInd);
  document.fonts && document.fonts.ready.then(moverInd);
  pintar('all');
  requestAnimationFrame(moverInd);
})();

/* ---------- arena de combate ---------- */
(function combate(){
  const elems = [
    {n:'Fuego', c:'#ef7350'}, {n:'Aire', c:'#9fd6e8'}, {n:'Tierra', c:'#c9a46a'},
    {n:'Agua', c:'#4a9fe0'}, {n:'Luz', c:'#f3cf7a'}, {n:'Oscuridad', c:'#c98fdb'}
  ];
  $('elemCycle').innerHTML = elems.map((e,i) =>
    `<span class="elem${i===0?' active':''}" style="--ec:${e.c}" data-i="${i}">${e.n}</span>`).join('');
  let ei = 0;
  if(!REDUCED) setInterval(() => {
    ei = (ei+1) % 4;
    $$('.elem').forEach((el,i) => el.classList.toggle('active', i === ei));
  }, 1500);

  const heroe = { nombre:'Aren', hp:120, hpMax:120, mp:34, mpMax:40 };
  const jefe  = { nombre:'El Devorador', hp:420, hpMax:420, fase:1 };
  let ronda = 1, enCurso = false, ocupado = false, timer = null;

  const habilidades = [
    {n:'golpe_poderoso', e:'1d20+strength', base:14},
    {n:'runa_menor',     e:'1d20+magic',    base:11},
    {n:'sello_aurico',   e:'1d20+magic',    base:16}
  ];
  const stage = $('stage'), flashEl = $('stageFlash');

  function reanimar(el, cls){ el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  function flotar(fId, txt, cls){
    const cont = $(fId).querySelector('.floats');
    const s = document.createElement('span');
    s.className = 'float' + (cls ? ' ' + cls : '');
    s.textContent = txt;
    s.style.marginLeft = (Math.random() * 40 - 20).toFixed(0) + 'px';
    cont.appendChild(s);
    setTimeout(() => s.remove(), 1400);
  }
  function destello(rojo){
    flashEl.classList.toggle('red', !!rojo);
    reanimar(flashEl, 'go');
  }
  function pintarBarras(golpeA){
    const ph = Math.max(0, heroe.hp/heroe.hpMax*100), pb = Math.max(0, jefe.hp/jefe.hpMax*100);
    $('hpHero').style.width = ph + '%'; $('ghHero').style.width = ph + '%';
    $('hpHeroV').textContent = `${Math.max(0,heroe.hp)} / ${heroe.hpMax}`;
    $('mpHero').style.width = heroe.mp/heroe.mpMax*100 + '%';
    $('hpBoss').style.width = pb + '%'; $('ghBoss').style.width = pb + '%';
    $('hpBossV').textContent = `${Math.max(0,jefe.hp)} / ${jefe.hpMax}`;
    $('phBoss').style.width = (100 - (jefe.fase-1)*33) + '%';
    $('hpHero').parentElement.classList.toggle('low', ph < 30 && ph > 0);
    $('hpBoss').parentElement.classList.toggle('low', pb < 30 && pb > 0);
    $('csRound').textContent = ronda;
    if(golpeA === 'heroe') reanimar($('fBoss'), 'hit');
    else if(golpeA === 'jefe') reanimar($('fHero'), 'hit');
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
  function turnoDe(quien){
    $('fHero').classList.toggle('turn', quien === 'heroe');
    $('fBoss').classList.toggle('turn', quien === 'jefe');
    $('csTurn').textContent = quien === 'heroe' ? 'turno del grupo' : 'turno enemigo';
    $('csTurn').className = 'r';
  }

  /* los dados ruedan: números revueltos mientras giran, y aterrizan */
  function rodar(nat, mod){
    return new Promise(res => {
      const d1 = $('die1'), d2 = $('die2');
      d1.classList.remove('crit', 'fumble');
      if(REDUCED){ d1.firstElementChild.textContent = nat; d2.firstElementChild.textContent = '+' + mod; res(); return; }
      reanimar(d1, 'rolling'); setTimeout(() => reanimar(d2, 'rolling'), 80);
      const t0 = performance.now();
      (function scramble(t){
        if(t - t0 < 520){
          d1.firstElementChild.textContent = 1 + Math.floor(Math.random()*20);
          d2.firstElementChild.textContent = '+' + (8 + Math.floor(Math.random()*6));
          setTimeout(() => requestAnimationFrame(scramble), 45);
        } else {
          d1.firstElementChild.textContent = nat; d2.firstElementChild.textContent = '+' + mod;
          if(nat === 20) d1.classList.add('crit');
          if(nat === 1) d1.classList.add('fumble');
          setTimeout(res, 140);
        }
      })(t0);
    });
  }

  async function turnoHeroe(){
    turnoDe('heroe');
    const h = habilidades[Math.floor(Math.random()*habilidades.length)];
    const nat = 1 + Math.floor(Math.random()*20);
    const mod = 8 + Math.floor(Math.random()*6);
    const total = nat + mod;
    $('dieExpr').innerHTML = `${h.n} · <b>${h.e}</b>`;
    await rodar(nat, mod);

    if(nat === 20){
      const dmg = Math.round(h.base * 2.1);
      jefe.hp -= dmg;
      linea(`<b>${h.n}</b> impacta — ¡crítico natural! <b>${dmg}</b> de daño al Devorador`, 'crit');
      flotar('fBoss', '¡' + dmg + '!', 'crit'); destello(); reanimar(stage, 'shake');
    } else if(nat === 1){
      linea(`<b>${h.n}</b> — pifia natural, el turno se pierde`, 'fumble');
      flotar('fBoss', 'pifia', 'miss');
    } else {
      const dmg = Math.max(1, h.base - 4 + Math.floor(Math.random()*8));
      jefe.hp -= dmg;
      const est = Math.random() < .3 ? ' · aplica veneno' : '';
      linea(`<b>${h.n}</b> ${total} vs evasión — <b>${dmg}</b> de daño${est}`, 'dmg');
      flotar('fBoss', '-' + dmg);
    }
    heroe.mp = Math.min(heroe.mpMax, heroe.mp + 3);
    pintarBarras(nat === 1 ? null : 'heroe'); pintarEstado();
    return jefe.hp > 0;
  }
  function turnoJefe(){
    turnoDe('jefe');
    const nat = 1 + Math.floor(Math.random()*20);
    if(nat <= 2){
      linea('El Devorador falla — su golpe se pierde en la oscuridad', 'fumble');
      flotar('fHero', 'esquiva', 'miss');
      pintarBarras();
    } else {
      const dmg = 9 + Math.floor(Math.random()*12);
      heroe.hp -= dmg;
      linea(`El Devorador golpea — <b>${dmg}</b> de daño a Aren`, 'dmg');
      flotar('fHero', '-' + dmg);
      if(dmg >= 18) destello(true);
      pintarBarras('jefe');
    }
    pintarEstado();
    return heroe.hp > 0;
  }
  function fase(){
    const tercio = jefe.hp / jefe.hpMax;
    const nueva = tercio > .66 ? 1 : tercio > .33 ? 2 : 3;
    if(nueva !== jefe.fase){
      jefe.fase = nueva;
      linea(`El Devorador cambia de forma — <b>fase ${nueva}</b>`, 'info');
      destello(true); reanimar(stage, 'shake');
      pintarBarras();
    }
  }
  const esperar = (ms) => new Promise(r => setTimeout(r, REDUCED ? 0 : ms));

  async function paso(){
    if(ocupado) return; ocupado = true;
    ronda++;
    if(!(await turnoHeroe())){ fin('victoria'); ocupado = false; return; }
    fase();
    await esperar(650);
    if(!turnoJefe()){ fin('derrota'); ocupado = false; return; }
    pintarEstado();
    await esperar(300);
    turnoDe('heroe');
    ocupado = false;
  }
  function fin(res){
    enCurso = false;
    clearInterval(timer);
    $('autoBtn').firstElementChild.textContent = 'Ver combate';
    $('csTurn').textContent = res;
    $('csTurn').className = 'r ' + (res === 'victoria' ? 'win' : 'lose');
    $('fHero').classList.remove('turn'); $('fBoss').classList.remove('turn');
    linea(res === 'victoria'
      ? '<b>Victoria</b> — el Devorador se deshace. El registro guarda la partida.'
      : '<b>Derrota</b> — el combate se puede repetir desde el último acceso.', res === 'victoria' ? 'crit' : 'fumble');
    if(res === 'victoria') destello();
    setTimeout(reiniciar, 6000);
  }
  function reiniciar(){
    heroe.hp = heroe.hpMax; heroe.mp = heroe.mpMax; jefe.hp = jefe.hpMax; jefe.fase = 1; ronda = 1;
    $('csLog').innerHTML = '';
    linea('Comienza el combate — Aren contra el Devorador', 'info');
    turnoDe('heroe');
    pintarBarras(); pintarEstado();
  }

  $('rollBtn').addEventListener('click', () => { if(!enCurso) paso(); });
  $('autoBtn').addEventListener('click', () => {
    const lbl = $('autoBtn').firstElementChild;
    if(enCurso){ clearInterval(timer); enCurso = false; lbl.textContent = 'Ver combate'; return; }
    enCurso = true; lbl.textContent = 'Detener';
    paso();
    timer = setInterval(() => { if(enCurso) paso(); }, 2300);
  });

  pintarBarras(); pintarEstado(); turnoDe('heroe');
  linea('Comienza el combate — Aren contra el Devorador', 'info');
  /* primera tirada cuando la arena entra en pantalla */
  const io = new IntersectionObserver(es => {
    if(es[0].isIntersecting){ io.disconnect(); setTimeout(() => { if(!enCurso) paso(); }, REDUCED ? 0 : 700); }
  }, { threshold:.45 });
  io.observe(stage);
})();

/* ---------- clases y razas ---------- */
const ICONOS = {
  'Guerrero':'<path d="M14.5 3.5l6 6-9.5 9.5-3-3zM8 16l-4.5 4.5M5 13l6 6"/>',
  'Maga':'<path d="M12 2l2.2 6.6L21 9l-5.4 4.1L17.6 20 12 16l-5.6 4 2-6.9L3 9l6.8-.4z"/>',
  'Arquera':'<path d="M4 20L20 4M20 4h-6M20 4v6M7 3c6 3 11 8 14 14"/>',
  'Clérigo':'<path d="M12 3v18M6 9h12"/><circle cx="12" cy="9" r="7"/>',
  'Ladrón':'<path d="M4 12c3-5 13-5 16 0-3 5-13 5-16 0z"/><circle cx="12" cy="12" r="2.5"/>',
  'Caballero':'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  'Portador Rúnico':'<circle cx="12" cy="12" r="9"/><path d="M12 5v14M7 9l5 3 5-3"/>'
};
(function personajes(){
  $('classGrid').innerHTML = CLASES.map((c,i) => `
    <article class="class-card" style="--i:${i}">
      <div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[c.n] || '<circle cx="12" cy="12" r="8"/>'}</svg></div>
      <h3>${c.n}</h3>
      <p class="role">${c.r}</p>
      <p class="skills">${c.x}</p>
      <p class="pasiva"><b>Pasiva</b>${c.p}</p>
    </article>`).join('');
  $('raceStrip').innerHTML = RAZAS.map((r,i) => `
    <div class="race" style="--i:${i}"><div class="n">${r.n}</div><div class="x">${r.x}</div></div>`).join('');
  $$('.class-card').forEach(el => tilt(el, 8));
  $$('.race').forEach(el => tilt(el, 10));
})();

/* ---------- contadores animados ---------- */
(function numeros(){
  $('numGrid').innerHTML = NUMEROS.map((n,i) => `
    <div class="num-item" style="--i:${i}"><div class="big" data-to="${n.v}">0</div><div class="cap">${n.c}</div></div>`).join('');
  const io = new IntersectionObserver(es => {
    es.forEach(en => {
      if(!en.isIntersecting) return;
      const el = en.target, to = +el.dataset.to, dur = REDUCED ? 1 : 1700 + Math.min(900, to / 3);
      io.unobserve(el);
      const delay = REDUCED ? 0 : (+el.parentElement.style.getPropertyValue('--i') || 0) * 90;
      setTimeout(() => {
        const t0 = performance.now();
        (function tick(t){
          const k = Math.min(1, (t - t0)/dur), eased = 1 - Math.pow(1 - k, 4);
          el.textContent = Math.round(to * eased).toLocaleString('es-ES');
          if(k < 1) requestAnimationFrame(tick); else el.parentElement.classList.add('done');
        })(t0);
      }, delay);
    });
  }, { threshold:.4 });
  $$('.num-item .big').forEach(el => io.observe(el));
})();

/* ---------- títulos partidos en palabras ---------- */
(function split(){
  $$('[data-reveal="split"]').forEach(h => {
    const txt = h.textContent.trim();
    h.setAttribute('aria-label', txt);
    h.innerHTML = txt.split(' ').map((w,i) => `<span class="w" aria-hidden="true"><span style="--wi:${i}">${w}</span></span>`).join(' ');
    h.classList.add('is-split');
  });
})();

/* ---------- revelado en scroll ---------- */
(function reveals(){
  const els = $$('[data-reveal], [data-stagger]');
  if(REDUCED || !('IntersectionObserver' in window)){ els.forEach(e => e.classList.add('in')); return; }
  $$('[data-stagger]').forEach(g => [...g.children].forEach((c,i) => { if(!c.style.getPropertyValue('--i')) c.style.setProperty('--i', i); }));
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold:.12, rootMargin:'0px 0px -8% 0px' });
  els.forEach(el => io.observe(el));
})();

/* ---------- botones: magnetismo, brillo y onda al pulsar ---------- */
(function botones(){
  if(!REDUCED){
    document.addEventListener('pointerdown', e => {
      const b = e.target.closest('.btn'); if(!b) return;
      const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
      const o = document.createElement('span');
      o.className = 'rip';
      o.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s/2}px;top:${e.clientY - r.top - s/2}px`;
      b.appendChild(o); setTimeout(() => o.remove(), 700);
    });
  }
  if(!FINE || REDUCED) return;
  $$('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2, y = e.clientY - r.top - r.height/2;
      el.style.transform = `translate(${x * .22}px, ${y * .3}px)`;
      el.style.setProperty('--bx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--by', (e.clientY - r.top) + 'px');
    });
    el.addEventListener('pointerleave', () => {
      el.style.transition = 'transform .6s cubic-bezier(.34,1.56,.64,1), filter .22s, background .3s, box-shadow .3s';
      el.style.transform = '';
      setTimeout(() => el.style.transition = '', 600);
    });
  });
})();

/* ---------- cursor dorado ---------- */
(function cursor(){
  const c = $('cursor');
  if(!FINE || REDUCED || !c) return;
  let x = -100, y = -100, rx = -100, ry = -100, on = false;
  addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY;
    if(!on){ on = true; c.classList.add('on'); rx = x; ry = y; }
    c.classList.toggle('hover', !!e.target.closest('a, button, .zone-frame, [tabindex]'));
  }, { passive:true });
  addEventListener('pointerdown', () => c.classList.add('down'));
  addEventListener('pointerup', () => c.classList.remove('down'));
  document.addEventListener('pointerleave', () => { c.classList.remove('on'); on = false; });
  (function loop(){
    rx = lerp(rx, x, .18); ry = lerp(ry, y, .18);
    c.style.setProperty('--x', x + 'px'); c.style.setProperty('--y', y + 'px');
    c.style.setProperty('--rx', rx.toFixed(1) + 'px'); c.style.setProperty('--ry', ry.toFixed(1) + 'px');
    requestAnimationFrame(loop);
  })();
})();

/* ---------- parallax, halo, progreso, nav, volver arriba ---------- */
(function capas(){
  const ridges = $$('.ridge');
  const eclipse = $('eclipse'), hero = $('hero'), heroGrid = $('heroGrid');
  const nav = $('nav'), halo = $('halo'), prog = $('progress');
  const toTop = $('toTop'), ring = $('toTopRing');
  const tracks = $$('.dice-track');
  let ticking = false, lastY = scrollY, vel = 0, skew = 0;

  function frame(){
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - innerHeight;
    const p = h > 0 ? y / h : 0;
    prog.style.setProperty('--p', p.toFixed(4));
    ring.style.strokeDashoffset = (132 * (1 - p)).toFixed(1);
    toTop.classList.toggle('on', y > innerHeight * .8);

    if(!REDUCED){
      const hx = parseFloat(hero.style.getPropertyValue('--hx')) || 0;
      const hy = parseFloat(hero.style.getPropertyValue('--hy')) || 0;
      if(y < innerHeight * 1.2){
        ridges.forEach(r => { r.style.transform = `translate(${-hx * (+r.dataset.mx || 0)}px, ${y * +r.dataset.parallax}px)`; });
        if(eclipse) eclipse.style.transform = `translate(${hx * 26}px, ${y * 0.12 + hy * 18}px) scale(${1 + y / 4000})`;
        const k = clamp(y / (innerHeight * .75), 0, 1);
        heroGrid.style.transform = `translateY(${y * .22}px)`;
        heroGrid.style.opacity = (1 - k * 1.1).toFixed(3);
      }
    }
    nav.classList.toggle('scrolled', y > 40);
    if(y > 420 && y > lastY + 4 && !$('menu').classList.contains('open')) nav.classList.add('hide');
    else if(y < lastY - 4 || y < 420) nav.classList.remove('hide');
    vel = y - lastY; lastY = y;
    ticking = false;
  }
  const pedir = () => { if(!ticking){ requestAnimationFrame(frame); ticking = true; } };
  addEventListener('scroll', pedir, { passive:true });
  hero.addEventListener('pointermove', pedir, { passive:true });
  frame();

  /* la marquesina se inclina con la velocidad del scroll */
  if(!REDUCED) (function skewLoop(){
    skew = lerp(skew, clamp(vel * -.25, -8, 8), .1);
    vel *= .9;
    tracks.forEach(t => t.style.setProperty('--skew', skew.toFixed(2) + 'deg'));
    requestAnimationFrame(skewLoop);
  })();

  if(FINE && !REDUCED){
    addEventListener('pointermove', e => {
      halo.style.setProperty('--mx', e.clientX + 'px');
      halo.style.setProperty('--my', e.clientY + 'px');
      halo.classList.add('on');
    }, { passive:true });
  }

  /* sección activa en la nav con indicador deslizante */
  const secciones = $$('section[id]');
  const enlaces = $$('nav ul a[href^="#"]:not(.nav-cta)');
  const ind = $('navInd');
  function moverInd(a){
    if(!a){ ind.classList.remove('on'); return; }
    ind.style.width = a.offsetWidth + 'px';
    ind.style.transform = `translateX(${a.offsetLeft}px)`;
    ind.classList.add('on');
  }
  const spy = new IntersectionObserver(es => {
    es.forEach(e => {
      if(!e.isIntersecting) return;
      let act = null;
      enlaces.forEach(a => { const on = a.getAttribute('href') === '#' + e.target.id; a.classList.toggle('active', on); if(on) act = a; });
      moverInd(act);
    });
  }, { rootMargin:'-40% 0px -55% 0px' });
  secciones.forEach(s => spy.observe(s));
  new IntersectionObserver(es => { if(es[0].isIntersecting){ enlaces.forEach(a => a.classList.remove('active')); moverInd(null); } }, { threshold:.5 }).observe(hero);
  addEventListener('resize', () => moverInd(enlaces.find(a => a.classList.contains('active'))));
})();

/* ---------- menú móvil ---------- */
(function menu(){
  const burger = $('burger'), ul = $('menu');
  function cerrar(){ ul.classList.remove('open'); burger.setAttribute('aria-expanded','false'); burger.setAttribute('aria-label','Abrir menú'); }
  burger.addEventListener('click', () => {
    const open = ul.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  ul.addEventListener('click', e => { if(e.target.tagName === 'A') cerrar(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') cerrar(); });
})();
