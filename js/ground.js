import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js";

//Const variables
const SPEED = 0.05;

//Select all the ground elements
const groundElem = document.querySelectorAll("[data-ground]");

export function setupGround() {
  //Run at the start, create two ground elements to loop the ground
  setCustomProperty(groundElem[0], "--left", 0);
  setCustomProperty(groundElem[1], "--left", 300);
}

//Update the ground's position in every refresh
export function updateGround(delta, speedScale) {
  groundElem.forEach((ground) => {
    incrementCustomProperty(ground, "--left", delta * speedScale * SPEED * -1); //Convert the css value into js value, and increment it

    //If first ground element moved all the way off, loop it all the way around and put it by the end, looping it
    if (getCustomProperty(ground, "--left") <= -300) {
      incrementCustomProperty(ground, "--left", 600);
    }
  });
}
