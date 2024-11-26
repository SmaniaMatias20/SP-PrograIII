/// <summary>
/// Calcula el año actual y lo muestra en el elemento con id "year".
/// </summary>
var yearElement = document.getElementById("year");
var currentYear = new Date().getFullYear();
yearElement.textContent = currentYear;

//#region  DarkMode
/// <summary>
/// Configura el modo oscuro de la aplicación basado en la preferencia del usuario.
/// </summary>
function darkMode() {
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  //Guardo en el almacenamiento local del navegador la preferencia de tema de usuario
  const userPreference = localStorage.getItem("theme");
  if (userPreference) {
    if (userPreference === "dark") {
      document.body.classList.add("darkMode");
    } else {
      document.body.classList.remove("darkMode");
    }
  } else {
    prefersDarkScheme.matches
      ? document.body.classList.add("darkMode")
      : document.body.classList.remove("darkMode");

  }

  // Listener para el boton de cambiar de modo
  document.querySelector(".dark-mode-boton").addEventListener("click", () => {
    document.body.classList.toggle("darkMode");
    // Guardar la preferencia del usuario en localStorage
    if (document.body.classList.contains("darkMode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
  // se fija en si se cambia de tema
  prefersDarkScheme.addEventListener("change", () => {
    prefersDarkScheme.matches
      ? document.body.classList.add("darkMode")
      : document.body.classList.remove("darkMode");
    // Actualizar el localStorage
    if (prefersDarkScheme.matches) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
}
//#endregion

/// <summary>
/// Configura los eventos para el menú móvil.
/// </summary>
function eventListeners() {
  document
    .querySelector(".mobile-menu")
    .addEventListener("click", toggleNavigation);
}

/// <summary>
/// Alterna la visibilidad del menú de navegación en dispositivos móviles.
/// </summary>
function toggleNavigation() {
  document.querySelector(".navegacion").classList.toggle("mostrar");
}




/// <summary>
/// Carga la propiedad desde los parámetros de la URL y actualiza la interfaz de usuario.
/// </summary>
async function cargarPropiedad() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (propiedades[id]) {
    const propiedad = propiedades[id];

    // Update property details in the DOM
    document.getElementById("titulo-propiedad").textContent = propiedad.titulo;
    document.getElementById("descripcion-propiedad").textContent = propiedad.descripcion;
    document.getElementById("precio-propiedad").textContent = propiedad.precio;
    document.getElementById("sanitarios").textContent = propiedad.sanitarios;
    document.getElementById("estacionamientos").textContent = propiedad.estacionamientos;
    document.getElementById("dormitorios").textContent = propiedad.dormitorios;

    // Set interior images in the carousel
    const imagenesInterior = propiedad.imagenesInterior;
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.innerHTML = ''; // Clear previous content

    imagenesInterior.forEach((imagen, index) => {
      const item = document.createElement('div');
      item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
      const img = document.createElement('img');
      img.src = imagen;
      img.alt = `Imagen Interior ${index + 1}`;
      img.className = 'img-fluid mb-4';
      item.appendChild(img);
      carouselInner.appendChild(item);
    });

    // Initialize the map asynchronously
    try {
      await inicializarMapa(propiedad.ubicacion); // Await the asynchronous map initialization
    } catch (error) {
      console.error("Error al inicializar el mapa:", error);
      document.body.innerHTML = "<h1 class='text-center'>Error al cargar el mapa</h1>";
    }
  } else {
    document.body.innerHTML = "<h1 class='text-center'>Propiedad no encontrada</h1>";
  }
}

/// <summary>
/// Inicializa el mapa de Google Maps en la ubicación de la propiedad.
/// </summary>
/// <param name="ubicacion">La ubicación de la propiedad que se mostrará en el mapa.</param>
/// <returns>Una promesa que se resuelve cuando el mapa ha sido inicializado.</returns>
function inicializarMapa(location) {
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
//#endregion

//#region General

document.addEventListener('DOMContentLoaded', function () {
  // Primer bloque (Reserva de propiedad)
  const reservaButton = document.getElementById('btn-reserva');

  if (reservaButton) {
    reservaButton.addEventListener('click', function () {
      const propiedad = {
        titulo: document.getElementById('titulo-propiedad').textContent,
        descripcion: document.getElementById('descripcion-propiedad').textContent,
        precio: document.getElementById('precio-propiedad').textContent,
        sanitarios: document.getElementById('sanitarios').textContent,
        estacionamientos: document.getElementById('estacionamientos').textContent,
        dormitorios: document.getElementById('dormitorios').textContent
        //usuarioReserva:localStorage.getItem();
      };

      let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

      reservas.push(propiedad);

      localStorage.setItem('reservas', JSON.stringify(reservas));

      window.location.href = 'reservas.html';
    });
  }

  // Segundo bloque (Mostrar reservas)
  const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
  const longitudMaximaDescripcion = 70;
  const listaReservas = document.querySelector('.lista-reservas');

  if (listaReservas) {
    if (reservas.length > 0) {
      reservas.forEach((item, index) => {
        const reservaItem = document.createElement('div');
        reservaItem.classList.add('favorito-item');
        reservaItem.innerHTML = `
          <div class="contenido-anuncios">
          <h3>${item.titulo}</h3>
          <p>${resumirTexto(item.descripcion, longitudMaximaDescripcion)}</p>
          <p class="precio">${item.precio}</p>
          <ul class="iconos-caracteristicas">
            <li>
              <img class="icono" loading="lazy" src="../src/iconos/icono_wc.svg" alt="icono_wc" />
              <p>${item.sanitarios}</p>
            </li>
            <li>
              <img class="icono" loading="lazy" src="../src/iconos/icono_estacionamiento.svg" alt="icono_estacionamiento" />
              <p>${item.estacionamientos}</p>
            </li>
            <li>
              <img class="icono" loading="lazy" src="../src/iconos/icono_dormitorio.svg" alt="icono_dormitorio" />
              <p>${item.dormitorios}</p>
            </li>
          </ul>
          <a href="contacto.html" class="boton-verde">Contactar</a>
          <a href="/generar-pdf" class="boton-azul">Descargar Comprobante</a>
          <button class="boton-rojo eliminar-reserva" data-index="${index}">Eliminar</button>
        </div>
        `;

        listaReservas.appendChild(reservaItem);
      });

      // Eliminar reserva
      document.querySelectorAll('.eliminar-reserva').forEach(button => {
        button.addEventListener('click', function () {
          const index = this.getAttribute('data-index');

          reservas.splice(index, 1);
          localStorage.setItem('reservas', JSON.stringify(reservas));

          this.parentElement.remove();

          if (reservas.length === 0) {
            listaReservas.innerHTML = '<p>No hay ninguna reserva en este momento.</p>';
          }
        });
      });
    } else {
      listaReservas.innerHTML = '<p>No hay ninguna reserva en este momento.</p>';
    }
  }

  // Tercer bloque (Inicialización de otras páginas)
  eventListeners();
  darkMode();

  const isListaPropiedades = document.querySelector(".contenedor-anuncios") && window.location.pathname.includes("anuncios.html");

  if (window.location.pathname.includes("blog.html")) {
    mostrarArticulos();
  } else if (window.location.pathname.includes("inicio.html")) {
    mostrarArticulos(2);
    mostrarPropiedades(3);
  }

  if (isListaPropiedades && window.location.pathname.includes("anuncios.html")) {
    mostrarPropiedades();
  } else if (window.location.pathname.includes("propiedad.html")) {
    cargarPropiedad();
  }

  if (window.location.pathname.includes("panel.html")) {
    // Obtener propiedades y artículos en paralelo
    Promise.all([obtenerPropiedades(), obtenerArticulos()])
      .then(([propiedades, articulos]) => {
        crearTablaPropiedades(propiedades);
        crearTablaArticulos(articulos);
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
  }

  // Cuarto bloque (ScrollReveal para animaciones)
  const revealOptions = {
    duration: 1000,
    distance: '50px',
    easing: 'ease-in-out',
    delay: 100, // Delay de 100 ms antes de iniciar la animación
    interval: 200 // Animación con un intervalo de 200 ms entre elementos
  };

  ScrollReveal().reveal('main', revealOptions);
  ScrollReveal().reveal('section', revealOptions);

  // Quinto bloque (Verificación de token y rol de usuario)
  const token = localStorage.getItem('token');

  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificamos la parte del payload del JWT
    const userRole = decodedToken.rol;

    if (userRole === 'admin') {
      document.getElementById('contacto-link').style.display = 'none';
      document.getElementById('reservas-link').style.display = 'none';
      document.getElementById('panel-de-control-link').style.display = 'inline-block';
    } else {
      document.getElementById('panel-de-control-link').style.display = 'none';
    }
  } else {
    window.location.href = 'index.html';
  }
});

//#region Cupones
/// <summary>
/// Configura los eventos para generar cupones de descuento.
/// </summary>
document.querySelectorAll('.generar-cupon').forEach(boton => {
  boton.addEventListener('click', function () {
    const cupon = 'CUPON-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    this.nextElementSibling.textContent = 'Tu código de cupón: ' + cupon;
    alert('Cupón generado: ' + cupon);
  });
});

//#endregion
