async function obtenerUsuarios() {
    try {
        const response = await axios.get('https://sp-prograiii-fj7g.onrender.com/usuarios/obtenerUsuarios', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        const usuarios = response.data;
        return usuarios;
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        return [];
    }
}

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

    tbody.innerHTML = '';
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

async function crearUsuario(datosUsuario) {
    try {
        const response = await axios.post('https://sp-prograiii-fj7g.onrender.com/usuarios/crearUsuario', datosUsuario, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        alert('Usuario creado exitosamente');
        const usuarios = await obtenerUsuarios();
        crearTablaUsuarios(usuarios);

    } catch (error) {
        console.error('Error al crear usuario:', error);
        alert('Error al crear el usuario');
    }
}

async function actualizarUsuario(id, datosUsuario) {
    try {
        const response = await axios.put(`https://sp-prograiii-fj7g.onrender.com/usuarios/actualizarUsuario/${id}`, datosUsuario, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        alert('Usuario actualizado exitosamente');
        const usuarios = await obtenerUsuarios();
        crearTablaUsuarios(usuarios);

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        alert('Error al actualizar el usuario');
    }
}

async function eliminarUsuario(id) {
    try {
        const response = await axios.delete(`https://sp-prograiii-fj7g.onrender.com/usuarios/eliminarUsuario/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        alert('Usuario eliminado exitosamente');
        const usuarios = await obtenerUsuarios();
        crearTablaUsuarios(usuarios);

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar el usuario');
    }
}

function editarUsuario(id) {
    const formulario = document.getElementById('form-usuario');
    const usuarioIdInput = document.getElementById('usuario-id');
    const usuarioNombreInput = document.getElementById('usuario-nombre');
    const usuarioRolInput = document.getElementById('usuario-rol');

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
            formulario.querySelector('button').textContent = 'Actualizar Usuario';
        })
        .catch(error => {
            console.error('Error al obtener el usuario:', error);
            alert('Error al cargar los datos del usuario');
        });
}

document.getElementById('form-usuario').addEventListener('submit', function (event) {
    event.preventDefault();

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
        actualizarUsuario(usuarioId, datosUsuario);
    } else {
        crearUsuario(datosUsuario);
    }
    document.getElementById('form-usuario').reset();
    document.getElementById('usuario-id').value = '';
    document.getElementById('form-usuario').style.display = 'none';
});

document.getElementById('nuevo-usuario').addEventListener('click', function () {
    const formulario = document.getElementById('form-usuario');
    formulario.style.display = 'block';
    document.getElementById('form-usuario').reset();
    document.getElementById('usuario-id').value = '';
    document.querySelector('#form-usuario button').textContent = 'Crear Usuario';
});
