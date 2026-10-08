/* Datos reales extraídos del código de Crónicas de Auria (1.0.5.2) — verificado contra docs/lore/SNAPSHOT_ESTRUCTURAL.json */
const ZONAS = [
 {n:"Piedrahonda",l:1,p:11,d:"Ninguno",s:1,x:"Pueblo minero en el borde de la Umbria. Huele a pan, a hierro y a miedo mal disimulado."},
 {n:"Calzada del Velo",l:3,p:11,d:"Medio",s:2,x:"Sendero de carros lleno de huellas recientes... y de emboscadas más recientes aún."},
 {n:"Bosque de las Campanas Hundidas",l:4,p:11,d:"Alto",s:2,x:"Los árboles crecen torcidos hacia dentro. La luz llega tarde y se va antes."},
 {n:"Cavernas de Namar",l:6,p:9,d:"Alto",s:3,x:"Las paredes húmedas murmuran si te quedas quieto demasiado tiempo."},
 {n:"Ruinas de Kharn",l:9,p:10,d:"Extremo",s:4,x:"Una fortaleza hundida. Las columnas aún sostienen algo que no deberían."},
 {n:"Ciudadela de Auria",l:10,p:13,d:"Medio",s:1,x:"La última ciudad de pie. Sus muros son altos y sus ojos, bajos."},
 {n:"Santuario del Eclipse",l:14,p:6,d:"Extremo",s:5,x:"No hay suelo, hay una idea de suelo. Arriba, un sol negro y mudo."},
 {n:"Catacumbas de la Piedra Ciega",l:5,p:13,d:"Medio",s:3,x:"Bajo el pueblo, cuatrocientos años de muertos ordenados por familias. El sepulturero ya no distingue a los suyos de los vivos."},
 {n:"Campamento del Peaje",l:7,p:14,d:"Alto",s:2,x:"Carros volcados y empalizadas: los peajeros de Sarnak cobran a todo el que pasa y a todo el que no pasa también."},
 {n:"Mina Vhal-Kharn",l:9,p:12,d:"Alto",s:3,x:"Galerías que Piedrahonda abandonó tras el derrumbe. El gas y los muertos siguen cubriendo el mismo turno."},
 {n:"Santuario de Tharanea",l:11,p:10,d:"Extremo",s:2,x:"Un claro que no está en ningún mapa, sostenido por un árbol que respira. Aquí el bosque no pide permiso."},
 {n:"Torre de Namaris",l:13,p:12,d:"Extremo",s:4,x:"El faro viejo que la marea tapó hace un siglo. Con el sello roto, la escalera vuelve a estar al aire... y algo la sube contigo."},
 {n:"Bosque Plateado de Sylvaris",l:16,p:15,d:"Alto",s:2,x:"El bosque donde los elfos dejaron de esconderse: troncos de plata, un claro que suena a campanas pequeñas y una centinela que no sonríe."},
 {n:"Ciudad de Sylvaris",l:20,p:19,d:"Medio",s:1,x:"Una ciudad tallada en un árbol de plata: escaleras de corteza, faroles de savia y elfos que te miran como se mira a un cuchillo."},
 {n:"Enramada Prohibida",l:30,p:15,d:"Extremo",s:2,x:"La parte del bosque que los elfos no nombran: raíces que sangran savia negra y algo con voz de mujer que canta desde el fondo."},
 {n:"Cripta de los Siete Reyes Caídos",l:40,p:16,d:"Extremo",s:3,x:"Bajo la enramada podrida hay escaleras de reyes: cuarenta sepulcros abiertos, una guardia que sigue de servicio y un trono al que le falta la corona."},
 {n:"Trono del Ocaso",l:50,p:17,d:"Extremo",s:5,x:"El último escalón del mundo: un trono vacío bajo un sol puesto y una sombra que lleva esperando desde la noche del Eclipse."},
 {n:"Yermo Ceniciento",l:60,p:14,d:"Extremo",s:5,x:"Lo que hay por encima del Trono: un mundo que se quemó antes que Auria y que sigue echando humo. La ceniza tapa el suelo y todo lo que había debajo de él."},
 {n:"Bastión de las Mil Tormentas",l:70,p:15,d:"Extremo",s:4,x:"Una fortaleza que no está apoyada en nada: la sujeta la tormenta que lleva cuarenta años sin caer. Sus pasillos son de metal y el aire muerde."},
 {n:"Abismo de Nyxara",l:80,p:14,d:"Extremo",s:5,x:"Una grieta que baja más de lo que la piedra permite. Abajo no hay fondo: hay una voz que lleva mil años hablando sola y que se alegra de tener público."},
 {n:"Ciudadela Estelar",l:90,p:16,d:"Extremo",s:4,x:"Una ciudad de metal que cayó entera desde el cielo apagado y quedó clavada en el suelo de lado. Dentro sigue de servicio todo lo que puede seguir de servicio."},
 {n:"Vacío de Auria",l:100,p:12,d:"Extremo",s:5,x:"El final de todo lo recorrido: un sitio sin suelo donde el mundo se está borrando desde dentro, con las cosas de Auria flotando ya a medias."}
];

