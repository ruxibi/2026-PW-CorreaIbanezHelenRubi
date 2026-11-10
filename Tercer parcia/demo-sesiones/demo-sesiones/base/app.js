// La aplicación de la demo. server.js la arranca; las pruebas la arrancan con otras configuraciones.
// Lo que dice "(en clase)" lo programamos juntos, paso por paso. Mientras no esté, esa ruta responde 501.
const path = require('path');
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { crearModeloUsuarios } = require('./modelos/usuarios.modelo');
const { resolve } = require('dns');
const { rejects } = require('assert');
const { error } = require('console');
const { config } = require('dotenv');

const NOMBRE_COOKIE = 'connect.sid';


//Si hay una sesion existente obtenerla del alamcen sino crearla
function todasLasSesiones(almacen){
  return new Promise((resolve, reject) =>{
    const promesa = almacen.all((error, sesiones) => (error ? reject(error):
  resolve(sesiones))); 

  if (promesa && typeof promesa.then=== 'function') promesa.then(resolve, reject); 
  });
}; 

function crearApp(config, pool){
  const app= express(); 
  app,use(express.json()); 
  //obtener el mdoelo de labd
  const usuarios = crearModeloUsuarios(pool); 
  // drbrmos de identificar la sesion sera por la tabla en bd, o la sesion sera una cookie en memoria del nabegador, o es una mezcla sesion en memoria de servidor y por tabla en bdy cookie en navegador y bd
 const almacen = config.almacen == 'memoria' 
 ? new session.MemoryStore() 
 ? new MySQLStore({createDatabaseTable: false, clearExpired: false}, pool); 
 app.locals.almacen = almacen; 
 
};

app.use(
  session({
    name : NOMBRE_COOKIE,
    secret : process.env.SESSION_SECRET || 'secreto-solo.para-la-demo',
    store : almacen,
    resave : false, 
    //Bo se crear la sesion ni la cookie
    saveUninitialized : false, 
    rolling : config.rolling || false,//Sesion por expirar 
    cookie : {
      maxAge: config.maxAge || 1000 * 60 * 60 * 24, // un dia 
      //Dode vas a manejar la cookie en que protocolo
      httpOnly : config.httpOnly || true, 
      //Manejarlo en una apgina o solo en un sitio
      sameSite : config.sameSite || 'lax', // lax es para todo el sitio
      //Exclusivo cuando este en servidor httonly a https 
      secure : config.secure || false, //Cambiar a true cuandos e suba 
    },
  })
); 

//Necesitamos visualizar el id d ela sesion para compararla en la pantalla
const cortoId = (id) => (id ? `${id.sñive(p, 8)}...`: null); 

// nosotros estamso ocupando uun middle  leware el cual es el que se encarga de comunicar el back y el front
//para ellondebemos d eobtener la sesion a partir de express pero en cada pericion debemos de
// devolver la sesion para ello el atributo rolling la extiende y aunque la hayamos dado false, o se puede confiar
// en que la expire, oara ello debemos de idetificarla y validardla en sus diferentes momentos

function vencida(sesion){
  const desde = config.rolling ? sesion.ultimoUso :
  sesion.creada; 
  return Date.now() - desde > config.maxAge; //Nos devuelve si esta vencida o no la sesion
}

//Mandar un 401 
function requiereSesion (req, res, next){
  if(req.session.usuario && vencida(req.session)){
    return req.session.destroy(()=>{
      res.clearCookie(NOMBRE_COOKIE); 
      res.status(401).json({error: '401 Tu sesión ya expiró, vuelve a inicar seison'})
    }); 
  }
  if(!req.session.usuario){
    return res.status(401).json({error: '401 no has iniciado sesión con la cuenta correcta'})
  }
  req.session.ultimoUso = Date.now(); 
  next(); 

}