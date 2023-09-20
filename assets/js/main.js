const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const modal = document.getElementById('pokemonModal');

modal.style.display = 'none';

function fecharModal() {
    const modal = document.getElementById('pokemonModal');
    modal.style.display = 'none';
}

// Adicione um evento de clique ao botão "x" para fechar a modal
const closeButton = document.querySelector('.close');
if (closeButton) {
    closeButton.addEventListener('click', fecharModal);
}

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">

                     
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function exibirDetalhesNaModal(pokemon) {
    const modal = document.getElementById('pokemonModal');
    const modalContent = modal.querySelector('.modal-content');
    const modalPokemonDetails = document.getElementById('modalPokemonDetails');

    // Construa o HTML dos detalhes com base nos dados do Pokémon
    const html = `
        <div class="poke ${pokemon.type}">
        <div class="nomePokemon">
            <h3>${pokemon.name}</h3>
        </div>
        <div class="infosPokemon">
            <p>Número: #${pokemon.number}</p>
            <p>Tipo: ${pokemon.type}</p>
            <p>Habilidades: ${pokemon.types.join(', ')}</p>
        </div>
            <img id="img" src="${pokemon.photo}"
                     alt="${pokemon.name}">
        </div>
    `;

    // Defina o HTML dos detalhes na modal
    modalPokemonDetails.innerHTML = html;

    // Exiba a modal
    modal.style.display = 'block';
}


pokemonList.addEventListener('click', (event) => {
    const clickedPokemon = event.target.closest('.pokemon');
    if (clickedPokemon) {

        const numberElement = clickedPokemon.querySelector('.number');

        const pokemonNumber = numberElement.textContent.replace('#', '')

        // Certifique-se de que você tenha um objeto pokemon com uma propriedade 'url'
        const pokemon = {
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}/`
        };

        pokeApi.getPokemonDetail(pokemon).then((details) => {
            exibirDetalhesNaModal(details);
        });
    }
});