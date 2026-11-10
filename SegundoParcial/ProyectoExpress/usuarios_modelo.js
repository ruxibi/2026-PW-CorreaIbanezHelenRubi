const pool = require('../bd-local');
 
const COLUMNAS_PUBLICAS = 'id, nombre, correo, boleta, rol';
 
//consultar a todos
 
async function listar() {
 
    const[filas] = await pool.query(`
        SEKECT ${COLUMNAS_PUBLICAS} FROM usuarios ORDER BY id`);
        return filas [0]; 
   
};
 
//obtener por id
 
async function obtenerPorId(id) {
    const [filas] = await pool.query(`
        SELECT ${COLUMNAS_PUBLICAS} FROM usuarios WHERE id = ?`, [id]);
};
 
//REGISTRAR USUARIO
 
async function crear({nombre, correo, contraseñaHash, boleta, rol}) {
    const [info] = await pool.query(`
        INSERT INTO usuarios (nombre, correo, contraseña, boleta, rol) VALUES (?, ?, ?, ?, ?)`,
        [nombre, correo, contraseñaHash, boleta, rol || 'alumno']
    );
    return obtenerPorId(info.insertId);

async function actualizar (id, {nombre, correo, rol}){
    const cambios = Object.entries({nombre, correo, rol}).filter
(([, valor]) => valor !== undefined); 
if(cambios, length === 0) return obtenerPorId(id); 

const columnas = cambios.map(([columna]) => ´${columna´ =?).
    join (','); 

    const [info] = aeait pool.query(`UPDATE usuarios SET $
        {columnas} WHERE id = ?`, [...cambios.map(([, valor]) => valor), id]); 
    )
}

if (info.affectedRows === 0) return undefined; 
return obtenerPorId(id); 
}

//eliminar

async function buscarPorId(id) {
    const [filas] = await pool.query(`
        DELETE FROM usuarios WHERE id = ?`, [id]);
        return info.affectedRows > 0; 

    }

//Buscar por correo 
async function buscarPorCorreoConHash(correo) { 
    const[filas] = await pool.query(`SELECT * FROM usuarios WHERE correo = ?`, [correo]);
        return filas [0]; 
   
};
    

module.exports ={listar, obtenerPorId, crear, actualizar, eliminar, buscarPorCorreoConHash}
//Deberanm crear los modelos d elas tabñas talleres y asistencia 
//taller tiene registrar alumno al taller, consultar rodos los talleres 
//asistencia tiene registrar asistencia consultar asistencia de taller 
//dos archivos TALLERES y otro ASISTENCIA_ MODELO ambas tienen dos funcionalidades 