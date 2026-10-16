const bcrypt = require('bcryptjs')

const usuariosModel = require('../MODELO/usuarios_modelo'); 

const {validarCorreo, validarBoleta, validarContrasena} = require
('../validacione')
//validacionrs

function esDuplicado(error){
    return error.code === 'ER_DUP_ENTRY' || error.code ===
    '23505'; 
}

 async function listarUsuarios(req, res){
    try{
        const usuarios = await usuariosModel,listar(); 
        res.json(usuarios); 
    }catch{
        res.status(500).json({error: error, message}); 
    }
 } 

//deberan realizar los constroladores de asistencia y talleres cib sus funciones correspondientes

async function obtenerUsuario(req, res) {
    try{
        const usuario = await usuariosModel.obtenerPotid(req.params.id);
        if 
    }
    
}