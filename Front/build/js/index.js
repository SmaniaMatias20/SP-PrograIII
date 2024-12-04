const BASE_URL = 'http://localhost:3000'


document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const usuario = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    try {
        // Enviar la solicitud POST al backend para verificar el usuario
        const response = await axios.post(`${BASE_URL}/usuarios/iniciarSesion`, { usuario, password });
        // const response = await axios.post('https://sp-prograiii-fj7g.onrender.com/usuarios/iniciarSesion', { usuario, password });

        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('usuario', usuario);
            message.style.color = 'green';
            message.textContent = 'Inicio de sesión exitoso';
            window.location.href = 'build/pages/inicio.html';
        } else {
            message.style.color = 'red';
            message.textContent = 'Usuario o contraseña incorrectos';
        }
    } catch (error) {
        message.style.color = 'red';
        message.textContent = 'Hubo un error en la solicitud';
        console.error(error);
    }
});

async function registerUser(usuario, password, role) {
    try {
        if (!usuario || !password || !role) {
            alert('Por favor completa todos los campos');
            return;
        }

        const response = await axios.post(`${BASE_URL}/usuarios/crearUsuario`, {
            //const response = await axios.post('https://sp-prograiii-fj7g.onrender.com/usuarios/crearUsuario', {
            usuario,
            password,
            rol: role
        });
        const registerMessage = document.getElementById('registerMessage');
        if (response.data.mensaje === 'Usuario creado exitosamente') {
            registerMessage.textContent = 'Registro exitoso';
            registerMessage.style.color = 'green';
        } else {
            registerMessage.textContent = response.data.message || 'El usuario ya existe';
            registerMessage.style.color = 'red';
        }

        document.getElementById('registerUsername').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('role').value = '';

    } catch (error) {
        const registerMessage = document.getElementById('registerMessage');

        if (error.response) {
            if (error.response.data.mensaje === 'Error de validación') {
                let errorDetails = error.response.data.detalles.map(err => err.message).join(', ');
                registerMessage.textContent = `${errorDetails}`;
                registerMessage.style.color = 'red';
            } else {
                registerMessage.textContent = error.response.data.message || 'Error al registrar el usuario';
                registerMessage.style.color = 'red';
            }
        } else if (error.request) {
            registerMessage.textContent = 'No se recibió respuesta del servidor';
            registerMessage.style.color = 'red';
        } else {
            registerMessage.textContent = 'Hubo un error al procesar la solicitud';
            registerMessage.style.color = 'red';
        }

        console.error(error);
    }
}

document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('role').value;
    await registerUser(username, password, role);
});

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
