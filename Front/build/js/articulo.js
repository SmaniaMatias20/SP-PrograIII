async function obtenerArticulos() {
    try {
        const response = await axios.get('http://localhost:3000/articulos/obtenerArticulos', {
            //const response = await axios.get('https://sp-prograiii-fj7g.onrender.com/articulos/obtenerArticulos', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        const articulos = response.data;
        console.log(articulos);
        return articulos;
    } catch (error) {
        console.error('Error al obtener los artículos:', error);
        return [];
    }
}

function crearTablaArticulos(articulos) {
    const tablaArticulos = document.getElementById('tabla-articulos').getElementsByTagName('tbody')[0];
    tablaArticulos.innerHTML = '';

    articulos.forEach(articulo => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${articulo.titulo}</td>
            <td>${articulo.autor}</td>
            <td>${articulo.contenido || 'Sin descripción'}</td>
            <td>${new Date(articulo.fecha).toLocaleDateString()}</td> <!-- Convertir la fecha en formato legible -->
        `;
        tablaArticulos.appendChild(fila);
    });
}

async function cargarArticulos(limite = 4) {
    const longitudMaximaDescripcion = 30;

    const contenedor = document.getElementById('articulos');

    try {
        const articulos = await obtenerArticulos();
        const articulosLimitados = articulos.slice(0, limite);
        contenedor.innerHTML = '';

        articulosLimitados.forEach(articulo => {
            const article = document.createElement('article');
            article.classList.add('entrada-blog');
            const contenidoTexto = resumirTexto(articulo.contenido, longitudMaximaDescripcion);

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
            contenedor.appendChild(article);
        });
    } catch (error) {
        console.error('Error al cargar los artículos:', error);
    }
}

let paginaActualArticulos = 1;
const itemsPorPaginaArticulos = 3;

async function mostrarArticulos(cantidad = 4) {
    const articulos = await obtenerArticulos();
    const contenedor = document.getElementById('articulos');

    if (!contenedor) {
        console.error('El contenedor de artículos no se encontró.');
        return;
    }
    contenedor.innerHTML = '';
    const articulosMostrar = articulos.slice(0, cantidad);
    const totalArticulos = articulosMostrar.length;
    const totalPaginas = Math.ceil(totalArticulos / itemsPorPaginaArticulos);

    const primerIndice = (paginaActualArticulos - 1) * itemsPorPaginaArticulos;
    const ultimoIndice = Math.min(primerIndice + itemsPorPaginaArticulos, totalArticulos);

    articulosMostrar.slice(primerIndice, ultimoIndice).forEach((articulo) => {
        const article = document.createElement('article');
        article.classList.add('entrada-blog');
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
        contenedor.appendChild(article);
    });


    if (totalPaginas > 1) {
        mostrarPaginacionArticulos(totalPaginas);
    }
}

function mostrarPaginacionArticulos(totalPaginas) {
    const contenedorPaginacion = document.querySelector(".paginacion-articulos");
    contenedorPaginacion.innerHTML = "";

    const botonIzquierda = document.createElement("button");
    botonIzquierda.classList.add("pagina-btn", "flecha", "flecha-izquierda");
    botonIzquierda.disabled = paginaActualArticulos === 1;
    botonIzquierda.addEventListener("click", () => {
        if (paginaActualArticulos > 1) {
            paginaActualArticulos--;
            mostrarArticulos();
        }
    });
    contenedorPaginacion.appendChild(botonIzquierda);

    for (let i = 1; i <= totalPaginas; i++) {
        const botonPagina = document.createElement("button");
        botonPagina.textContent = i;
        botonPagina.classList.add("pagina-btn");

        if (i === paginaActualArticulos) {
            botonPagina.classList.add("activo");
        }

        botonPagina.addEventListener("click", () => {
            paginaActualArticulos = i;
            mostrarArticulos();
        });

        contenedorPaginacion.appendChild(botonPagina);
    }

    const botonDerecha = document.createElement("button");
    botonDerecha.classList.add("pagina-btn", "flecha", "flecha-derecha");
    botonDerecha.disabled = paginaActualArticulos === totalPaginas;
    botonDerecha.addEventListener("click", () => {
        if (paginaActualArticulos < totalPaginas) {
            paginaActualArticulos++;
            mostrarArticulos();
        }
    });
    contenedorPaginacion.appendChild(botonDerecha);
}

function resumirTexto(texto, longitudMaxima) {
    return texto.length > longitudMaxima
        ? texto.substring(0, longitudMaxima) + '...'
        : texto;
}
