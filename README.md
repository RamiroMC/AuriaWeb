# Crónicas de Auria — web promocional

Página de una sola vista para promocionar el RPG de turnos **Crónicas de Auria**
(Python + Flet, Android y escritorio, sin conexión). Estática pura: sin build, sin
dependencias, sin rastreadores. Funciona abriendo `index.html` o desplegándola tal cual
en Vercel desde GitHub.

## Estructura

```
web/
├── index.html          página completa (hero, mundo, jefes, combate, descarga)
├── style.css           estilos y animaciones (tokens del tema del juego)
├── data.js             contenido real del juego, extraído del código
├── app.js              lógica: hero, carrusel, combate, parallax, reveals
├── vercel.json         cabeceras de caché y seguridad para el despliegue
├── .vercelignore       lo que no se sube (node_modules, .vercel)
├── assets/
│   ├── Cinzel.ttf                  tipografía de títulos, empaquetada
│   └── CronicasDeAuria-1.0.5.2.apk descarga ofrecida en la página (65 MB)
├── tools/                          raseros de verificación (no se usan en producción)
│   ├── verify_datos.js    compara los datos de data.js con el snapshot del juego
│   └── verify_render.js   renderiza el DOM con jsdom y exige 0 errores
└── README.md
```

## Desplegar en Vercel desde GitHub

1. Sube esta carpeta a un repo de GitHub.
2. En [vercel.com](https://vercel.com): **Add New → Project → Import Git Repository**
   y autoriza el acceso al repo.
3. **Root Directory:** si el repo contiene más cosas además de `web/`, pon `web`.
   Si el repo es solo esta web, déjalo vacío.
4. **Framework Preset:** `Other`. **Build Command:** vacío. **Output Directory:** vacío.
   No hay nada que compilar: Vercel sirve los archivos tal cual.
5. **Deploy.** Cada `git push` a la rama principal vuelve a desplegar solo.

Rasero mínimo tras el primer despliegue: abre la URL y comprueba que carga el APK
desde `/assets/CronicasDeAuria-1.0.5.2.apk` y que la tipografía Cinzel pinta los títulos.

`vercel.json` ya fija, sin tocar nada más:

- caché larga e inmutable (`max-age=31536000, immutable`) para el APK y las fuentes;
- `Content-Type: application/vnd.android.package-archive` para que el APK se descargue
  en Android en vez de intentar abrirse como texto;
- caché corta con revalidación para `style.css`, `app.js` y `data.js`;
- `X-Content-Type-Options`, `X-Frame-Options` y `Referrer-Policy` en toda la web;
- URLs limpias (sin `.html`).

## Comprobar en local

```bash
node tools/verify_datos.js     # los números coinciden con el código del juego
npm install jsdom              # solo para el segundo rasero
node tools/verify_render.js    # render real con jsdom, sin errores
```

Si no quieres subir los raseros, borra `tools/` antes de publicar.

## Notas

- **Sin conexión y sin rastreadores:** cero peticiones a terceros, cero analítica.
- **Accesible:** contraste WCAG AA medido (18/18 pares), foco visible,
  `prefers-reduced-motion` apaga grano, parallax, marquesina y revelados.
- **Móvil:** una columna por debajo de 760 px, menú desplegable, objetivos táctiles de 44 px.
- **Dirección visual** («Arcane premium») y tokens de color salen de `game/ui/theme.py`
  del juego: la web y la app cuentan la misma historia.
- **Datos** (22 zonas, 32 jefes, 139 habilidades, 350 objetos…) verificados contra
  `docs/lore/SNAPSHOT_ESTRUCTURAL.json` del repo del juego.
- **Cinzel** solo en títulos; el cuerpo usa la pila del sistema (`Segoe UI`), sin descarga.

## Cambiar el APK

Sustituye el archivo en `assets/` y actualiza, en este orden:

1. la ruta de la cabecera de caché inmutable en `vercel.json`;
2. el nombre del archivo en el enlace de descarga de `index.html`;
3. el rótulo del botón del hero y las dos menciones de la versión en la sección de descarga;
4. el `<title>` y la meta descripción de `index.html`.

Si cambias el nombre del APK, la cabecera de `vercel.json` que apunta al nombre antiguo
deja de aplicarse y Vercel serviría el archivo con un `Content-Type` genérico.
