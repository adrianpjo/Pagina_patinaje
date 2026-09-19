
// ============================================
// SISTEMA DE COMENTARIOS - VIDA ROLLER
// ============================================

// Obtener elementos del HTML
const formulario = document.getElementById("formSugerencia");
const listaComentarios = document.getElementById("listaComentarios");


// ============================================
// CARGAR COMENTARIOS GUARDADOS
// ============================================

let comentarios = JSON.parse(localStorage.getItem("comentariosVidaRoller")) || [];


// Mostrar los comentarios cuando se carga la página
mostrarComentarios();


// ============================================
// EVENTO DEL FORMULARIO
// ============================================

formulario.addEventListener("submit", function (evento) {

    // Evita que la página se recargue
    evento.preventDefault();

    // Obtener los valores escritos por el usuario
    const nombre = document.getElementById("nombre").value.trim();
    const categoria = document.getElementById("categoria").value;
    const mensaje = document.getElementById("mensaje").value.trim();

    // Verificar que todos los campos tengan información
    if (nombre === "" || categoria === "" || mensaje === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Crear objeto con la información del comentario
    const nuevoComentario = {
        nombre: nombre,
        categoria: obtenerNombreCategoria(categoria),
        mensaje: mensaje
    };

    // Agregar el comentario al arreglo
    comentarios.push(nuevoComentario);

    // Guardar los comentarios en localStorage
    localStorage.setItem(
        "comentariosVidaRoller",
        JSON.stringify(comentarios)
    );

    // Mostrar nuevamente los comentarios
    mostrarComentarios();

    // Limpiar el formulario
    formulario.reset();

});


// ============================================
// MOSTRAR COMENTARIOS
// ============================================

function mostrarComentarios() {

    // Limpiar la lista antes de volver a mostrarla
    listaComentarios.innerHTML = "";

    // Si no existen comentarios
    if (comentarios.length === 0) {

        const mensajeVacio = document.createElement("p");

        mensajeVacio.classList.add("mensaje-comentarios-vacio");

        mensajeVacio.textContent = "Aún no hay comentarios. ¡Sé el primero en participar!";

        listaComentarios.appendChild(mensajeVacio);

        return;
    }


    // Recorrer todos los comentarios
    comentarios.forEach(function (comentario) {

        // Crear tarjeta principal
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-comentario");


        // ============================================
        // CABECERA DEL COMENTARIO
        // ============================================

        const cabecera = document.createElement("div");
        cabecera.classList.add("cabecera-comentario");


        // Nombre del usuario
        const autor = document.createElement("span");
        autor.classList.add("autor");
        autor.textContent = comentario.nombre;


        // Categoría
        const categoria = document.createElement("span");
        categoria.classList.add("etiqueta-categoria");
        categoria.textContent = comentario.categoria;


        // Agregar nombre y categoría a la cabecera
        cabecera.appendChild(autor);
        cabecera.appendChild(categoria);


        // ============================================
        // TEXTO DEL COMENTARIO
        // ============================================

        const texto = document.createElement("p");

        texto.classList.add("texto-comentario");

        texto.textContent = comentario.mensaje;


        // ============================================
        // ARMAR LA TARJETA
        // ============================================

        tarjeta.appendChild(cabecera);
        tarjeta.appendChild(texto);

        listaComentarios.appendChild(tarjeta);

    });
}


// ============================================
// CONVERTIR VALOR DE CATEGORÍA
// ============================================

function obtenerNombreCategoria(valor) {

    switch (valor) {

        case "sugerencia":
            return "Sugerencia general";

        case "evento":
            return "Noticias / Eventos";

        case "pista":
            return "Pistas y Rutas";

        case "otro":
            return "Otro";

        default:
            return "Sin categoría";
    }
}

