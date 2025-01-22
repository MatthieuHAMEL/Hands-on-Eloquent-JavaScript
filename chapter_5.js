// /!\ Change this and export SCRIPTS depending on your runtime.
import { SCRIPTS } from "./scripts";

// Chapter 5: Higher order functions
// Key points I've learned :

// 1. Since functions are values and lambdas can capture everything, 
// it is OK to pass a function to a function : 

function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

let labels = [];
repeat(5, i => {labels.push(`Unit ${i + 1}`)});
console.log(labels);

// repeat is a Higher-Order Function : an abstraction to actions and not only 
// to values. 

// This is a Higher-Order Function that produces a function.
function greaterThan(n) {
  return m => m > n;
}

let greaterThan10 = greaterThan(10);
console.log(greaterThan10(11));

// The following function "proxifies" its input function and can be used for logging :
function noisy(f) {
  return (...args) => {
  console.log("calling with", args);
  let result = f(...args);
  console.log("called with", args, ", returned", result);
  return result;
  };
}

// This one is interesting too so I keep it 
function unless(test, then) {
  if (!test) then();
}

// This exists in the Array class :
["A", "B"].forEach(l => console.log(l));

// Let's write it by myself - without the class semantics :
function myForEach(iArray, iAction) {
  for (let elt of iArray) {
    iAction(elt);
  }
}

myForEach(["A", "B"], l => console.log(l));

// This is my attempt of using reduce() to find the most recent script
// without having read the book's reduce() examples : 
let newest = SCRIPTS.reduce((a, b) => {return (a.year > b.year) ? a : b});
console.log(newest);

// The callback function in reduce() takes two parameters: the accumulator and the current value.
// If we don't give any "start value", which is what I did right before, the 
// accumulator(a) is set to the first element, and b to the second element.

// This is by pure cultural curiosity 
let oldest = SCRIPTS.reduce((a, b) => {return (a.year < b.year) ? a : b});
console.log(oldest);

// This is for finding the script with the most characters : 
function characterCount(script) {
  return script.ranges.reduce(
    (count, [from, to]) => {
      return count + (to - from);
    }, 0); // We count from zero
}

console.log(SCRIPTS.reduce((a, b) => {
  return characterCount(a) < characterCount(b) ? b : a;
}));

/////////////////////////////////////////
// 2. Unicode

// JavaScript strings are UTF-16, which means characters (code points) can be 1 code unit long, 
// or 2 code units long. 
let horseShoe = "🐴👟";
console.log(horseShoe.length); // 4 ! length counts the code units and not the code points!
console.log(horseShoe[0]); // Half-character
console.log(horseShoe[1]); // The second half of the Horse character
console.log(horseShoe.charCodeAt(0)); // → 55357 (Code of the half-character): not very useful
console.log(horseShoe.codePointAt(0)); // OK (code of the Horse character)

// Not relevant, it gives the char code of the half character unit...
console.log(horseShoe.codePointAt(1)); 
// ... since we're not pointing to the beginning of a code point. 
// So we can't just loop from 0 to length and print every codePointAt(), as their 
// indexing is by code unit.

// Fortunately the for..of loop does loop on real characters and not code units
let roseDragon = "🌹🐉";
  for (let char of roseDragon) {
  console.log(char); // Then we can use safely codePointAt(char[0])
}

/////////////////////////////////////////
// Exercises 
/////////////////////////////////////////
// I. "Flattening"
let myArrayOfArrays = [[3, 4], ["Babar", 6], [2]];

function flatten(iArr) {
  return iArr.reduce((acc, elt) => acc.concat(elt));
}

let myFlattenedArray = flatten(myArrayOfArrays);
console.log(myFlattenedArray);

/////////////////////////////////////////
// II. "Your own loop"

function loop(iVal, funcTest, funcUpdate, funcBody) {
  for(let iter = iVal; funcTest(iter); iter = funcUpdate(iter)) {
    funcBody(iter);
  }
}

loop(5, v => (v <= 10), v => v+1, console.log);

