/* ================================================================
   JAVASCRIPT INTERACTIVO MEJORADO - script.js
   Aqui controlas toda la interactividad de la web

   COMO MODIFICAR:
   - Busca los comentarios que dicen "MODIFICAR AQUI"
   - La fecha del contador esta al inicio de este archivo
   ================================================================ */

// ================================================================
// CONFIGURACION INICIAL
// ================================================================

// MODIFICAR AQUI: Fecha cuando se conocieron o empezaron a salir
// Formato: new Date(ano, mes-1, dia, hora, minuto)
// Los meses empiezan en 0: enero=0, febrero=1, marzo=2, etc.
const FECHA_INICIO = new Date(2026, 3, 20, 12, 12); // Ejemplo: 15 de enero de 2024

// MODIFICAR AQUI: Velocidad de escritura de la carta (en milisegundos)
// Menor numero = mas rapido | Mayor numero = mas lento
const VELOCIDAD_ESCRITURA = 45;

// Variable global para la musica
let musicaActiva = false;
let cancionActual = null;
let nombreCancionActual = '';
let menuMusicaVisible = false;
let loopActivado = false;
let listaCanciones = [];
let indiceCancion = -1;

// ================================================================
// ESPERAR A QUE LA PAGINA CARGUE COMPLETAMENTE
// ================================================================
document.addEventListener('DOMContentLoaded', function() {

    // Inicializar todas las funciones
    inicializarBienvenida();
    inicializarCorazonesFlotantes();
    inicializarLluviaCorazones();
    inicializarMusica();
    inicializarNavegacion();
    inicializarContador();
    inicializarCarta();
    inicializarAnimacionesScroll();
    inicializarPregunta();
    inicializarBotonNo();
    inicializarEfectoMouse();
});

// ================================================================
// FUNCION 1: PANTALLA DE BIENVENIDA
// ================================================================
function inicializarBienvenida() {
    const btnComenzar = document.getElementById('btn-comenzar');
    const pantallaBienvenida = document.getElementById('bienvenida');

    btnComenzar.addEventListener('click', function() {
        // Oculta la pantalla de bienvenida con animacion
        pantallaBienvenida.classList.add('oculta');

        // Inicia la musica si se selecciono una
        if (cancionActual && cancionActual !== 'noplay') {
            reproducirMusica(cancionActual);
        }

        // Pequena pausa antes de iniciar la carta
        setTimeout(() => {
            // No iniciamos la carta automaticamente, esperamos que el usuario haga clic en "Comenzar a Leer"
        }, 1500);
    });
}

// ================================================================
// FUNCION 2: CORAZONES FLOTANTES (EFECTO VISUAL)
// ================================================================
function inicializarCorazonesFlotantes() {
    const container = document.getElementById('corazones-container');
    const corazones = ['❤', '💖', '💕', '💗', '💝', '💝', '💘', '🤎', '💞', '💘'];

    // Crea 20 corazones flotantes (aumentado para mas efecto)
    for (let i = 0; i < 20; i++) {
        crearCorazon(container, corazones, i);
    }
}

function crearCorazon(container, corazones, index) {
    const corazon = document.createElement('div');
    corazon.className = 'corazon-float';
    corazon.textContent = corazones[Math.floor(Math.random() * corazones.length)];

    // Posicion aleatoria horizontal
    corazon.style.left = Math.random() * 100 + '%';

    // Tamanio aleatorio
    const tamanio = 15 + Math.random() * 25;
    corazon.style.fontSize = tamanio + 'px';

    // Retraso de animacion aleatorio
    corazon.style.animationDelay = (index * 0.3) + 's';
    corazon.style.animationDuration = (5 + Math.random() * 4) + 's';

    container.appendChild(corazon);
}

function inicializarLluviaCorazones() {
    const container = document.getElementById('lluvia-corazones');
    const corazones = ['❤', '💖', '💕', '💗', '💝', '💘'];

    // Genera una lluvia suave de corazones pequeños
    for (let i = 0; i < 8; i++) {
        setTimeout(() => crearCorazonLluvia(container, corazones), i * 300);
    }

    setInterval(() => crearCorazonLluvia(container, corazones), 1200);
}

