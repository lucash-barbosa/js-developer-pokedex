const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pagination = document.getElementsByClassName("pagination");

const maxRecords = 151
const limit = 10
let offset = 0;

function clearListAndRestart (offset, limit) {
  pokemonList.innerHTML = "";
  pagination[0].innerHTML = `<button id="loadMoreButton" type="button">
                Carregar mais
            </button>`;
  loadPokemonItens(offset, limit);
}

function loadPokemon(id) {
  pokeApi.getPokemonDetail({ url: `https://pokeapi.co/api/v2/pokemon/${id}/` }).then((pokemon) => {
    const pokemonInfo = `
    <span onclick="clearListAndRestart(${offset}, ${limit})">< voltar</span>
      <p>Nome: ${pokemon.name}</p>
      <p>Número: ${pokemon.number}</p>
      <p>Tipo: ${pokemon.type}</p>
      <img style="max-width: 60vw;" src="${pokemon.photo}" alt="${pokemon.name}">
    `;
    pokemonList.innerHTML = pokemonInfo;
  });
 loadMoreButton.parentElement.removeChild(loadMoreButton)
}


function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
        <button onclick="loadPokemon(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
            </button>
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