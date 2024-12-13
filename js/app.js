let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const btnGuardar = document.querySelector('#guardar-cliente');

btnGuardar.addEventListener('click', guardarCliente);

function guardarCliente(){
    // console.log('Desde la funcion guardarCliente');
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    // Validar
    const  camposVacios = [mesa, hora].some(campo => campo === '');

    if(camposVacios){
        imprimirAlerta('Hay campos vacios');        
    }else{
        console.log('No hay campos vacios');
        
    }
}

function imprimirAlerta(mensaje){
    const existeAlerta = document.querySelector('.bg-danger-subtle');

    if(!existeAlerta){
        const alerta = document.createElement('p');
        alerta.classList.add('bg-danger-subtle', 'text-center', 'p-2', 'text-danger','border', 'border-danger', 'rounded');
        alerta.textContent = mensaje;
        document.querySelector('.modal-body form').appendChild(alerta);  

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

    
    

}