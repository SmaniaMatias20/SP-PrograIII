// Función para obtener propiedades desde el backend y devolverlas
async function obtenerPropiedades() {
    try {
        // Realizar la solicitud HTTP usando axios
        const response = await axios.get('http://localhost:3000/propiedades/obtenerPropiedades', {
            // const response = await axios.get('https://sp-prograiii-fj7g.onrender.com/propiedades/obtenerPropiedades', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Agregar el token de autenticación si es necesario
            }
        });

        // Obtener los datos de la respuesta
        const propiedades = response.data;

        // Retornar las propiedades obtenidas
        return propiedades;

    } catch (error) {
        console.error('Error al obtener las propiedades:', error);

        // Si ocurre un error, retornar un arreglo vacío o un mensaje de error según lo que necesites
        return [];
    }
}

// Función para crear la tabla con las propiedades
function crearTablaPropiedades(propiedades) {
    // Obtener la referencia a la tabla en el HTML
    const tablaPropiedades = document.getElementById('tabla-propiedades').getElementsByTagName('tbody')[0];

    // Limpiar la tabla antes de agregar los nuevos datos
    tablaPropiedades.innerHTML = '';

    // Iterar sobre las propiedades y agregarlas a la tabla
    propiedades.forEach(propiedad => {
        // Crear una nueva fila de la tabla
        const fila = document.createElement('tr');

        // Insertar celdas con la información de cada propiedad
        fila.innerHTML = `
        <td>${propiedad.titulo}</td>
        <td>$${propiedad.precio}</td>
        <td>${propiedad.sanitarios}</td>
        <td>${propiedad.estacionamiento}</td>
        <td>${propiedad.dormitorio}</td>
      `;

        // Agregar la fila a la tabla
        tablaPropiedades.appendChild(fila);
    });
}


// Función para crear un anuncio con los datos de una propiedad
function crearAnuncio(propiedad, key) {
    const anuncio = document.createElement('div');
    anuncio.classList.add('anuncio');

    anuncio.innerHTML = `
      <picture>
        <source srcset="${propiedad.imagen}" type="image/jpeg" />
        <img src="${propiedad.imagen}" alt="Imagen de la propiedad ${propiedad.titulo}" />
      </picture>
      <div class="contenido-anuncios">
        <h3>${propiedad.titulo}</h3>
        <p>${resumirTexto(propiedad.descripcion, 50)}</p>
        <p class="precio">$${propiedad.precio}</p>
        <ul class="iconos-caracteristicas">
          <li>
            <img class="icono" loading="lazy" src="../src/iconos/icono_wc.svg" alt="icono_wc" />
            <p>${propiedad.sanitarios}</p>
          </li>
          <li>
            <img class="icono" loading="lazy" src="../src/iconos/icono_estacionamiento.svg" alt="icono_estacionamiento" />
            <p>${propiedad.estacionamiento}</p>
          </li>
          <li>
            <img class="icono" loading="lazy" src="../src/iconos/icono_dormitorio.svg" alt="icono_dormitorio" />
            <p>${propiedad.dormitorio}</p>
          </li>
        </ul>
        <a href="javascript:void(0);" class="boton-amarillo-block" data-id="${propiedad.id}">Ver Propiedad</a>
      </div>
    `;

    // Añadir un event listener al enlace para guardar el ID
    const botonVerPropiedad = anuncio.querySelector('a');
    botonVerPropiedad.addEventListener('click', (event) => {
        const propiedadId = event.target.getAttribute('data-id');
        localStorage.setItem('propiedadId', propiedadId); // Guardar el ID en el almacenamiento local
        // Redirigir a la página de detalles de la propiedad
        window.location.href = `propiedad.html?id=${propiedadId}`;
    });

    return anuncio;
}

