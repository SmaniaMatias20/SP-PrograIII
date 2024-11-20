// Definir la URL base para las API dependiendo del entorno
const BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000' // URL en entorno local
    : 'https://sp-prograiii-fj7g.onrender.com'; // URL en entorno de producción

console.log('Base URL:', BASE_URL);
// Función para manejar el inicio de sesión con Axios
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const usuario = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    try {
        // Enviar la solicitud POST al backend para verificar el usuario
        // const response = await axios.post('http://localhost:3000/usuarios/iniciarSesion', { usuario, password });
        const response = await axios.post(`${BASE_URL}/usuarios/iniciarSesion`, { usuario, password });

        // Si el inicio de sesión es exitoso
        if (response.data.success) {
            // Almacenar el token JWT en localStorage
            localStorage.setItem('token', response.data.token);

            // Mostrar mensaje de éxito
            message.style.color = 'green';
            message.textContent = 'Inicio de sesión exitoso';

            // Redirigir a otra página
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


// Función para manejar el registro de nuevos usuarios con Axios
async function registerUser(usuario, password, role) {
    try {
        // Verificar si los campos están completos antes de enviarlos
        if (!usuario || !password || !role) {
            alert('Por favor completa todos los campos');
            return;
        }

        // Enviar la solicitud POST al backend para registrar un nuevo usuario
        // const response = await axios.post('http://localhost:3000/usuarios/crearUsuario', {
        //     usuario,
        //     password,
        //     rol: role
        // });
        const response = await axios.post('https://sp-prograiii-fj7g.onrender.com/usuarios/crearUsuario', {
            usuario,
            password,
            rol: role
        });

        // Verificar si el registro fue exitoso
        const registerMessage = document.getElementById('registerMessage');
        if (response.data.mensaje === 'Usuario creado exitosamente') {
            registerMessage.textContent = 'Registro exitoso';
            registerMessage.style.color = 'green';
        } else {
            registerMessage.textContent = response.data.mensaje || 'El usuario ya existe';
            registerMessage.style.color = 'red';
        }

        // Limpiar los campos
        document.getElementById('registerUsername').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('role').value = ''; // Reiniciar el rol
    } catch (error) {
        const registerMessage = document.getElementById('registerMessage');
        registerMessage.textContent = 'Hubo un error en la solicitud';
        registerMessage.style.color = 'red';
        console.error(error);
    }
}

// Manejar el registro de nuevos usuarios
document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('role').value; // Obtener el rol seleccionado

    // Llamar a la función para registrar el usuario
    await registerUser(username, password, role);
});

// Mostrar/Ocultar formularios
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
