

const talleres = [
  { nombre: 'Introducción a Python', instructor: 'Ing. María López', cupo: 25, inscritos: 25 },
  { nombre: 'Fundamentos de Redes', instructor: 'Ing. Carlos Ramírez', cupo: 30, inscritos: 18 },
  { nombre: 'Diseño de Bases de Datos', instructor: 'Ing. Ana Torres', cupo: 20, inscritos: 20 },
  { nombre: 'Desarrollo Web con JS', instructor: 'Ing. María López', cupo: 25, inscritos: 10 },
];


function pintarTabla(){
    //debe de obtener la tabla y rellenarla con los datos de talleres
    const tabla = document.getElementById('tabla-talleres');
    const tbody = tabla.querySelector('tbody');

    talleres.forEach((taller) => {

        const fila = document.createElement('tr');

        const celdaNombre = document.createElement('td');
        celdaNombre.textContent = taller.nombre;

        const celdaInstructor = document.createElement('td');
        celdaInstructor.textContent = taller.instructor;

        const celdaCupo = document.createElement('td');
        celdaCupo.textContent = taller.cupo;

        const celdaInscritos = document.createElement('td');
        celdaInscritos.textContent = taller.inscritos;

        
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaInstructor);
        fila.appendChild(celdaCupo);
        fila.appendChild(celdaInscritos);

        tbody.appendChild(fila);

    });

}
pintarTabla(); 

const formArreglos = document.getElementById('form-arreglos');
const resultadoArreglos = document.getElementById('resultado-arreglo');
const selectOperacionArreglo = document.getElementById('operacion-arreglo');

formArreglos.addEventListener('submit', (evento) =>{
    evento.preventDefault();
    const operacion = selectOperacionArreglo.value;

    let resultado;

    switch(operacion){
        case 'forEach':
            resultado = talleres.map((t) => `- ${t.nombre} (${t.inscritos}/${t.cupo})`).join('\n');
            break;
    }


    resultadoArreglos.textContent = resultado;
});