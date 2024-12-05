async function obtenerComprobantesPorNombreUsuario(nombre_usuario) {
    try {
        const respuesta = await axios.get(
            `${BASE_URL}/comprobantes/usuario/${nombre_usuario}`
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
            <p id="precio-original"><strong>Precio:</strong> $${precio_propiedad.toLocaleString()}</p>
            <p><strong>Usuario:</strong> ${nombre_usuario}</p>
            <button class="btn-descargar">Descargar comprobante</button>
            <button class="btn-cancelar" data-id="${id}" id-propiedad=${id_propiedad}>Cancelar Reserva</button>
            <a href="../pages/contacto.html" class="boton-verde">Contactar para finalizar la compra</a>
            <hr />
        `;

        listaReservas.appendChild(comprobanteDiv);

        comprobanteDiv.querySelector(".btn-descargar").addEventListener("click", () => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();

            pdf.setLineWidth(1); 
            pdf.setDrawColor(0, 0, 0); 
            pdf.rect(5, 5, 200, 287); 
    
            // Agregar contenido al PDF
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(18);
            pdf.text(`Comprobante de Reserva`, 10, 15);
            pdf.text(`----------------------------------------------`, 10, 20);
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "normal");
            pdf.text(`Propiedad: ${titulo_propiedad}`, 10, 30);
            pdf.text(`Fecha de Reserva: ${new Date(fecha_reserva).toLocaleString()}`, 10, 40);
            pdf.text(`Precio Original: $${precio_propiedad.toLocaleString()}`, 10, 50);
            pdf.text(`Usuario: ${nombre_usuario}`, 10, 60);
    
            // Descargar el PDF
            pdf.save(`comprobante_reserva_${id}.pdf`);
        });
        document.getElementById('btn-aplicar-cupon').addEventListener('click', () => {
            const codigoCuponIngresado = document.getElementById('codigo-cupon').value.trim();
            const codigoCuponGuardado = localStorage.getItem('codigoCupon');
            const descuento = 0.1; //10% de descuento
        
            if (codigoCuponIngresado === codigoCuponGuardado) {
                const precioConDescuento = (precio_propiedad * (1 - descuento)).toFixed(2);
                comprobanteDiv.querySelector('#precio-original').innerHTML =
                `<strong>Precio con descuento de cupón:</strong> $${Number(precioConDescuento).toLocaleString()}`;
            }
            else
            {
                alert("El código de cupón no es válido o ha expirado.");
            }
        });
        
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

        const respuesta = await axios.delete(`${BASE_URL}/comprobantes/eliminarComprobante/${id_comprobante}`);
        if (respuesta.status !== 200) {
            throw new Error('Error al eliminar el comprobante.');
        }
        const propiedad = await obtenerPropiedadPorId(id_propiedad);
        if (!propiedad) {
            throw new Error('No se encontró la propiedad correspondiente a la reserva.');
        }
        propiedad.reservada = false;
        const respuestaActualizacion = await axios.put(
            `${BASE_URL}/propiedades/actualizarPropiedad/${id_propiedad}`,
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

