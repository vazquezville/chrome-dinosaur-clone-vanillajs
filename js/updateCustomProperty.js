//Helper script to get and update CSS var values for moving around the elements

//Return the value of an specific property of a css element
export function getCustomProperty(elem, prop) {
  return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
}

//Set a value to an specific property of a css element
export function setCustomProperty(elem, prop, value) {
  elem.style.setProperty(prop, value);
}

//Combine the previous functions, setting the current value plus the increment of an specific property of a css element
export function incrementCustomProperty(elem, prop, inc) {
  setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc);
}
