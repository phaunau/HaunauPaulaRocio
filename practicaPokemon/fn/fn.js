//Extra tip: Si alguna vez querés ver todos los stats disponibles, podés hacer esto:
//console.log(data1.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`));

async function Get_StatsPersonaje() {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
    const data = await res.json();
    const lista = data.results;
    // console.log('Total de pokemones:', lista);

    const pok1 = document.querySelector('#pokemon1').value
    const pok2 = document.querySelector('#pokemon2').value
    Get_Pokemones(pok1, pok2)
}

async function Get_Pokemones(pok1, pok2) {

    //poke1
    const pers1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pok1}/`)
    const data1 = await pers1.json()
    const attack1 = data1.stats[1].base_stat
    const pic1 = data1.sprites.front_default
    document.getElementById('ataquepok1').textContent = `Ataque de ${data1.name}: ${attack1}`
    document.getElementById('img_pok1').src = pic1;
    document.getElementById('img_pok1').style.display = 'block';

    //poke2
    const pers2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pok2}/`)
    const data2 = await pers2.json()
    const attack2 = data2.stats[1].base_stat
    const pic2 = data2.sprites.front_default
    document.getElementById('ataquepok2').textContent = `Ataque de ${data2.name}: ${attack2}`
    document.getElementById('img_pok2').src = pic2;
    document.getElementById('img_pok2').style.display = 'block';
    document.getElementById('resultado').style.display = 'block';
    Pelea_Pokemones(attack1, attack2, data1, data2)
}
async function Pelea_Pokemones(attack1, attack2, data1, data2) {

    //comparo
    if (attack1 > attack2) {
        document.getElementById('ganador').textContent = `${data1.name} es mas fuerte en ataque.`
        const pic3 = data1.sprites.front_default
        document.getElementById('img_pok3').src = pic3;
        document.getElementById('img_pok3').style.display = 'block';
    } else if (attack2 > attack1) {
        document.getElementById('ganador').textContent = `${data2.name} es mas fuerte en ataque.`
        const pic3 = data2.sprites.front_default
        document.getElementById('img_pok3').src = pic3;
        document.getElementById('img_pok3').style.display = 'block';
    } else {
        document.getElementById('ganador').textContent = `${data1.name} y ${data2.name} tienen el mismo nivel de ataque.`
    }

}



