//#region Fetchs


// Función para obtener propiedades desde el backend y devolverlas
async function obtenerPropiedades() {
  try {
    // Realizar la solicitud HTTP usando axios
    const response = await axios.get('http://localhost:3000/propiedades/obtenerPropiedades', {
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
      <td>${propiedad.precio}</td>
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

  // <picture>
  // <source srcset="${propiedad.imagen}" type="image/jpeg" />
  // <img src="${propiedad.imagen}" alt="Imagen ${propiedad.titulo}" />
  // </picture>
  anuncio.innerHTML = `
    <div class="contenido-anuncios">
      <h3>${propiedad.titulo}</h3>
      <p>${resumirTexto(propiedad.descripcion, 50)}</p>  <!-- Limitar la descripción a 50 caracteres -->
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
      <a href="propiedad.html?id=${key}" class="boton-amarillo-block">Ver Propiedad</a>
    </div>
  `;

  return anuncio;
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




//#endregion















//#region Constantes

/* ARTÍCULOS */
const articulos = [
  {
    id: 1,
    titulo: 'Ideas para organizar tu hogar en espacios pequeños',
    fecha: '10/02/2024',
    autor: 'Tanoni Matias',
    contenido: 'Descubre cómo aprovechar cada rincón de tu casa con ingeniosas soluciones de almacenamiento y diseño. Desde estanterías flotantes hasta muebles multifuncionales, aprende a maximizar el espacio sin sacrificar estilo.',
    imagen: '../src/articulos/blog1.jpg',
  },
  {
    id: 2,
    titulo: 'Colores que serán tendencia en 2024 para tu hogar',
    fecha: '25/03/2024',
    autor: 'Palopolo Lujan',
    contenido: 'Te mostramos los colores que estarán en auge este año y cómo puedes incorporarlos en la decoración de tu hogar. Desde tonos cálidos y acogedores hasta colores fríos que aportan serenidad, descubre cómo elegir la paleta adecuada para cada espacio.',
    imagen: '../src/articulos/blog2.jpg',
  },
  {
    id: 3,
    titulo: 'Cómo crear un jardín interior en casa',
    fecha: '12/07/2024',
    autor: 'Smania Matias',
    contenido: 'Aprende a diseñar y mantener un pequeño jardín en el interior de tu hogar. Te enseñaremos sobre las plantas más adecuadas para espacios reducidos, el cuidado que requieren y consejos para la disposición ideal.',
    imagen: '../src/articulos/blog3.jpg',
  },
  {
    id: 4,
    titulo: 'Consejos para elegir los mejores muebles para tu sala',
    fecha: '03/10/2024',
    autor: 'Peña Enzo',
    contenido: 'Encuentra los muebles ideales para tu sala de estar con nuestros consejos prácticos. Descubre qué estilos se adaptan mejor a tu espacio y cómo seleccionar muebles que sean funcionales y estéticamente agradables.',
    imagen: '../src/articulos/blog4.jpg',
  },
];

// /* PROPIEDADES */
const propiedades = {
  1: {
    titulo: "Casa de lujo",
    imagen: "../src/anuncios/anuncio1/propiedad.jpg",
    imagenesInterior: [
      "../src/anuncios/anuncio1/cocina.jpg",
      "../src/anuncios/anuncio1/baño.jpg",
      "../src/anuncios/anuncio1/dormitorio.jpg"
    ],
    descripcion: "Descubre esta impresionante casa de lujo con vistas espectaculares al lago y acabados de alta gama en cada rincón. La propiedad cuenta con un diseño moderno y elegante, ofreciendo una combinación perfecta de confort y exclusividad. Los amplios ventanales permiten la entrada de abundante luz natural, resaltando la sofisticación de los espacios interiores, que incluyen una cocina gourmet equipada con electrodomésticos de última generación, baños de mármol con duchas a ras de suelo, y dormitorios espaciosos con vestidores. En el exterior, encontrarás una gran terraza con zona de barbacoa, una piscina infinita con vista panorámica, y un jardín cuidadosamente diseñado. La casa también cuenta con un sistema de seguridad avanzado y domótica para control total de iluminación, temperatura y más desde tu dispositivo móvil.",
    precio: "$3,000,000",
    sanitarios: 3,
    estacionamientos: 5,
    dormitorios: 4,
    ubicacion: { lat: -34.6083, lng: -58.3732 },
  },
  2: {
    titulo: "Casa con balcón",
    imagen: "../src/anuncios/anuncio2/propiedad.jpg",
    imagenesInterior: [
      "../src/anuncios/anuncio2/cocina.jpg",
      "../src/anuncios/anuncio2/baño.jpg",
      "../src/anuncios/anuncio2/dormitorio.jpg"
    ],
    descripcion: "Vive en esta moderna casa que combina estilo y funcionalidad, ubicada en un vecindario tranquilo y accesible. Con un diseño contemporáneo y acabados de calidad, esta propiedad cuenta con un amplio balcón que se convierte en el espacio perfecto para relajarse y disfrutar de las vistas al jardín. La cocina está equipada con muebles de madera, encimeras de granito y electrodomésticos de última generación, ideal para los amantes de la cocina. Los dormitorios son luminosos y espaciosos, proporcionando un ambiente acogedor y privado, mientras que los baños están diseñados con un enfoque en el confort, incluyendo duchas modernas y acabados elegantes. La casa también cuenta con un jardín privado, perfecto para reuniones familiares o simplemente disfrutar de un día al aire libre. Además, su ubicación estratégica te permite acceder fácilmente a escuelas, supermercados y zonas recreativas.",
    precio: "$2,000,000",
    sanitarios: 3,
    estacionamientos: 3,
    dormitorios: 4,
    ubicacion: { lat: -34.5889, lng: -58.3962 },
  },
  3: {
    titulo: "Casa de verano",
    imagen: "../src/anuncios/anuncio3/propiedad.jpg",
    imagenesInterior: [
      "../src/anuncios/anuncio3/cocina.jpg",
      "../src/anuncios/anuncio3/baño.jpg",
      "../src/anuncios/anuncio3/dormitorio.jpg"
    ],
    descripcion: "Esta moderna casa, con acceso privado a la playa, es el refugio perfecto para quienes buscan disfrutar del sol y el mar en un entorno exclusivo. Con un diseño elegante y funcional, la casa cuenta con amplias ventanas que permiten la entrada de luz natural, creando un ambiente cálido y acogedor. La cocina, equipada con electrodomésticos de alta gama y un diseño contemporáneo, se integra perfectamente con el salón, que ofrece vistas panorámicas al océano. Los dormitorios son ideales para descansar después de un día en la playa, y el baño principal cuenta con una ducha de lujo y acabados de calidad. Además, la propiedad incluye un pequeño jardín y una terraza, perfectos para disfrutar de comidas al aire libre o relajarse mientras se escucha el sonido de las olas. Ubicada en una zona tranquila, esta casa es una oportunidad única para vivir la experiencia de una vida costera, cerca de restaurantes, tiendas y actividades recreativas.",
    precio: "$4,500,000",
    sanitarios: 2,
    estacionamientos: 1,
    dormitorios: 3,
    ubicacion: { lat: -34.5880, lng: -58.4072 },
  },
  4: {
    titulo: "Casa moderna",
    imagen: "../src/anuncios/anuncio4/propiedad.jpg",
    imagenesInterior: [
      "../src/anuncios/anuncio4/cocina.jpg",
      "../src/anuncios/anuncio4/baño.jpg",
      "../src/anuncios/anuncio4/dormitorio.jpg"
    ],
    descripcion: "Sumérgete en la vida urbana con esta moderna casa, diseñada para quienes buscan la combinación perfecta entre estilo y comodidad. Con una fachada contemporánea que destaca en el vecindario, esta propiedad cuenta con amplios espacios abiertos que facilitan la convivencia. La cocina, equipada con electrodomésticos de última generación y acabados de alta calidad, se integra perfectamente con el salón, creando un ambiente ideal para el entretenimiento. Los cinco dormitorios, todos con armarios empotrados, ofrecen el espacio necesario para una familia en crecimiento. Los cuatro sanitarios, que incluyen un baño principal con bañera y ducha separadas, garantizan comodidad y privacidad. Además, disfrutarás de un jardín privado donde podrás relajarte o recibir a amigos y familiares. Esta casa no solo es un hogar, sino un estilo de vida que te permite disfrutar de todas las ventajas de la vida urbana, con fácil acceso a tiendas, restaurantes y parques. ¡No pierdas la oportunidad de vivir en un lugar que redefine el concepto de modernidad y confort!",
    precio: "$4,200,000",
    sanitarios: 4,
    estacionamientos: 2,
    dormitorios: 5,
    ubicacion: { lat: -34.6170, lng: -58.3643 },
  },
  5: {
    titulo: "Casa minimalista",
    imagen: "../src/anuncios/anuncio5/propiedad.jpg",
    imagenesInterior: [
      "../src/anuncios/anuncio5/cocina.jpg",
      "../src/anuncios/anuncio5/baño.jpg",
      "../src/anuncios/anuncio5/dormitorio.jpg"
    ],
    descripcion: "Disfruta de la tranquilidad en esta propiedad minimalista, donde la simplicidad se encuentra con la elegancia. Diseñada para ofrecer un ambiente sereno y despejado, esta casa destaca por sus líneas limpias y su uso inteligente del espacio. La cocina, con su diseño funcional y moderno, es perfecta para preparar comidas en un entorno que promueve la calma y la concentración. Los tres dormitorios son luminosos y acogedores, proporcionando un refugio ideal para descansar y recargar energías. Cada uno cuenta con grandes ventanales que permiten la entrada de luz natural y ofrecen vistas al jardín, creando una conexión armoniosa con el entorno. Los tres sanitarios están diseñados con acabados de calidad y un estilo contemporáneo que refleja la estética minimalista de la casa. La propiedad también incluye un espacio exterior privado, perfecto para disfrutar de momentos de paz o para socializar en un ambiente íntimo. Ubicada en una zona tranquila, esta casa no solo es un hogar, sino un santuario donde la vida cotidiana se siente más relajada y equilibrada. ¡Descubre la belleza de vivir con menos y disfrutar de lo esencial!",
    precio: "$3,800,000",
    sanitarios: 3,
    estacionamientos: 2,
    dormitorios: 3,
    ubicacion: { lat: -34.5733, lng: -58.4391 },
  },
  6: {
    titulo: "Casa con alberca",
    imagen: "../src/anuncios/anuncio6/propiedad.jpg",
    imagenesInterior: [
      "../src/anuncios/anuncio6/cocina.jpg",
      "../src/anuncios/anuncio6/baño.jpg",
      "../src/anuncios/anuncio6/dormitorio.jpg"
    ],
    descripcion: "Aprovecha esta excelente oportunidad de adquirir una casa con alberca, donde el lujo y la comodidad se encuentran en perfecta armonía. Esta impresionante propiedad cuenta con una amplia alberca rodeada de un hermoso jardín, ideal para disfrutar de días soleados y organizar reuniones con familiares y amigos. La cocina, moderna y completamente equipada, es un sueño para cualquier amante de la gastronomía, con suficiente espacio para preparar deliciosas comidas y disfrutar de momentos inolvidables. Los cuatro dormitorios son espaciosos y están diseñados para maximizar el confort, ofreciendo un refugio acogedor para descansar después de un largo día. Cada dormitorio tiene vistas al jardín, creando un ambiente de tranquilidad y serenidad. Los tres sanitarios están equipados con acabados contemporáneos y toques de elegancia, lo que añade un valor adicional a la propiedad. Esta casa es perfecta para quienes buscan un estilo de vida activo y relajado, donde la diversión y el descanso coexisten. Con estacionamiento para tres vehículos, la comodidad está garantizada. No pierdas la oportunidad de vivir en este oasis privado, donde cada día puede sentirse como vacaciones.",
    precio: "$3,000,000",
    sanitarios: 3,
    estacionamientos: 3,
    dormitorios: 4,
    ubicacion: { lat: -34.6132, lng: -58.3733 },
  },
  7: {
    titulo: "Casa con pileta",
    imagen: "../src/anuncios/anuncio6/propiedad.jpg",
    imagenesInterior: [
      "../src/anuncios/anuncio6/cocina.jpg",
      "../src/anuncios/anuncio6/baño.jpg",
      "../src/anuncios/anuncio6/dormitorio.jpg"
    ],
    descripcion: "Descubre esta maravillosa casa con pileta, un refugio ideal para aquellos que buscan un estilo de vida relajante y lujoso. Esta propiedad está diseñada para disfrutar de momentos inolvidables en compañía de amigos y familiares, con una amplia pileta que invita a refrescarse en los días calurosos. La zona exterior está rodeada de un hermoso jardín, perfecto para organizar barbacoas o simplemente relajarse al sol. La moderna cocina, equipada con electrodomésticos de alta gama, ofrece un espacio amplio y funcional para cocinar y compartir deliciosas comidas. Los cuatro dormitorios son luminosos y espaciosos, cada uno diseñado para proporcionar el máximo confort y tranquilidad, asegurando un descanso reparador. Con tres sanitarios contemporáneos que combinan estilo y funcionalidad, la comodidad está garantizada para todos los residentes y visitantes. La casa también incluye espacio de estacionamiento para tres vehículos, asegurando que nunca te falte lugar para tus coches. Esta es una oportunidad única para adquirir un hogar que no solo es una inversión, sino un lugar donde crear recuerdos duraderos. No dejes pasar la oportunidad de vivir en este maravilloso espacio que combina modernidad y naturaleza.",
    precio: "$3,000,000",
    sanitarios: 3,
    estacionamientos: 3,
    dormitorios: 4,
    ubicacion: { lat: -34.6132, lng: -58.3733 },
  },
};
//#endregion

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
/// Resume un texto a una longitud máxima especificada.
/// </summary>
/// <param name="texto">El texto que se va a resumir.</param>
/// <param name="longitudMaxima">La longitud máxima del texto resumido.</param>
/// <returns>El texto resumido, añadiendo "..." si es necesario.</returns>
function resumirTexto(texto, longitudMaxima) {
  return texto.length > longitudMaxima
    ? texto.substring(0, longitudMaxima) + '...'
    : texto;
}


//#region  Propiedades
/// <summary>
/// Carga las propiedades en el contenedor especificado.
/// </summary>
/// <param name="limite">Número máximo de propiedades a cargar.</param>

// let paginaActual = 1;
// const itemsPorPagina = 6;
// function cargarPropiedades(limite = Object.keys(propiedades).length) {
//   const contenedor = document.querySelector(".contenedor-anuncios");

//   // Verificar si el contenedor existe en el DOM
//   if (!contenedor) {
//     console.error('El contenedor de anuncios no se encontró.');
//     return; // Salir si no existe el contenedor
//   }

//   // Verificar si el objeto propiedades está correctamente inicializado
//   if (!propiedades || Object.keys(propiedades).length === 0) {
//     console.error('El objeto "propiedades" está vacío o no definido.');
//     return; // Salir si no hay propiedades
//   }

//   contenedor.innerHTML = ""; // Limpiar las propiedades anteriores

//   const longitudMaximaDescripcion = 50; // Longitud máxima de la descripción
//   const totalPropiedades = Object.keys(propiedades).length;
//   const totalPaginas = Math.ceil(totalPropiedades / itemsPorPagina);

//   // Verificar los valores de paginación
//   const primerIndice = (paginaActual - 1) * itemsPorPagina;
//   const ultimoIndice = Math.min(primerIndice + itemsPorPagina, limite);

//   Object.keys(propiedades).slice(primerIndice, ultimoIndice).forEach(key => {
//     const propiedad = propiedades[key];
//     const anuncio = document.createElement('div');
//     anuncio.classList.add('anuncio');

//     anuncio.innerHTML = `
//       <picture>
//         <source srcset="${propiedad.imagen}" type="image/jpeg" />
//         <img src="${propiedad.imagen}" alt="Imagen ${propiedad.titulo}" />
//       </picture>
//       <div class="contenido-anuncios">
//         <h3>${propiedad.titulo}</h3>
//         <p>${resumirTexto(propiedad.descripcion, longitudMaximaDescripcion)}</p>
//         <p class="precio">${propiedad.precio}</p>
//         <ul class="iconos-caracteristicas">
//           <li>
//             <img class="icono" loading="lazy" src="../src/iconos/icono_wc.svg" alt="icono_wc" />
//             <p>${propiedad.sanitarios}</p>
//           </li>
//           <li>
//             <img class="icono" loading="lazy" src="../src/iconos/icono_estacionamiento.svg" alt="icono_estacionamiento" />
//             <p>${propiedad.estacionamientos}</p>
//           </li>
//           <li>
//             <img class="icono" loading="lazy" src="../src/iconos/icono_dormitorio.svg" alt="icono_dormitorio" />
//             <p>${propiedad.dormitorios}</p>
//           </li>
//         </ul>
//         <a href="propiedad.html?id=${key}" class="boton-amarillo-block">Ver Propiedad</a>
//       </div>
//     `;

//     contenedor.appendChild(anuncio);
//   });

//   mostrarPaginacion(totalPaginas);
// }

// function mostrarPaginacion(totalPaginas) {
//   const paginacionContenedor = document.querySelector(".contenedor-paginacion");

//   // Verificar si el contenedor existe antes de intentar manipularlo
//   if (!paginacionContenedor) {
//     return;
//   }

//   paginacionContenedor.innerHTML = ""; // Limpiar la paginación anterior

//   // Botón "Anterior" con flecha
//   const botonAnterior = document.createElement("button");
//   botonAnterior.innerHTML = `<i class="bi bi-arrow-left"></i>`; // Ícono de flecha izquierda
//   botonAnterior.classList.add("boton-paginacion");
//   botonAnterior.disabled = (paginaActual === 1); // Deshabilitar si estamos en la primera página
//   botonAnterior.addEventListener("click", () => {
//     if (paginaActual > 1) {
//       paginaActual--;
//       cargarPropiedades(); // Cargar las propiedades de la página anterior
//     }
//   });
//   paginacionContenedor.appendChild(botonAnterior);

//   // Botón "Siguiente" con flecha
//   const botonSiguiente = document.createElement("button");
//   botonSiguiente.innerHTML = `<i class="bi bi-arrow-right"></i>`; // Ícono de flecha derecha
//   botonSiguiente.classList.add("boton-paginacion");
//   botonSiguiente.disabled = (paginaActual === totalPaginas); // Deshabilitar si estamos en la última página
//   botonSiguiente.addEventListener("click", () => {
//     if (paginaActual < totalPaginas) {
//       paginaActual++;
//       cargarPropiedades(); // Cargar las propiedades de la siguiente página
//     }
//   });
//   paginacionContenedor.appendChild(botonSiguiente);
// }

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

//#region  Articulos
/// <summary>
/// Carga los artículos en la lista según la página actual.
/// </summary>
/// <param name="limite">Número máximo de artículos a cargar.</param>
function cargarArticulos(limite = articulos.length) {
  const longitudMaximaDescripcion = 30; // Longitud máxima de la descripción

  let contenedor;
  const enInicio = window.location.pathname.includes("inicio.html");

  if (window.location.pathname.includes("blog.html")) {
    contenedor = document.querySelector("main.contenedor");
  } else if (enInicio) {
    contenedor = document.querySelector("section.contenedor");
  }

  articulos.slice(0, limite).forEach(articulo => {
    const article = document.createElement('article');
    article.classList.add('entrada-blog');

    const contenidoTexto = enInicio
      ? resumirTexto(articulo.contenido, longitudMaximaDescripcion)
      : articulo.contenido;

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
}

//#region Reservas
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
          <p><strong>${item.titulo}</strong> - ${item.dormitorios} Dormitorios</p>
          <p>Descripción: ${resumirTexto(item.descripcion, longitudMaximaDescripcion)}</p>
          <p>Precio: ${item.precio}</p>
          <p>Baños: ${item.sanitarios}, Estacionamientos: ${item.estacionamientos}</p>
          <button class="boton-rojo eliminar-reserva" data-index="${index}">Eliminar de reservas</button>
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
    cargarArticulos();
  } else if (window.location.pathname.includes("inicio.html")) {
    cargarArticulos(2);
    //cargarPropiedades(3);
    mostrarPropiedades(3);
  }

  if (isListaPropiedades && window.location.pathname.includes("anuncios.html")) {
    // cargarPropiedades();
    mostrarPropiedades(); // Mostrar propiedades cuando la página cargue
  } else if (window.location.pathname.includes("propiedad.html")) {
    cargarPropiedad();
  }

  if (window.location.pathname.includes("panel.html")) {
    // Obtener las propiedades desde el backend
    obtenerPropiedades()
      .then(propiedades => {
        // Llamar a la función para crear la tabla con los datos obtenidos
        crearTablaPropiedades(propiedades);
      })
      .catch(error => {
        console.error('Error al obtener las propiedades:', error);
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
      document.getElementById('panel-de-control-link').style.display = 'inline-block';
    } else {
      document.getElementById('panel-de-control-link').style.display = 'none';
    }
  } else {
    window.location.href = 'login.html';
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
