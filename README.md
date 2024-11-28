# Documentación del Proceso de Desarrollo del Sitio Web de Bienes Raíces

## Introducción
Este documento describe el proceso de desarrollo del **sitio web de bienes raíces**, detallando las decisiones de diseño, selección de elementos y desarrollo de funcionalidades. El objetivo principal fue crear una plataforma intuitiva que permita a los usuarios buscar, explorar y obtener información sobre propiedades disponibles en el mercado. El proyecto ahora incluye **backend con Node.js**, utilizando **SQLite** como base de datos y **Zod** para las validaciones.

## Selección de Elementos para el Diseño

### 1. Estructura del Sitio
La estructura del sitio fue diseñada con un enfoque centrado en el usuario, asegurando una navegación sencilla y accesible. Se optó por un menú de navegación claro y bien organizado, que incluye las siguientes secciones:
- **Inicio**
- **Nosotros**
- **Anuncios**
- **Blog**
- **Reservas**
- **Contacto**
- **Panel** (Para administración del sitio)

### 2. Diseño Visual
El diseño visual del sitio se basa en una paleta de colores suave y profesional, con énfasis en la legibilidad y la estética. Se utilizaron los siguientes principios de diseño:
- **Tipografía**: Se seleccionaron fuentes claras y modernas para mejorar la legibilidad del contenido.
- **Imágenes**: Se incorporaron imágenes de alta calidad de las propiedades, asegurando que cada anuncio destaque visualmente. Las imágenes se optimizaron para garantizar tiempos de carga rápidos.

### 3. Responsive Design
Se utilizó **Bootstrap** como framework para asegurar que el sitio sea responsivo y se adapte a diferentes tamaños de pantalla. Esto permite una experiencia de usuario óptima en dispositivos móviles, tabletas y escritorios.

## Desarrollo de Funcionalidades

### 1. Búsqueda de Propiedades
La funcionalidad de búsqueda de propiedades permite a los usuarios visualizar todas las propiedades disponibles en el sitio. No se implementaron filtros para esta sección; en su lugar, se ofrece una vista general de todas las propiedades.

### 2. Mapa Interactivo
La integración de **Google Maps API** proporciona una representación visual de la ubicación de las propiedades. Los usuarios pueden ver los anuncios en un mapa interactivo, lo que facilita la búsqueda geográfica. La selección de esta funcionalidad se basó en la necesidad de mejorar la usabilidad y la interacción del usuario.

### 3. Detalles de Propiedades
Al hacer clic en un anuncio, los usuarios acceden a una página de detalles que incluye información extensa sobre la propiedad, como descripciones, imágenes y precios. Esta sección se diseñó para ofrecer toda la información necesaria en un solo lugar, optimizando la experiencia del usuario.

### 4. Blog
La sección de blog se creó para proporcionar contenido adicional sobre el mercado inmobiliario, ofreciendo consejos y tendencias. Esta funcionalidad no solo ayuda a mantener a los usuarios informados, sino que también mejora la visibilidad del sitio en motores de búsqueda a través de contenido relevante y actualizado.

### 5. Sección de Contacto
Se desarrolló un formulario de contacto que permite a los usuarios enviar consultas directamente a la empresa. Este formulario fue diseñado para ser simple y eficiente, garantizando que la comunicación entre los usuarios y la empresa sea fluida y efectiva.

### 6. Panel de Administración
El **Panel de Administración** es una nueva sección disponible en el navbar, accesible solo para los administradores del sitio. Esta solapa permite a los administradores gestionar el contenido del sitio, como:
- **Administrar anuncios**: Crear, editar o eliminar propiedades en venta.
- **Ver estadísticas**: Revisar visitas y métricas de las propiedades.
- **Gestionar usuarios**: Administrar los datos de los usuarios registrados.
  
El panel está protegido por autenticación, garantizando que solo los usuarios con permisos puedan acceder y realizar cambios en el sitio.

## Backend

### 1. Tecnologías Utilizadas
- **Node.js**: Para el desarrollo del backend.
- **SQLite**: Base de datos utilizada para almacenar la información de propiedades, usuarios y reservas.
- **Zod**: Biblioteca para las validaciones de datos en el backend.
  
