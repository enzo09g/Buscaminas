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
        casilla.addEventListener('click', generarChequeo)
        casilla.addEventListener('mouseout', eventoDeClicks);
        casilla.addEventListener('mouseover', eventoDeClicks);
        casilla.addEventListener('contextmenu', eventoDeClicks);
    })
    document.addEventListener('mousedown', eventoDeClicks);
    document.addEventListener('mouseup', eventoDeClicks)

    const contenedor = document.getElementById('contenedor');
    contenedor.addEventListener('contextmenu', (evento) => {
        evento.preventDefault();
    })
}

function eventoMouseDown(event, casillas, numeros) {
    if (event.button == 2 && event.target.classList.contains('boton_closed')) {
        event.target.classList.toggle('boton_flag')
    }
    if (event.button == 0 && !event.target.classList.contains('boton_flag')) {
        if (event.target.classList.contains('casilla')) {
            event.target.classList.add('boton_pressed')
        }
        if (!event.target.classList.contains('boton_closed')) {
            let minas = chequearMinas(event.target, casillas, numeros)
            let array = sinMinas(event.target, minas.array)
            marcarCasillasPresionadas(array, "add")
        }
        mouseDown = true;
    }
}

function eventoMouseUp(event, casillas, numeros) {
    mouseDown = false;

    let minas = chequearMinas(event.target, casillas, numeros)
    let array = sinMinas(event.target, minas.array)
    marcarCasillasPresionadas(array)


    if (event.button == 0 && !event.target.classList.contains('boton_flag')) {
        event.target.click()
    }
    if (event.target.dataset.nMinas && minas.banderas) {
        if (event.target.dataset.nMinas == minas.banderas)
            expansion(sinMinas(event.target, minas.array), minas.contador, minas.banderas)
    }
}

function eventoMouseOut(event, casillas, numeros) {
    if (mouseDown) {
        if (event.target.classList.contains('boton_pressed')) {
            event.target.classList.remove('boton_pressed')
        }
        let pressed = Array.from(document.getElementsByClassName('boton_pressed'))
        pressed.forEach(elemento => {
            elemento.classList.remove('boton_pressed')
        })
    }
}

function eventoMouseOver(event, casillas, numeros) {
    if (mouseDown) {
        if (!(event.target.classList.contains('boton_pressed'))) {
            event.target.classList.add('boton_pressed')
        }
        if (!event.target.classList.contains('boton_closed')) {
            let minas = chequearMinas(event.target, casillas, numeros)
            let array = sinMinas(event.target, minas.array)
            marcarCasillasPresionadas(array, "add")
        }
    }
}

function marcarCasillasPresionadas(array, string) {
    if (string) {
        array.forEach(elemento => {
            elemento.classList.add('boton_pressed')
        })
    } else {
        array.forEach(elemento => {
            elemento.classList.remove('boton_pressed')
        })
    }
}

let mouseDown = false;

function eventoDeClicks(event) {

    const casillas = document.getElementsByClassName('casilla');
    const numeros = tomarNumeros()

    if (event.type == 'mousedown') {
        eventoMouseDown(event, casillas, numeros)
    }

    if (event.type == 'mouseout') {
        eventoMouseOut(event)
    }

    if (event.type == 'mouseover') {
        eventoMouseOver(event, casillas, numeros)
    }

    if (event.type == 'mouseup') {
        eventoMouseUp(event, casillas, numeros)
    }

    if (event.type == "contextmenu") {
        event.preventDefault();
    }
}

function quitarEventos(objetivo) {
    if (objetivo.classList.contains('boton_0')) {
        objetivo.removeEventListener('click', generarChequeo)
        objetivo.removeEventListener('mouseout', eventoDeClicks)
        objetivo.removeEventListener('mouseover', eventoDeClicks)
        objetivo.removeEventListener('contextmenu', eventoDeClicks)
    }
}

function parche(evento) {
    evento.classList.remove('boton_closed')
}

function chequearAlRededor(evento, casillaCondicion) {

    if (!casillaCondicion) {
        functionCasillaCondicion(evento, casillaCondicion)
    } else {
        functionCasillaCondicion(null, casillaCondicion)
    }
}

function functionCasillaCondicion(evento, casillaCondicion) {
    let target = event[evento] || casillaCondicion
    let estadoDelJuego = false;
    if (!target.classList.contains('boton_flag')) {

        parche(target)

        let posicion = tomarNumeros();
        if (target.dataset.mina == "true") { // Si tiene mina coloca  mine red y explosion
            explosion(target)
            estadoDelJuego = true;
        } else {                                    // Si no tiene mina chequea la posicion para poder contar las minas al rededor correctamente.
            const casillas = Array.from(document.getElementsByClassName('casilla'))
            chequearMinas(target, casillas, posicion, true)
            finDePartida(posicion.minas, estadoDelJuego);
        }
        quitarEventos(target)
    }


}

