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

console.log(SCRIPTS);
console.log(typeof SCRIPTS);