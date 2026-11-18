// Consultas a la tabla usuarios. Siempre con ? (consulta parametrizada), nunca pegando texto en el SQL.
const bcrypt = require('bcryptjs');

function crearModeloUsuarios(pool) {
  // Regresa el usuario (sin el hash) si la contraseña es correcta, o null si no.
  async function verificar(usuario, contrasena) {
    //Aqui habia un throw error (Verificar en la clase)

    const [filas] = await pool.execute(
      'SELECT id, usuario, nombre, rol, contrasena_hash FROM usuarios WHERE usuario = ?',
      [usuario]
    );


    if (filas.length === 0) {
      return null;
    }
    const usuarioEncontrado = filas[0];

    const coincide = await bcrypt.compare(
      contrasena,
      usuarioEncontrado.contrasena_hash
    );

    if (!coincide) {
      return null;
    }

    return {
      id: usuarioEncontrado.id,
      usuario: usuarioEncontrado.usuario,
      nombre: usuarioEncontrado.nombre,
      rol: usuarioEncontrado.rol
    };
  }
  return { verificar };
}

module.exports = { crearModeloUsuarios };
