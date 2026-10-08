# Crónicas de Auria — web promocional (v2)

Página de una sola vista para promocionar el RPG de turnos **Crónicas de Auria**
(Python + Flet, Android y escritorio, sin conexión). Estática pura: sin build, sin
dependencias, sin rastreadores. Funciona abriendo `index.html` o desplegándola tal cual
en Vercel desde GitHub.

## Novedades de la v2

- **Intro con eclipse**: anillo dorado que se dibuja y da paso al hero (máx. ~2,6 s, nunca bloquea).
- **Título letra a letra en 3D** con barrido de brillo dorado periódico.
- **Cielo en canvas**: estrellas con destellos y paralaje por profundidad, brasas con brillo
  aditivo y estrellas fugaces. Se pausa fuera de pantalla y con la pestaña oculta.
- **Hero con profundidad**: montañas y eclipse siguen al ratón; el contenido se desvanece al bajar.
- **Zonas tipo cine**: transición circular según la dirección, Ken Burns, temporizador visible
  (pausa al pasar el ratón o fuera de pantalla), flechas del teclado y deslizar en móvil.
- **Cita que se ilumina palabra a palabra** con el scroll.
- **Jefes**: filtro con indicador deslizante, contador animado, salida/entrada escalonada
  y tarjetas con inclinación 3D y reflejo que sigue al cursor.
- **Combate**: dados que ruedan en 3D con números revueltos, daño flotante, barra «fantasma»
  que se vacía con retraso, destello y temblor en críticos y cambios de fase, turno resaltado
  y elementos con su propio color.
- **Clases con iconos**, razas con relleno al pasar, contadores escalonados.
- **Descarga** con borde dorado giratorio (conic-gradient + `@property`).
- Títulos que suben palabra a palabra, ornamentos que se dibujan, marquesina doble que se
  inclina con la velocidad del scroll, botones magnéticos con onda al pulsar, cursor dorado,
  nav que se oculta al bajar y reaparece al subir, botón «volver arriba» con anillo de progreso.
- `prefers-reduced-motion` sigue apagando todo el movimiento; sin JS el contenido se ve igual.

## Estructura

```
├── index.html      página completa
├── style.css       estilos y animaciones
├── data.js         contenido real del juego
├── app.js          lógica e interacciones
├── favicon.svg
├── vercel.json     cabeceras de caché y seguridad
├── .vercelignore / .gitignore
└── assets/
    ├── Cinzel.ttf                    ← copia aquí tu fuente
    └── CronicasDeAuria-1.0.5.2.apk   ← copia aquí tu APK
```

> **Importante:** antes de subir, copia en `assets/` tu `Cinzel.ttf` y el APK
> (y `tools/` si quieres conservar los raseros). Los IDs del DOM no cambiaron,
> así que `tools/verify_render.js` sigue siendo válido.

## Desplegar en Vercel desde GitHub

1. Sube esta carpeta a un repo de GitHub (el APK de 67 MB entra: el límite por archivo es 100 MB).
2. En [vercel.com](https://vercel.com): **Add New → Project → Import Git Repository**.
3. **Root Directory:** vacío si el repo es solo esta web; si está dentro de una subcarpeta, pon su nombre.
4. **Framework Preset:** `Other`. **Build Command** y **Output Directory:** vacíos.
5. **Deploy.** Cada `git push` a la rama principal vuelve a desplegar.

## Cambiar el APK

Sustituye el archivo en `assets/` y actualiza: la ruta en `vercel.json`, el enlace de
descarga de `index.html`, el rótulo del botón del hero, las menciones de versión en la
sección de descarga, y el `<title>` y la meta descripción.
