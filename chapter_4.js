// Important stuff in Chapter 4 : 

/////////////////////////////////////////
// 1. ARRAYS : They can contain differently typed values : 
let myArray = [2, 3, 9, "Babar", -150, null, 3.14];  
console.log(myArray); 

// Array spreading :
let words = ["never", "fully"];
console.log(["will", ...words, "understand"]);

// Function with a variable number of parameters : 
function max(...numbers) { // spreads to an array ... 
  let result = -Infinity;
  for (let number of numbers) {
    if (number > result) result = number;
  }
  return result;
}

// Destructuring 
let [name, age] = ["Babar", 80]; 

/////////////////////////////////////////
// 2. PROPERTIES 
function myFunction() {}
console.log(myFunction.name); // "myFunction". name is a property of the function object. 
console.log(myFunction["name"]) // Explicit access to the object's properties hashtable 

/////////////////////////////////////////
// 3. METHODS 
let myString = "Babar"; 
console.log(myString.toUpperCase); // Will log some special message stating it's a function 
console.log(typeof myString.toUpperCase); // ... indeed
console.log(myString.toUpperCase()); // Call that method !

// A method is a special function whose main parameter is the instance of the class it is defined on.
// Or: a method is a "property that is actually a function".
// toUpperCase is a method of the String class.

// push and pop are methods from the Array class 
myArray.push("Foo");
console.log(myArray); 

let something = myArray.pop();
// The last element, "Foo", has disappeared from myArray and it has been returned by pop()
console.log(something); 
console.log(myArray); 

/////////////////////////////////////////
// 4. OBJECTS

let day1 = {
  squirrel: false,
  events: ["work", "touched tree", "pizza", "running"], 
  "a property name with spaces": true
};

console.log(day1.events);

// Modifying a property of the day1 object :
day1.events.push("sleeping");
console.log(day1.events);

console.log("squirrel" in day1); // true : the property exists 
console.log("babar" in day1); // false 
console.log(Object.keys(day1));
console.log(Object.keys({tata: 0, toto: "hey!"})); // With an anonymous object defined on the fly 

// Syntactic sugar: 
let journal = [];
  function addEntry(events, squirrel) {
  journal.push({events, squirrel}); // Shortcut for {events: events, squirrel: squirel}
  // that shortcut is valid as long as the variable and the property names are the same.
}

// Access to a property if we don't know if it exists in the object
function city(object) {
  return object.address?.city;
}

/////////////////////////////////////////
// 5. MUTABILITY 

let object1 = {value: 10};
let object2 = object1;      // Reference to object1
let object3 = {value: 10};  // Different object !

console.log(object1 == object2); // true
console.log(object1 == object3); // false

const score = {visitors: 0, home: 0};
// score = { visitors: 1, home: 0 }; // Not possible. it's const (try it!)
score.visitors = 1; // Still possible to mutate data members 

/////////////////////////////////////////
// Exercises 

// I - Range 
function range(start, end) {
  // Directly initialize the array with the right number of parameters: 
  let arr = Array(end-start+1);
  for (let i = 0; i < end-start+1; i++) {
    arr[i] = start + i;
  }
  return arr;
}

console.log(range(15, 25));