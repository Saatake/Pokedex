const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const mainInfo = document.getElementById('mainInfo');
const statsCard = document.getElementById('statsCard');
const evolutionsCard = document.getElementById('evolutionsCard');
const backButton = document.getElementById('backButton');

const colors = {
  fire: 'orange',
  grass: 'lightgreen',
  electric: 'yellow',
  water: '#70ffea',
  ground: '#bf925a',
  rock: '#807465',
  fairy: 'pink',
  poison: '#6a51bd',
  bug: 'greenyellow',
  dragon: '#44becf',
  psychic: '#e238eb',
  flying: '#fcca46',
  fighting: '#bd4a5d',
  normal: 'lightgrey',
  ice: '#00f2f2',
  dark: '#49535c',
  ghost: '#7685a7',
  steel: 'steelblue',
};

const fetchPokemonDetails = async () => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        displayPokemonDetails(data);
        fetchEvolutionChain(data.species.url);
    } catch (error) {
        console.error('Erro ao buscar detalhes do Pokémon:', error);
    }
};

const displayPokemonDetails = (pokemon) => {
    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const types = pokemon.types.map(type => type.type.name);
    const mainColor = colors[types[0]] || '#F5F5F5';

    mainInfo.style.backgroundColor = mainColor;
    mainInfo.innerHTML = `
        <h1>${name}</h1>
        <div class="pokemon-images">
            <div class="pokemon-version">
                <h3>Versão Normal</h3>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png" 
                     alt="${name} normal">
            </div>
            <div class="pokemon-version">
                <h3>Versão Shiny</h3>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemon.id}.png" 
                     alt="${name} shiny">
            </div>
        </div>
        <p>${types.map(type => `<span class="type-badge" style="background-color: ${colors[type]}">${type}</span>`).join(' ')}</p>
        <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
        <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
        <p><strong>Habilidades:</strong> ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
    `;

    displayStats(pokemon.stats);
};

const displayStats = (stats) => {
    statsCard.innerHTML = '<h2>Estatísticas</h2>';
    stats.forEach(stat => {
        const statName = stat.stat.name;
        const statValue = stat.base_stat;
        const statPercentage = (statValue / 255) * 100;

        statsCard.innerHTML += `
            <div class="stat-bar">
                <span>${statName}: ${statValue}</span>
                <div class="bar" style="width: ${statPercentage}%"></div>
            </div>
        `;
    });
};

const fetchEvolutionChain = async (speciesUrl) => {
    try {
        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();
        const evolutionChainUrl = speciesData.evolution_chain.url;

        const evolutionResponse = await fetch(evolutionChainUrl);
        const evolutionData = await evolutionResponse.json();

        displayEvolutions(evolutionData.chain);
    } catch (error) {
        console.error('Erro ao buscar cadeia de evolução:', error);
    }
};

const displayEvolutions = async (evolutionChain) => {
    evolutionsCard.innerHTML = '<h2>Evoluções</h2><div class="evolutions-container"></div>';
    const evolutionsContainer = evolutionsCard.querySelector('.evolutions-container');

    const addEvolutionToDisplay = async (species) => {
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${species.name}`);
        const pokemonData = await pokemonResponse.json();
        
        const evolutionCard = document.createElement('div');
        evolutionCard.classList.add('evolution-card');
        evolutionCard.innerHTML = `
            <div class="evolution-images">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonData.id}.png" 
                     alt="${species.name} normal">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemonData.id}.png" 
                     alt="${species.name} shiny">
            </div>
            <p>${species.name}</p>
        `;
        evolutionCard.addEventListener('click', () => {
            window.location.href = `detalhes.html?id=${pokemonData.id}`;
        });
        evolutionsContainer.appendChild(evolutionCard);
    };

    await addEvolutionToDisplay(evolutionChain.species);

    let currentEvolution = evolutionChain.evolves_to[0];
    while (currentEvolution) {
        await addEvolutionToDisplay(currentEvolution.species);
        currentEvolution = currentEvolution.evolves_to[0];
    }
};

backButton.addEventListener('click', () => {
    window.location.href = 'pokedex.html';
});

fetchPokemonDetails();