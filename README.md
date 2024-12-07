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

## Integrantes
![Desarrollador](https://img.icons8.com/color/48/000000/developer.png) Peña Enzo (Desarrollador)  
![Desarrollador](https://img.icons8.com/color/48/000000/developer.png) Smania Matías (Desarrollador)

## Tecnologías Utilizadas

### Frontend
![Axios](https://img.shields.io/badge/axios-%23232B34.svg?style=for-the-badge&logo=axios&logoColor=white) ![Zod](https://img.shields.io/badge/zod-%23000000.svg?style=for-the-badge&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![HTML](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

- **Axios**: Biblioteca para realizar solicitudes HTTP.
- **Zod**: Biblioteca para validaciones de datos y esquemas.
- **HTML**: Lenguaje de marcado utilizado para estructurar el contenido web.
- **CSS**: Lenguaje de estilo que define la presentación del contenido web (colores, fuentes, disposición, etc.).
- **Bootstrap**: Framework CSS popular para crear sitios web y aplicaciones móviles responsivas y con un diseño atractivo sin mucho esfuerzo.

### Backend
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![SQLite](https://img.shields.io/badge/sqlite-%2307405E.svg?style=for-the-badge&logo=sqlite&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Express](https://img.shields.io/badge/express-%23404D59.svg?style=for-the-badge&logo=express&logoColor=white) ![Sequelize](https://img.shields.io/badge/sequelize-%23000000.svg?style=for-the-badge&logo=sequelize&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-%2321C7C1.svg?style=for-the-badge&logo=json-web-token&logoColor=white) ![Zod](https://img.shields.io/badge/zod-%23000000.svg?style=for-the-badge&logoColor=white) ![Nodemailer](https://img.shields.io/badge/nodemailer-%23000.svg?style=for-the-badge&logo=npm&logoColor=white)

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework para Node.js que simplifica la creación de aplicaciones web y APIs.
- **SQLite**: Sistema de gestión de bases de datos liviano, embebido y basado en archivos, ideal para aplicaciones pequeñas o para desarrollo.
- **Sequelize**: ORM para Node.js que facilita la interacción con la base de datos.
- **JWT (JSON Web Token)**: Método para la autenticación de usuarios.
- **Zod**: Biblioteca para validaciones de datos y esquemas.
- **Nodemailer**: Librería para enviar correos electrónicos desde el backend.


## Herramientas

![Postman](https://img.shields.io/badge/postman-%23FF6C37.svg?style=for-the-badge&logo=postman&logoColor=white) ![DBeaver](https://img.shields.io/badge/dbeaver-%23000000.svg?style=for-the-badge&logoColor=white) 

- **Postman**: Herramienta para probar y documentar APIs.
- **DBeaver**: Herramienta de administración de bases de datos para gestionar y consultar PostgreSQL.

## Diseño conceptual de la DB
![Base](https://github.com/SmaniaMatias20/SP-PrograIII/blob/master/Front/build/src/readme/db.png) 

## Conclusión
El desarrollo del sitio web de bienes raíces fue un proceso enfocado en crear una experiencia de usuario intuitiva y funcional. La selección de elementos de diseño y las funcionalidades implementadas se basaron en las necesidades de los usuarios, garantizando que el sitio no solo sea atractivo, sino también útil y accesible.

## Observaciones

Cabe aclarar que existe una **versión alternativa del proyecto** realizada utilizando **MySQL** como base de datos. Sin embargo, decidimos realizar la entrega de este proyecto utilizando **SQLite** debido a que su archivo de base de datos puede ser fácilmente alojado en plataformas como **Render**. Esto nos permite ofrecer la página de forma accesible a través de un enlace de hosting, sin la necesidad de que los usuarios descarguen ningún archivo adicional. Esta característica facilita la implementación y el acceso remoto al proyecto.

En resumen, con SQLite, el sitio web puede ser utilizado directamente desde el enlace proporcionado, sin complicaciones adicionales para los usuarios finales.

## Inicio sesión / Registro

Para iniciar sesión como admin...

usuario: matias
contraseña: 123456789

Para iniciar sesión como usuario...

usuario: usuario
contraseña: 123456789

Cuenta con la posibilidad de registrarse si necesita.