// Función para obtener una propiedad por su ID
async function obtenerPropiedadPorId(id) {
    try {
        // Realizar la solicitud HTTP usando axios para obtener la propiedad por su ID
        const response = await axios.get(`http://localhost:3000/propiedades/obtenerPropiedad/${id}`, {
        });

        // Obtener los datos de la respuesta
        const propiedad = response.data;

        // Retornar la propiedad obtenida
        return propiedad;

    } catch (error) {
        console.error('Error al obtener la propiedad por ID:', error);

        // Si ocurre un error, retornar null o un objeto vacío dependiendo de lo que necesites
        return null;
    }
}

// Función para cargar la propiedad en una página
async function cargarPropiedad(id) {
    const propiedad = await obtenerPropiedadPorId(id); // Obtener la propiedad por ID desde el backend

    console.log(propiedad);

    if (!propiedad) {
        console.error('La propiedad no se encontró.');
        return;
    }

    // Establecer el título de la propiedad
    const tituloPropiedad = document.getElementById('titulo-propiedad');
    tituloPropiedad.textContent = propiedad.titulo;

    // Añadir las imágenes del carrusel
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.innerHTML = ''; // Limpiar el contenido anterior

    propiedad.imagenes.forEach((imagen, index) => {
        const item = document.createElement('div');
        item.classList.add('carousel-item', index === 0 ? 'active' : ''); // Asegurarse de que la primera imagen esté activa

        const img = document.createElement('img');
        img.src = imagen;
        img.alt = `Imagen ${index + 1} de la propiedad ${propiedad.titulo}`;
        img.classList.add('d-block', 'w-100');

        item.appendChild(img);
        carouselInner.appendChild(item);
    });

    // Establecer la descripción, precio, sanitarios, estacionamientos, y dormitorios
    document.getElementById('descripcion-propiedad').textContent = propiedad.descripcion;
    document.getElementById('precio-propiedad').textContent = `$${propiedad.precio}`;
    document.getElementById('sanitarios').textContent = propiedad.sanitarios;
    document.getElementById('estacionamientos').textContent = propiedad.estacionamiento;
    document.getElementById('dormitorios').textContent = propiedad.dormitorio;

    // Si deseas incluir un mapa, puedes usar la API de Google Maps para mostrarlo en el contenedor 'map'.
    if (propiedad.ubicacion) {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: propiedad.ubicacion.lat, lng: propiedad.ubicacion.lng },
            zoom: 14,
        });
    }
}




let paginaActual = 1; // Página inicial
const itemsPorPagina = 6; // Número de elementos a mostrar por página

// Función para mostrar una cantidad específica de propiedades con paginación
async function mostrarPropiedades(cantidad = 7) {
    const propiedades = await obtenerPropiedades(); // Obtener las propiedades desde el backend
    const contenedor = document.querySelector(".contenedor-anuncios"); // Seleccionar el contenedor de anuncios

    // Verificar si el contenedor existe
    if (!contenedor) {
        console.error('El contenedor de anuncios no se encontró.');
        return;
    }

    contenedor.innerHTML = ""; // Limpiar el contenedor antes de agregar los nuevos anuncios

    // Asegurarse de no exceder la cantidad disponible de propiedades
    const propiedadesMostrar = propiedades.slice(0, cantidad); // Obtener solo el número deseado de propiedades

    // Calcular el total de páginas
    const totalPropiedades = propiedadesMostrar.length;
    const totalPaginas = Math.ceil(totalPropiedades / itemsPorPagina);

    // Verificar los valores de paginación
    const primerIndice = (paginaActual - 1) * itemsPorPagina;
    const ultimoIndice = Math.min(primerIndice + itemsPorPagina, totalPropiedades);

    // Mostrar las propiedades de la página actual
    propiedadesMostrar.slice(primerIndice, ultimoIndice).forEach((propiedad, index) => {
        const anuncio = crearAnuncio(propiedad, index); // Crear un anuncio para cada propiedad
        contenedor.appendChild(anuncio); // Agregar el anuncio al contenedor
    });

    // Mostrar la paginación si es necesario
    if (totalPaginas > 1) {
        mostrarPaginacion(totalPaginas);
    }
}
function mostrarPropiedadesFiltradas(propiedades) {
    const contenedor = document.querySelector(".contenedor-anuncios");
    if (!contenedor) {
        console.error('El contenedor de anuncios no se encontró.');
        return;
    }

    contenedor.innerHTML = ""; 

    const totalPropiedades = propiedades.length;
    const totalPaginas = Math.ceil(totalPropiedades / itemsPorPagina);

    const primerIndice = (paginaActual - 1) * itemsPorPagina;
    const ultimoIndice = Math.min(primerIndice + itemsPorPagina, totalPropiedades);

    propiedades.slice(primerIndice, ultimoIndice).forEach((propiedad, index) => {
        const anuncio = crearAnuncio(propiedad, index);
        contenedor.appendChild(anuncio);
    });

    if (totalPaginas > 1) {
        mostrarPaginacion(totalPaginas);
    }
}

