let pokemonList = [];
let dexNumber;
let spriteURL;
let pkmTypes = [];

const typeColours = {
  normal: `rgb(158, 158, 109)`,
  fighting: "rgb(184, 42, 36)",
  flying: "rgb(158, 133, 238)",
  poison: `rgb(196, 97, 226)`,
  ground: "rgb(220, 184, 93)",
  rock: "rgb(175, 149, 49)",
  bug: "rgb(158, 175, 30)",
  ghost: "rgb(101, 78, 141)",
  steel: "rgb(175, 175, 202)",
  fire: "rgb(238, 116, 43)",
  water: "rgb(93, 133, 238)",
  grass: "rgb(32, 178, 44)",
  electric: " rgb(247, 201, 43)",
  psychic: "rgb(247, 77, 125)",
  ice: "rgb(141, 211, 211)",
  dragon: "rgb(100, 50, 247)",
  fairy: "rgb(238,173,180)",
};
let updatedStats = {};
/////////////////////
const select = document.getElementById("pokemon-list");
const spriteImg = document.getElementById("sprite-image");
const pkmName = document.getElementById("name");
const typeContainer = document.getElementById("type-container");
const dexEntry = document.getElementById("dex-entry");
const hp = document.getElementById("HP");
const atk = document.getElementById("ATK");
const def = document.getElementById("DEF");
const spATK = document.getElementById("SP-ATK");
const spDEF = document.getElementById("SP-DEF");
const spe = document.getElementById("SPE");
const mainContainer = document.getElementById("main-container");
const nextBTN = document.getElementById("next");
const previousBTN = document.getElementById("previous");

/////////////////////
//create new option element
const createOptionEl = (name, number) => {
  const optionEl = document.createElement("option");
  optionEl.value = `${name}`;
  optionEl.textContent = `${number}. ${name}`;
  optionEl.setAttribute("number", number);
  select.appendChild(optionEl);
};
//loop through pokemon list array to create option elements for each pokemon
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

  //await fetch(`url`).json() returns a promise. You must use a promise method to handle promises i.e. then((res)=>res.json())
  updateSelect();
  return pokemonList;
};
getPokemonList();

//dynamically set the src attribute for the sprite image
const updateSpriteImg = async (number) => {
  spriteImg.src = `
  https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/${number}.png
  `;
  await new Promise((resolve) => {
    spriteImg.onload = resolve;
  });
  activateButtons();
  //the executor function takes a single argument resolve, which is a function that is called when the Promise is resolved. The resolve function is assigned as the onload event handler for the spriteImg element. This means that the resolve function will be called once the image has finished loading.

  //The await keyword is used to wait for the Promise to resolve before executing the next line of code. When the Promise is resolved (i.e., when the resolve function is called), the Promise resolves with the argument passed to the resolve function, which in this case is the event object associated with the onload event. This allows you to handle the completion of the image loading before moving on to the next step, which in this case is calling the activateButtons() function.
};

//update pokemon name
const updatePkmName = async (value) => {
  dexNumber = select.selectedOptions[0].getAttribute("number");
  //.selectedOptions property is a read-only collection that contains all the 'option' elements in a select element. select.selectedOptions[0] is used to retrieve the currently selected 'options' element. '[0]' is used to access the first element in the selectedOptions collection which is the only element when 'select' element has a single collection
  let name = `#${dexNumber} ${value}`;
  pkmName.textContent = name;
  if (name.length > 10) {
    pkmName.style.fontSize = `30px`;
  } else {
    pkmName.style.fontSize = `40px`;
  }
};
//update background color to a lighter version of it's type color
const updateBGColor = () => {
  let bgColor = typeColours[pkmTypes[0]];
  let fadedBgColor = bgColor.slice(0, -1) + `, 0.6)`;
  mainContainer.style.backgroundColor = fadedBgColor;
};
//update pokemon type
const getPkmType = async (number) => {
  pkmTypes = [];
  const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}/`).then(
    (res) => res.json()
  );
  const types = data.types;
  types.forEach((object) => {
    pkmTypes.push(object.type.name);
  });

  updateTypeUI();
  updateBGColor();
};

//create pokemon type bubbles
const updateTypeUI = () => {
  typeContainer.innerHTML = ``;
  pkmTypes.forEach((value) => {
    const typeEl = document.createElement("span");
    typeEl.classList.add(`type`);
    // typeEl.classList.add(`${value}`);

    typeEl.style.backgroundColor = `${typeColours[value]}`;
    typeEl.textContent = value;

    typeContainer.appendChild(typeEl);
  });
};

//get pokemon dex entry
const getDexEntry = async (number) => {
  const data = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${number}/`
  ).then((res) => res.json());
  const entry = data["flavor_text_entries"][10]["flavor_text"];
  dexEntry.textContent = entry;
};
//update stats UI
const updateStatsUI = () => {
  hp.textContent = `HP: ${updatedStats.hp}`;
  atk.textContent = `ATK: ${updatedStats.attack}`;
  def.textContent = `DEF: ${updatedStats.defense}`;
  spATK.textContent = `SP-ATK: ${updatedStats["special-attack"]}`;
  spDEF.textContent = `SP-DEF: ${updatedStats["special-defense"]}`;
  spe.textContent = `SPE: ${updatedStats["speed"]}`;
};
//get base stats
const getStats = async (number) => {
  const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}/`).then(
    (res) => res.json()
  );
  const statsArray = data.stats;
  statsArray.forEach((stat) => {
    updatedStats[stat.stat.name] = stat["base_stat"];
  });
  updateStatsUI();
};

// select onChange functionality to trigger UI updates
const onSelectChange = () => {
  disableButtons();
  updatePkmName(select.value);
  getPkmType(dexNumber);
  getDexEntry(dexNumber);
  getStats(dexNumber);
  updateSpriteImg(dexNumber);
};
select.addEventListener("change", onSelectChange);

// button functionality
const prevOption = () => {
  //get current selected index
  const currentIndex = select.selectedIndex;
  const prevIndex = currentIndex - 1;
  if (prevIndex === -1) {
    select.selectedIndex = 150;

    onSelectChange();
  } else {
    select.selectedIndex = prevIndex;
    onSelectChange();
  }
};

const nextOption = () => {
  //get current selected index
  const currentIndex = select.selectedIndex;
  const nextIndex = currentIndex + 1;
  if (nextIndex === 151) {
    select.selectedIndex = 0;

    onSelectChange();
  } else {
    select.selectedIndex = nextIndex;
    onSelectChange();
  }
};
// nextBTN.addEventListener("click", ());
previousBTN.addEventListener("click", prevOption);
nextBTN.addEventListener("click", nextOption);

const disableButtons = () => {
  nextBTN.disabled = true;
  previousBTN.disabled = true;
};
const activateButtons = () => {
  nextBTN.disabled = false;
  previousBTN.disabled = false;
};
