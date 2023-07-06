let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}


// Eligiendo Servicios de Compra

document.addEventListener('DOMContentLoaded', ()=>{

    iniciarApp();

});

function iniciarApp(){
    mostrarServivios();

    // Resalta el Div actual segun el tab que se prresiona
    mostrarSeccion()

    // Oculta o Muestra una seccion segun el tab que se presiona
    cambiarSeccion();

    // Paginacion Siguiente y Anterior
    paginaSiguiente();

    paginaAnterior();

    // Comprueba la pagina actual para mostrar o ocultar la paginacion
    botonesPaginador();

    // Muestra el resumen de la cita( o mensaje de error en caso de no pasar la validacion )
    mostrarResumen();
    
    // Almacena el nombre de la cita en el objeto
    nombreCita();

    // Almacena la fecha de la cita en el objeto
    fechaCita();

    // Deshabilita dias pasados
    deshabilitarFechaAnterior();

    // Almacena la hora de la cita en el objeto
    horaCita();

}

function mostrarSeccion(){

    // Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }
    

    
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Elimina la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.navigator .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual')
    }
    
    

    // Resalta el tab al presionar
    const tab = document.querySelector(` [data-paso="${pagina}"] `);
    tab.classList.add('actual');
    
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.navigator button');

    enlaces.forEach( enlace =>{
        enlace.addEventListener( 'click', e =>{
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            // Llamar a la funcion de mostarSeccion
            mostrarSeccion();

            // Lamar la funcion botonesPaginador
            botonesPaginador()
        })
    })
}


async function mostrarServivios(){
    try {   // el Fetch API es el reemplazo a ajax
        const resultado = await fetch('./servicios.json'); // Conectamos y asociamos el archivo .json a un fetch con una funcion asincronica y lo guardamos en la variable resultado
        const db = await resultado.json(); // Guardamos los datos de la variable resultado en una variable llamada db y le decimos que lo muestre como un archivo JSOn

        const { servicios } = db; // Utilizamos destructurin para mencionar a la variable y guardarla en otra todo de una.

        /* Generar el HTML */
        servicios.forEach( servicio => {
            const { id, nombre, precio} = servicio;
            
            /* DOM Scripting */
            const cuerpoServicio = document.querySelector('.listado-servicios');
            // Nombre de los Servicios
            
            const nombreServicio = document.createElement('P');
            nombreServicio.classList.add('nom__servicios');
            nombreServicio.textContent = nombre;

            // Precio del Servicio
            const precioServicio = document.createElement('P');
            precioServicio.classList.add('precio__servicio');
            precioServicio.textContent = '$'+precio;

            // Div contenedor de los servicios
            const div = document.createElement('DIV');
            div.classList.add('div__servicios');
            div.appendChild(nombreServicio);
            div.appendChild(precioServicio)

            div.dataset.idServicio = id; // Esto nos va a generar en el div un atributo nuevo con el id del servicio que abarca todo el servicio

            // Selecciona un servicio para la cita
            div.onclick = seleccionarServicio;

            // console.log(div)
            cuerpoServicio.appendChild(div);

            
           
        } )


    } catch (error) {
        console.log(' No se a podido realizar la consulta '+error)
    }
}


function seleccionarServicio(e){
   
    
    let elemento; // El elemento lo agregamos sin valor ya que el valor lo va a decidir el condicional

    //Forzar al elemento al cual le damos click
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement // Cunado demos click en etiquetas hijas del div va a ser igual al div(e.target)
    }else{
        elemento = e.target; // Cuando demos click en el div el elemento va a ser igual a e.target
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    }else{
        elemento.classList.add('seleccionado')

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre:elemento.firstElementChild.textContent,
            precio:elemento.firstElementChild.nextElementSibling.textContent
        }
        // console.log(servicioObj)

        agregarServicio(servicioObj);
    }
    
}

function eliminarServicio(id){
    const { servicios } = cita ;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);

    console.log(cita)
}

function agregarServicio(servicioObj){
    const { servicios} = cita;
    cita.servicios = [...servicios, servicioObj];

    console.log(cita)
}



function paginaSiguiente(){
    const pagSiguiente = document.querySelector('#siguiente');
    pagSiguiente.addEventListener('click', ()=>{
        pagina++;

        botonesPaginador();
    })
}

function paginaAnterior(){
    const pagAnterior = document.querySelector('#anterior');
    pagAnterior.addEventListener('click', ()=>{
        pagina--;

        botonesPaginador();
    })
}

function botonesPaginador(){
    const pagSiguiente = document.querySelector('#siguiente');
    const pagAnterior = document.querySelector('#anterior');

    if (pagina === 1) {
        pagAnterior.classList.add('ocultar');
        pagSiguiente.classList.remove('ocultar');
    }else if(pagina === 3){
        pagSiguiente.classList.add('ocultar');
        pagAnterior.classList.remove('ocultar');

        mostrarResumen(); // Estamos en la pagina 3 carga el resumen de la cita
    }else{
        pagSiguiente.classList.remove('ocultar');
        pagAnterior.classList.remove('ocultar');
    }

    mostrarSeccion() // Cambia la seccion que se muestra
}