// Función para mostrar los botones de paginación con flechas
function mostrarPaginacion(totalPaginas) {
    const contenedorPaginacion = document.querySelector(".contenedor-paginacion"); // Suponiendo que hay un contenedor para la paginación

    if (!contenedorPaginacion) return;

    contenedorPaginacion.innerHTML = ""; // Limpiar la paginación previa

    // Botón "Anterior"
    const botonAnterior = document.createElement("button");
    botonAnterior.classList.add("pagina-boton", "flecha", "flecha-izquierda");
    botonAnterior.disabled = paginaActual === 1; // Deshabilitar si estamos en la primera página

    // Agregar evento para ir a la página anterior
    botonAnterior.addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarPropiedades();
        }
    });
    contenedorPaginacion.appendChild(botonAnterior);

    // Botones de las páginas
    for (let i = 1; i <= totalPaginas; i++) {
        const boton = document.createElement("button");
        boton.textContent = i;
        boton.classList.add("pagina-boton");

        // Agregar un evento click para cambiar de página
        boton.addEventListener("click", () => {
            paginaActual = i;
            mostrarPropiedades();
        });

        // Resaltar la página activa
        if (paginaActual === i) {
            boton.classList.add("pagina-activa");
        }

        contenedorPaginacion.appendChild(boton);
    }

    // Botón "Siguiente"
    const botonSiguiente = document.createElement("button");
    botonSiguiente.classList.add("pagina-boton", "flecha", "flecha-derecha");
    botonSiguiente.disabled = paginaActual === totalPaginas; // Deshabilitar si estamos en la última página

    // Agregar evento para ir a la siguiente página
    botonSiguiente.addEventListener("click", () => {
        if (paginaActual < totalPaginas) {
            paginaActual++;
            mostrarPropiedades();
        }
    });
    contenedorPaginacion.appendChild(botonSiguiente);
}

function filtrarPropiedades(propiedades) {
    const filtroBanos = document.getElementById('banos').value;
    const filtroHabitaciones = document.getElementById('habitaciones').value;
    const filtroCocheras = document.getElementById('cocheras').value;

    return propiedades.filter(propiedad => {
        const cumpleBanos = !filtroBanos || (filtroBanos === '3' ? propiedad.sanitarios >= 3 : propiedad.sanitarios == filtroBanos);
        const cumpleHabitaciones = !filtroHabitaciones || (filtroHabitaciones === '3' ? propiedad.dormitorio >= 3 : propiedad.dormitorio == filtroHabitaciones);
        const cumpleCocheras = !filtroCocheras || (filtroCocheras === '3' ? propiedad.estacionamiento >= 3 : propiedad.estacionamiento == filtroCocheras);

        return cumpleBanos && cumpleHabitaciones && cumpleCocheras;
    });
}

document.getElementById('filtrar-btn').addEventListener('click', async () => {
    const propiedades = await obtenerPropiedades(); 
    const propiedadesFiltradas = filtrarPropiedades(propiedades); 
    paginaActual = 1; // Reiniciar a la primera
    mostrarPropiedadesFiltradas(propiedadesFiltradas);
});


function resumirTexto(texto, longitudMaxima) {
    return texto.length > longitudMaxima
        ? texto.substring(0, longitudMaxima) + '...'
        : texto;
}