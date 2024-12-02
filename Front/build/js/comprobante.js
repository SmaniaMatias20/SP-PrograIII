async function obtenerComprobantesPorNombreUsuario(nombre_usuario) {
    try {
        console.log("Solicitando comprobantes para el usuario:", nombre_usuario);

        // Realizar la solicitud al backend
        const respuesta = await axios.get(
            `https://sp-prograiii-fj7g.onrender.com/comprobantes/usuario/${nombre_usuario}`
        );

        // Manejar los datos obtenidos
        const comprobantes = respuesta.data;
        console.log('Comprobantes obtenidos:', comprobantes);

        // Mostrar los comprobantes en el HTML
        mostrarComprobantes(comprobantes);
    } catch (error) {
        console.error('Error al obtener los comprobantes:', error);
        alert('No se pudieron obtener los comprobantes. Verifica el nombre de usuario.');
    }
}

// Función para mostrar los comprobantes en el HTML
function mostrarComprobantes(comprobantes) {
    const listaReservas = document.querySelector('.lista-reservas');
    listaReservas.innerHTML = ''; // Limpiar cualquier contenido previo

    comprobantes.forEach(comprobante => {
        const { fecha_reserva, id_propiedad, titulo_propiedad, nombre_usuario, precio_propiedad } = comprobante;

        // Crear un nuevo div para cada comprobante
        const comprobanteDiv = document.createElement('div');
        comprobanteDiv.classList.add('comprobante-item');

        // Agregar el contenido al div
        comprobanteDiv.innerHTML = `
            <h3>Comprobante de Reserva - ${titulo_propiedad}</h3>
            <p><strong>Propiedad:</strong> ${titulo_propiedad}</p>
            <p><strong>Fecha de Reserva:</strong> ${new Date(fecha_reserva).toLocaleString()}</p>
            <p><strong>Precio:</strong> $${precio_propiedad.toLocaleString()}</p>
            <p><strong>Usuario:</strong> ${nombre_usuario}</p>
            <hr />
        `;

        // Agregar el comprobante al contenedor de reservas
        listaReservas.appendChild(comprobanteDiv);
    });
}
