document.addEventListener('DOMContentLoaded', () => {
    const btnCrearTablero = document.getElementById('boton');
    btnCrearTablero.addEventListener('click', crearYVaciarTablero)
})

function crearYVaciarTablero() {
    const contenedor = document.querySelector('#contenedor');
    contenedor.firstChild ? contenedor.firstChild.remove() : contenedor;

    const numeros = tomarNumeros();

    if (validacion(numeros.filas, numeros.columnas, numeros.minas)) {
        const tablero = crearTableroHtml(numeros.filas, numeros.columnas, numeros.minas);
        contenedor.appendChild(tablero)
        agregarEventos(numeros);
    } else {
        validacionError()
    }

}


function tomarNumeros() {
    let tablero = {
        filas: document.getElementById('filas').value,
        columnas: document.getElementById('columnas').value,
        minas: document.getElementById('minas').value
    }
    return tablero
}

const crearTableroHtml = (filas, columnas, minas) => {
    let numeroCasilla = 1;
    const tablero = document.createElement('div');

    const arrayMinas = crearYAsignarMinas(filas, columnas, minas);


    for (let x = 1; x <= filas; x++) {
        const fila = crearFila(columnas, numeroCasilla, arrayMinas, filas)
        tablero.appendChild(fila)
        numeroCasilla += parseInt(columnas)
    }

    return tablero;
}

const crearFila = (columnas, numeroCasilla, arrayMinas, filas) => {
    const fila = document.createElement('div');
    fila.classList.add('filas')

    for (let i = 1; i <= columnas; i++) {

        const casilla = crearCasilla(numeroCasilla, arrayMinas, columnas, filas)
        numeroCasilla++;
        fila.appendChild(casilla);
    }

    return fila;
}

function asignarPosicion(casilla, numeroCasilla, columnas, filas) {

    let esquinas = [1, columnas, columnas*filas, (columnas*filas) - (columnas - 1)]


    if (numeroCasilla == 1 || numeroCasilla == columnas || numeroCasilla == columnas * filas || numeroCasilla == (columnas * filas) - (columnas - 1)) {
        casilla.dataset.posicion = "esquina"
    }

}

const crearCasilla = (numeroCasilla, arrayMinas, columnas, filas) => {
    let casilla = document.createElement('div');
    casilla = asignarPosicion(casilla, numeroCasilla, columnas, filas);


    arrayMinas.includes(numeroCasilla) ? casilla.dataset.mina = true : casilla.dataset.mina = false;
    casilla.dataset.numero = numeroCasilla
    casilla.classList.add("boton")
    casilla.classList.add("casilla")


    return casilla
}

function crearYAsignarMinas(filas, columnas, numeroDeMinas) {
    const arrayCasillas = crearArrayCasillas(filas, columnas);

    return asignarMinas(arrayCasillas, numeroDeMinas);
}

function crearArrayCasillas(filas, columnas) {

    const casillasTotales = filas * columnas;
    let casillas = [];

    for (let i = 0; i < casillasTotales; i++) {
        casillas.push(i)
    }

    return casillas;
}

function asignarMinas(arrayCasillas, numeroDeMinas) {
    let arrayMinas = []

    let mina = Math.floor(Math.random() * arrayCasillas.length + 1)

    for (let i = 1; i <= numeroDeMinas; i++) {
        while (arrayMinas.includes(mina)) {
            mina = Math.floor(Math.random() * arrayCasillas.length + 1)
        }
        arrayMinas.push(mina);
    }

    return arrayMinas;
}

const validacion = (filas, columnas, minas) => {
    let casillasMayorAMinas = filas * columnas >= minas;
    let filasYColumnasMayorA0 = false;
    filas > 0 && columnas > 0 && minas > 0 ? filasYColumnasMayorA0 = true : filasYColumnasMayorA0 = false;

    return (casillasMayorAMinas && filasYColumnasMayorA0)
}

