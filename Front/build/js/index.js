const BASE_URL = "https://sp-prograiii-fj7g.onrender.com";

// Función para mostrar mensajes en pantalla
function displayMessage(elementId, message, color) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.color = color;
}

// Manejar el inicio de sesión
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const usuario = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!usuario || !password) {
        displayMessage('message', 'Por favor, completa todos los campos.', 'red');
        return;
    }

    try {
        const response = await axios.post(`${BASE_URL}/usuarios/iniciarSesion`, { usuario, password });

        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('usuario', usuario);
            localStorage.setItem('rol', response.data.rol);

            displayMessage('message', 'Inicio de sesión exitoso', 'green');

            // Redirigir al inicio
            setTimeout(() => {
                window.location.href = 'build/pages/inicio.html';
            }, 1000);
        } else {
            displayMessage('message', response.data.mensaje || 'Usuario o contraseña incorrectos', 'red');
        }
    } catch (error) {
        if (error.response) {
            displayMessage('message', error.response.data.mensaje || 'Error en la solicitud', 'red');
        } else if (error.request) {
            displayMessage('message', 'No se recibió respuesta del servidor', 'red');
        } else {
            displayMessage('message', 'Hubo un error desconocido', 'red');
        }
        console.error(error);
    }
});

// Manejar el registro de usuarios
async function registerUser(usuario, password, role) {
    const registerMessageId = 'registerMessage';

    if (!usuario || !password || !role) {
        displayMessage(registerMessageId, 'Por favor completa todos los campos', 'red');
        return;
    }

    try {
        const response = await axios.post(`${BASE_URL}/usuarios/crearUsuario`, {
            usuario,
            password,
            rol: role
        });

        if (response.data.mensaje === 'Usuario creado exitosamente') {
            registerMessage.textContent = 'Registro exitoso';
            registerMessage.style.color = 'green';
            setTimeout(() => {
                document.querySelector('.login-container').style.display = 'block';
                document.querySelector('.register-container').style.display = 'none';
            }, 1500);
        } else {
            registerMessage.textContent = response.data.message || 'El usuario ya existe';
            registerMessage.style.color = 'red';
        }

        document.getElementById('registerUsername').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('role').value = '';

            // Cambiar a la vista de inicio de sesión
            setTimeout(() => {
                document.querySelector('.register-container').style.display = 'none';
                document.querySelector('.login-container').style.display = 'block';
            }, 1000);
        } else {
            displayMessage(registerMessageId, response.data.mensaje || 'El usuario ya existe', 'red');
        }
    } catch (error) {
        if (error.response) {
            if (error.response.data.mensaje === 'Error de validación') {
                const errorDetails = error.response.data.detalles.map(err => err.message).join(', ');
                displayMessage(registerMessageId, errorDetails, 'red');
            } else {
                displayMessage(registerMessageId, error.response.data.mensaje || 'Error al registrar el usuario', 'red');
            }
        } else if (error.request) {
            displayMessage(registerMessageId, 'No se recibió respuesta del servidor', 'red');
        } else {
            displayMessage(registerMessageId, 'Hubo un error desconocido', 'red');
        }
        console.error(error);
    }
}

// Configurar eventos del formulario de registro
document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const role = document.getElementById('role').value.trim();
    await registerUser(username, password, role);
});

// Cambiar entre vistas (Login <-> Registro)
document.getElementById('showRegister').addEventListener('click', function (event) {
    event.preventDefault();
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.register-container').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', function (event) {
    event.preventDefault();
    document.querySelector('.login-container').style.display = 'block';
    document.querySelector('.register-container').style.display = 'none';
});
