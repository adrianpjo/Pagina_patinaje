
// Busca en el HTML el <div> donde se muestra el tiempo y lo guarda en esta variable
const pantallaTiempo = document.getElementById('pantallaTiempo');
// Busca el botón "Iniciar" y lo guarda en esta variable
const botonIniciar = document.getElementById('botonIniciar');
// Busca el botón "Pausar" y lo guarda en esta variable
const botonPausar = document.getElementById('botonPausar');
// Busca el botón "Reiniciar" y lo guarda en esta variable
const botonReiniciar = document.getElementById('botonReiniciar');
// Busca el botón "Guardar Tiempo" y lo guarda en esta variable
const botonGuardarTiempo = document.getElementById('botonGuardarTiempo');
// Busca el <tbody> de la tabla donde van las filas de tiempos guardados
const cuerpoTablaTiempos = document.getElementById('cuerpoTablaTiempos');

// Momento exacto (timestamp) en que se inició o reanudó el cronómetro
let tiempoInicio = 0;
// Tiempo ya contado antes de la pausa actual
let tiempoAcumulado = 0;
// Guarda la referencia del temporizador activo, para poder detenerlo después
let intervalo = null;
// Indica si el cronómetro está corriendo (true) o detenido (false)
let corriendo = false;
// Tiempo exacto que quedó marcado la última vez que se pausó
let tiempoFinalPausado = 0;

// Función que convierte milisegundos en un texto tipo "00:01:23.4"
function formatearTiempo(ms) {
  // Calcula cuántas horas completas caben en esos milisegundos
  const horas = Math.floor(ms / 3600000);
  // Calcula cuántos minutos completos sobran después de las horas
  const minutos = Math.floor((ms % 3600000) / 60000);
  // Calcula cuántos segundos completos sobran después de los minutos
  const segundos = Math.floor((ms % 60000) / 1000);
  // Calcula la décima de segundo actual
  const decimas = Math.floor((ms % 1000) / 100);
  // Función pequeña que agrega un "0" adelante si el número tiene un solo dígito
  const pad = (num) => String(num).padStart(2, '0');
  // Junta todo en el formato final HH:MM:SS.d y lo devuelve como resultado
  return `${pad(horas)}:${pad(minutos)}:${pad(segundos)}.${decimas}`;
}

// Función que se ejecuta muchas veces por segundo para refrescar la pantalla
function actualizarPantalla() {
  // Obtiene la hora actual exacta del sistema
  const ahora = Date.now();
  // Suma lo ya acumulado más lo que ha pasado desde el último "Iniciar"
  const transcurrido = tiempoAcumulado + (ahora - tiempoInicio);
  // Reemplaza el texto de la pantalla con el tiempo recién calculado
  pantallaTiempo.textContent = formatearTiempo(transcurrido);
}

// Escucha los clics en el botón "Iniciar"
botonIniciar.addEventListener('click', () => {
  // Si ya está corriendo, no hace nada más (evita iniciar dos veces)
  if (corriendo) return;
  // Marca que el cronómetro ya está corriendo
  corriendo = true;
  // Guarda el instante exacto de este clic como el nuevo punto de partida
  tiempoInicio = Date.now();
  // Arranca un temporizador que llama a actualizarPantalla() cada 100 milisegundos
  intervalo = setInterval(actualizarPantalla, 100);
  // Deshabilita "Iniciar" (ya está corriendo, no tiene sentido volver a apretarlo)
  botonIniciar.disabled = true;
  // Habilita "Pausar" (ahora sí hay algo que pausar)
  botonPausar.disabled = false;
  // Deshabilita "Guardar" (no se guarda mientras el tiempo sigue corriendo)
  botonGuardarTiempo.disabled = true;
});

// Escucha los clics en el botón "Pausar"
botonPausar.addEventListener('click', () => {
  // Si no está corriendo, no hace nada (no se puede pausar algo detenido)
  if (!corriendo) return;
  // Marca que el cronómetro ya no está corriendo
  corriendo = false;
  // Detiene el temporizador que actualizaba la pantalla
  clearInterval(intervalo);
  // Suma el tiempo que corrió desde el último inicio al total acumulado
  tiempoAcumulado += Date.now() - tiempoInicio;
  // Guarda ese total como el tiempo que se podría guardar en la tabla
  tiempoFinalPausado = tiempoAcumulado;
  // Vuelve a habilitar "Iniciar" (para poder reanudar)
  botonIniciar.disabled = false;
  // Deshabilita "Pausar" (ya está pausado, no hay nada más que pausar)
  botonPausar.disabled = true;
  // Habilita "Guardar" solo si el tiempo marcado es mayor a 0
  botonGuardarTiempo.disabled = tiempoFinalPausado === 0;
});

