
// ============================================
// ESTADÍSTICAS - VIDA ROLLER
// ============================================

// Elementos HTML donde se mostrarán las estadísticas
const mejorTiempo = document.getElementById("mejorTiempo");
const peorTiempo = document.getElementById("peorTiempo");
const promedioTiempo = document.getElementById("promedioTiempo");
const cantidadTiempos = document.getElementById("cantidadTiempos");
const ultimoTiempo = document.getElementById("ultimoTiempo");
const diferenciaTiempos = document.getElementById("diferenciaTiempos");
const listaEstadisticas = document.getElementById("listaEstadisticas");


// Obtiene los tiempos guardados en localStorage
function obtenerTiemposGuardados() {

  const datos = localStorage.getItem("tiemposGuardados");

  return datos ? JSON.parse(datos) : [];

}


// Convierte los milisegundos a formato HH:MM:SS.d
function formatearTiempo(ms) {

  const horas = Math.floor(ms / 3600000);

  const minutos = Math.floor(
    (ms % 3600000) / 60000
  );

  const segundos = Math.floor(
    (ms % 60000) / 1000
  );

  const decimas = Math.floor(
    (ms % 1000) / 100
  );

  const pad = (numero) => String(numero).padStart(2, "0");

  return `${pad(horas)}:${pad(minutos)}:${pad(segundos)}.${decimas}`;

}


// Calcula y muestra todas las estadísticas
function calcularEstadisticas() {

  const tiempos = obtenerTiemposGuardados();


  // Si no existen tiempos guardados
  if (tiempos.length === 0) {

    mejorTiempo.textContent = "Sin datos";
    peorTiempo.textContent = "Sin datos";
    promedioTiempo.textContent = "Sin datos";
    cantidadTiempos.textContent = "0";
    ultimoTiempo.textContent = "Sin datos";
    diferenciaTiempos.textContent = "Sin datos";

    listaEstadisticas.innerHTML = `
      <p class="mensaje-estadisticas-vacio">
        Aún no tienes tiempos registrados.
        Ve al cronómetro y guarda tu primer tiempo.
      </p>
    `;

    return;
  }


  // Se toman los valores del primer registro
  let mejor = tiempos[0].milisegundos;
  let peor = tiempos[0].milisegundos;


  // Busca el mejor y el peor tiempo
  tiempos.forEach(function(registro) {

    if (registro.milisegundos < mejor) {
      mejor = registro.milisegundos;
    }

    if (registro.milisegundos > peor) {
      peor = registro.milisegundos;
    }

  });


  // Calcula la suma de todos los tiempos
  let suma = 0;

  tiempos.forEach(function(registro) {
    suma += registro.milisegundos;
  });


  // Calcula el promedio
  const promedio = suma / tiempos.length;


  // Obtiene el último tiempo registrado
  const ultimo = tiempos[tiempos.length - 1].milisegundos;


  // Calcula la diferencia entre el peor y el mejor
  const diferencia = peor - mejor;


  // Muestra los resultados en las tarjetas
  mejorTiempo.textContent = formatearTiempo(mejor);

  peorTiempo.textContent = formatearTiempo(peor);

  promedioTiempo.textContent = formatearTiempo(promedio);

  cantidadTiempos.textContent = tiempos.length;

  ultimoTiempo.textContent = formatearTiempo(ultimo);

  diferenciaTiempos.textContent = formatearTiempo(diferencia);


  // Muestra el historial de tiempos
  mostrarHistorial(tiempos);

}


// Muestra todos los tiempos guardados
function mostrarHistorial(tiempos) {

  // Limpia la lista antes de mostrar los registros
  listaEstadisticas.innerHTML = "";


  // Muestra primero el registro más reciente
  tiempos.slice().reverse().forEach(function(registro, index) {

    const elemento = document.createElement("div");

    elemento.classList.add(
      "elemento-historial-estadistica"
    );


    elemento.innerHTML = `
      <span>
        Tiempo ${tiempos.length - index}
      </span>

      <strong>
        ${registro.tiempoFormateado}
      </strong>

      <small>
        ${registro.fecha}
      </small>
    `;


    listaEstadisticas.appendChild(elemento);

  });

}


// Ejecuta las estadísticas cuando se carga la página
calcularEstadisticas();
