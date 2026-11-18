// La página solo hace fetch a la API. El navegador manda la cookie solo (misma página, mismo servidor).
const $ = (id) => document.getElementById(id);

//La función de llamarAPI envia solicitudes al servidro y recibe sus respuestas
async function llamarAPI(metodo, url, cuerpo) {
    const opciones ={
        method: metodo,
        headers:{}
    }; 

    if(cuerpo !== undefined){
        opciones.headers['Content-Type']='application/json'; 
        opciones.body = JSON.stringify(cuerpo); 
    }
    
    try{
        const respuesta = await fetch(url, opciones); 

        let datos = null;     

        try{
            datos = await respuesta.json();
           }catch(error){
            datos = null;
           }
        return{
               status: respuesta.status,
               datos: datos
              }; 
    } catch (error){
        console.error('Error al comunicarse al servidor: ', error); 

        return{
            status:0,
            datos: null
        }; 
    }
}

//La función registraBitacora muestra la respuesta en la página para poder consultar lo que pasó
function registrarBitacora(metodo, url, codigo, datos){
    const bitacora = $('bitacora'); 
    const elemento = document.createElement('li'); 
    const encabezado = document.createElement('p'); 
    encabezado.textContent = `${codigo} | ${metodo} | ${url}`; 
    //color
    if(codigo >= 200 && codigo <300){
        encabezado.className ='codigo ok';
    }else if (codigo === 401){
        encabezado.className = 'codigo e401'
    }else if (codigo === 403){
        encabezado.className = 'codigo e403'
    }else{
        encabezado.className = 'codigo error'; 
    }

    const contenido = document.createElement('pre'); 
    contenido.textContent = JSON.stringify(datos, null, 2); 

    elemento.appendChild(encabezado); 
    elemento.appendChild(contenido); 
    bitacora.appendChild(elemento); 
}

//La función de actualizarEstado se encargará d epreguntarle al servidor si hay una sesión inciada 
//Muestra los datos del usuario si estan conectadp
//muestra el contenido de document.cookie
async function actualizarEstado() {
    const respuesta = await llamarAPI('GET', '/api/sesion');
    registrarBitacora('GET', '/api/sesion', respuesta.status, respuesta.datos);

    const estado = $('estado');
    if (respuesta.status === 200) {
        const usuario = respuesta.datos.usuario;
        estado.textContent = `Bienvenido ${usuario.nombre} | Rol: ${usuario.rol} | Sesión: ${respuesta.datos.sesion} | Vence en ${respuesta.datos.expiraEnSegundos} s`;
        estado.className = 'estado con-sesion';
    } else {
        estado.textContent = 'Sin sesión (el servidor responde 401)';
        estado.className = 'estado sin-sesion';
    }
    $('cookie-js').textContent = document.cookie;
}

//La función de actualizarEstado funciona para consultar al servidor y obtener la sesiones guardadrs 
//y mostrarlas en la tabla
async function actualizarTabla() {
    const respuesta = await llamarAPI('GET', '/api/diagnostico/sesiones');

    registrarBitacora(
        'GET',
        '/api/diagnostico/sesiones',
        respuesta.status,
        respuesta.datos
    );

    const donde = $('donde');
    const tabla = $('tabla-sesiones');

    donde.textContent = `En ${respuesta.datos.almacen}`;

    tabla.replaceChildren();

    if (respuesta.status !== 200) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');

        celda.textContent = 'No se pudieron cargar las sesiones';
        fila.appendChild(celda);
        tabla.appendChild(fila);
        return;
    }
    if (respuesta.datos.sesiones.length === 0) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');

        celda.textContent = 'Sin sesiones';
        fila.appendChild(celda);
        tabla.appendChild(fila);
        return;
    }
    respuesta.datos.sesiones.forEach((sesion) => {
        const fila = document.createElement('tr');

        if (sesion.esLaTuya) {
            fila.className = 'tuya';
        }
        const celdaSesion = document.createElement('td');
        celdaSesion.textContent = sesion.sesion;

        if (sesion.esLaTuya) {
            celdaSesion.textContent += ' (la tuya)';
        }
        const celdaUsuario = document.createElement('td');
        celdaUsuario.textContent = sesion.usuario;
        const celdaVisitas = document.createElement('td');
        celdaVisitas.textContent = sesion.visitas;
        const celdaExpira = document.createElement('td');
        celdaExpira.textContent = new Date(sesion.expira).toLocaleString();
        fila.append(
            celdaSesion,
            celdaUsuario,
            celdaVisitas,
            celdaExpira
        );
        tabla.appendChild(fila);
    });
}

//Actualiza el estadp y la tabla de sesiones 
async function refrescarTodo() {
    await actualizarEstado(); 
    await actualizarTabla(); 
    
}

//Le da vida a la aplicación cunado se abre o recarga la pagina como que dice cuando empizan a trabajar las funciones anterirores
async function iniciarApp() {
    const respuesta = await llamarAPI('GET', '/api/config');
    registrarBitacora('GET', '/api/config', respuesta.status, respuesta.datos);

    const configEl = $('config');
    if (respuesta.status === 200) {
        configEl.textContent = JSON.stringify(respuesta.datos, null, 2);
    } else {
        configEl.textContent = 'No se pudo cargar la configuración';
    }

    // refresa estado de tabla
    await refrescarTodo();
}
$('form-login').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const usuario = $('usuario').value;
    const contrasena = $('contrasena').value;

    // Enviar los datos al servidor.
    const respuesta = await llamarAPI('POST', '/api/login', {
        usuario,
        contrasena
    });
    registrarBitacora('POST', '/api/login', respuesta.status, respuesta.datos);

    await refrescarTodo();
});


document.querySelectorAll('[data-metodo][data-url]').forEach((boton) => {
    boton.addEventListener('click', async () => {

        const metodo = boton.dataset.metodo;
        const url = boton.dataset.url;

        const respuesta = await llamarAPI(metodo, url);

        registrarBitacora(metodo, url, respuesta.status, respuesta.datos);

        await refrescarTodo();
    });
});
$('btn-refrescar').addEventListener('click', actualizarEstado);
$('btn-sesiones').addEventListener('click', actualizarTabla);

// Ejecutar el arranque de la aplicación
iniciarApp();