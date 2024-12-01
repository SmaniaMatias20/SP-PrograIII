async function obtenerComprobantesPorNombreUsuario(nombre_usuario) {
    try {
        // Realizar la solicitud al backend
        const respuesta = await axios.get(
            `http://localhost:3000/comprobantes/obtenerComprobante/${nombre_usuario}`
        );

        // Manejar los datos obtenidos
        console.log('Comprobantes obtenidos:', respuesta.data);
        return respuesta.data; // Devolver los datos si es necesario
    } catch (error) {
        // Manejar errores
        console.error('Error al obtener los comprobantes:', error);
        alert('No se pudieron obtener los comprobantes. Verifica el nombre de usuario.');
    }
}
