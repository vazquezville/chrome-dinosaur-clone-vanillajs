import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js";

//Const variables
const SPEED = 0.05; //Same speed as ground, to avoid weird perfomance

//Intervals for how long between the summonning of a new cactus
const CACTUS_INTERVAL_MIN = 500; //500 milliseconds
const CACTUS_INTERVAL_MAX = 2000; //2 seconds

//Select the main element
const mainElem = document.querySelector("[data-main]");

let nextCactusTime;
export function setupCactus() {
  //For the first cactus, use the standard minimum time
  nextCactusTime = CACTUS_INTERVAL_MIN;

  //Remove all the remaining cactus on new render
  document.querySelectorAll("[data-cactus]").forEach((cactus) => {
    cactus.remove();
  });
}

//Create and summon new cactus
export function updateCactus(delta, speedScale) {
  document.querySelectorAll("[data-cactus]").forEach((cactus) => {
    incrementCustomProperty(cactus, "--left", delta * speedScale * SPEED * -1);

    //Remove the cactus if it's out of screen, avoid to append infinite cactus element to the DOM
    if (getCustomProperty(cactus, "--left") <= -100) {
      cactus.remove();
    }
  });

  //If the time for the next cactus is over, summon a new one and restart the counter for a new one
  if (nextCactusTime <= 0) {
    createCactus();
    nextCactusTime =
      randomNumberBetween(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX) /
      speedScale;
  }
  nextCactusTime -= delta; //Gradually make the next cactus time smaller and smaller to increase the difficulty
}

//Append a new cactus element to the game
function createCactus() {
  const cactus = document.createElement("img");
  cactus.dataset.cactus = true;

  cactus.src = "img/cactus.png";
  cactus.classList.add("cactus");
  setCustomProperty(cactus, "--left", 100);
  mainElem.append(cactus);
}

//Randomize the cactus creation
function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//Get all the cactus' position on the screen, by maping the cactus array to compare later with the dinosaur's position
export function getCactusRect() {
  return [...document.querySelectorAll("[data-cactus]")].map((cactus) => {
    return cactus.getBoundingClientRect();
  });
}
