// Chapter 11 : Asynchronous programming 

/////////////////////////////////////////
// 1. Callbacks

// A callback is a function which is executed when the async operation 
// completes 
setTimeout(() => console.log("Tick"), 500);

// It is useful when we know an operation might take some time and we 
// want the control back e.g. when dispatching network requests or 
// reading files. 

/////////////////////////////////////////
// 2. Promises 

// A promise is an object returned by a function. Promise objects 
// represent the future state of an operation. 

// It provides a 'then' method to which we can give a function ; 
// that method will be called when the promise is resolved, when 
// the async operation completes. 

// Here the promise immediatly resolves (as "15" is not a promise by itself)
let fifteen = Promise.resolve(15);
fifteen.then(value => console.log(`Got ${value}`));

// "Real" promises are created like that : 
function readTextFile() {} // do something asynchronous

function textFile(filename) {
  return new Promise(resolve => { // This function is immediatly ran
    readTextFile(filename, text => resolve(text)); // resolve is the function that the user will pass
  });
}

textFile("plans.txt").then(console.log);

// The user callback function, here console.log, could be more complicated 
// and return something itself. This return value would be wrapped in a promise.
// So we can chain promises !