function crearCorazonLluvia(container, corazones) {
    const corazon = document.createElement('div');
    corazon.className = 'lluvia-corazon';
    corazon.textContent = corazones[Math.floor(Math.random() * corazones.length)];

    const spawn = Math.random();
    if (spawn < 0.7) {
        // Desde arriba
        corazon.style.top = '-15px';
        corazon.style.left = Math.random() * 100 + '%';
        corazon.style.setProperty('--x-end', `${Math.random() * 30 - 15}vw`);
        corazon.style.setProperty('--y-end', '110vh');
    } else if (spawn < 0.85) {
        // Desde el lado izquierdo
        corazon.style.top = Math.random() * 40 + '%';
        corazon.style.left = '-15px';
        corazon.style.setProperty('--x-end', '120vw');
        corazon.style.setProperty('--y-end', `${Math.random() * 40 + 40}vh`);
    } else {
        // Desde el lado derecho
        corazon.style.top = Math.random() * 40 + '%';
        corazon.style.right = '-15px';
        corazon.style.setProperty('--x-end', '-120vw');
        corazon.style.setProperty('--y-end', `${Math.random() * 40 + 40}vh`);
    }

    const size = 10 + Math.random() * 10;
    corazon.style.fontSize = `${size}px`;
    corazon.style.opacity = 0.25 + Math.random() * 0.15;
    corazon.style.animationDuration = `${6 + Math.random() * 4}s`;

    container.appendChild(corazon);
    setTimeout(() => corazon.remove(), 10500);
}

