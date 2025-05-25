document.getElementById('Randomizador').addEventListener('click', async function () {
    // Mostrar ambos equipos nuevamente (por si estaban ocultos)
    document.getElementById('equipoA').style.display = 'block';
    document.getElementById('equipoB').style.display = 'block';
    document.getElementById('labelGanador').textContent = '';

    const seleccionados = await obtenerSeisPokemonRandom();
    const equipoUno = [seleccionados[0], seleccionados[1], seleccionados[2]];
    const equipoDos = [seleccionados[3], seleccionados[4], seleccionados[5]];

    const equipo1Stats = await mostrarEquipo(equipoUno, 'equipoA');
    const equipo2Stats = await mostrarEquipo(equipoDos, 'equipoB');

    await PeleaEquipos(equipo1Stats, equipo2Stats, 'equipoA', 'equipoB');
});

async function obtenerNombresValidos() {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1300');
    const data = await res.json();
    return data.results.map(p => p.name);
}

async function obtenerSeisPokemonRandom() {
    const nombres = await obtenerNombresValidos();
    const seleccionados = [];

    while (seleccionados.length < 6) {
        const indice = Math.floor(Math.random() * nombres.length);
        const nombre = nombres[indice];
        if (!seleccionados.includes(nombre)) {
            seleccionados.push(nombre);
        }
    }
    return seleccionados;
}

async function mostrarEquipo(nombres, contenedorID) {
    let ataqueTotal = 0;
    let defensaTotal = 0;
    const contenedor = document.getElementById(contenedorID);
    contenedor.innerHTML = ''; // Limpiar equipo anterior

    for (let i = 0; i < nombres.length; i++) {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombres[i]}`);
        const data = await res.json();

        const ataque = data.stats[1].base_stat;
        const defensa = data.stats[2].base_stat;
        const imagen = data.sprites.front_default;

        ataqueTotal += ataque;
        defensaTotal += defensa;

        const card = document.createElement('div');
        card.className = 'pokemon';
        card.innerHTML = `
            <img src="${imagen}" alt="Pokémon ${i + 1}" width="150">
            <p>Ataque: ${ataque} Defensa: ${defensa}</p>`;
        contenedor.appendChild(card);
    }
    const resumen = document.createElement('p');
    resumen.innerHTML = `<strong>Total Ataque:</strong> ${ataqueTotal} <br><strong>Total Defensa:</strong> ${defensaTotal}`;
    contenedor.appendChild(resumen)

    return { ataqueTotal, defensaTotal }
}

async function PeleaEquipos(equipo1Stats, equipo2Stats, idA, idB) {
    const ComparaUno = equipo1Stats.defensaTotal - equipo2Stats.ataqueTotal
    const ComparaDos = equipo2Stats.defensaTotal - equipo1Stats.ataqueTotal

    let textoGanador = ''
    let equipoPerdedorID = ''

    if (ComparaDos < ComparaUno) {
        textoGanador = 'El equipo ganador es el A'
        equipoPerdedorID = idB;
    } else if (ComparaUno < ComparaDos) {
        textoGanador = 'El equipo ganador es el B'
        equipoPerdedorID = idA;
    } else {
        textoGanador = '¡Empate!'
        // No ocultar nada si hay empate
        document.getElementById('labelGanador').textContent = textoGanador;
        return;
    }

    // Mostrar mensaje del ganador
    document.getElementById('labelGanador').textContent = textoGanador;

    // Ocultar el equipo perdedor
    document.getElementById(equipoPerdedorID).style.display = 'none';
}