// Chapter 8: Bugs and errors 

/////////////////////////////////////////
// 1. Strict mode 
function canYouSpotTheProblem() {
  "use strict"; // Activates strict mode 
  for (counter = 0; counter < 10; counter++) {
    console.log("Happy happy");
  }
}

//canYouSpotTheProblem(); // try this!
// Whether I put "use strict" or not I don't see any difference in my env (BunJS) since 
// .js file are considered ES Modules and strict mode is enabled by default ... for the better.

// Without that strict mode, counter would have been created silently as a global binding.

// Many bad things can happen if we're not in strict mode 
// Below I forgot "new" when creating a Person object. So 'this', instead of designating 
// the object to be created, designates the global program scope and I'm just creating 
// a "name" variable. In strict mode, I have an error because it set "this" to undefined 
// If we're not in an appropriate context (in a method call or in a constructor call with new
// Try it!
// function Person(name) { this.name = name; }
// let ferdinand = Person("Ferdinand"); // oops
// console.log(name); // → Ferdinand

// Fortunately I was in strict mode since the beginning of my JS journey.

/////////////////////////////////////////
// 2. Types
