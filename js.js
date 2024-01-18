document.addEventListener('DOMContentLoaded', () => {
    const btnCrearTablero = document.getElementById('boton');
    btnCrearTablero.addEventListener('click', crearYVaciarTablero)
})

function crearYVaciarTablero() {
    console.clear()
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

    const posiciones = crearPosiciones(columnas, filas)

    const posicion = Object.keys(posiciones).find(key => posiciones[key].includes(numeroCasilla));

    if (posicion) {
        casilla.dataset.posicion = posicion;
    }

}

function crearPosiciones(columnasArgumento, filas) {
    let columnas = parseInt(columnasArgumento)
    let todasLasCasillas = [];

    let posicion = {};
    posicion.esquina = [1, columnas, columnas * filas, (columnas * filas) - (columnas - 1)];
    posicion.norte = [];
    posicion.sur = [];
    posicion.oeste = [];
    posicion.este = [];
    posicion.centrales = [];

    for (let i = 1; i <= parseInt(filas) * columnas; i++) {
        todasLasCasillas.push(i)
    }

    for (i = 2; i < columnas; i++) {
        posicion.norte.push(i)
    }

    for (i = posicion.esquina[3] + 1; i < posicion.esquina[2]; i++) {
        posicion.sur.push(i);
    }

    for (i = 1 + columnas; i < posicion.esquina[3]; i += columnas) {
        posicion.oeste.push(i);
    }

    for (i = columnas * 2; i < posicion.esquina[2]; i += columnas) {
        posicion.este.push(i);
    }

    let todoExceptoCentrales = posicion.esquina.concat(posicion.norte, posicion.sur, posicion.oeste, posicion.este)

    posicion.centrales = todasLasCasillas.filter(elemento => !todoExceptoCentrales.includes(elemento));

    return posicion;

}


const crearCasilla = (numeroCasilla, arrayMinas, columnas, filas) => {
    let casilla = document.createElement('div');

    asignarPosicion(casilla, numeroCasilla, columnas, filas);

    arrayMinas.includes(numeroCasilla) ? casilla.dataset.mina = true : casilla.dataset.mina = false;
    casilla.dataset.numero = numeroCasilla
    casilla.classList.add("boton")
    casilla.classList.add("boton_closed")
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
        casilla.addEventListener('mouseout', eventoDeClicks);
        casilla.addEventListener('mouseover', eventoDeClicks);
        casilla.addEventListener('contextmenu', eventoDeClicks);
    })
    document.addEventListener('mousedown', eventoDeClicks);
    document.addEventListener('mouseup', eventoDeClicks)
}

let mouseDown = false;

function eventoDeClicks(event) {

    if (event.type == 'mousedown') {
        if (event.button == 0 && !event.target.classList.contains('boton_flag')) {
            mouseDown = true;
            if (event.target.classList.contains('casilla')) {
                event.target.classList.add('boton_pressed')
            }
        }
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
        if (event.button == 0 && !event.target.classList.contains('boton_flag')) {
            event.target.click()
        }
    }

    if (event.type == "contextmenu") {
        console.log(event)
        event.preventDefault();
        event.target.classList.toggle('boton_flag')
    }
}

function colocarBandera(evento) {

}

function quitarEventos(objetivo) {
    objetivo.removeEventListener('click', chequearAlRededor)
    objetivo.removeEventListener('mouseout', eventoDeClicks)
    objetivo.removeEventListener('mouseover', eventoDeClicks)
    objetivo.removeEventListener('contextmenu', eventoDeClicks)
}

function parche(evento) {
    quitarEventos(evento)
    evento.classList.remove('boton_closed')
}

