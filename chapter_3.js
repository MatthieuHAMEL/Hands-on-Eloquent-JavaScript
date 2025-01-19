// Subtleties in Chapter 3 :

//////////////////////////////////////////////////////
// I - There are three ways to create functions : 

  // 1. Declarations
  function makeNoise_1(some_param) {
    console.log("Pling!", some_param);
  }

  // 2. Expressions 
  const makeNoise_2 = function(some_param) {
    console.log("Pling!", some_param);
  };

  // 3. Arrow functions - still an expression 
  const makeNoise_3 = some_param => console.log("Pling!", some_param);
  
  /* A declared function (1.) can be used before it is declared, thanks to hoisting. (those
  declarations are "moved" at the top of the source before the program runs). While an 
  expression function (2.) is created on the fly and can be used for passing 
  callbacks (anonymous functions)... as they are put in bindings we can reassign them, 
  if we use let instead of const. 
  Finally arrow functions are syntactic sugar for function 
  expressions but with a few limitations in OOP (they can't be methods, ...) */

//////////////////////////////////////////////////////
// II - Optional arguments 
// "Default arguments" work like in many other languages : 
function f(arg1, arg2="Foo") {
  // ... 
}

// What can be more surprising is that the interpreter does not complain if 
// we pass too many parameters :
const g = function(arg1) {
  console.log(arg1)
}
//g("Foo", "Bar") // Try this: "Bar is simply ignored"

// If there are too few parameters, and if no default value is given, they'll be "undefined"
const h = (arg1, arg2) => {
  console.assert(arg2 === undefined, "you actually passed arg2!")
}
// h("Foo") // Try this. arg2 will be undefined in h's body

//////////////////////////////////////////////////////
// III - Closures 
// Closures capture their environment : 
function wrapValue(n) {
  let local = n;
  return () => local;
}

const func1 = wrapValue(42);
//console.log(func1()); 

//////////////////////////////////////////////////////
// Exercises 

//////////////////////////////////////////////////////
// I - "Minimum" 
const min = (a, b) => (a < b) ? a : b;
// console.log(min(5, 2.1));

//////////////////////////////////////////////////////
// II - "Recursion" (recursive isEven function)
// Prec: n is an integer. 
function isEven(n) {
  if (n < 0) {
    return isEven(-n);
  }

  switch (n) {
    case 0: 
      return true;
    case 1:
      return false;
    default: 
      return isEven(n-2);
  }
}

// console.log(isEven(0)) // T
// console.log(isEven(1)) // F 
// console.log(isEven(2)) // T
// console.log(isEven(3)) // F
// console.log(isEven(546)) // T
// console.log(isEven(331)) // F
// console.log(isEven(-1)); // F
// console.log(isEven(-2)); // T
// console.log(isEven(-45)); // F

// Tail-recursive version 
function isEven_TCO(n, acc = true) {
  if (n < 0) {
    return isEven_TCO(-n, acc);
  }

  switch (n) {
    case 0: 
      return acc;
    case 1:
      return !acc;
    default: 
      return isEven_TCO(n - 2, acc);
  }
}

// Naive benchmark 
// I'm working with bun.js (JavaScriptCore) and TCO version is really faster 
// (1.34 ms against 4.45 ms for non-TCO)
// Try with your environment !
const startTime = performance.now();
const b = isEven(335982);
const endTime = performance.now();
console.assert(b);
console.log(`Non-TCO version took ${endTime - startTime} milliseconds`);

const startTime_TCO = performance.now();
const b2 = isEven(335982);
const endTime_TCO = performance.now();
console.assert(b2);
console.log(`TCO version took ${endTime_TCO - startTime_TCO} milliseconds`);

//////////////////////////////////////////////////////
// III - "Bean Counting" 

function countBs_FirstDraft(string) {
  let counter = 0;
  for (let i = 0 ; i < string.length ; i++) {
    counter += (string[i] === "B");
  }
  return counter;
}

function countChar(string, char) {
  let counter = 0;
  for (let i = 0 ; i < string.length ; i++) {
    counter += (string[i] === char);
  }
  return counter;
}

function countBs(string) { 
  return countChar(string, "B");
}

function testCountBs(funcCountBs) {
  console.log(`Testing ${funcCountBs.name}`);
  console.log(funcCountBs("babar")); // 0
  console.log(funcCountBs("Babar")); // 1
  console.log(funcCountBs("BaBar")); // 2
  console.log(funcCountBs("BaBar's BarBapapa")); // 4
}

testCountBs(countBs_FirstDraft); 
testCountBs(countBs); 
console.log("Testing countChar:" , countChar("Abracadabra", "a")); // 4
