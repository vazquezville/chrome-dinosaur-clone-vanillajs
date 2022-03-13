import { setupGround, updateGround } from "./ground.js";
import {
  setupDinosaur,
  updateDinosaur,
  getDinosaurRect,
  setDinosaurLose,
} from "./dinosaur.js";
import { setupCactus, updateCactus, getCactusRect } from "./cactus.js";

//Const variables
const SCREEN_WIDTH = 100;
const SCREEN_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

//Main element
const mainElem = document.querySelector("[data-main]");

//Score element
const scoreElem = document.querySelector("[data-score]");

//MaxScore element
const maxScoreElem = document.querySelector("[data-maxScore]");

//Start Message element
const startElem = document.querySelector("[data-start]");

//Resize the game in the beginning and in each change of the window's size
setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);

//Render the maximum score if exists
if (localStorage.getItem("maxScore")) {
  maxScoreElem.textContent =
    "Max. Score: " + parseInt(localStorage.getItem("maxScore"));
}

//Listener to handle the game start, by pressing any key, just once
document.addEventListener("keydown", handleStart, { once: true });

let lastTime;
let speedScale;
let score;
let maxScore;

//Start the with the initial parameters' values
function handleStart() {
  //Reset the game vars
  lastTime = null;
  speedScale = 1;
  score = 0;
  maxScore = localStorage.getItem("maxScore");

  //Reset the graphic elements
  setupGround();
  setupDinosaur();
  setupCactus();

  //Hide the screen message
  startElem.classList.add("hide");

  //Starts update loop
  window.requestAnimationFrame(update);
}

//Scale the game to the screen
function setPixelToWorldScale() {
  let worldToPixelScale;

  //If the division of the current window size is small than the division of the screen const, then it scale based in the width, otherwise scale based in the height
  if (window.innerWidth / window.innerHeight < SCREEN_WIDTH / SCREEN_HEIGHT) {
    worldToPixelScale = window.innerWidth / SCREEN_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / SCREEN_HEIGHT;
  }

  mainElem.getElementsByClassName.width = `${
    SCREEN_WIDTH * worldToPixelScale
  }px`;
  mainElem.getElementsByClassName.height = `${
    SCREEN_HEIGHT * worldToPixelScale
  }px`;
}

//Update loop task to avoid workload delay, based in its own times
function update(time) {
  //Avoid a huge delta between the loading and the starting of the game, when the game is initialize and lastTime is null
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }

  const delta = time - lastTime; //Time between frames
  updateGround(delta, speedScale);
  updateDinosaur(delta, speedScale);
  updateCactus(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);

  //If collision, trigger lose
  if (checkLose()) return handleLose();

  lastTime = time;
  window.requestAnimationFrame(update);
}

//Gradually increase speed
function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

//Each second give 10 points and write it into the score element in the screen
function updateScore(delta) {
  score += delta * 0.01;
  scoreElem.textContent = Math.floor(score);

  //Update the maximum score if the record is break
  if (Math.floor(score) <= parseInt(localStorage.getItem("maxScore"))) return;

  localStorage.setItem("maxScore", Math.floor(score));
  maxScoreElem.textContent = "Max. Score: " + Math.floor(Math.floor(score));
}

//Check if the game is over by checking collisions
function checkLose() {
  const dinosaurRect = getDinosaurRect();
  return getCactusRect().some((rect) => isCollision(rect, dinosaurRect));
}

//Check if there's collision between the dinosaur's and cactus' positions
function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}

//On lose by collision, restart the game
function handleLose() {
  setDinosaurLose();

  //Avoid restart the game after lose by clicking inmediatly space
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true });
    startElem.classList.remove("hide");
  }, 1500);
}
