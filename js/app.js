let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Guarniciones',
    4: 'Postres',
}

const btnGuardar = document.querySelector('#guardar-cliente');
const formularioModal = document.querySelector('.modal-body form');
btnGuardar.addEventListener('click', guardarCliente);

const divContenido = document.querySelector('#resumen .contenido');
const divCuenta = document.createElement('div');

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);

    // Validar
    const  camposVacios = [mesa, hora].some(campo => campo === '');

    // Asignar datos del formulario al objeto cliente
    cliente = {...cliente, mesa, hora};    

    if(camposVacios){
        imprimirAlerta('Hay campos vacios');        
    }else{
        console.log('No hay campos vacios');
    }
    
    formularioModal.reset();

    // Cierro modal y muestro secciones
    cerrarModal(modalFormulario, modalBootstrap);
    mostrarSecciones();

    obtenerDatos();
}

function imprimirAlerta(mensaje){
    const existeAlerta = document.querySelector('.bg-danger-subtle');

    if(!existeAlerta){
        const alerta = document.createElement('p');
        alerta.classList.add('bg-danger-subtle', 'text-center', 'p-2', 'text-danger','border', 'border-danger', 'rounded');
        alerta.textContent = mensaje;
        modalFormulario.appendChild(alerta);  

        setTimeout(() => {
            alerta.remove();
        }, 3000);

        return;
    }

}

function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => {
        seccion.classList.remove('d-none');
    })
}

async function obtenerDatos(){
    const url = 'https://my-json-server.typicode.com/DVs07/restaurant/platos'; // API 

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();

        mostrarPlatos(resultado);   
    } catch (error) {
        console.log(error);
    }
}

