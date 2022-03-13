import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js";

//Const variables
const JUMP_SPEED = 0.45;
const GRAVITY = 0.002;
const DINOSAUR_FRAME_COUNT = 2; //For change between the two dinosaur's spirits
const FRAME_TIME = 100;

//Select all the ground elements
const dinosaurElem = document.querySelector("[data-dinosaur]");

let dinosaurFrame;
let currentFrameTime;
let isJumping;
let ySpeed;

export function setupDinosaur() {
  isJumping = false;
  dinosaurFrame = 0;
  currentFrameTime = 0;
  ySpeed = 0;
  setCustomProperty(dinosaurElem, "--bottom", 0);

  //In every setup, remove the previous listener for jumping in order to restart it again
  document.removeEventListener("keydown", onJump);
  document.addEventListener("keydown", onJump);
}

//Update the dinosaur's position in every refresh
export function updateDinosaur(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
}

//Manage the animitions for the dinosaur moves
function handleRun(delta, speedScale) {
  //If is jumping, get the stationary animation and don't change it
  if (isJumping) {
    dinosaurElem.src = "img/dinosaur-stationary.png";
    return;
  }

  //If the current frame is larger than the frame variable, is time to update the dinosaur spirit
  if (currentFrameTime >= FRAME_TIME) {
    dinosaurFrame = (dinosaurFrame + 1) % DINOSAUR_FRAME_COUNT;
    dinosaurElem.src = "img/dinosaur-run-" + dinosaurFrame + ".png";
    currentFrameTime -= FRAME_TIME;
  }

  currentFrameTime += delta * speedScale; //Refresh the current time, will be faster and faster gradually
}

//Manage the jump, setting velocity to JUMP_SPEED (onJump function), and substracting gravity from velocity.
//When is up in the air, will get slower and slower until reach 0, when the gravity pull it back downwards
function handleJump(delta) {
  if (!isJumping) return; //Only handle jump if it's actually jumping

  incrementCustomProperty(dinosaurElem, "--bottom", ySpeed * delta); //Increase the bottom distance

  //If the dinousaur reached the bottom, don't go any further, keep it on the ground and disable isJumping
  if (getCustomProperty(dinosaurElem, "--bottom") <= 0) {
    setCustomProperty(dinosaurElem, "--bottom", 0);
    isJumping = false;
  }

  ySpeed -= GRAVITY * delta;
}

//Handle the listener for the space button click, in order to jump
function onJump(e) {
  if (e.code !== "Space" || isJumping) return; //Avoid to enter the function if the key is different to space or is alredy jumping

  ySpeed = JUMP_SPEED;
  isJumping = true;
}

//Get the current dinosaur's position on the screen to compare later with the cactus position
export function getDinosaurRect() {
  return dinosaurElem.getBoundingClientRect();
}

//Change the dinosaur sprite on game over
export function setDinosaurLose() {
  dinosaurElem.src = "img/dinosaur-lose.png";
}
