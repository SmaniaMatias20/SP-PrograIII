// Función para obtener usuarios desde el backend y devolverlos
async function obtenerUsuarios() {
    try {
        const response = await axios.get('https://sp-prograiii-fj7g.onrender.com/usuarios/obtenerUsuarios', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        // Obtener los datos de la respuesta
        const usuarios = response.data;

        return usuarios;

    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        return []; // Retornar un arreglo vacío si hay un error
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

    // Limpiar la tabla antes de llenarla con nuevos datos
    tbody.innerHTML = '';

    // Agregar filas para cada usuario
    usuarios.forEach(usuario => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.usuario}</td>
            <td>${usuario.rol}</td>
            <td>
                <button onclick="editarUsuario(${usuario.id})">Editar</button>
                <button onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

// Función para crear un nuevo usuario
async function crearUsuario(datosUsuario) {
    try {
        const response = await axios.post('https://sp-prograiii-fj7g.onrender.com/usuarios/crearUsuario', datosUsuario, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        alert('Usuario creado exitosamente');

        // Volver a cargar la tabla de usuarios después de crear uno
        const usuarios = await obtenerUsuarios();
        crearTablaUsuarios(usuarios);

    } catch (error) {
        console.error('Error al crear usuario:', error);
        alert('Error al crear el usuario');
    }
}

// Función para actualizar un usuario
async function actualizarUsuario(id, datosUsuario) {
    try {
        const response = await axios.put(`https://sp-prograiii-fj7g.onrender.com/usuarios/actualizarUsuario/${id}`, datosUsuario, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        alert('Usuario actualizado exitosamente');

        // Volver a cargar la tabla de usuarios después de actualizar uno
        const usuarios = await obtenerUsuarios();
        crearTablaUsuarios(usuarios);

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        alert('Error al actualizar el usuario');
    }
}

// Función para eliminar un usuario
async function eliminarUsuario(id) {
    try {
        const response = await axios.delete(`https://sp-prograiii-fj7g.onrender.com/usuarios/eliminarUsuario/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        alert('Usuario eliminado exitosamente');

        // Volver a cargar la tabla de usuarios después de eliminar uno
        const usuarios = await obtenerUsuarios();
        crearTablaUsuarios(usuarios);

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar el usuario');
    }
}

// Función para cargar un usuario en el formulario de edición
function editarUsuario(id) {
    const formulario = document.getElementById('form-usuario');
    const usuarioIdInput = document.getElementById('usuario-id');
    const usuarioNombreInput = document.getElementById('usuario-nombre');
    const usuarioRolInput = document.getElementById('usuario-rol');

    // Mostrar el formulario
    formulario.style.display = 'block';

    // Obtener los detalles del usuario desde el backend
    axios.get(`https://sp-prograiii-fj7g.onrender.com/usuarios/obtenerUsuario/${id}`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    })
        .then(response => {
            const usuario = response.data;
            usuarioIdInput.value = usuario.id;
            usuarioNombreInput.value = usuario.usuario;
            usuarioRolInput.value = usuario.rol;
            formulario.querySelector('button').textContent = 'Actualizar Usuario'; // Cambiar el texto del botón a "Actualizar"
        })
        .catch(error => {
            console.error('Error al obtener el usuario:', error);
            alert('Error al cargar los datos del usuario');
        });
}

// Función para manejar el envío del formulario de usuario
document.getElementById('form-usuario').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario

    const usuarioId = document.getElementById('usuario-id').value;
    const usuarioNombre = document.getElementById('usuario-nombre').value;
    const usuarioRol = document.getElementById('usuario-rol').value;
    const usuarioPassword = document.getElementById('usuario-contraseña').value;

    const datosUsuario = {
        usuario: usuarioNombre,
        rol: usuarioRol,
        password: usuarioPassword
    };


    if (usuarioId) {
        // Si hay un ID, actualizar el usuario
        actualizarUsuario(usuarioId, datosUsuario);
    } else {
        // Si no hay ID, crear un nuevo usuario
        crearUsuario(datosUsuario);
    }

    // Limpiar el formulario después de enviar
    document.getElementById('form-usuario').reset();
    document.getElementById('usuario-id').value = ''; // Resetear el campo oculto de ID

    // Ocultar el formulario
    document.getElementById('form-usuario').style.display = 'none';
});

// Función para mostrar el formulario de creación de usuario
document.getElementById('nuevo-usuario').addEventListener('click', function () {
    const formulario = document.getElementById('form-usuario');
    formulario.style.display = 'block'; // Mostrar el formulario para crear usuario
    document.getElementById('form-usuario').reset(); // Limpiar el formulario
    document.getElementById('usuario-id').value = ''; // Resetear el campo oculto de ID
    document.querySelector('#form-usuario button').textContent = 'Crear Usuario'; // Cambiar el texto del botón
});