function chequearMinas(target, casillas, posicion, boolean) {
    posicion = posicion || tomarNumeros()
    let minas;
    if (target.dataset.posicion == "esquina") {
        let columnas = parseInt(posicion.columnas);
        let filas = parseInt(posicion.filas)
        let esquinas = [1, columnas, columnas * filas, (columnas * filas) - (columnas - 1)]

        if (target.dataset.numero == esquinas[0]) {
            minas = chequearEsquina(target, casillas, "noroeste");
            if (boolean) {
                expansion(sinMinas(target, minas.array), minas.contador)
                colocarNumero(target, minas.contador)
            }
        }

        if (target.dataset.numero == esquinas[1]) {
            minas = chequearEsquina(target, casillas, "noreste");
            if (boolean) {
                expansion(sinMinas(target, minas.array), minas.contador)
                colocarNumero(target, minas.contador)
            }

        }

        if (target.dataset.numero == esquinas[3]) {
            minas = chequearEsquina(target, casillas, "suroeste");
            if (boolean) {
                expansion(sinMinas(target, minas.array), minas.contador)
                colocarNumero(target, minas.contador)
            }

        }

        if (target.dataset.numero == esquinas[2]) {
            minas = chequearEsquina(target, casillas, "sureste");
            if (boolean) {
                expansion(sinMinas(target, minas.array), minas.contador)
                colocarNumero(target, minas.contador)
            }

        }

    }

    if (target.dataset.posicion == "norte") {
        minas = chequearNorte(target, casillas);
        if (boolean) {
            expansion(sinMinas(target, minas.array), minas.contador)
            colocarNumero(target, minas.contador)
        }

    }

    if (target.dataset.posicion == "sur") {
        minas = chequearSur(target, casillas);
        if (boolean) {
            expansion(sinMinas(target, minas.array), minas.contador)
            colocarNumero(target, minas.contador)
        }

    }

    if (target.dataset.posicion == "centrales") {
        minas = chequearCentrales(target, casillas);
        if (boolean) {
            expansion(sinMinas(target, minas.array), minas.contador)
            colocarNumero(target, minas.contador)
        }

    }

    if (target.dataset.posicion == "oeste") {
        minas = chequearOeste(target, casillas);
        if (boolean) {
            expansion(sinMinas(target, minas.array), minas.contador)
            colocarNumero(target, minas.contador)
        }

    }

    if (target.dataset.posicion == "este") {
        minas = chequearEste(target, casillas);
        if (boolean) {
            expansion(sinMinas(target, minas.array), minas.contador)
            colocarNumero(target, minas.contador)
        }

    }
    return minas;
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

    let casillaActual = evento.dataset.numero - 1;
    let contador = 0;
    let contadorBanderas = 0;

    switch (esquina) {
        case "noroeste":

            retorno.array = arrayNoroeste
            for (let i = 0; i < arrayNoroeste.length; i++) {
                let casillaAdyacente = casillaActual + arrayNoroeste[i];
                if (casillas[casillaAdyacente].dataset.mina == "true") {
                    contador++;
                }
                if (casillas[casillaAdyacente].classList.contains('boton_flag')) {
                    contadorBanderas++;
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
                if (casillas[casillaAdyacente].classList.contains('boton_flag')) {
                    contadorBanderas++;
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
                if (casillas[casillaAdyacente].classList.contains('boton_flag')) {
                    contadorBanderas++;
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
                if (casillas[casillaAdyacente].classList.contains('boton_flag')) {
                    contadorBanderas++;
                }
            }

            break;
    }

    retorno.banderas = contadorBanderas;
    retorno.contador = contador;

    return retorno;
}

function chequearCentrales(evento, casillas) {
    let retorno = {};
    let numeros = tomarNumeros()
    let columnas = parseInt(numeros.columnas)

    let casillaActual = evento.dataset.numero - 1;
    let contador = 0;
    let contadorBanderas = 0;
    let array = [+columnas, +1, -1, +(columnas - 1), +(columnas + 1), -columnas, -(columnas - 1), -(columnas + 1)]

    for (let i = 0; i < array.length; i++) {
        let casillaAdyacente = casillaActual + array[i];
        if (casillas[casillaAdyacente].dataset.mina == "true") {
            contador++;
        }
        if (casillas[casillaAdyacente].classList.contains('boton_flag')) {
            contadorBanderas++;
        }
    }
    retorno.banderas = contadorBanderas;
    retorno.contador = contador;
    retorno.array = array;
    return retorno;
}

function chequearNorte(evento, casillas) {
    let retorno = {};
    let numeros = tomarNumeros()
    let columnas = parseInt(numeros.columnas)
    let casillaActual = evento.dataset.numero - 1;
    let contador = 0;
    let contadorBanderas = 0;
    let array = [+columnas, +1, -1, +(columnas - 1), +(columnas + 1)]

    for (let i = 0; i < array.length; i++) {
        let casillaAdyacente = casillaActual + array[i];
        if (casillas[casillaAdyacente].dataset.mina == "true") {
            contador++;
        }
        if (casillas[casillaAdyacente].classList.contains('boton_flag')) {
            contadorBanderas++;
        }
    }

    retorno.banderas = contadorBanderas
    retorno.contador = contador
    retorno.array = array;
    return retorno;
}

function chequearSur(evento, casillas) {
    let retorno = {}
    let numeros = tomarNumeros()
    let columnas = parseInt(numeros.columnas)
    let casillaActual = evento.dataset.numero - 1;
    let contador = 0;
    let contadorBanderas = 0;
    let array = [+1, -1, -columnas, -(columnas + 1), -(columnas - 1)]

    for (let i = 0; i < array.length; i++) {
        let casillaAdyacente = casillaActual + array[i];
        if (casillas[casillaAdyacente].dataset.mina == "true") {
            contador++;
        }
        if (casillas[casillaAdyacente].classList.contains('boton_flag')) {
            contadorBanderas++;
        }
    }

    retorno.banderas = contadorBanderas;
    retorno.contador = contador
    retorno.array = array;
    return retorno;
}

function chequearOeste(evento, casillas) {
    let retorno = {};
    let numeros = tomarNumeros()
    let columnas = parseInt(numeros.columnas)
    let casillaActual = evento.dataset.numero - 1;
    let contador = 0;
    let contadorBanderas = 0;
    let array = [-columnas, +columnas, +1, -(columnas - 1), +(columnas + 1)]

    for (let i = 0; i < array.length; i++) {
        let casillaAdyacente = casillaActual + array[i];
        if (casillas[casillaAdyacente].dataset.mina == "true") {
            contador++;
        }
        if (casillas[casillaAdyacente].classList.contains('boton_flag')) {
            contadorBanderas++;
        }
    }

    retorno.banderas = contadorBanderas;
    retorno.contador = contador;
    retorno.array = array;
    return retorno;
}

function chequearEste(evento, casillas) {
    let retorno = {}
    let numeros = tomarNumeros()
    let columnas = parseInt(numeros.columnas)
    let casillaActual = evento.dataset.numero - 1;
    let contador = 0;
    let contadorBanderas = 0;
    let array = [-columnas, +columnas, -1, +(columnas - 1), -(columnas + 1)]

    for (let i = 0; i < array.length; i++) {
        let casillaAdyacente = casillaActual + array[i];
        if (casillas[casillaAdyacente].dataset.mina == "true") {
            contador++;
        }
        if (casillas[casillaAdyacente].classList.contains('boton_flag')) {
            contadorBanderas++;
        }
    }

    retorno.banderas = contadorBanderas;
    retorno.contador = contador
    retorno.array = array;
    return retorno;
}

function colocarNumero(evento, minas) {
    evento.classList.add(`boton_${minas}`)
    evento.dataset.nMinas = minas
}

function sinMinas(evento, array) {
    let casillaActual = parseInt(evento.dataset.numero) - 1
    const casillas = Array.from(document.getElementsByClassName('casilla'));
    let casillasSinMinas = []

    for (let i = 0; i < array.length; i++) {
        let casillaAdyacente = casillaActual + array[i];

        if (casillas[casillaAdyacente].classList.contains('boton_closed')) {
            casillasSinMinas.push(casillas[casillaAdyacente])
        }
    }
    return casillasSinMinas;
}

function expansion(array, minas, banderas) {

    for (let i = 0; i < array.length; i++) {
        if (minas == 0) {
            chequearAlRededor("target", array[i])
        }
        if (minas && banderas) {
            if (minas == banderas) {
                chequearAlRededor("target", array[i])
            }
        }
    }

}

function explosion(evento) {
    document.removeEventListener('mousedown', eventoDeClicks)
    document.removeEventListener('mouseup', eventoDeClicks)
    const casillas = Array.from(document.getElementsByClassName('casilla'))


    casillas.forEach(elemento => {
        if (elemento.classList.contains('boton_flag') && elemento.dataset.mina == "false") {
            elemento.classList.add('boton_wrong')
        }
        elemento.dataset.mina == "true" ? elemento.classList.add('boton_mine') : elemento.dataset.mina
        quitarEventos(elemento)
    })
    evento.classList.remove('boton_mine')
    evento.classList.add('boton_9')
}


function finDePartida(minas, boolean) {

    if (!boolean) {
        const casillas = Array.from(document.getElementsByClassName('boton_closed'))
        if (casillas.length == parseInt(minas)) {
            victoria();
        }
    }
}

function victoria() {
    const casillas = Array.from(document.getElementsByClassName('casilla'));

    casillas.forEach(elemento => {
        quitarEventos(elemento);
        document.removeEventListener('mouseup', eventoDeClicks);
        document.removeEventListener('mousedown', eventoDeClicks);
        if (elemento.classList.contains('boton_closed')) {
            elemento.classList.remove('boton_closed');
            elemento.classList.add('boton_flag');
        }
    })
}


function crearFuncionChequeoAlRededor(target) {
    return function () {
        chequearAlRededor(target);
    }
}

const generarChequeo = crearFuncionChequeoAlRededor("target");