// ================================================================
// FUNCION 3: SELECTOR DE MUSICA
// ================================================================
function inicializarMusica() {
    const botonesMusica = document.querySelectorAll('.btn-musica');
    const btnMusicaNav = document.getElementById('btn-musica-nav');

    listaCanciones = Array.from(botonesMusica)
        .map(btn => btn.dataset.audio)
        .filter(audioPath => audioPath && audioPath !== 'noplay');

    // Seleccion de cancion en la pantalla de bienvenida
    botonesMusica.forEach(btn => {
        btn.addEventListener('click', function() {
            // Quita la clase activa de todos los botones
            botonesMusica.forEach(b => b.classList.remove('activo'));
            // Activa el boton clickeado
            this.classList.add('activo');
            // Guarda la cancion seleccionada
            cancionActual = this.dataset.audio;
            nombreCancionActual = this.textContent.replace(/\s+/g, ' ').trim();
            if (cancionActual === 'noplay') {
                indiceCancion = -1;
            } else {
                indiceCancion = listaCanciones.indexOf(cancionActual);
            }
            actualizarMenuTrack();

            // Reproduce inmediatamente con el click del usuario, salvo si se selecciona 'Sin Musica'
            if (cancionActual === 'noplay') {
                pausarMusica();
            } else {
                reproducirMusica(cancionActual);
            }
        });
    });

    // Boton de musica en la navegacion abre/cierra el mini menu
    btnMusicaNav.addEventListener('click', function(event) {
        event.stopPropagation();
        if (menuMusicaVisible) {
            cerrarMenuMusica();
        } else {
            abrirMenuMusica();
        }
    });

    // Cerrar el menu al hacer clic fuera de el
    document.addEventListener('click', function(event) {
        if (menuMusicaVisible && !event.target.closest('#music-menu') && event.target !== btnMusicaNav) {
            cerrarMenuMusica();
        }
    });

    // Boton de reproducir/pausar dentro del menu
    const btnPlayPause = document.getElementById('btn-play-pause');
    const btnBack = document.getElementById('btn-back');
    const btnForward = document.getElementById('btn-forward');
    const btnLoop = document.getElementById('btn-loop');
    const btnCloseMenu = document.getElementById('btn-close-music-menu');
    const slider = document.getElementById('music-seek-slider');
    const currentTimeLabel = document.getElementById('music-current-time');
    const durationLabel = document.getElementById('music-duration');
    const trackLabel = document.getElementById('music-menu-track');
    const audio = document.getElementById('audio-player');

    btnPlayPause.addEventListener('click', function() {
        if (musicaActiva) {
            pausarMusica();
        } else if (cancionActual && cancionActual !== 'noplay') {
            reproducirMusica(cancionActual);
        }
    });

    function cambiarCancion() {
        if (listaCanciones.length === 0) return;
        if (indiceCancion < 0 || !listaCanciones.includes(cancionActual)) {
            indiceCancion = 0;
        } else {
            indiceCancion = (indiceCancion + 1) % listaCanciones.length;
        }
        cancionActual = listaCanciones[indiceCancion];
        botonesMusica.forEach(b => b.classList.toggle('activo', b.dataset.audio === cancionActual));
        const siguienteBoton = Array.from(botonesMusica).find(btn => btn.dataset.audio === cancionActual);
        nombreCancionActual = siguienteBoton ? siguienteBoton.textContent.replace(/\s+/g, ' ').trim() : '';
        actualizarMenuTrack();
        reproducirMusica(cancionActual);
    }

    btnBack.addEventListener('click', function() {
        if (audio.currentTime) {
            audio.currentTime = Math.max(0, audio.currentTime - 10);
        }
    });

    btnForward.addEventListener('click', function() {
        cambiarCancion();
    });

    btnLoop.addEventListener('click', function() {
        loopActivado = !loopActivado;
        audio.loop = loopActivado;
        btnLoop.classList.toggle('active', loopActivado);
    });

    btnCloseMenu.addEventListener('click', function() {
        cerrarMenuMusica();
    });

    slider.addEventListener('input', function() {
        if (audio.duration) {
            audio.currentTime = audio.duration * (this.value / 100);
        }
    });

    audio.addEventListener('timeupdate', function() {
        actualizarProgresoAudio(audio, slider, currentTimeLabel);
    });

    audio.addEventListener('loadedmetadata', function() {
        durationLabel.textContent = formatearTiempo(audio.duration);
        actualizarProgresoAudio(audio, slider, currentTimeLabel);
    });

    audio.addEventListener('ended', function() {
        if (!loopActivado && cancionActual !== 'noplay') {
            cambiarCancion();
        } else if (!loopActivado) {
            musicaActiva = false;
            actualizarIconoMusica(false);
            btnPlayPause.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    function actualizarMenuTrack() {
        trackLabel.textContent = nombreCancionActual || 'Selecciona una canción arriba';
        if (!nombreCancionActual && cancionActual && cancionActual !== 'noplay') {
            trackLabel.textContent = cancionActual;
        }
    }

    function abrirMenuMusica() {
        menuMusicaVisible = true;
        document.getElementById('music-menu').classList.add('visible');
    }

    function cerrarMenuMusica() {
        menuMusicaVisible = false;
        document.getElementById('music-menu').classList.remove('visible');
    }

    function actualizarProgresoAudio(audioElement, sliderElement, timeLabel) {
        timeLabel.textContent = formatearTiempo(audioElement.currentTime);
        const progreso = audioElement.duration ? (audioElement.currentTime / audioElement.duration) * 100 : 0;
        sliderElement.value = progreso;
    }

    function formatearTiempo(segundos) {
        const minutos = Math.floor(segundos / 60) || 0;
        const segundosRestantes = Math.floor(segundos % 60) || 0;
        return minutos + ':' + (segundosRestantes < 10 ? '0' : '') + segundosRestantes;
    }

    function actualizarMenuDatos() {
        actualizarMenuTrack();
        durationLabel.textContent = audio.duration ? formatearTiempo(audio.duration) : '0:00';
        currentTimeLabel.textContent = formatearTiempo(audio.currentTime || 0);
    }
}

function reproducirMusica(cancionId) {
    const iframe = document.getElementById('iframe-musica');
    const audio = document.getElementById('audio-player');
    const btnPlayPause = document.getElementById('btn-play-pause');

    // Detiene cualquier reproductor anterior
    iframe.src = '';
    audio.pause();

    // Si el valor es 'noplay', no reproduce nada
    if (cancionId === 'noplay') {
        musicaActiva = false;
        actualizarIconoMusica(false);
        return;
    }

    // Si es un archivo local, usa el elemento audio
    if (/\.(mp3|wav|ogg|aac)$/i.test(cancionId)) {
        audio.src = cancionId;
        audio.loop = loopActivado;
        audio.load();
        audio.play().then(() => {
            musicaActiva = true;
            actualizarIconoMusica(true);
            if (btnPlayPause) btnPlayPause.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(() => {
            musicaActiva = false;
            actualizarIconoMusica(false);
            if (btnPlayPause) btnPlayPause.innerHTML = '<i class="fas fa-play"></i>';
            console.warn('No se pudo reproducir el audio. Asegurate de que el archivo exista en la carpeta audio/.');
        });
    } else {
        // Fallback a YouTube si se utiliza un ID de video
        iframe.src = 'https://www.youtube.com/embed/' + cancionId + '?autoplay=1&loop=1&playlist=' + cancionId + '&mute=0';
        musicaActiva = true;
        actualizarIconoMusica(true);
    }
}

function pausarMusica() {
    const iframe = document.getElementById('iframe-musica');
    const audio = document.getElementById('audio-player');

    iframe.src = '';
    audio.pause();
    musicaActiva = false;
    actualizarIconoMusica(false);
    const btnPlayPause = document.getElementById('btn-play-pause');
    if (btnPlayPause) btnPlayPause.innerHTML = '<i class="fas fa-play"></i>';
}

function actualizarIconoMusica(activa) {
    const btnNav = document.getElementById('btn-musica-nav');
    const btnPlayPause = document.getElementById('btn-play-pause');
    if (activa) {
        btnNav.innerHTML = '<i class="fas fa-pause"></i>';
        btnNav.style.background = '#e91e63';
        btnNav.style.color = 'white';
    } else {
        btnNav.innerHTML = '<i class="fas fa-music"></i>';
        btnNav.style.background = 'white';
        btnNav.style.color = '#e91e63';
    }
}

// ================================================================
// FUNCION 4: NAVEGACION FIJA (aparece al hacer scroll)
// ================================================================
function inicializarNavegacion() {
    const navegacion = document.getElementById('navegacion');

    window.addEventListener('scroll', function() {
        // Muestra la navegacion despues de scrollear 500px
        if (window.scrollY > 500) {
            navegacion.classList.add('visible');
        } else {
            navegacion.classList.remove('visible');
        }
    });

    // Scroll suave al hacer clic en los links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const destino = document.querySelector(this.getAttribute('href'));
            destino.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ================================================================
// FUNCION 5: CONTADOR DE TIEMPO JUNTOS
// ================================================================
function inicializarContador() {
    function actualizarContador() {
        const ahora = new Date();
        const diferencia = ahora - FECHA_INICIO;

        // Calcula dias, horas, minutos y segundos
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

        // Actualiza los numeros en la pagina con animacion
        actualizarNumero('dias', dias);
        actualizarNumero('horas', horas);
        actualizarNumero('minutos', minutos);
        actualizarNumero('segundos', segundos);
    }

    // Actualiza cada segundo
    actualizarContador();
    setInterval(actualizarContador, 1000);
}

function actualizarNumero(id, valor) {
    const elemento = document.getElementById(id);
    const valorActual = parseInt(elemento.textContent);

    if (valorActual !== valor) {
        elemento.style.transform = 'scale(1.2)';
        elemento.style.color = '#ff6b9d';

        setTimeout(() => {
            elemento.textContent = valor;
            elemento.style.transform = 'scale(1)';
            elemento.style.color = '#e91e63';
        }, 150);
    }
}

// ================================================================
// FUNCION 6: CARTA CON EFECTO MAQUINA DE ESCRIBIR
// ================================================================
function inicializarCarta() {
    const btnLeerCarta = document.getElementById('btn-leer-carta');
    const cartaIntro = document.getElementById('carta-intro');
    const cartaContenido = document.getElementById('carta-contenido');

    btnLeerCarta.addEventListener('click', function() {
        // Oculta el intro con animacion
        cartaIntro.style.opacity = '0';
        cartaIntro.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            cartaIntro.style.display = 'none';
            cartaContenido.style.display = 'block';

            // Inicia la escritura de la carta
            iniciarEscrituraCarta();
        }, 500);
    });
}

let cartaEscribiendo = false;

function iniciarEscrituraCarta() {
    if (cartaEscribiendo) return; // Evita que se escriba dos veces
    cartaEscribiendo = true;

    const textoCompleto = document.getElementById('texto-carta-completo').textContent;
    const elementoCarta = document.getElementById('texto-carta');
    const cursor = document.getElementById('cursor-carta');

    let indice = 0;

    function escribirCaracter() {
        if (indice < textoCompleto.length) {
            const caracter = textoCompleto.charAt(indice);

            // Si es un salto de linea, crea un elemento <br>
            if (caracter === '\n') {
                elementoCarta.innerHTML += '<br>';
            } else {
                elementoCarta.textContent += caracter;
            }

            indice++;

            // Velocidad variable para que parezca mas natural
            // Pausa mas larga despues de puntos
            let velocidad = VELOCIDAD_ESCRITURA;
            if (caracter === '.' || caracter === '!' || caracter === '?') {
                velocidad = VELOCIDAD_ESCRITURA * 4;
            } else if (caracter === ',') {
                velocidad = VELOCIDAD_ESCRITURA * 2;
            } else if (caracter === '\n') {
                velocidad = VELOCIDAD_ESCRITURA * 3;
            }

            setTimeout(escribirCaracter, velocidad);
        } else {
            // La carta termino de escribirse
            cursor.style.animation = 'parpadear 0.8s infinite, desvanecer 2s forwards';
            setTimeout(() => {
                cursor.style.display = 'none';
            }, 2000);
        }
    }

    // Inicia la escritura
    escribirCaracter();
}

// ================================================================
// FUNCION 7: ANIMACIONES AL HACER SCROLL
// ================================================================
function inicializarAnimacionesScroll() {
    const secciones = document.querySelectorAll('.seccion');

    // Crea un observador que detecta cuando los elementos entran en pantalla
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15 // Se activa cuando el 15% del elemento es visible
    });

    // Observa cada seccion
    secciones.forEach(seccion => {
        observador.observe(seccion);
    });
}

// ================================================================
// FUNCION 8: PREGUNTA ESPECIAL Y RESPUESTA
// ================================================================
function inicializarPregunta() {
    const btnSi = document.getElementById('btn-si');
    const respuestaMensaje = document.getElementById('respuesta-mensaje');
    const preguntaCaja = document.querySelector('.pregunta-caja');
    const cuponesContenedor = document.getElementById('cupones-contenedor');
    const botonesDescargar = document.querySelectorAll('.btn-descargar-cupon');

    if (cuponesContenedor) {
        cuponesContenedor.style.display = 'none';
    }

    botonesDescargar.forEach(button => {
        button.addEventListener('click', function() {
            if (this.disabled) return;

            const imagenSrc = this.dataset.cuponSrc;
            const cuponNum = this.dataset.cuponNum || '1';

            if (!imagenSrc) return;

            const enlace = document.createElement('a');
            enlace.href = imagenSrc;
            enlace.download = `cupon-${cuponNum}.jpeg`;
            document.body.appendChild(enlace);
            enlace.click();
            enlace.remove();

            this.textContent = `Cupón ${cuponNum} descargado`;
            this.disabled = true;

            const tarjeta = this.closest('.cupon-card');
            if (tarjeta) {
                tarjeta.classList.add('cupon-usado');
                if (!tarjeta.querySelector('.cupon-estado')) {
                    const estado = document.createElement('span');
                    estado.className = 'cupon-estado';
                    estado.textContent = 'Usado solo una vez';
                    tarjeta.appendChild(estado);
                }
            }
        });
    });

    btnSi.addEventListener('click', function() {
        // Oculta la pregunta con animacion
        preguntaCaja.style.animation = 'desvanecer 0.5s ease forwards';

        setTimeout(() => {
            preguntaCaja.style.display = 'none';

            // Muestra el mensaje de respuesta y los cupones
            respuestaMensaje.style.display = 'block';
            if (cuponesContenedor) {
                cuponesContenedor.style.display = 'block';
            }

            // Lanza la explosion de corazones
            crearExplosionCorazones();

            // Lanza confeti adicional
            lanzarConfeti();

            // Reproduce un sonido de celebracion (opcional)
        }, 500);
    });
}

function crearExplosionCorazones() {
    const container = document.getElementById('corazones-explosion');
    const corazones = ['❤', '💖', '💕', '💗', '💝', '💘', '💓', '💞'];

    // Crea 80 corazones que explotan desde el centro (aumentado)
    for (let i = 0; i < 80; i++) {
        const corazon = document.createElement('div');
        corazon.className = 'corazon-explosion';
        corazon.textContent = corazones[Math.floor(Math.random() * corazones.length)];

        // Posicion inicial (centro)
        corazon.style.left = '50%';
        corazon.style.top = '50%';

        // Direccion aleatoria de explosion
        const angulo = Math.random() * Math.PI * 2;
        const distancia = 100 + Math.random() * 400;
        const tx = Math.cos(angulo) * distancia + 'px';
        const ty = Math.sin(angulo) * distancia + 'px';

        corazon.style.setProperty('--tx', tx);
        corazon.style.setProperty('--ty', ty);

        // Tamanio aleatorio
        corazon.style.fontSize = (15 + Math.random() * 35) + 'px';

        // Retraso aleatorio
        corazon.style.animationDelay = (Math.random() * 0.5) + 's';

        container.appendChild(corazon);

        // Elimina el corazon despues de la animacion
        setTimeout(() => {
            corazon.remove();
        }, 2500);
    }
}

function lanzarConfeti() {
    // Crea confeti de colores
    const colores = ['#e91e63', '#ff6b9d', '#ffd700', '#ff4081', '#f50057'];

    for (let i = 0; i < 50; i++) {
        const confeti = document.createElement('div');
        confeti.style.position = 'fixed';
        confeti.style.left = Math.random() * 100 + 'vw';
        confeti.style.top = '-10px';
        confeti.style.width = (8 + Math.random() * 8) + 'px';
        confeti.style.height = (8 + Math.random() * 8) + 'px';
        confeti.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
        confeti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confeti.style.pointerEvents = 'none';
        confeti.style.zIndex = '9999';
        confeti.style.animation = 'caer-confeti ' + (2 + Math.random() * 3) + 's linear forwards';
        confeti.style.opacity = '0.8';

        document.body.appendChild(confeti);

        setTimeout(() => {
            confeti.remove();
        }, 5000);
    }
}

// Agrega la animacion de confeti al CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes caer-confeti {
        0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    @keyframes desvanecer {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.9); }
    }