function chequearAlRededor(evento) {
    if (!evento.target.classList.contains('boton_flag')) {

        parche(evento.target)
        if (evento.target.dataset.mina == "true") { // Si tiene mina coloca  mine red y explosion
            explosion(evento)
        } else {                                    // Si no tiene mina chequea la posicion para poder contar las minas al rededor correctamente.
            const casillas = Array.from(document.getElementsByClassName('casilla'))

            if (evento.target.dataset.posicion == "esquina") {
                let posicion = tomarNumeros();
                let columnas = parseInt(posicion.columnas);
                let filas = parseInt(posicion.filas)
                let esquinas = [1, columnas, columnas * filas, (columnas * filas) - (columnas - 1)]

                if (evento.target.dataset.numero == esquinas[0]) {
                    let minas = chequearEsquina(evento, casillas, "noroeste");
                    minas.contador == 0 ? sinMinas(evento, minas.array) : minas.contador
                    colocarNumero(evento, minas.contador)

                }

                if (evento.target.dataset.numero == esquinas[1]) {
                    let minas = chequearEsquina(evento, casillas, "noreste");
                    minas.contador == 0 ? sinMinas(evento, minas.array) : minas.contador
                    colocarNumero(evento, minas.contador)
                }

                if (evento.target.dataset.numero == esquinas[3]) {
                    let minas = chequearEsquina(evento, casillas, "suroeste");
                    minas.contador == 0 ? sinMinas(evento, minas.array) : minas.contador
                    colocarNumero(evento, minas.contador)
                }

                if (evento.target.dataset.numero == esquinas[2]) {
                    let minas = chequearEsquina(evento, casillas, "sureste");
                    minas.contador == 0 ? sinMinas(evento, minas.array) : minas.contador
                    colocarNumero(evento, minas.contador)
                }

            }

            if (evento.target.dataset.posicion == "norte") {
                let minas = chequearNorte(evento, casillas);
                minas.contador == 0 ? sinMinas(evento, minas.array) : minas.contador
                colocarNumero(evento, minas.contador)
            }

            if (evento.target.dataset.posicion == "sur") {
                let minas = chequearSur(evento, casillas);
                minas.contador == 0 ? sinMinas(evento, minas.array) : minas.contador
                colocarNumero(evento, minas.contador)
            }

            if (evento.target.dataset.posicion == "centrales") {
                let minas = chequearCentrales(evento, casillas);
                minas.contador == 0 ? sinMinas(evento, minas.array) : minas.contador
                colocarNumero(evento, minas.contador)
            }

            if (evento.target.dataset.posicion == "oeste") {
                let minas = chequearOeste(evento, casillas);
                minas.contador == 0 ? sinMinas(evento, minas.array) : minas.contador
                colocarNumero(evento, minas.contador)
            }

            if (evento.target.dataset.posicion == "este") {
                let minas = chequearEste(evento, casillas);
                minas.contador == 0 ? sinMinas(evento, minas.array) : minas.contador
                colocarNumero(evento, minas.contador)
            }
        }
    }
}

function chequearEsquina(evento, casillas, esquina) {
    let retorno = {};
    let numeros = tomarNumeros()
    let columnas = parseInt(numeros.columnas)

    let arrayNoroeste = [+1, +columnas, +(columnas + 1)]
    let arrayNoreste = [-1, +columnas, +(columnas - 1)]
    let arraySuroeste = [+1, -columnas, -(columnas - 1)]
    let arraySureste = [-1, -columnas, -(columnas + 1)]
    let array;

    let casillaActual = evento.target.dataset.numero - 1;
    let contador = 0;

    switch (esquina) {
        case "noroeste":

            retorno.array = arrayNoroeste
            for (let i = 0; i < arrayNoroeste.length; i++) {
                let casillaAdyacente = casillaActual + arrayNoroeste[i];
                if (casillas[casillaAdyacente].dataset.mina == "true") {
                    contador++;
                }
            }

            break;

        case "noreste":

            retorno.array = arrayNoreste
            for (let i = 0; i < arrayNoroeste.length; i++) {
                let casillaAdyacente = casillaActual + arrayNoreste[i];
                if (casillas[casillaAdyacente].dataset.mina == "true") {
                    contador++;
                }
            }

            break;

        case "suroeste":

            retorno.array = arraySuroeste
            for (let i = 0; i < arrayNoroeste.length; i++) {
                let casillaAdyacente = casillaActual + arraySuroeste[i];
                if (casillas[casillaAdyacente].dataset.mina == "true") {
                    contador++;
                }
            }

            break;

        case "sureste":

            retorno.array = arraySureste
            for (let i = 0; i < arrayNoroeste.length; i++) {
                let casillaAdyacente = casillaActual + arraySureste[i];
                if (casillas[casillaAdyacente].dataset.mina == "true") {
                    contador++;
                }
            }

            break;
    }

    retorno.contador = contador;

    return retorno;
}

