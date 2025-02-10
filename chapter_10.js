// Chapter 10 : Modules 

// 1. Modules (ECMAScript 2015)
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

// The 'as' keyword can rename something imported :
// import {foo as bar} from ... ;
// This can help in case of name conflict. 

// Another possible syntax is with * 
// import * as myOtherModule from ... ;

// 2. Packages 
// NPM : universal package manager in the js world 
// BunJS, which I work with, has a "bun install" tool 
// that seems compatible with any NPM package 


// 3. Building and bundling 
// cf. "bun build"


/////////////////////////////////////////
// Exercises 
/////////////////////////////////////////
// I. Modular Robot 

// roads
// buildGraph
// roadGraph
// VillageState
// runRobot
// randomPick
// randomRobot
// mailRoute
// routeRobot
// findRoute
// goalOrientedRobot

// "roads" is probably part of the user module, that's an input of the rest 
// "buildGraph" is an internal function from the "solver" module 
// "roadGraph" will be, likely, a local variable from the solver function 
// "VillageState" can form, by itself, another (internal) module - that can be tested separately 
// "runRobot" could be exported by the solver, like randomRobot, routeRobot, goalOrientedRobot 
// "randomPick" could be in some NPM generic package
// "mailRoute" is internal data used by routeRobot 
// "findRoute" is internal in the solver. 