`;
document.head.appendChild(style);

// ================================================================
// FUNCION 9: BOTON "NO" QUE SE MUEVE (BROMA)
// ================================================================

function inicializarBotonNo() {
    const btnNo = document.getElementById('btn-no');
    const preguntaCaja = document.querySelector('.pregunta-caja');

    btnNo.addEventListener('mouseover', function() {
        // Calcula los limites del contenedor
        const cajaRect = preguntaCaja.getBoundingClientRect();
        const btnRect = this.getBoundingClientRect();

        // Mueve el boton a una posicion aleatoria dentro de la caja
        const maxX = cajaRect.width - btnRect.width - 40;
        const maxY = cajaRect.height - btnRect.height - 40;

        const x = Math.random() * maxX - (maxX / 2);
        const y = Math.random() * maxY - (maxY / 2);

        this.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        this.style.transition = 'transform 0.3s ease';
    });

    btnNo.addEventListener('click', function() {
        // Si logran clickearlo, muestra un mensaje divertido
        alert('¡Imposible! Sabia que no podrias resistirte ❤');
    });
}

// ================================================================
// FUNCION 10: EFECTO DE CORAZONES EN EL MOUSE
// ================================================================
function inicializarEfectoMouse() {
    let ultimoCorazon = 0;

    document.addEventListener('mousemove', function(e) {
        const ahora = Date.now();

        // Crea un corazon pequeno cada 100ms maximo
        if (ahora - ultimoCorazon > 100 && Math.random() > 0.7) {
            ultimoCorazon = ahora;

            const corazon = document.createElement('div');
            corazon.textContent = '❤';
            corazon.style.position = 'fixed';
            corazon.style.left = (e.clientX + (Math.random() - 0.5) * 20) + 'px';
            corazon.style.top = (e.clientY + (Math.random() - 0.5) * 20) + 'px';
            corazon.style.color = '#e91e63';
            corazon.style.fontSize = (10 + Math.random() * 15) + 'px';
            corazon.style.pointerEvents = 'none';
            corazon.style.zIndex = '9999';
            corazon.style.opacity = '0.6';
            corazon.style.animation = 'flotar-corazon-mouse 1.5s ease-out forwards';

            document.body.appendChild(corazon);

            setTimeout(() => {
                corazon.remove();
            }, 1500);
        }
    });
}

// Agrega la animacion de corazon del mouse al CSS dinamicamente
const styleMouse = document.createElement('style');
styleMouse.textContent = `
    @keyframes flotar-corazon-mouse {
        0% { transform: translateY(0) scale(1); opacity: 0.6; }
        100% { transform: translateY(-50px) scale(0.5); opacity: 0; }
    }
`;
document.head.appendChild(styleMouse);

// ================================================================
// FUNCION EXTRA: EFECTO DE PARALLAX EN EL SCROLL
// ================================================================
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.frase-inicial, .contador-amor');

    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
    });
});