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

  document.querySelector(".dark-mode-boton").addEventListener("click", () => {
    document.body.classList.toggle("darkMode");
    if (document.body.classList.contains("darkMode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
  prefersDarkScheme.addEventListener("change", () => {
    prefersDarkScheme.matches
      ? document.body.classList.add("darkMode")
      : document.body.classList.remove("darkMode");
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
//#endregion

function navbarRender() {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userRole = decodedToken.rol;
      if (userRole === 'admin') {
        document.getElementById('contacto-link').style.display = 'none';
        document.getElementById('reservas-link').style.display = 'none';
        document.getElementById('panel-de-control-link').style.display = 'inline-block';
      } else {
        document.getElementById('panel-de-control-link').style.display = 'none';
      }
    } catch (error) {
      console.error("Error al decodificar el token", error);
      window.location.href = 'index.html';
    }
  } else {
    window.location.href = 'index.html';
  }
}
//#region General

document.addEventListener('DOMContentLoaded', async function () {
  eventListeners();
  darkMode();

  const isListaPropiedades = document.querySelector(".contenedor-anuncios") && window.location.pathname.includes("anuncios.html");

  if (window.location.pathname.includes("blog.html")) {
    mostrarArticulos();
  }

  if (window.location.pathname.includes("reservas.html")) {
    const usuario = localStorage.getItem("usuario");
    await obtenerComprobantesPorNombreUsuario(usuario);
  }

  if (window.location.pathname.includes("inicio.html")) {
    await mostrarArticulos(2);
    await mostrarPropiedades(3);
  }

  if (isListaPropiedades && window.location.pathname.includes("anuncios.html")) {
    mostrarPropiedades();
    document.getElementById('filtrar-btn').addEventListener('click', async () => {
      const propiedades = await obtenerPropiedades();
      const propiedadesFiltradas = filtrarPropiedades(propiedades);
      paginaActual = 1;
      await mostrarPropiedadesFiltradas(propiedadesFiltradas);
    });
  }

  if (window.location.pathname.includes("propiedad.html")) {
    navbarRender();
    const propiedadId = localStorage.getItem('propiedadId');

    if (propiedadId) {
      const propiedad = await obtenerPropiedadPorId(propiedadId);

      if (propiedad) {
        await mostrarPropiedad(propiedad);
        document.getElementById('filtrar-btn').addEventListener('click', async () => {
          const propiedades = await obtenerPropiedades();
          const propiedadesFiltradas = filtrarPropiedades(propiedades);
          paginaActual = 1;
          await mostrarPropiedadesFiltradas(propiedadesFiltradas);
        });
      } else {
        console.error('No se pudo obtener la propiedad');
      }
    } else {
      console.error('ID de propiedad no encontrado en el almacenamiento local');
    }
  }


  if (window.location.pathname.includes("panel.html")) {
    Promise.all([obtenerPropiedades(), obtenerArticulos(), obtenerUsuarios()])
      .then(([propiedades, articulos, usuarios]) => {
        crearTablaPropiedades(propiedades);
        crearTablaArticulos(articulos);
        crearTablaUsuarios(usuarios);
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });

    const formUsuario = document.getElementById('form-usuario');
    const btnCancelar = document.getElementById('btn-cancelar');
    const btnCrearUsuario = document.getElementById('crear-usuario-btn');

    btnCrearUsuario.addEventListener('click', function () {
      formUsuario.style.display = 'block';
    });

    btnCancelar.addEventListener('click', function () {
      formUsuario.style.display = 'none';
      formUsuario.reset();
      document.getElementById('usuario-id').value = '';
    });
  }

  const revealOptions = {
    duration: 1000,
    distance: '50px',
    easing: 'ease-in-out',
    delay: 100,
    interval: 200
  };

  ScrollReveal().reveal('main', revealOptions);
  ScrollReveal().reveal('section', revealOptions);

  navbarRender();
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
