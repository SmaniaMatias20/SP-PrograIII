// Función para obtener artículos desde el backend y devolverlos
async function obtenerArticulos() {
    try {
        // Realizar la solicitud HTTP usando axios
        const response = await axios.get('http://localhost:3000/articulos/obtenerArticulos', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Agregar el token de autenticación si es necesario
            }
        });

        // Obtener los datos de la respuesta
        const articulos = response.data;

        // Retornar los artículos obtenidos
        return articulos;

    } catch (error) {
        console.error('Error al obtener los artículos:', error);

        // Si ocurre un error, retornar un arreglo vacío o un mensaje de error según lo que necesites
        return [];
    }
}

// Función para crear la tabla con los artículos
function crearTablaArticulos(articulos) {
    // Obtener la referencia a la tabla en el HTML
    const tablaArticulos = document.getElementById('tabla-articulos').getElementsByTagName('tbody')[0];

    // Limpiar la tabla antes de agregar los nuevos datos
    tablaArticulos.innerHTML = '';

    // Iterar sobre los artículos y agregarlos a la tabla
    articulos.forEach(articulo => {
        // Crear una nueva fila de la tabla
        const fila = document.createElement('tr');

        // Insertar celdas con la información de cada artículo
        fila.innerHTML = `
            <td>${articulo.titulo}</td>
            <td>${articulo.autor}</td>
            <td>${articulo.contenido || 'Sin descripción'}</td>
            <td>${new Date(articulo.fecha).toLocaleDateString()}</td> <!-- Convertir la fecha en formato legible -->
        `;

        // Agregar la fila a la tabla
        tablaArticulos.appendChild(fila);
    });
}

// Función para cargar artículos desde el backend
async function cargarArticulos(limite = 4) {
    const longitudMaximaDescripcion = 30; // Longitud máxima de la descripción

    const contenedor = document.getElementById('articulos'); // Seleccionar el contenedor con id="articulos"

    try {
        // Obtener los artículos desde el backend
        const articulos = await obtenerArticulos();

        // Limitar la cantidad de artículos si es necesario
        const articulosLimitados = articulos.slice(0, limite);

        // Limpiar el contenedor antes de agregar los nuevos artículos
        contenedor.innerHTML = '';

        // Iterar sobre los artículos y agregarlos al contenedor
        articulosLimitados.forEach(articulo => {
            const article = document.createElement('article');
            article.classList.add('entrada-blog');

            // Resumir el contenido si estamos en la página de inicio
            const contenidoTexto = resumirTexto(articulo.contenido, longitudMaximaDescripcion);

            // Estructura HTML del artículo
            article.innerHTML = `
                <div class="imagen">
                    <picture>
                        <source srcset="${articulo.imagen}" type="image/jpeg" />
                        <img loading="lazy" src="${articulo.imagen}" alt="Imagen Blog ${articulo.id}" />
                    </picture>
                </div>
                <div class="texto-entrada">
                    <a class="enlace-articulo" data-id="${articulo.id}">
                        <h4>${articulo.titulo}</h4>
                        <p>Escrito el: <span>${articulo.fecha}</span> por: <span>${articulo.autor}</span></p>
                        <p>${contenidoTexto}</p>
                    </a>
                </div>
            `;

            // Agregar el artículo al contenedor
            contenedor.appendChild(article);
        });
    } catch (error) {
        console.error('Error al cargar los artículos:', error);
    }
}