const JEFES = [
 {n:"Gormak el Desollador",l:6,k:"minijefe",r:0,x:"Cabecilla de los saqueadores del camino. Nadie le discute dos veces."},
 {n:"El Sepulturero Ciego",l:6,k:"raid",r:0,x:"Enterró a los muertos de Piedrahonda durante cuarenta años; luego empezó a enterrar a los vivos. La llave del peaje cuelga de su cinturón."},
 {n:"Sarnak, la Recaudadora",l:8,k:"raid",r:0,x:"Cobra el peaje desde hace veinte años y ha enterrado a todos los que se negaron a pagar. Lleva el plano de la mina como si fuera un trofeo."},
 {n:"Reina Aracna",l:9,k:"minijefe",r:0,x:"La madre de todas las arañas del bosque. Su tela es un mapa de huesos."},
 {n:"Bram, el Capataz del Último Pozo",l:10,k:"raid",r:0,x:"Murió en el derrumbe con el pico en la mano y siguió dando órdenes. Guarda en el puño la semilla que encontraron en la veta imposible."},
 {n:"Vexar, Heraldo de Cristal",l:12,k:"jefe",r:0,x:"Portador del sello negro. Dice haber visto el final del mundo y estar ayudándolo a llegar."},
 {n:"La Madre Raíz",l:12,k:"raid",r:0,x:"El árbol que sostiene el santuario del bosque. Nunca habló hasta que los cultistas quemaron sus ramas jóvenes. Ahora habla, y duele."},
 {n:"Nerissa, Dama de la Marea Negra",l:14,k:"raid",r:0,x:"Dueña de la torre cuando era faro y no tumba. Ahogó a su tripulación para que nadie se llevara el sello; sigue esperando visita."},
 {n:"El Devorador",l:15,k:"jefe",r:0,x:"Lo que había detrás del sello. No tiene forma fija ni nombre pronunciable."},
 {n:"El Guardián de Hojas",l:17,k:"minijefe",r:0,x:"El bosque le dio un cuerpo de ramas y una sola orden: que el sendero siga cerrado. Abre la puerta de Sylvaris a quien lo venza."},
 {n:"Custodio de Raíces",l:20,k:"jefe",r:0,x:"Bajo la Ciudad de Sylvaris, las raíces se enredaron con los cimientos y con lo que allí dormía. El Custodio lleva desde entonces de guardia, enterrado hasta medio pecho."},
 {n:"Sirenna del Ocaso",l:30,k:"raid",r:1,x:"Guardiana de la Enramada antes de que se pudriera. Ahora canta para que nadie llegue al corazón del bosque: dice que allí ya no queda nada que salvar."},
 {n:"La Matriarca Espina Negra",l:30,k:"jefe",r:1,x:"La sima que las zarzas cubren a propósito, y el motivo de que las cubran: la Matriarca teje con espina negra y con lo que encuentra dentro."},
 {n:"Rey Osirion, el Coronado Hueco",l:40,k:"raid",r:1,x:"Se coronó a sí mismo cuando el cielo empezó a apagarse y ordenó a su corte que le esperara despierta. Lleva mil años esperando la coronación."},
 {n:"El Chambelán de Osirion",l:40,k:"jefe",r:1,x:"Sirvió a un trono que ya no existe con una puntualidad ejemplar. Sigue anunciando visitas a un rey hueco y cerrando puertas que nadie usa."},
 {n:"La Sombra del Trono",l:50,k:"raid",r:1,x:"Lo que queda sentado cuando el rey se levanta. No es un enemigo: es el final del corredor, el que apaga la última luz y el que ha decidido que os quedéis."},
 {n:"El Guardián de las Grietas",l:50,k:"jefe",r:1,x:"Cuando el trono se rompió, alguien quedó a cargo de las grietas. Cobra peaje a quien se asoma: a veces en oro y a veces en años."},
 {n:"La Ceniza Viviente",l:60,k:"jefe",r:1,x:"Todo lo que ardió en el Yermo, andando junto y con una sola voluntad. No tiene cara: tiene un hueco donde debería estar y por ahí respira."},
 {n:"El Forjador de Cenizas",l:60,k:"raid",r:1,x:"Donde el Yermo arde sin llama, un forjador sigue batiendo metal con la ceniza de los que ya cayeron. No ha parado porque nadie le ha dicho que ya no hace falta."},
 {n:"El Último Fundidor",l:62,k:"minijefe",r:1,x:"Siguió batiendo hierro después de que se quemara el mundo. Dice que el metal todavía está caliente y no piensa dejar el turno."},
 {n:"El Heraldo del Trueno",l:70,k:"jefe",r:1,x:"Habla con la voz de la tormenta y la tormenta le obedece. Bajar del Bastión, para él, es apagar el último sitio donde el mundo sigue haciendo ruido."},
 {n:"El Centinela del Trueno",l:70,k:"raid",r:1,x:"Bajo el Bastión la tormenta no se apaga: se encierra. El Centinela la guarda como si aún sirviera a alguien, y la suelta por partes cada vez que alguien baja."},
 {n:"El Celador del Bastión",l:72,k:"minijefe",r:1,x:"Único habitante que no se ha ido a la torre: dice que dejar el puesto sería peor que morir. No recuerda a quién se lo juró."},
 {n:"Velisra, Devoradora de Nyxara",l:80,k:"raid",r:1,x:"Lo que hay al fondo mirando hacia arriba. Devoró la luz de tres ciudades y todavía dice, con mucha educación, que tiene hambre."},
 {n:"La Voz del Abismo",l:80,k:"jefe",r:1,x:"El Abismo tiene voz y la usa para llamar por tu nombre. La Voz es solo la boca: el cuerpo se llama Nyxara y no cabe en ninguna sala."},
 {n:"El Celador de Nyxara",l:82,k:"minijefe",r:1,x:"Puso la primera piedra de la grieta para cerrarla. La grieta le contestó y sigue ahí, contestando por él."},
 {n:"El Guardián del Núcleo",l:90,k:"jefe",r:1,x:"No cayó con la Ciudadela: la sujetó. Lleva seis años sosteniendo el núcleo con los brazos y no piensa soltarlo para atender visitas."},
 {n:"Seraphel, Arquitecto Estelar",l:90,k:"raid",r:1,x:"La Ciudadela cayó del cielo con su arquitecto dentro, y él sigue construyendo con lo que encuentra: escombros, luz vieja y visitas."},
 {n:"El Cenital de la Ciudadela",l:92,k:"minijefe",r:1,x:"El último oficial de la guardia estelar. Da órdenes a escombros que se levantan obedeciendo, lo cual es peor que si no obedecieran."},
 {n:"El Custodio del Último Sello",l:100,k:"minijefe",r:1,x:"Lo soldó él por dentro para que no se abriera desde el otro lado. Lleva mil años oyendo lo que hay al otro lado y ya no distingue su voz de la de dentro."},
 {n:"El Eco de Auria",l:100,k:"raid",r:1,x:"La Ciudadela, la Torre, el Santuario y el Trono, todo a la vez y todo al revés. No es un enemigo: es lo que queda de Auria cuando se le quita el nombre."},
 {n:"El Devorador de Ecos",l:100,k:"jefe",r:1,x:"Lo que hay dentro del Corazón del Vacío lleva desde el principio devorando lo que los demás dejan atrás: nombres, finales y ecos. Ahora le toca el vuestro."}
];

