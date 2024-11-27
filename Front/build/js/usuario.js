// Función para obtener usuarios desde el backend y devolverlos
async function obtenerUsuarios() {
    try {
        // Realizar la solicitud HTTP usando axios
        console.log("holaaaaa");
        const response = await axios.get('http://localhost:3000/usuarios/obtenerUsuarios', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Agregar el token de autenticación si es necesario
            }
        });
        // Obtener los datos de la respuesta
        const usuarios = response.data; // Asegúrate de que el backend devuelva datos con las claves correctas
        console.log(usuarios);

        // Retornar los usuarios obtenidos
        return usuarios;

    } catch (error) {
        console.error('Error al obtener los usuarios:', error);

        // Si ocurre un error, retornar un arreglo vacío
        return [];
    }
}

// Función para crear la tabla con los usuarios
function crearTablaUsuarios(usuarios) {
    const tablaUsuarios = document.getElementById('tabla-usuarios');
    if (!tablaUsuarios) {
        console.error("Elemento 'tabla-usuarios' no encontrado en el DOM");
        return;
    }

    const tbody = tablaUsuarios.getElementsByTagName('tbody')[0];
    if (!tbody) {
        console.error("Elemento 'tbody' no encontrado dentro de 'tabla-usuarios'");
        return;
    }

    // Limpiar la tabla
    tbody.innerHTML = '';
    console.log("Limpiando tabla de usuarios...");

    // Agregar filas
    usuarios.forEach(usuario => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.usuario}</td>
            <td>${usuario.rol}</td>
        `;
        tbody.appendChild(fila);
        console.log("Fila añadida:", fila.innerHTML);
    });
}