// Función para obtener artículos desde el backend y devolverlos
async function obtenerArticulos() {
    try {
        const response = await axios.get('http://localhost:3000/articulos/obtenerArticulos', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los artículos:', error);
        return []; // Retorna un arreglo vacío si ocurre un error
    }
}

// Paginación: Variables de configuración
let paginaActualArticulos = 1; // Página inicial para artículos
const itemsPorPaginaArticulos = 3; // Número de artículos a mostrar por página

// Función para mostrar artículos con paginación
async function mostrarArticulos(cantidad = 4) {
    const articulos = await obtenerArticulos(); // Obtener artículos
    const contenedor = document.getElementById('articulos'); // Seleccionar el contenedor de artículos

    if (!contenedor) {
        console.error('El contenedor de artículos no se encontró.');
        return;
    }

    // Limpiar el contenedor antes de agregar los nuevos artículos
    contenedor.innerHTML = '';

    // Asegurarse de no exceder la cantidad disponible de artículos
    const articulosMostrar = articulos.slice(0, cantidad); // Obtener los artículos limitados

    // Calcular el total de páginas y mostrar la paginación
    const totalArticulos = articulosMostrar.length;
    const totalPaginas = Math.ceil(totalArticulos / itemsPorPaginaArticulos);

    const primerIndice = (paginaActualArticulos - 1) * itemsPorPaginaArticulos;
    const ultimoIndice = Math.min(primerIndice + itemsPorPaginaArticulos, totalArticulos);

    articulosMostrar.slice(primerIndice, ultimoIndice).forEach((articulo) => {
        const article = document.createElement('article');
        article.classList.add('entrada-blog');

        // Resumir el contenido si estamos en la página de inicio
        const contenidoTexto = resumirTexto(articulo.contenido, 30);

        article.innerHTML = `
            <div class="imagen">
                <picture>
                    <source srcset="${articulo.imagen}" type="image/jpeg" />
                    <img loading="lazy" src="${articulo.imagen}" alt="Imagen Blog ${articulo.id}" />
                </picture>
            </div>
            <div class="texto-entrada">
                <a class="enlace-articulo" data-id="${articulo.id}">
                    <h4>${articulo.titulo}</h4>
                    <p>Escrito el: <span>${new Date(articulo.fecha).toLocaleDateString()}</span> por: <span>${articulo.autor}</span></p>
                    <p>${contenidoTexto}</p>
                </a>
            </div>
        `;

        // Agregar el artículo al contenedor
        contenedor.appendChild(article);
    });

    // Mostrar la paginación si es necesario
    if (totalPaginas > 1) {
        mostrarPaginacionArticulos(totalPaginas);
    }
}

// Función para crear la paginación de artículos
function mostrarPaginacionArticulos(totalPaginas) {
    const contenedorPaginacion = document.querySelector(".paginacion-articulos");
    contenedorPaginacion.innerHTML = ""; // Limpiar la paginación anterior

    // Crear el botón "Anterior" (flecha izquierda)
    const botonIzquierda = document.createElement("button");
    botonIzquierda.classList.add("pagina-btn", "flecha", "flecha-izquierda");
    botonIzquierda.disabled = paginaActualArticulos === 1; // Desactivar si estamos en la primera página
    botonIzquierda.addEventListener("click", () => {
        if (paginaActualArticulos > 1) {
            paginaActualArticulos--;
            mostrarArticulos(); // Recargar los artículos
        }
    });
    contenedorPaginacion.appendChild(botonIzquierda);

    // Crear los botones de las páginas
    for (let i = 1; i <= totalPaginas; i++) {
        const botonPagina = document.createElement("button");
        botonPagina.textContent = i;
        botonPagina.classList.add("pagina-btn");

        // Resaltar el botón de la página activa
        if (i === paginaActualArticulos) {
            botonPagina.classList.add("activo");
        }

        botonPagina.addEventListener("click", () => {
            paginaActualArticulos = i;
            mostrarArticulos(); // Recargar los artículos
        });

        contenedorPaginacion.appendChild(botonPagina);
    }

    // Crear el botón "Siguiente" (flecha derecha)
    const botonDerecha = document.createElement("button");
    botonDerecha.classList.add("pagina-btn", "flecha", "flecha-derecha");
    botonDerecha.disabled = paginaActualArticulos === totalPaginas; // Desactivar si estamos en la última página
    botonDerecha.addEventListener("click", () => {
        if (paginaActualArticulos < totalPaginas) {
            paginaActualArticulos++;
            mostrarArticulos(); // Recargar los artículos
        }
    });
    contenedorPaginacion.appendChild(botonDerecha);
}

function resumirTexto(texto, longitudMaxima) {
    return texto.length > longitudMaxima
        ? texto.substring(0, longitudMaxima) + '...'
        : texto;
}
