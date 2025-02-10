// Chapter 10 : Modules 

// ECMA standard distinguishes : 
// Script : something with no namespace - everything in the js file is global 
// Module : defines a namespace and supports the import / export syntax 

// Take the following module : 

// That global variable is not part of the module interface. It's internal.
const names = ["Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"];

export function dayName(number) {
  return names[number];
}

export function dayNumber(name) {
  return names.indexOf(name);
}

// Another module can do : 
// import {dayName} from "./dayname.js";
// And then use that dayName function.