function mostrarResumen(){
    // Destructuring
    const {nombre, fecha, hora, servicios} = cita;

    // Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    // Limpiar el resumen
    // Manera 1) Mas optimizada
    // while (resumenDiv.firstChild) {
    //     resumenDiv.removeChihld( resumenDiv.firstChild );
    // }
    // Manera 2)
    resumenDiv.innerHTML = '';

    // Validacion de objeto
    if(Object.values(cita).includes('')){ // validar si el objeto esta vacio
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, Hora, Fecha o Nombre';
 
        noServicios.classList.add('invalidar__cita');
 
        resumenDiv.appendChild(noServicios);

        return;
     }

     // Mostrar el resumen
     const nombreCita = document.createElement('P');
     nombreCita.innerHTML = `<span class="span__resumen">Nombre: </span>${nombre}`;
     nombreCita.classList.add('resumenCita');

     const fechaCita = document.createElement('P');
     fechaCita.innerHTML = `<span class="span__resumen">Fecha: </span>${fecha}`;
     fechaCita.classList.add('resumenCita');

     const horaCita = document.createElement('P');
     horaCita.innerHTML = `<span class="span__resumen">Hora: </span>${hora}`;
     horaCita.classList.add('resumenCita');

     serviciosCita = document.createElement('DIV');
     serviciosCita.classList.add('resumen-servicios')

     const headingServicios = document.createElement('H3');
     headingServicios.textContent = 'Resumen de Servicios';
     headingServicios.classList.add('title__section')

     serviciosCita.appendChild(headingServicios);

     let cantidad = 0;

     const totalServicios = document.createElement('P');
     totalServicios.textContent = cantidad;
     totalServicios.classList.add('total__servicios');

     // Iterar sobre los servicios
     servicios.forEach( servicio => {

        const {nombre, precio} = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;
        textoServicio.classList.add('servicio');

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        // console.log(parseInt(totalServicio[1].trim()))
        cantidad += parseInt(totalServicio[1].trim());

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);

     })

     console.log(cantidad)

     resumenDiv.appendChild(nombreCita)
     resumenDiv.appendChild(fechaCita)
     resumenDiv.appendChild(horaCita)
     resumenDiv.appendChild(serviciosCita)

     const cantidadPagar = document.createElement('P');
     cantidadPagar.innerHTML = `<span class="span__total">Total: </span>$${cantidad}`;
     cantidadPagar.classList.add('total__pagar');
     
     resumenDiv.appendChild(cantidadPagar)
     


}

function nombreCita(){
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', (e)=>{
        const nombreTexto = e.target.value.trim();

        // Validacion de que el nombre del formulario tiene que tener algo
        if(nombreTexto === '' || nombreTexto.length <= 3){
            mostrarAlerta('nombre no valido', 'error')
        }else{
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    })
}

function mostrarAlerta(mensaje, tipo){
    
    // Si hay una alerta previa, entonces no mostrar otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return ;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje ;
    alerta.classList.add('alerta');

    if(tipo === 'error'){
        alerta.classList.add('error')
    }

    // Insertar en el HTML
    const formulario = document.querySelector('.form');
    formulario.appendChild(alerta)

    // Eliminar la alerta despues de 3 segundos
    setTimeout(() => {
        alerta.remove()
    }, 2000);
        
    
}

function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener( 'input', (e)=>{

        // Objeto de fecha que nos permite tener acceso a las fechas mucho mas especificas
        const dia = new Date(e.target.value).getUTCDay('0'); // Esto nos permite que los dias se cuenten como numeros (domingo = 0, hasta sabado = 6)

        if([0].includes(dia)){
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Domingo no es un dia valido', 'error')
        }else{
            cita.fecha = fechaInput.value;
            console.log(cita)
        }

        
        /*
        // Con esto el new date nos va a leer la info de la fecha en español
        const opciones = {
            weekday:'long',// Esto nos trae todo el nombre
            year:'numeric', // Esto nos trae del año la fecha con numero
            month:'numeric',
            day:'numeric'
             
        }
        console.log(dia.toLocaleDateString('es-ES', opciones));
        */
    })
}



function deshabilitarFechaAnterior (){
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    let mes = fechaAhora.getMonth() + 1;
    let dia = fechaAhora.getDate() + 1; 
    if (mes <= 9) {
        mes = '0' + mes;
    }
    if(dia <= 9){
        dia = '0' + dia;
    }
    // Formato deseado AAAA-MM-DD
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;
    
    inputFecha.min = fechaDeshabilitar;
}

function horaCita(){
    const horaInput = document.querySelector('#hora');
    horaInput.addEventListener('input', (e)=>{
        
        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if(hora[0] < 10 || hora[0] > 18){

            mostrarAlerta('Horario no valido', 'error')
            setTimeout(()=>{
                horaInput.value = '';
            },2000)
        }else{
            cita.hora = horaCita;
            console.log(cita)
        }

        
        // if(hora[0] > 20 || hora[0] < 10){
        //     console.log('horario no disponible')
        // }else if(hora[0] == 13 || hora[0] == 14 || hora[0] == 15 || hora[0] == 16 ){
        //     console.log('horario no disponible')
        // }else{
        //     cita.hora = horaCita;
        // }
})

}










