let pokemonList = [];
let dexNumber;
const select = document.getElementById("pokemon-list");

const createOptionEl = (name, number) => {
  //create new option element
  const optionEl = document.createElement("option");
  optionEl.value = `${name}`;
  optionEl.textContent = `${number}. ${name}`;
  optionEl.number = number;
  select.appendChild(optionEl);
};
//loop through pokemon list array
const updateSelect = () => {
  pokemonList.forEach((element, index) => {
    const pkmNameLower = element.name;
    const pkmNameCap =
      pkmNameLower.charAt(0).toUpperCase() + pkmNameLower.slice(1);
    dexNumber = index + 1;
    createOptionEl(pkmNameCap, dexNumber);
  });
};

const getPokemonList = async () => {
  /*Calling any API endpoint without a resource ID or name will return a paginated list of available resources for that API. By default, a list "page" will contain up to 20 resources. If you would like to change this just add a 'limit' query parameter to the GET request, e.g. ?limit=60. You can use 'offset' to move to the next page, e.g. ?limit=60&offset=60. */
  const apiURL = `https://pokeapi.co/api/v2/pokemon/`;
  pokemonList = await fetch(apiURL + `?offset=0&limit=151`)
    .then((res) => res.json())
    .then((res) => res.results);
  //
  console.log(pokemonList);
  //await fetch(`url`).json() returns a promise. You must use a promise method to handle promises i.e. then((res)=>res.json())
  updateSelect();
  return pokemonList;
};
getPokemonList();
