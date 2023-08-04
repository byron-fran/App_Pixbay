const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario')
const paginador = document.querySelector('#paginador');
const card = document.querySelector('.card');


const numeroPorPagina = 30;
let totalPaginas;
let iterador;
let paginaActual = 1;
window.onload = () => {
    formulario.addEventListener('submit', validarFormulario)
}

//Funcion para hacer validaciones
function validarFormulario(e){
    e.preventDefault();
    const terminoBusqueda = document.querySelector('#terminoBusqueda').value;
    if(terminoBusqueda === ''){
        mostrarAlerta('No puede ir vacio')
    }
    getData()


};

//Muestra un mensaje de alerta 
function mostrarAlerta(mensaje){
    const elminarALerta = document.querySelector('.alerta');
    if(!elminarALerta){
        const alerta = document.createElement('p');
        alerta.innerHTML = mensaje;
        alerta.classList.add('alerta')
        formulario.appendChild(alerta);

        setTimeout(() => {
            formulario.removeChild(alerta);
        },2000)
    }
};

//hace peticion a la api
async function getData () {
    const terminoBusqueda = document.querySelector('#terminoBusqueda').value;
    const url = `https://pixabay.com/api/?key=30285645-15ef99a73781bfe8606a97aa9&q=${terminoBusqueda}&per_page=${numeroPorPagina}&page=${paginaActual}`
    const res = await fetch(url);
    const data = await res.json();

    totalPaginas = calcularPaginas (data.totalHits)
    mostrarImagenes(data.hits);
};

//usa un generador para crear paginaciones
function *creadorPaginas(total){
    for(let i =1; i<=total; i++){
        yield i
    }
}

function calcularPaginas  (total) {
    return parseInt(Math.ceil(total / numeroPorPagina));
}

//Consulta en la api y muestra las imagenes
function mostrarImagenes(data){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
    const total = data.map(elemento => {
        const {largeImageURL,tags,views, likes} = elemento
        const card = document.createElement('div');
        card.classList.add('card')
        card.innerHTML = `
            <img src=${largeImageURL} class='imagen'/>
        `;
        resultado.appendChild(card)
    });
    while(paginador.firstChild){
        paginador.removeChild(paginador.firstChild)
    }
     imprimirPaginador()
};

//imprime botones para paginaciones
function imprimirPaginador(){
    iterador = creadorPaginas(totalPaginas);
    while(true){
        const {done, value} = iterador.next()
        if(done) return;

        //caso contrario generará un boto por cada pagina
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('botonNext');
        paginador.appendChild(boton);
        boton.onclick = () => {
            paginaActual = value;
            getData()
        }
    }
}