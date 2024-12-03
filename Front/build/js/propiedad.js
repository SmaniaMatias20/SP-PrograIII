
async function obtenerPropiedades() {
    try {
        // Realizar la solicitud HTTP usando axios
        const response = await axios.get(`${BASE_URL}/propiedades/obtenerPropiedades`, {
            // const response = await axios.get('https://sp-prograiii-fj7g.onrender.com/propiedades/obtenerPropiedades', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        const propiedades = response.data;
        return propiedades;
    } catch (error) {
        console.error('Error al obtener las propiedades:', error);
        return [];
    }
}

function crearTablaPropiedades(propiedades) {
    const tablaPropiedades = document.getElementById('tabla-propiedades').getElementsByTagName('tbody')[0];

    tablaPropiedades.innerHTML = '';

    propiedades.forEach(propiedad => {
        const fila = document.createElement('tr');
        let reservada = "";
        if (propiedad.reservada) {
            reservada = "reservada";
        } else {
            reservada = "disponible";
        }
        fila.innerHTML = `
            < td > ${propiedad.titulo}</td >
        <td>$${propiedad.precio}</td>
        <td>${propiedad.sanitarios}</td>
        <td>${propiedad.estacionamiento}</td>
        <td>${propiedad.dormitorio}</td>
        <td>${reservada}</td>
      `;
        tablaPropiedades.appendChild(fila);
    });
}


function crearAnuncio(propiedad, key) {
    const anuncio = document.createElement('div');
    anuncio.classList.add('anuncio');

    anuncio.innerHTML = `
            < picture >
        <source srcset="${propiedad.imagen}" type="image/jpeg" />
        <img src="${propiedad.imagen}" alt="Imagen de la propiedad ${propiedad.titulo}" />
      </picture >
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
    const botonVerPropiedad = anuncio.querySelector('a');

    botonVerPropiedad.addEventListener('click', (event) => {
        const propiedadId = event.target.getAttribute('data-id');
        localStorage.setItem('propiedadId', propiedadId);
        window.location.href = `propiedad.html ? id = ${propiedadId} `;

    });


    return anuncio;
}

async function obtenerPropiedadPorId(id) {
    try {
        // Realizar la solicitud HTTP usando axios para obtener la propiedad por su ID
        const response = await axios.get(`${BASE_URL}/propiedades/obtenerPropiedad/${id}`, {
        });
        const propiedad = response.data;
        return propiedad;
    } catch (error) {
        console.error('Error al obtener la propiedad por ID:', error);
        return null;
    }
}


let paginaActual = 1;
const itemsPorPagina = 6;

async function mostrarPropiedades(cantidad = 7) {
    const propiedades = await obtenerPropiedades();
    const contenedor = document.querySelector(".contenedor-anuncios");

    if (!contenedor) {
        console.error('El contenedor de anuncios no se encontró.');
        return;
    }

    contenedor.innerHTML = "";

    const propiedadesMostrar = propiedades.slice(0, cantidad);

    const totalPropiedades = propiedadesMostrar.length;
    const totalPaginas = Math.ceil(totalPropiedades / itemsPorPagina);

    const primerIndice = (paginaActual - 1) * itemsPorPagina;
    const ultimoIndice = Math.min(primerIndice + itemsPorPagina, totalPropiedades);

    propiedadesMostrar.slice(primerIndice, ultimoIndice).forEach((propiedad, index) => {
        const anuncio = crearAnuncio(propiedad, index);
        contenedor.appendChild(anuncio);
    });

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

function mostrarPaginacion(totalPaginas) {
    const contenedorPaginacion = document.querySelector(".contenedor-paginacion");

    if (!contenedorPaginacion) return;

    contenedorPaginacion.innerHTML = "";

    const botonAnterior = document.createElement("button");
    botonAnterior.classList.add("pagina-boton", "flecha", "flecha-izquierda");
    botonAnterior.disabled = paginaActual === 1;

    botonAnterior.addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarPropiedades();
        }
    });
    contenedorPaginacion.appendChild(botonAnterior);

    for (let i = 1; i <= totalPaginas; i++) {
        const boton = document.createElement("button");
        boton.textContent = i;
        boton.classList.add("pagina-boton");

        boton.addEventListener("click", () => {
            paginaActual = i;
            mostrarPropiedades();
        });


        if (paginaActual === i) {
            boton.classList.add("pagina-activa");
        }

        contenedorPaginacion.appendChild(boton);
    }

    const botonSiguiente = document.createElement("button");
    botonSiguiente.classList.add("pagina-boton", "flecha", "flecha-derecha");
    botonSiguiente.disabled = paginaActual === totalPaginas;

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



function resumirTexto(texto, longitudMaxima) {
    return texto.length > longitudMaxima
        ? texto.substring(0, longitudMaxima) + '...'
        : texto;
}

async function mostrarPropiedad(propiedad) {

    const tituloElement = document.querySelector('#titulo-propiedad');
    const descripcionElement = document.querySelector('#descripcion-propiedad');
    const precioElement = document.querySelector('#precio-propiedad');
    const sanitariosElement = document.querySelector('#sanitarios');
    const estacionamientoElement = document.querySelector('#estacionamientos');
    const dormitorioElement = document.querySelector('#dormitorios');
    const carouselIndicators = document.querySelector('.carousel-indicators');
    const carouselInner = document.querySelector('.carousel-inner');
    console.log(propiedad.descripcion);
    tituloElement.textContent = propiedad.titulo;
    descripcionElement.textContent = propiedad.descripcion;
    precioElement.textContent = `$${propiedad.precio} `;
    sanitariosElement.textContent = propiedad.sanitarios;
    estacionamientoElement.textContent = propiedad.estacionamiento;
    dormitorioElement.textContent = propiedad.dormitorio;

    carouselIndicators.innerHTML = '';
    carouselInner.innerHTML = '';


    propiedad.imagenes.forEach((imagen, index) => {

        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('data-bs-target', '#demo');
        indicator.setAttribute('data-bs-slide-to', index);
        indicator.classList.add('active');
        if (index !== 0) indicator.classList.remove('active');
        carouselIndicators.appendChild(indicator);


        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) carouselItem.classList.add('active');

        const imgElement = document.createElement('img');
        imgElement.src = imagen;
        imgElement.classList.add('d-block', 'w-100');
        imgElement.alt = `Imagen de la propiedad ${propiedad.titulo} `;
        carouselItem.appendChild(imgElement);

        carouselInner.appendChild(carouselItem);
    });

    try {
        console.log(propiedad.ubicacion);
        await inicializarMapa(propiedad.ubicacion);
    } catch (error) {
        console.error("Error al inicializar el mapa:", error);
        document.body.innerHTML = "<h1 class='text-center'>Error al cargar el mapa</h1>";
    }
}

function inicializarMapa(location) {
    console.log(location);
    return new Promise((resolve, reject) => {
        if (typeof google !== 'undefined' && google.maps) {
            const map = new google.maps.Map(document.getElementById("map"), {
                center: location,
                zoom: 15,
            });
            resolve(map);
        } else {
            reject(new Error("Google Maps API is not loaded"));
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const btnReserva = document.querySelector('#btn-reserva');
    if (btnReserva) {
        btnReserva.addEventListener('click', gestionarReserva);
    }
});

async function gestionarReserva() {
    const propiedadId = obtenerPropiedadId();
    console.log(propiedadId);

    if (!propiedadId) {
        console.error('No se encontró el ID de la propiedad');
        return;
    }

    const propiedad = await obtenerPropiedadPorId(propiedadId);

    if (!propiedad) {
        console.error('No se encontró la propiedad');
        return;
    }

    if (propiedad.reservada) {
        alert("Esta propiedad ya se encuentra reservada");
        return;
    }

    // Preguntar al usuario si está seguro de realizar la reserva
    const confirmacion = confirm('¿Estás seguro de que deseas realizar esta reserva?');
    if (!confirmacion) {
        return; // Si el usuario cancela, no se realiza la reserva
    }

    const usuario = localStorage.getItem('usuario');
    const datosReserva = prepararDatosReserva(propiedad, usuario);

    const actualizacionExitosa = await reservarPropiedad(propiedad);
    if (!actualizacionExitosa) return;

    const reservaExitosa = await crearComprobante(datosReserva);
    if (reservaExitosa) {
        alert('Reserva realizada con éxito');
        window.location.href = 'reservas.html';
    }
}

function obtenerPropiedadId() {
    let searchParams = decodeURIComponent(window.location.search);
    searchParams = searchParams.replace(/\s+/g, '');
    const urlParams = new URLSearchParams(searchParams);
    const id = urlParams.get('id');
    console.log('id encontrado:', id);
    return id ? id.trim() : null;
}

function prepararDatosReserva(propiedad, usuario) {
    return {
        id_propiedad: propiedad.id,
        titulo_propiedad: propiedad.titulo,
        precio_propiedad: propiedad.precio,
        fecha_reserva: formatearFecha(new Date()),
        nombre_usuario: usuario,
    };
}


async function reservarPropiedad(propiedad) {
    propiedad.reservada = true;

    try {
        const respuestaActualizacion = await axios.put(
            `${BASE_URL}/propiedades/actualizarPropiedad/${propiedad.id}`,
            propiedad // El objeto propiedad se envía como el cuerpo de la petición
        );

        // Cambiar respuesta a respuestaActualizacion aquí
        if (respuestaActualizacion.status === 200) {
            return true;
        } else {
            console.error('Error al actualizar la propiedad:', respuestaActualizacion.data);
            throw new Error('No se pudo actualizar el estado de la propiedad.');
        }
    } catch (error) {
        console.error('Error al actualizar la propiedad:', error);
        alert(
            'Hubo un problema al actualizar la propiedad. Por favor, verifica los datos e intenta nuevamente.'
        );
        return false;
    }
}


async function crearComprobante(datosReserva) {
    try {
        const response = await axios.post(`${BASE_URL}/comprobantes/crearComprobante`, datosReserva, {
        });

        if (response.status === 201) {
            return true;
        } else {
            console.error('Error al crear el comprobante:', response.data);
            return false;
        }
    } catch (error) {
        console.error('Error al procesar la reserva:', error);
        alert('Hubo un problema al realizar la reserva. Inténtalo más tarde.');
        return false;
    }
}


function formatearFecha(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year} /${month}/${day} ${hours}:${minutes}:${seconds} `;
}

