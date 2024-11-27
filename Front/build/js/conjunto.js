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
/// Inicializa el mapa de Google Maps en la ubicación de la propiedad.
/// </summary>
/// <param name="ubicacion">La ubicación de la propiedad que se mostrará en el mapa.</param>
// /// <returns>Una promesa que se resuelve cuando el mapa ha sido inicializado.</returns>
// function initMap(location) {
//   return new Promise((resolve, reject) => {
//     if (typeof google !== 'undefined' && google.maps) {

//       const map = new google.maps.Map(document.getElementById("map"), {
//         center: location,
//         zoom: 15,
//       });
//       resolve(map);
//     } else {
//       reject(new Error("Google Maps API is not loaded"));
//     }
//   });
// }
//#endregion

//#region General

document.addEventListener('DOMContentLoaded', async function () {
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
    // Recuperar el ID de la propiedad desde el almacenamiento local
    const propiedadId = localStorage.getItem('propiedadId');

    if (propiedadId) {
      // Obtener los detalles de la propiedad usando su ID
      const propiedad = await obtenerPropiedadPorId(propiedadId);

      if (propiedad) {
        // Llamar a la función para mostrar la propiedad en el HTML
        mostrarPropiedad(propiedad);
        document.getElementById('filtrar-btn').addEventListener('click', async () => {
          const propiedades = await obtenerPropiedades();
          const propiedadesFiltradas = filtrarPropiedades(propiedades);
          paginaActual = 1; // Reiniciar a la primera
          mostrarPropiedadesFiltradas(propiedadesFiltradas);
        });
      } else {
        console.error('No se pudo obtener la propiedad');
      }
    } else {
      console.error('ID de propiedad no encontrado en el almacenamiento local');
    }
  }


  if (window.location.pathname.includes("panel.html")) {
    // Obtener propiedades, artículos y usuarios en paralelo
    Promise.all([obtenerPropiedades(), obtenerArticulos(), obtenerUsuarios()])
      .then(([propiedades, articulos, usuarios]) => {
        crearTablaPropiedades(propiedades);
        crearTablaArticulos(articulos);
        crearTablaUsuarios(usuarios); // Agregar usuarios a la tabla
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
