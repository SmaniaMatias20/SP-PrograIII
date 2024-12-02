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
//#endregion

function navbarRender() {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificar el payload del JWT
      const userRole = decodedToken.rol;

      // Verificar el rol del usuario
      if (userRole === 'admin') {
        // Mostrar el panel de control solo si el rol es admin
        document.getElementById('contacto-link').style.display = 'none';
        document.getElementById('reservas-link').style.display = 'none';
        document.getElementById('panel-de-control-link').style.display = 'inline-block';
      } else {
        // Si no es admin, ocultar el panel de control
        document.getElementById('panel-de-control-link').style.display = 'none';
      }
    } catch (error) {
      console.error("Error al decodificar el token", error);
      window.location.href = 'index.html'; // Redirigir si ocurre un error en el token
    }
  } else {
    window.location.href = 'index.html'; // Redirigir si no hay token
  }
}
//#region General

document.addEventListener('DOMContentLoaded', async function () {
  // Tercer bloque (Inicialización de otras páginas)
  eventListeners();
  darkMode();

  const isListaPropiedades = document.querySelector(".contenedor-anuncios") && window.location.pathname.includes("anuncios.html");

  if (window.location.pathname.includes("blog.html")) {
    mostrarArticulos();
  }

  if (window.location.pathname.includes("reservas.html")) {
    const usuario = localStorage.getItem("usuario");
    console.log(usuario);
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
      paginaActual = 1; // Reiniciar a la primera
      await mostrarPropiedadesFiltradas(propiedadesFiltradas);
    });
  }

  if (window.location.pathname.includes("propiedad.html")) {

    navbarRender();

    // Recuperar el ID de la propiedad desde el almacenamiento local
    const propiedadId = localStorage.getItem('propiedadId');

    if (propiedadId) {
      // Obtener los detalles de la propiedad usando su ID
      const propiedad = await obtenerPropiedadPorId(propiedadId);

      if (propiedad) {
        // Llamar a la función para mostrar la propiedad en el HTML
        await mostrarPropiedad(propiedad);
        document.getElementById('filtrar-btn').addEventListener('click', async () => {
          const propiedades = await obtenerPropiedades();
          const propiedadesFiltradas = filtrarPropiedades(propiedades);
          paginaActual = 1; // Reiniciar a la primera
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


    const formUsuario = document.getElementById('form-usuario');
    const btnCancelar = document.getElementById('btn-cancelar');
    const btnCrearUsuario = document.getElementById('crear-usuario-btn');

    // Mostrar el formulario cuando se hace clic en "Crear Usuario"
    btnCrearUsuario.addEventListener('click', function () {
      formUsuario.style.display = 'block';
    });

    // Cerrar el formulario y resetear al hacer clic en "Cancelar"
    btnCancelar.addEventListener('click', function () {
      formUsuario.style.display = 'none'; // Ocultar el formulario
      formUsuario.reset(); // Limpiar el formulario
      document.getElementById('usuario-id').value = ''; // Resetear el campo oculto de ID
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
