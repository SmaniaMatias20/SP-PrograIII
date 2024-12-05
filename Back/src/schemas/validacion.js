// schemas/usuarioSchema.js
const { z } = require('zod');

// Esquema de validación para crear un usuario
const crearUsuarioSchema = z.object({
    usuario: z.string()
        .min(5, 'El nombre de usuario debe tener al menos 5 caracteres.')
        .max(10, 'El nombre de usuario no puede tener más de 10 caracteres.'),

    password: z.string()
        .min(5, 'La contraseña debe tener al menos 5 caracteres.')
        .max(10, 'La contraseña no puede tener más de 10 caracteres.'),

    rol: z.enum(['usuario', 'admin'], 'El rol debe ser "usuario" o "admin"'),
});



// Exportar el esquema
module.exports = { crearUsuarioSchema };