const CLASES = [
 {n:"Guerrero",r:"Daño físico",x:"Golpe poderoso, grito de guerra, tajo giratorio, embestida feroz",p:"Recibe un 10 % menos de daño físico."},
 {n:"Maga",r:"Daño mágico",x:"Bola de fuego, ventisca, drenaje arcano, meteoro arcano",p:"Sus hechizos cuestan un 15 % menos de maná."},
 {n:"Arquera",r:"Precisión",x:"Disparo preciso, lluvia de flechas, marca de cazador, flecha umbría",p:"Golpe crítico un 15 % más probable."},
 {n:"Clérigo",r:"Apoyo",x:"Luz sanadora, bendición, castigo radiante, luz restauradora",p:"Sus curaciones son un 20 % más potentes."},
 {n:"Ladrón",r:"Evasión",x:"Punalada trapera, nube de humo, robar, danza de sombras",p:"Huir de un combate le resulta más fácil."},
 {n:"Caballero",r:"Tanque",x:"Escudo de fe, embate sagrado, juramento, represalia",p:"Los aliados por debajo del 30 % de vida reciben un 15 % menos de daño."},
 {n:"Portador Rúnico",r:"Híbrido",x:"Runa menor, eco eclipse, segundo aliento, sello áurico",p:"Inflige un 10 % más de daño cuando está por debajo de la mitad de su vida."}
];