function mostrarPlatos(platos){
    // console.log('Desde mostrarPlatos: ', platos);
    const divPlatos = document.querySelector('#platos .contenido');

    platos.forEach(plato => {
        const row = document.createElement('div');
        row.classList.add('row','py-3','border-top');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = plato.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-3','fw-bold');
        precio.textContent = `$ ${plato.precio}`;

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[plato.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${plato.id}`;
        inputCantidad.classList.add('form-control');

        inputCantidad.onchange = function(){
            const cantidad = parseInt(inputCantidad.value);
            // console.log('Cantidad: ', cantidad);
            
            agregarPlato({...plato, cantidad});
        }; 

        const contendorInput = document.createElement('div');
        contendorInput.classList.add('col-md-2');
        
        contendorInput.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(contendorInput);

        divPlatos.appendChild(row);

    });
    
}

function cerrarModal(modalElement, bootstrapModalInstance) {
    bootstrapModalInstance.hide();
    
    modalElement.addEventListener('hidden.bs.modal', () => {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = ''; // Restablecer overflow
    
    const backdrop = document.querySelector('.modal-backdrop');

    if (backdrop) {
        backdrop.remove();
    }

    modalElement.remove(); // Eliminar el modal del DOM
    });
}


function agregarPlato(orden){
    // console.log('ID: ', id);   
    // console.log('Plato: ', orden);

    let {pedido} = cliente; // Desestructuro el pedido

    if(orden.cantidad > 0){
        // console.log('Se agrego un plato'); 
        // console.log(pedido.some(elemento => elemento.id === orden.id)); // Verifica si el plato ya esta en el pedido
        
        // Compruebo si el elemento ya existe en le array
        if(pedido.some(elemento => elemento.id === orden.id)){
            // El elemento ya existe
            const pedidoActualizado = pedido.map(elemento => {
                if(elemento.id === orden.id){
                    elemento.cantidad = orden.cantidad;
                }
                return elemento;
            })

            // Actualizo el pedido
            cliente.pedido = [...pedidoActualizado]; 

        }else{
            // El elemento no existe, lo agrego al array
           cliente.pedido = [...pedido, orden]; // Se agrega el plato al pedido  
        }
    }else{
        // Eliminar elemento cuando la cantidad sea 0
        const resultado = pedido.filter(elemento => elemento.id !== orden.id);

        cliente.pedido = [...resultado];
    }

    limpiarHTML(divContenido);

    if(cliente.pedido.length === 0){
        mensajeResumen();
    }else{
        actualizarResumen();
    }
    
}

function actualizarResumen(){
    // console.log('Actualizando resumen');

    const divResumen = document.createElement('div');
    divResumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold')
    
    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal')

    const hora = document.createElement('p');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold')

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;

    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    const heading = document.createElement('h3');
    heading.classList.add('my-4','text-center');
    heading.textContent = 'Platos Consumidos';

    const listaPlatos = document.createElement('ul');
    listaPlatos.classList.add('list-group');

    const {pedido} = cliente;
    pedido.forEach(plato => {
        const {nombre, cantidad, precio, id} = plato;

        const listaPlato = document.createElement('li');
        listaPlato.classList.add('list-group-item');

        const nombrePlato = document.createElement('h4');
        nombrePlato.classList.add('my-4');
        nombrePlato.textContent = nombre;

        const cantidadPlato = document.createElement('p');
        cantidadPlato.classList.add('fw-bold');
        cantidadPlato.textContent = `Cantidad: ${cantidad}`;

        const precioPlato = document.createElement('p');
        precioPlato.classList.add('fw-bold');
        precioPlato.textContent = `Precio: ${precio}`;

        const subTotalPlato = document.createElement('p'); 
        subTotalPlato.classList.add('fw-bold');        
        subTotalPlato.textContent = calcularSubtotal(precio, cantidad, 'Subtotal');

        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar Plato';
        btnEliminar.onclick = () => eliminarPlato(id);

        listaPlato.appendChild(nombrePlato);
        listaPlato.appendChild(cantidadPlato);
        listaPlato.appendChild(precioPlato);
        listaPlato.appendChild(subTotalPlato);
        listaPlato.appendChild(btnEliminar);
        
        listaPlatos.appendChild(listaPlato);


    })


    divResumen.appendChild(heading);
    divResumen.appendChild(mesa);
    divResumen.appendChild(hora);
    divResumen.appendChild(listaPlatos);

    divContenido.appendChild(divResumen);

    // Mostrar formulario de propinas
    formularioPropinas();
}

function limpiarHTML(elemento){
    while(elemento.firstChild){
        elemento.removeChild(elemento.firstChild);
    }
}

function calcularSubtotal(precio,cantidad,string ){
    return `${string}: $ ${precio*cantidad}`
}

function eliminarPlato(id){
    // console.log('Eliminando plato: ', id);
    const {pedido} = cliente;
    const resultado = pedido.filter(plato => plato.id !== id);
    cliente.pedido = [...resultado];

    limpiarHTML(divContenido);

    if(cliente.pedido.length === 0){
        mensajeResumen();
    }else{
        actualizarResumen();
    }
    
    // Limpiar el input de un plato eliminado
    const platoEliminado = `#producto-${id}`;
    const inputPlatoEliminado = document.querySelector(platoEliminado);
    inputPlatoEliminado.value = 0;
}

function mensajeResumen(){
    const texto = document.createElement('p');

    texto.classList.add('text-center', 'text-primary', 'fw-bold');
    texto.textContent = 'No hay platos en tu pedido';
    
    divContenido.appendChild(texto);
}

function formularioPropinas(){
    
    const divForm = document.createElement('div');
    divForm.classList.add('col-md-6','formulario');

    const formPropinas = document.createElement('div');
    formPropinas.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('h3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    // Radio Button 10%
    const input10 = document.createElement('input');
    input10.type = 'radio';
    input10.name = 'propina';
    input10.value = '10';
    input10.classList.add('form-check-input');
    input10.onclick = calcularPropina;
    
    const divRadio10 = document.createElement('div');
    divRadio10.classList.add('form-check');

    const label10 = document.createElement('label');
    label10.textContent = '10%';
    label10.classList.add('form-check-label');

    // Radio Button 25%
    const input25 = document.createElement('input');
    input25.type = 'radio';
    input25.name = 'propina';
    input25.value = '25';
    input25.classList.add('form-check-input');
    input25.onclick = calcularPropina;
    
    const divRadio25 = document.createElement('div');
    divRadio25.classList.add('form-check');

    const label25 = document.createElement('label');
    label25.textContent = '25%';
    label25.classList.add('form-check-label');    

    // Radio Button 50%
    const input50 = document.createElement('input');
    input50.type = 'radio';
    input50.name = 'propina';
    input50.value = '50';
    input50.classList.add('form-check-input');
    input50.onclick = calcularPropina;
    
    const divRadio50 = document.createElement('div');
    divRadio50.classList.add('form-check');

    const label50 = document.createElement('label');
    label50.textContent = '50%';
    label50.classList.add('form-check-label');

    divRadio10.appendChild(input10);
    divRadio10.appendChild(label10);

    divRadio25.appendChild(input25);
    divRadio25.appendChild(label25);

    divRadio50.appendChild(input50);
    divRadio50.appendChild(label50);

    divForm.appendChild(formPropinas);
    formPropinas.appendChild(heading);

    formPropinas.appendChild(divRadio10);
    formPropinas.appendChild(divRadio25);
    formPropinas.appendChild(divRadio50);

    divContenido.appendChild(divForm);
}

function calcularPropina(){
    //console.log('Calculando propina');

    const {pedido} = cliente;
    let subtotal = 0;

    // Calculo el subtotal
    pedido.forEach(plato => {
        subtotal += plato.precio * plato.cantidad;
    });

    //console.log('Subtotal: ', subtotal);

    //Seleccionar el porcentaje de propina
    const propinaSeleccionada = document.
    querySelector('[name="propina"]:checked').value;

    //console.log(parseInt(propinaSeleccionada));
    
    //Calcular la propina
    const propina = ((subtotal * parseInt(propinaSeleccionada)) / 100);
    console.log('Propina: ', propina);
    
    // Calcular el total
    const total = subtotal + propina;
    console.log('Total: ', total);
    
    // Mostrar la cuenta
    mostrarCuenta(subtotal, propina, total);
}

function mostrarCuenta(subtotal, propina, total){

    limpiarHTML(divCuenta);
    
    divCuenta.classList.add('col', 'total-pagar');
    // Subtotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fw-bold', 'mt-2', 'fs-4', 'border-top', 'pt-2');
    subtotalParrafo.textContent = 'Subtotal: ';

    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add('fw-normal', 'fs-4');
    subtotalSpan.textContent = `$ ${subtotal}`;

    subtotalParrafo.appendChild(subtotalSpan);
    divCuenta.appendChild(subtotalParrafo);

    // Propina
    const propinaParrafo = document.createElement('p');
    propinaParrafo.classList.add('fw-bold', 'mt-2', 'fs-4');
    propinaParrafo.textContent = 'Propina: ';

    const propinaSpan = document.createElement('span');
    propinaSpan.classList.add('fw-normal', 'fs-4');
    propinaSpan.textContent = `$ ${propina}`;

    propinaParrafo.appendChild(propinaSpan);
    divCuenta.appendChild(propinaParrafo);

    // Total
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fw-bold', 'mt-2', 'fs-4', 'border-top', 'pt-2');
    totalParrafo.textContent = 'Total: ';

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('fw-normal', 'fs-4');
    totalSpan.textContent = `$ ${total}`;

    totalParrafo.appendChild(totalSpan);
    divCuenta.appendChild(totalParrafo);

    const form =document.querySelector('.formulario > div');


    // Cada vez que selecciono una propina, se limpia el HTML del divCuenta con la funcion limpiarHTML()
    form.appendChild(divCuenta);    
}