// Escucha los clics en el botón "Reiniciar"
botonReiniciar.addEventListener('click', () => {
  // Detiene cualquier temporizador que siga activo
  clearInterval(intervalo);
  // Marca que el cronómetro no está corriendo
  corriendo = false;
  // Pone el tiempo acumulado de vuelta en cero
  tiempoAcumulado = 0;
  // Pone el tiempo pausado de vuelta en cero
  tiempoFinalPausado = 0;
  // Restaura el texto de pantalla al valor inicial
  pantallaTiempo.textContent = '00:00:00.0';
  // Vuelve a habilitar "Iniciar"
  botonIniciar.disabled = false;
  // Deshabilita "Pausar" (no hay nada corriendo que pausar)
  botonPausar.disabled = true;
  // Deshabilita "Guardar" (no hay ningún tiempo válido para guardar)
  botonGuardarTiempo.disabled = true;
});

// Escucha los clics en el botón "Guardar Tiempo"
botonGuardarTiempo.addEventListener('click', () => {
  // Si no hay tiempo marcado, no hace nada
  if (tiempoFinalPausado === 0) return;
  // Trae la lista de tiempos que ya estaban guardados
  const tiempos = obtenerTiemposGuardados();
  // Agrega un nuevo registro al final de la lista
  tiempos.push({
    // Guarda el valor crudo en milisegundos
    milisegundos: tiempoFinalPausado,
    // Guarda la versión de texto legible (00:01:23.4)
    tiempoFormateado: formatearTiempo(tiempoFinalPausado),
    // Guarda la fecha y hora actuales en formato legible
    fecha: new Date().toLocaleString('es-CO')
  });
  // Convierte la lista completa a texto y la guarda en el navegador de forma permanente
  localStorage.setItem('tiemposGuardados', JSON.stringify(tiempos));
  // Vuelve a dibujar la tabla con el nuevo tiempo incluido
  renderizarListaTiempos();
  // Deshabilita "Guardar" hasta que haya un próximo tiempo válido
  botonGuardarTiempo.disabled = true;
});

// Función que lee y devuelve la lista de tiempos guardados
function obtenerTiemposGuardados() {
  // Busca el texto guardado bajo el nombre 'tiemposGuardados'
  const datos = localStorage.getItem('tiemposGuardados');
  // Si existe, lo convierte de texto a lista; si no existe, devuelve una lista vacía
  return datos ? JSON.parse(datos) : [];
}

// Función que dibuja (o redibuja) toda la tabla de tiempos guardados
function renderizarListaTiempos() {
  // Trae la lista actual de tiempos guardados
  const tiempos = obtenerTiemposGuardados();
  // Borra todo el contenido actual de la tabla, para volver a construirla desde cero
  cuerpoTablaTiempos.innerHTML = '';

  // Si no hay ningún tiempo guardado todavía...
  if (tiempos.length === 0) {
    // ...muestra una fila con un mensaje en vez de datos
    cuerpoTablaTiempos.innerHTML = `
      <tr><td colspan="4" class="mensaje-lista-vacia">Aún no hay tiempos guardados</td></tr>
    `;
    // Corta la función aquí, no hay más que hacer
    return;
  }

  // Recorre la lista de tiempos, mostrando primero los más recientes
  tiempos.slice().reverse().forEach((registro, index) => {
    // Calcula el número original de este tiempo (1, 2, 3...)
    const numeroReal = tiempos.length - index;
    // Crea un elemento <tr> (fila) nuevo, vacío por ahora
    const fila = document.createElement('tr');
    // Le asigna una clase CSS para poder darle estilo
    fila.className = 'fila-tiempo-guardado';
    // Llena la fila con las 4 columnas: número, tiempo, fecha y botón de eliminar
    fila.innerHTML = `
      <td class="numero-tiempo">${numeroReal}</td>
      <td class="valor-tiempo">${registro.tiempoFormateado}</td>
      <td class="fecha-tiempo">${registro.fecha}</td>
      <td><button class="boton-eliminar-tiempo" data-indice="${numeroReal - 1}">✕</button></td>   
    `;
    // ACA SE CREA EL BOTON "x"
    // Agrega esta fila ya construida dentro de la tabla visible
    cuerpoTablaTiempos.appendChild(fila);
  });

  // Busca todos los botones "✕" recién creados
  document.querySelectorAll('.boton-eliminar-tiempo').forEach((boton) => {
    // Le agrega a cada uno su propio evento de clic
    boton.addEventListener('click', (e) => {
      // Lee el índice guardado en el atributo data-indice de ese botón
      const indice = parseInt(e.target.dataset.indice);
      // Llama a la función que elimina ese tiempo específico
      eliminarTiempo(indice);
    });
  });
}

// Función que elimina un tiempo guardado según su posición en la lista
function eliminarTiempo(indice) {
  // Trae la lista actual de tiempos guardados
  const tiempos = obtenerTiemposGuardados();
  // Quita 1 elemento de la lista, en la posición indicada
  tiempos.splice(indice, 1);
  // Guarda la lista ya actualizada (sin ese tiempo) de vuelta en localStorage
  localStorage.setItem('tiemposGuardados', JSON.stringify(tiempos));
  // Vuelve a dibujar la tabla, ya sin el tiempo eliminado
  renderizarListaTiempos();
}

// Apenas carga la página, dibuja la tabla con los tiempos que ya existían antes
renderizarListaTiempos();