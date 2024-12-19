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

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    // Validar
    const  camposVacios = [mesa, hora].some(campo => campo === '');

    if(camposVacios){
        imprimirAlerta('Hay campos vacios');        
    }else{
        console.log('No hay campos vacios');
    }

    // Asignar datos del formulario al objeto cliente
    cliente = {...cliente, mesa, hora};

    // Ocultar modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();
    formularioModal.reset();
    // Mostar secciones
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

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);

        divPlatos.appendChild(row);

    });
    
}