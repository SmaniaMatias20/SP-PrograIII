async function obtenerComprobantesPorNombreUsuario(nombre_usuario) {
    try {
        const respuesta = await axios.get(
            `https://sp-prograiii-fj7g.onrender.com/comprobantes/usuario/${nombre_usuario}`
        );

        const comprobantes = respuesta.data;

        if (!Array.isArray(comprobantes) || comprobantes.length === 0) {
            mostrarComprobantes([]);
            return;
        }
        mostrarComprobantes(comprobantes);
    } catch (error) {
        console.error('Error al obtener los comprobantes:', error);
        alert('No se pudieron obtener los comprobantes. Verifica el nombre de usuario.');
    }
}

function mostrarComprobantes(comprobantes) {
    const listaReservas = document.querySelector('.lista-reservas');
    listaReservas.innerHTML = '';

    if (comprobantes.length === 0) {
        const mensaje = document.createElement('div');
        mensaje.classList.add('sin-comprobantes');
        mensaje.innerHTML = `
            <p>No hay reservas realizadas.</p>
        `;
        listaReservas.appendChild(mensaje);
        return;
    }

    comprobantes.forEach(comprobante => {
        const { id, fecha_reserva, id_propiedad, titulo_propiedad, nombre_usuario, precio_propiedad } = comprobante;

        const comprobanteDiv = document.createElement('div');
        comprobanteDiv.classList.add('comprobante-item');

        comprobanteDiv.innerHTML = `
            <h3>Comprobante de Reserva - ${titulo_propiedad}</h3>
            <p><strong>Propiedad:</strong> ${titulo_propiedad}</p>
            <p><strong>Fecha de Reserva:</strong> ${new Date(fecha_reserva).toLocaleString()}</p>
            <p><strong>Precio:</strong> $${precio_propiedad.toLocaleString()}</p>
            <p><strong>Usuario:</strong> ${nombre_usuario}</p>
            <button class="btn-cancelar" data-id="${id}" id-propiedad=${id_propiedad}>Cancelar Reserva</button>
            <hr />
        `;

        listaReservas.appendChild(comprobanteDiv);
    });

    const botonesCancelar = document.querySelectorAll('.btn-cancelar');
    botonesCancelar.forEach(boton => {
        boton.addEventListener('click', async (e) => {
            const id_comprobante = e.target.getAttribute('data-id');
            const id_propiedad = e.target.getAttribute('id-propiedad');
            await cancelarReserva(id_comprobante, id_propiedad);
        });
    });
}

async function cancelarReserva(id_comprobante, id_propiedad) {
    try {
        const confirmacion = confirm('¿Estás seguro de que deseas cancelar esta reserva?');
        if (!confirmacion) return;

        const respuesta = await axios.delete(`http://localhost:3000/comprobantes/eliminarComprobante/${id_comprobante}`);
        if (respuesta.status !== 200) {
            throw new Error('Error al eliminar el comprobante.');
        }
        const propiedad = await obtenerPropiedadPorId(id_propiedad);
        if (!propiedad) {
            throw new Error('No se encontró la propiedad correspondiente a la reserva.');
        }
        propiedad.reservada = false;
        const respuestaActualizacion = await axios.put(
            `http://localhost:3000/propiedades/actualizarPropiedad/${id_propiedad}`,
            propiedad
        );
        if (respuestaActualizacion.status !== 200) {
            throw new Error('Error al actualizar el estado de la propiedad.');
        }
        alert('Reserva cancelada y comprobante eliminado exitosamente.');
        const usuario = localStorage.getItem('usuario');
        await obtenerComprobantesPorNombreUsuario(usuario);
    } catch (error) {
        console.error('Error al cancelar la reserva:', error);
        alert('No se pudo cancelar la reserva. Inténtalo nuevamente.');
    }
}