const RAZAS = [
 {n:"Humano",x:"Ambición y adaptación. Crece en todo."},
 {n:"Elfo",x:"Vista alba, complexión frágil. Resiste la oscuridad."},
 {n:"Enano",x:"Piel de granito y terquedad. Resiste la tierra."},
 {n:"Orco",x:"Furia sangrienta y piel curtida. Resiste lo físico."},
 {n:"Mediano",x:"Pies ligeros y buena estrella. Nunca donde lo buscan."},
 {n:"Marcado",x:"Marca viva y eco eclipse. Resiste luz y oscuridad."}
];

const NUMEROS = [
 {v:22,c:"zonas explorables"},{v:32,c:"jefes y mini-jefes"},{v:90,c:"enemigos con IA"},
 {v:139,c:"habilidades"},{v:350,c:"objetos"},{v:124,c:"recetas de crafteo"},
 {v:30,c:"misiones encadenadas"},{v:9,c:"mazmorras"},{v:2521,c:"pruebas automáticas"}
];

const FRASES = [
 "1d20+strength","2d12+magic","1d20+accuracy vs evasion","daño × 100 / (100 + def × 6)",
 "20 natural = crítico asegurado","ciclo: fuego, aire, tierra, agua","6 % de vida por turno de sangrado",
 "1 natural = pifia","suerte por encima de 100","mazmorras con tres dificultades"
];

const CITA = {
 t:"No es un enemigo: es lo que queda de Auria cuando se le quita el nombre.",
 s:"El Eco de Auria · Vacío de Auria · nivel 100"
};

const COMBATE = [
 {k:"Crítico",x:"20 natural asegurado; multiplicador hasta ×3 según la Suerte"},
 {k:"Mitigación",x:"daño × 100 / (100 + defensa × 6), mínimo 1"},
 {k:"Elementos",x:"×1,5 a la debilidad, ×0,5 al resistir, ×0 al inmune"},
 {k:"Estados",x:"veneno, quemadura, sangrado, congelación, parálisis, silencio, sueño"},
 {k:"Fases",x:"los jefes cambian de estadísticas y estrategia a mitad del combate"}
];
