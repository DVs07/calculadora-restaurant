let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardar = document.querySelector('#guardar-cliente');
const formularioModal = document.querySelector('.modal-body form');
btnGuardar.addEventListener('click', guardarCliente);

const divContenido = document.querySelector('#resumen .contenido');

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

function obtenerDatos(){
    const url = 'http://localhost:4000/platos';

    fetch(url).then( respuesta => respuesta.json())
    .then(resultado => mostrarPlatos(resultado))
    .catch(error => console.log(error));
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

    // console.log('Pedido: ', cliente.pedido);
    // Mostrar el Resumen
    limpiarHTML(divContenido);
    actualizarResumen();

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
    heading.classList.add('my-4d','text-center');
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

        const totalPlato = document.createElement('p'); 
        totalPlato.classList.add('fw-bold');        
        totalPlato.textContent = `Total: ${cantidad * precio}`;

        listaPlato.appendChild(nombrePlato);
        listaPlato.appendChild(cantidadPlato);
        listaPlato.appendChild(precioPlato);
        listaPlato.appendChild(totalPlato);

        listaPlatos.appendChild(listaPlato);

    })



    divResumen.appendChild(mesa);
    divResumen.appendChild(hora);
    divResumen.appendChild(heading);
    divResumen.appendChild(listaPlatos);

    divContenido.appendChild(divResumen);
    
}

function limpiarHTML(elemento){
    while(elemento.firstChild){
        elemento.removeChild(elemento.firstChild);
    }
}