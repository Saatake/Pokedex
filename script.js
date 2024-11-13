const pokeContainer = document.querySelector("#pokeContainer");
const searchInput = document.querySelector("input[type='search']");
const surpriseBtn = document.getElementById("surpriseBtn");
const loadMoreBtn = document.createElement("button");
loadMoreBtn.textContent = "Carregar mais Pokémon";
loadMoreBtn.classList.add("btn", "btn-outline-primary");
let currentPokemonCount = 0;
const pokemonBatchSize = 20;
const pokemonCount = 1025;

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

const fetchPokemons = async () => {
    pokeContainer.innerHTML = '';
    currentPokemonCount = 0; 
    await loadMorePokemons();
};

const loadMorePokemons = async () => {
    const end = Math.min(currentPokemonCount + pokemonBatchSize, pokemonCount);
    for (let i = currentPokemonCount + 1; i <= end; i++) {
        await getPokemons(i);
    }
    currentPokemonCount = end; 
    if (currentPokemonCount < pokemonCount) {
        pokeContainer.appendChild(loadMoreBtn);
    }
};

const getPokemons = async (identifier) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${identifier}`;
    const resp = await fetch(url);
    
    if (!resp.ok) {
        throw new Error('Pokémon não encontrado');
    }
    
    const data = await resp.json();
    createPokemonCard(data);
};

const createPokemonCard = (poke) => {
    const card = document.createElement('div');
    card.classList.add("pokemon");

    const name = poke.name[0].toUpperCase() + poke.name.slice(1);
    const id = poke.id.toString().padStart(3, '0');
    const firstType = poke.types[0].type.name;
    const color = colors[firstType];
    card.style.backgroundColor = color;

    const typeSpans = poke.types.map(typeInfo => {
        const typeName = typeInfo.type.name;
        const typeColor = colors[typeName];
        return `<span class="type-badge" style="background-color: ${typeColor}">${typeName}</span>`;
    }).join(' ');

    const pokemonInnerHTML = `
        <div class="imgContainer">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${poke.id}.png" alt="${name}">
        </div>
        <div class="info">
            <span class="number">#${id}</span>
            <h3 class="name">${name}</h3>
            <small class="type">${typeSpans}</small>
        </div>
    `;

    card.innerHTML = pokemonInnerHTML;

    card.addEventListener("click", () => {
        document.body.classList.add("fade-out");
        setTimeout(() => {
            window.location.href = `detalhes.html?id=${poke.id}`;
        }, 600); 
    });

    pokeContainer.appendChild(card);
};

const searchPokemon = async (event) => {
    event.preventDefault();
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm) {
        pokeContainer.innerHTML = '';

        try {
            await getPokemons(searchTerm);
        } catch (error) {
            console.error('Pokémon não encontrado:', error);
            pokeContainer.innerHTML = '<p>Pokémon não encontrado. Tente outro nome.</p>';
        }
    } else {
        fetchPokemons();
    }
};

const getRandomPokemon = async () => {
    pokeContainer.innerHTML = ''; 
    const randomId = Math.floor(Math.random() * pokemonCount) + 1; 
    await getPokemons(randomId );
};

loadMoreBtn.addEventListener("click", loadMorePokemons);
surpriseBtn.addEventListener("click", getRandomPokemon);
document.querySelector("form").addEventListener("submit", searchPokemon);

fetchPokemons();