### 2. Funcionalidades del Backend
- **API RESTful**: Comunicación entre el frontend y el backend para la gestión de propiedades, usuarios y reservas.
- **Autenticación y Autorización**: Permite gestionar las sesiones de los usuarios, asegurando que solo los administradores puedan acceder al panel de administración.
- **Validaciones con Zod**: Garantiza la validez de los datos antes de ser procesados.

## Integrantes
![Desarrollador](https://img.icons8.com/color/48/000000/developer.png) Peña Enzo (Desarrollador)  
![Desarrollador](https://img.icons8.com/color/48/000000/developer.png) Smania Matías (Desarrollador)

## Tecnologías Utilizadas
**Frontend**:  
![HTML](https://img.icons8.com/color/48/000000/html-5.png) HTML: Para la estructura del contenido.  
![CSS](https://img.icons8.com/color/48/000000/css3.png) CSS: Para el diseño y estilo de la interfaz.  
![JavaScript](https://img.icons8.com/color/48/000000/javascript.png) JavaScript: Para la lógica y funcionalidad de la aplicación.  

**Backend**:  
![Node.js](https://img.icons8.com/color/48/000000/nodejs.png) Node.js: Para el desarrollo del servidor backend.  
![SQLite](https://img.icons8.com/color/48/000000/sqlite.png) SQLite: Base de datos utilizada para gestionar la información.  
![Zod](https://img.icons8.com/color/48/000000/validation.png) Zod: Para la validación de datos.

**Frameworks y API**:  
![Bootstrap](https://img.icons8.com/color/48/000000/bootstrap.png) Bootstrap: Para un diseño responsivo y componentes estilizados.  
![Google Maps](https://img.icons8.com/color/48/000000/google-maps.png) Google Maps API: Para integrar funcionalidades de mapas y geolocalización.

## Conclusión
El desarrollo del sitio web de bienes raíces fue un proceso enfocado en crear una experiencia de usuario intuitiva y funcional. La selección de elementos de diseño y las funcionalidades implementadas se basaron en las necesidades de los usuarios, garantizando que el sitio no solo sea atractivo, sino también útil y accesible.

## Imágenes

### Sección Inicio... ![Inicio](https://img.icons8.com/color/48/000000/home.png)
![Inicio](https://github.com/SmaniaMatias20/PP-PrograIII/blob/matias/build/src/readme/inicio.png)

### Sección Nosotros... ![Nosotros](https://img.icons8.com/color/48/000000/teamwork.png)
![Nosotros](https://github.com/SmaniaMatias20/PP-PrograIII/blob/matias/build/src/readme/nosotros.png)

### Sección Anuncios... ![Anuncios](https://img.icons8.com/color/48/000000/sale.png)
![Anuncios](https://github.com/SmaniaMatias20/PP-PrograIII/blob/matias/build/src/readme/anuncios.png)

### Sección Blog... ![Blog](https://img.icons8.com/color/48/000000/blog.png)
![Blog](https://github.com/SmaniaMatias20/PP-PrograIII/blob/matias/build/src/readme/blog.png)

### Sección Contacto... ![Contacto](https://img.icons8.com/color/48/000000/email.png)
![Contacto](https://github.com/SmaniaMatias20/PP-PrograIII/blob/matias/build/src/readme/contacto.png)



## Observaciones

Cabe aclarar que existe una **versión alternativa del proyecto** realizada utilizando **MySQL** como base de datos. Sin embargo, decidimos realizar la entrega de este proyecto utilizando **SQLite** debido a que su archivo de base de datos puede ser fácilmente alojado en plataformas como **Render**. Esto nos permite ofrecer la página de forma accesible a través de un enlace de hosting, sin la necesidad de que los usuarios descarguen ningún archivo adicional. Esta característica facilita la implementación y el acceso remoto al proyecto.

En resumen, con SQLite, el sitio web puede ser utilizado directamente desde el enlace proporcionado, sin complicaciones adicionales para los usuarios finales.


