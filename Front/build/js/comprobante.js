async function crearComprobante() {
    try {
        // Recoger los valores de los campos del formulario
        const tituloPropiedad = document.getElementById('titulo-propiedad').value;
        const idPropiedad = document.getElementById('id_propiedad').value;
        const idUsuario = document.getElementById('id_usuario').value;
        const nombreUsuario = document.getElementById('nombre_usuario').value;
        const precio = document.getElementById('precio').value;

        // Crear el objeto con los datos del comprobante
        const comprobanteData = {
            fechaReserva: new Date(),  // Fecha de la reserva (se pone la fecha actual)
            id_propiedad: parseInt(idPropiedad), // Convertir a número
            titulo_propiedad: tituloPropiedad,
            id_usuario: parseInt(idUsuario), // Convertir a número
            nombre_usuario: nombreUsuario,
            precio: parseFloat(precio).toFixed(2) // Convertir a número decimal con 2 decimales
        };

        // Enviar la solicitud POST para crear el comprobante
        const response = await axios.post('http://localhost:3000/comprobantes/crearComprobante', comprobanteData);

        // Si la solicitud es exitosa, procesar la respuesta
        console.log('Comprobante creado exitosamente:', response.data);
        alert('Reserva confirmada exitosamente!');

    } catch (error) {
        // Capturar cualquier error y mostrar un mensaje
        console.error('Error al crear el comprobante:', error);
        alert('Hubo un error al crear la reserva, por favor intente nuevamente.');
    }
}

// Asignar la función a la acción del botón "Reservar"
document.getElementById('btn-reserva').addEventListener('click', crearComprobante);