const baseUrl = `https://swapi.dev/api/`;
let planetUrl; //variabel för att kunna hämta info om planeten
let speciesUrl;
let vehicleUrl;
let starshipUrl;

//DOM
const characterList = document.querySelector(".character-list");
const characterInfo = document.querySelector(".character-details");
const buttons = document.querySelector(".info-buttons");
const moreInfo = document.querySelector(".more-info");
const nextPage = document.getElementById("next");
const previousPage = document.getElementById("previous");
const loading = document.querySelector(".loading");

buttons.classList.remove("active");

showLoading();
//funktion för att hämta karaktärer via API
async function getCharactersData() {
  const response = await fetch(`${baseUrl}people/`);

  const data = await response.json();
  console.log(data);
  hideLoading();
  createCharactersList(data.results); //kallar på funktionen som loopar datan från json-filen

  //variabler för att kontrollera next/prev-knapparna inom funktionen
  let next = data.next;
  let previous = data.previous;

  //eventlistener för att byta till nästa sida
  nextPage.addEventListener("click", async () => {
    //om next innehåller ett api körs nedan
    showLoading();
    if (next) {
      characterList.innerText = "";
      const response = await fetch(`${next}`);
      const nextPage = await response.json();
      hideLoading();
      next = nextPage.next; //uppdaterar page-api efter varje tryck
      previous = nextPage.previous; //uppdaterar page-api efter varje tryck
      createCharactersList(nextPage.results);
      //om next inte innehåller ett API visas en alert
    } else {
      hideLoading();
      alert("Du är på sista sidan! Testa att gå åt andra hållet :)");
    }
  });
  //eventlistener för att byta till föregående sida
  previousPage.addEventListener("click", async () => {
    //om previous innehåller ett api körs nedan
    showLoading();
    if (previous) {
      characterList.innerText = "";
      const response = await fetch(`${previous}`);
      const prevPage = await response.json();
      hideLoading();
      previous = prevPage.previous; //uppdaterar page-api efter varje tryck
      next = prevPage.next; //uppdaterar page-api efter varje tryck
      createCharactersList(prevPage.results);
      //om next inte innehåller ett API visas en alert
    } else {
      hideLoading();
      alert("Du är på första sidan! Testa att gå åt andra hållet :)");
    }
  });
}
getCharactersData();

//funktion med loop för att få ut x antal karaktärer
function createCharactersList(characters) {
  for (const character of characters) {
    // console.log(char);

    displayCharacters(character); //kallar på funktionen som skapar li-tags för att skapa en li per karaktär
  }
}

