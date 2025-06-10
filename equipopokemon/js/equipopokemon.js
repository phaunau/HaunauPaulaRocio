let tiradasA = [];
let tiradasB = [];
function verificarTiradas() {
    if (tiradasA.length < 3 || tiradasB.length < 3) {

        return
    }
    if (tiradasA.length >= 3 && tiradasB.length >= 3) {
        document.getElementById('Randomizador').disabled = false;
    }
    let mayorA = 0;
    for (let i = 0; i < tiradasA.length; i++) {
        if (tiradasA[i] > mayorA) {
            mayorA = tiradasA[i]
        }
    }

    let mayorB = 0;
    for (let i = 0; i < tiradasB.length; i++) {
        if (tiradasB[i] > mayorB) {
            mayorB = tiradasB[i]
        }
    }
    const resultadoA = document.createElement('p')
    const resultadoB = document.createElement('p')
    resultadoA.textContent = `La mejor tirada ${mayorA}`;
    document.getElementById('dadoACards').appendChild(resultadoA);
    resultadoB.textContent = `La mejor tirada ${mayorB}`;
    document.getElementById('dadoBCards').appendChild(resultadoB);
}

document.getElementById('DadosA').addEventListener('click', async function () {
    if (tiradasA.length >= 3) return;
    const dado1 = Math.floor(Math.random() * 6) + 1;
    const dado2 = Math.floor(Math.random() * 6) + 1;
    const suma = dado1 + dado2;

    tiradasA.push(suma)

    const resultado = document.createElement('p')
    resultado.textContent = `Tirada ${tiradasA.length}: ${dado1} + ${dado2} = ${suma}`;
    document.getElementById('dadoACards').appendChild(resultado);


    if (tiradasA.length >= 3) {
        document.getElementById('DadosA').disabled = true;
    }
    verificarTiradas();
})

document.getElementById('DadosB').addEventListener('click', async function () {
    if (tiradasB.length >= 3) return;
    const dado1 = Math.floor(Math.random() * 6) + 1;
    const dado2 = Math.floor(Math.random() * 6) + 1;
    const suma = dado1 + dado2;

    tiradasB.push(suma)

    const resultado = document.createElement('p')
    resultado.textContent = `Tirada ${tiradasB.length}: ${dado1} + ${dado2} = ${suma}`;
    document.getElementById('dadoBCards').appendChild(resultado);


    if (tiradasB.length >= 3) {
        document.getElementById('DadosB').disabled = true;
    }
    verificarTiradas();
})

document.getElementById('Randomizador').addEventListener('click', async function () {
    document.getElementById('equipoA').style.display = 'block'
    document.getElementById('equipoB').style.display = 'block'
    document.getElementById('labelGanador').textContent = ''

    // se quitan los estilos de los equipos
    document.getElementById('equipoA').classList.remove('ganador')
    document.getElementById('equipoB').classList.remove('ganador')

    const seleccionados = await obtenerSeisPokemonRandom();
    const equipoUno = [seleccionados[0], seleccionados[1], seleccionados[2]]
    const equipoDos = [seleccionados[3], seleccionados[4], seleccionados[5]]

    const equipo1Stats = await mostrarEquipo(equipoUno, 'equipoACards')
    const equipo2Stats = await mostrarEquipo(equipoDos, 'equipoBCards')

    await peleaEquipos(equipo1Stats, equipo2Stats, 'equipoA', 'equipoB')
});

async function obtenerNombresValidos() {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1300')
    const data = await res.json()
    return data.results.map(p => p.name)
}

async function obtenerSeisPokemonRandom() {
    const nombres = await obtenerNombresValidos();
    const seleccionados = [];

    while (seleccionados.length < 6) {
        const indice = Math.floor(Math.random() * nombres.length);
        const nombre = nombres[indice]
        if (!seleccionados.includes(nombre)) {
            seleccionados.push(nombre)
        }
    }
    return seleccionados;
}

async function mostrarEquipo(nombres, contenedorID) {
    let ataqueTotal = 0
    let defensaTotal = 0
    const contenedor = document.getElementById(contenedorID)
    contenedor.innerHTML = ''

    for (let i = 0; i < nombres.length; i++) {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombres[i]}`);
        const data = await res.json();

        const ataque = data.stats[1].base_stat
        const defensa = data.stats[2].base_stat
        const imagen = data.sprites.front_default

        ataqueTotal += ataque
        defensaTotal += defensa

        const card = document.createElement('div')
        card.className = 'pokemon'
        card.innerHTML = `
            <img src="${imagen}" alt="Pokémon ${i + 1}" width="100">
            <p>Ataque: ${ataque}<br>Defensa: ${defensa}</p>`
        contenedor.appendChild(card);
    }

    const resumen = document.createElement('p');
    resumen.innerHTML = `<strong>Total Ataque:</strong> ${ataqueTotal}<br><strong>Total Defensa:</strong> ${defensaTotal}`;
    contenedor.appendChild(resumen)

    return { ataqueTotal, defensaTotal }
}

async function peleaEquipos(equipo1Stats, equipo2Stats, idA, idB) {
    const ComparaUno = equipo1Stats.defensaTotal - equipo2Stats.ataqueTotal
    const ComparaDos = equipo2Stats.defensaTotal - equipo1Stats.ataqueTotal

    let textoGanador = ''

    if (ComparaDos < ComparaUno) {
        textoGanador = '¡El equipo ganador es el A!'
        document.getElementById(idA).classList.add('ganador')
    } else if (ComparaUno < ComparaDos) {
        textoGanador = '¡El equipo ganador es el B!'
        document.getElementById(idB).classList.add('ganador')
    } else {
        textoGanador = '¡Empate!'
    }

    document.getElementById('labelGanador').textContent = textoGanador
}