function validacionError() {
    alert("Ingrese numeros validos")
}

function agregarEventos(numeros) {

    const casillas = Array.from(document.getElementsByClassName('casilla'));
    casillas.forEach(casilla => {
        casilla.addEventListener('click', chequearAlRededor)
        casilla.addEventListener('click', boton_opened);
        casilla.addEventListener('mousedown', boton_opened);
        casilla.addEventListener('mouseout', boton_opened);
        casilla.addEventListener('mouseover', boton_opened);
    })
    document.addEventListener('mouseup', boton_opened)
}

let mouseDown = false;
function boton_opened(event) {
    eventoDeClicks(event)
}

function eventoDeClicks(event) {
    if (event.type == "click") {
        if (!(event.target.classList.contains('boton_opened'))) {
            event.target.classList.remove('boton_pressed')
            event.target.classList.add('boton_opened')
        }
        quitarEventos(event)
    }

    if (event.type == 'mousedown') {
        mouseDown = true;
        event.target.classList.add('boton_pressed')
    }

    if (event.type == 'mouseout') {
        if (mouseDown) {
            if (event.target.classList.contains('boton_pressed'))
                event.target.classList.remove('boton_pressed')
        }
    }

    if (event.type == 'mouseover') {
        if (mouseDown) {
            if (!(event.target.classList.contains('boton_pressed')))
                event.target.classList.add('boton_pressed')
        }
    }

    if (event.type == 'mouseup') {
        mouseDown = false;
    }
}

function quitarEventos(event) {
    event.target.removeEventListener('click', boton_opened)
    event.target.removeEventListener('click', chequearAlRededor)
    event.target.removeEventListener('mousedown', boton_opened)
    event.target.removeEventListener('mouseout', boton_opened)
    event.target.removeEventListener('mouseover', boton_opened)
}

function check(event, datos) {
    const casillasNorte = [-datos.columnas, -(datos.columnas - 1), +1, datos.columnas, +(datos.columnas + 1)];
    const casillasOeste = [-1, +1, (datos.columnas - 1), datos.columnas, +(datos.columnas + 1)]
    const casillasSur = [-datos.columnas, -(datos.columnas + 1), -1, (datos.columnas - 1), datos.columnas]
    const casillasEste = [-1, +1, -(datos.columnas - 1), -datos.columnas, -(datos.columnas + 1)]
    const casillasCentrales = [-(datos.columnas + 1), -(datos.columnas), -(datos.columnas - 1), -1, 1, +(datos.columnas - 1), datos.columnas, +(datos.columnas + 1)];
    const casillasEsquina1 = [datos.columnas, +1, +(datos.columnas + 1)]
    const casillasEsquina4 = [-1, (datos.columnas - 1), datos.columnas]
    const casillasEsquina13 = [+1, -(datos.columnas - 1), -datos.columnas]
    const casillasEsquina16 = [-1, -datos.columnas, -(datos.columnas + 1)]
}

function chequearAlRededor(evento) {
    const datos = tomarNumeros()
    const casillasCentrales = [-(parseInt(datos.columnas) + 1), -(parseInt(datos.columnas)), -(parseInt(datos.columnas - 1)), -1, 1, +(parseInt(datos.columnas - 1)), parseInt(datos.columnas), +(parseInt(datos.columnas) + 1)];
    const casillas = Array.from(document.getElementsByClassName('casilla'));
    const casillaActual = parseInt((evento.target.dataset.numero - 1));


    console.log(casillasCentrales)

    for (let i = 0; i < casillasCentrales.length; i++) {
        let contador = 0;
        let casilla2 = parseInt(casillaActual) + parseInt(casillasCentrales[i]);
        console.log(casillaActual + "+" + casillasCentrales[i] + "=" + parseInt(casillaActual) + parseInt(casillasCentrales[i]))

        if (casilla2 < 0) {
            console.log("menor a 0")
        }


        console.log(casillas[casilla2])
    }
}