function chequearCentrales(evento, casillas) {
    let retorno = {};
    let numeros = tomarNumeros()
    let columnas = parseInt(numeros.columnas)

    let casillaActual = evento.target.dataset.numero - 1;
    let contador = 0;
    let array = [+columnas, +1, -1, +(columnas - 1), +(columnas + 1), -columnas, -(columnas - 1), -(columnas + 1)]

    for (let i = 0; i < array.length; i++) {
        let casillaAdyacente = casillaActual + array[i];
        if (casillas[casillaAdyacente].dataset.mina == "true") {
            contador++;
        }
    }
    retorno.contador = contador
    retorno.array = array;
    return retorno;
}

function chequearNorte(evento, casillas) {
    let retorno = {};
    let numeros = tomarNumeros()
    let columnas = parseInt(numeros.columnas)
    let casillaActual = evento.target.dataset.numero - 1;
    let contador = 0;
    let array = [+columnas, +1, -1, +(columnas - 1), +(columnas + 1)]

    for (let i = 0; i < array.length; i++) {
        let casillaAdyacente = casillaActual + array[i];
        if (casillas[casillaAdyacente].dataset.mina == "true") {
            contador++;
        }
    }

    retorno.contador = contador
    retorno.array = array;
    return retorno;
}

function chequearSur(evento, casillas) {
    let retorno = {}
    let numeros = tomarNumeros()
    let columnas = parseInt(numeros.columnas)
    let casillaActual = evento.target.dataset.numero - 1;
    let contador = 0;
    let array = [+1, -1, -columnas, -(columnas + 1), -(columnas - 1)]

    for (let i = 0; i < array.length; i++) {
        let casillaAdyacente = casillaActual + array[i];
        if (casillas[casillaAdyacente].dataset.mina == "true") {
            contador++;
        }
    }
    retorno.contador = contador
    retorno.array = array;
    return retorno;
}

function chequearOeste(evento, casillas) {
    let retorno = {};
    let numeros = tomarNumeros()
    let columnas = parseInt(numeros.columnas)
    let casillaActual = evento.target.dataset.numero - 1;
    let contador = 0;
    let array = [-columnas, +columnas, +1, -(columnas - 1), +(columnas + 1)]

    for (let i = 0; i < array.length; i++) {
        let casillaAdyacente = casillaActual + array[i];
        if (casillas[casillaAdyacente].dataset.mina == "true") {
            contador++;
        }
    }
    retorno.contador = contador
    retorno.array = array;
    return retorno;
}

function chequearEste(evento, casillas) {
    let retorno = {}
    let numeros = tomarNumeros()
    let columnas = parseInt(numeros.columnas)
    let casillaActual = evento.target.dataset.numero - 1;
    let contador = 0;
    let array = [-columnas, +columnas, -1, +(columnas - 1), -(columnas + 1)]

    for (let i = 0; i < array.length; i++) {
        let casillaAdyacente = casillaActual + array[i];
        if (casillas[casillaAdyacente].dataset.mina == "true") {
            contador++;
        }
    }
    retorno.contador = contador
    retorno.array = array;
    return retorno;
}

function colocarNumero(evento, minas) {
    evento.target.classList.add(`boton_${minas}`)
}

function sinMinas(evento, array) {
    let casillaActual = parseInt(evento.target.dataset.numero) - 1
    const casillas = Array.from(document.getElementsByClassName('casilla'));

    for (let i = 0; i < array.length; i++) {
        let casillaAdyacente = casillaActual + array[i];

        if (casillas[casillaAdyacente].classList.contains('boton_closed')) {
            casillas[casillaAdyacente].click()
            console.log(casillas[casillaAdyacente])
            console.log("contiene")
        }
    }
}

function explosion(evento) {
    document.removeEventListener('mousedown', eventoDeClicks)
    document.removeEventListener('mouseup', eventoDeClicks)
    const casillas = Array.from(document.getElementsByClassName('casilla'))


    casillas.forEach(elemento => {
        elemento.dataset.mina == "true" ? elemento.classList.add('boton_mine') : elemento.dataset.mina
        quitarEventos(elemento)
    })
    evento.target.classList.remove('boton_mine')
    evento.target.classList.add('boton_9')
}