//funktion för li-tag
function displayCharacters(person) {
  const characterListItem = document.createElement("li"); //skapar li i HTML
  characterList.append(characterListItem); //gör så li-elementen syns i HTML
  characterListItem.innerText = person.name; //skriver ut namnen från datan på våra li-taggar

  characterListItem.addEventListener("click", () => {
    characterInfo.innerText = ""; //tömmer vår info om karaktären
    buttons.innerText = ""; //tar bort knapparna så nya kan skapas när man byter karaktär
    moreInfo.innerText = "";
    // moreInfo.innerHTML = `<div class="loading-more-info"></div>`;
    if (person.name) {
      //matchar vald person med dess info
      createDetailInfo(person); //kallar på funktionen som hämtat info om karaktären
      makeInfoButtons(); //kallar på funktionen som skapar knapparna och dess innehåll
      planetUrl = person.homeworld; //variabeln blir vald karaktärs homeworld
      speciesUrl = person.species;
      if (person.species.length === 0) {
        speciesUrl = ["https://swapi.dev/api/species/1/"];
      }
      vehicleUrl = person.vehicles;
      starshipUrl = person.starships;
    } else {
      console.log("try again");
    }
  });
}
//funktion för att skapa listan med info om vald karaktär
function createDetailInfo(personInfo) {
  const charName = document.createElement("h3");
  characterInfo.append(charName);
  charName.innerText = personInfo.name;

  const charHeight = document.createElement("p");
  const charMass = document.createElement("p");
  const charHair = document.createElement("p");
  const charSkin = document.createElement("p");
  const charEye = document.createElement("p");
  const charBirth = document.createElement("p");
  const charGender = document.createElement("p");

  characterInfo.append(charHeight);
  characterInfo.append(charMass);
  characterInfo.append(charHair);
  characterInfo.append(charSkin);
  characterInfo.append(charEye);
  characterInfo.append(charBirth);
  characterInfo.append(charGender);

  charHeight.innerText += `Height: ${personInfo.height} cm`;
  charMass.innerText += `Mass: ${personInfo.mass}kg`;
  charHair.innerText += `Hair color: ${personInfo.hair_color}`;
  charSkin.innerText += `Skin color: ${personInfo.skin_color}`;
  charEye.innerText += `Eye color: ${personInfo.eye_color}`;
  charBirth.innerText += `Birth year: ${personInfo.birth_year}`;
  charGender.innerText += `Gender: ${personInfo.gender}`;
}
function makeInfoButtons() {
  const planetButton = document.createElement("button"); //skapar en knapp
  const speciesButton = document.createElement("button");
  const vehiclesButton = document.createElement("button");
  const starshipButton = document.createElement("button");

  planetButton.setAttribute("id", "planet"); //tilldelar knappen ett id
  speciesButton.setAttribute("id", "species");
  vehiclesButton.setAttribute("id", "vehicles");
  starshipButton.setAttribute("id", "starship");

  planetButton.innerText = "planet"; //text som skall synas i knapparna
  speciesButton.innerText = "species";
  vehiclesButton.innerText = "vehicles";
  starshipButton.innerText = "starship";
  buttons.append(planetButton); //gör så knapparna blir synliga på sidan
  buttons.append(speciesButton);
  buttons.append(vehiclesButton);
  buttons.append(starshipButton);

  planet = document.getElementById("planet");
  species = document.getElementById("species");
  vehicles = document.getElementById("vehicles");
  starship = document.getElementById("starship");

  let infoButtons = [planet, species, vehicles, starship];

  // ********** KLICKFUNKTIONER FÖR INFOKNAPPARNA **********//

  planet.addEventListener("click", () => {
    //skapar element för "loading"animationen
    moreInfo.innerHTML = `<div class="loading-more-info"></div>`;
    const loadingMoreInfo = document.querySelector(".loading-more-info");

    //visar animation "loading"
    showLoading(loadingMoreInfo);

    //när du klickar på knappen skall info hämtas...
    getMoreInfo(planetUrl); //...från denna funktion

    //loop för att lägga till & ta bort klass som gör så att vald knapp får samma färg som "more info"
    infoButtons.forEach((btn) => {
      btn.classList.remove("active");
    });
    planet.classList.add("active");
  });

  species.addEventListener("click", () => {
    //skapar element för "loading"animationen
    moreInfo.innerHTML = `<div class="loading-more-info"></div>`;
    const loadingMoreInfo = document.querySelector(".loading-more-info");

    //visar animation "loading"
    showLoading(loadingMoreInfo);

    //när du klickar på knappen skall info hämtas...
    getMoreInfo(speciesUrl); //...från denna funktion
    infoButtons.forEach((btn) => {
      btn.classList.remove("active");
    });
    species.classList.add("active");
  });

  vehicles.addEventListener("click", () => {
    //skapar element för "loading"animationen
    moreInfo.innerHTML = `<div class="loading-more-info"></div>`;
    const loadingMoreInfo = document.querySelector(".loading-more-info");

    //gömmer animation "loading"
    hideLoading(loadingMoreInfo);

    //kontrollerar om det finns ett API att hämta mer data ifrån
    if (vehicleUrl.length === 0) {
      const none = document.createElement("h3");
      none.innerText = "Has none";
      moreInfo.append(none);
      infoButtons.forEach((btn) => {
        btn.classList.remove("active");
      });
      vehicles.classList.add("active");
    } else {
      //visar animation "loading"
      showLoading(loadingMoreInfo);
      infoButtons.forEach((btn) => {
        btn.classList.remove("active");
      });
      vehicles.classList.add("active");
      for (const vehicleInfo of vehicleUrl) {
        //när du klickar på knappen skall info hämtas...
        getMoreInfo(vehicleInfo); //...från denna funktion}
      }
    }
  });

  starship.addEventListener("click", () => {
    //skapar element för "loading"animationen
    moreInfo.innerHTML = `<div class="loading-more-info"></div>`;
    const loadingMoreInfo = document.querySelector(".loading-more-info");

    //gömmer animation "loading"
    hideLoading(loadingMoreInfo);

    //kontrollerar om det finns ett API att hämta mer data ifrån
    if (starshipUrl.length === 0) {
      const none = document.createElement("h3");
      none.innerText = ":(";
      moreInfo.append(none);
      infoButtons.forEach((btn) => {
        btn.classList.remove("active");
      });
      starship.classList.add("active");
    } else {
      //visar animation "loading"
      showLoading(loadingMoreInfo);
      infoButtons.forEach((btn) => {
        btn.classList.remove("active");
      });
      starship.classList.add("active");
      for (const starshipInfo of starshipUrl) {
        //när du klickar på knappen skall info hämtas...
        getMoreInfo(starshipInfo); //...från denna funktion}
      }
    }
  });
}

//*********************KNAPP-RELATERADE DELAR*******************//

//funktion som hämtar mer data om karaktärens planet, ras, fordon och rymdskepp
async function getMoreInfo(url) {
  const response = await fetch(url);
  const moreData = await response.json();
  printInfo(moreData);
}

//funktion för att skriva ut mer information om karaktären
function printInfo(additionalData) {
  const loadingMoreInfo = document.querySelector(".loading-more-info");

  //gömmer animation "loading"
  hideLoading(loadingMoreInfo);
  //skapar en h3 för datans namn
  const infoTitle = document.createElement("h3");
  moreInfo.append(infoTitle);
  infoTitle.innerText = additionalData.name;

  //lista med keys som ej skall skrivas ut
  const doNotDisplay = [
    "created",
    "edited",
    "url",
    "films",
    "residents",
    "people",
    "homeworld",
    "pilots",
    "cost_in_credits",
    "name",
  ];

  //loop för att skapa och skriva ut önskade keys
  for (const key in additionalData) {
    if (doNotDisplay.includes(key)) continue;

    let formattedKey = key.replace(/_/g, " "); //byter ut alla _ till mellanslag

    if (additionalData[key]) {
      const additionalInformation = document.createElement("p");

      //gör så att första bokstaven i keyn blir stor och de övriga små
      additionalInformation.innerText = `${
        formattedKey.charAt(0).toLocaleUpperCase() + formattedKey.slice(1)
      }: ${additionalData[key]}`;
      moreInfo.append(additionalInformation);
    }
  }
}
// ********** FUNCTIONS TO SHOW OR HIDE LOADING ANIMATION ********** //
function showLoading(load = loading) {
  load.style.display = "block";
}
function hideLoading(load = loading) {
  load.style.display = "none";
}

//loop för att lägga till & ta bort klass som gör så att vald knapp får samma färg som "more info"
// infoButtons.forEach((btn) => {
//   btn.classList.remove("active");
// });
// starship.classList.add("active");
