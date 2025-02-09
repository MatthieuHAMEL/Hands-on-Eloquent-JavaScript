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
const myString = "Babar"; 
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

/////////////////////////////////////////
// I - Range 
function range(start, end) {
  // Directly initialize the array with the right number of parameters: 
  let arr = new Array(end-start+1);
  for (let i = 0; i < end-start+1; i++) {
    arr[i] = start + i;
  }
  return arr;
}

console.log(range(15, 25));

function sum(arr) {
  let sum = 0;
  for (let elt of arr) { // /!\ Do not confuse with "for..in" which doesn't work with arrays.
    sum += elt;
  }
  return sum;
}

console.log(sum([40, 80, 12]));
console.log(sum(range(0, 30)));

// Additional assignment :
// Prec: step != 0
function range_step(start, end, step) {
  if (step === undefined) {
    return range(start, end); // With step of 1 (""optimized"" a little...)
  }

  let arr = [];
  for (let i = start; (step > 0) ? i <= end : i >= end; i += step) {
    arr.push(i);
  }
  return arr;
}

console.log(range_step(1, 10, 2));
console.log(range_step(5, 2,-1));
console.log(range_step(15, 25));

/////////////////////////////////////////
// II - Reversing an array 

// Produce a new array that is reversed.
function reverseArray(iArr) {
  let oArr = [];
  for (let i = iArr.length-1; i >= 0 ; i--) {
    oArr.push(iArr[i]);
  }
  return oArr;
}

console.log(reverseArray(["Babar", "is", "the", "king", "of", "elephants"]));

function reverseArrayInPlace(ioArr) {
  // I'll swap ioArr[n] with ioArr[LEN-n-1] for every n in [|0, LEN//2|]
  // We'll go from 0 to that middle index (LEN//2) below. If there's an odd 
  // number of parameters, the element is the middle won't change anyway.
  const middle_idx = (ioArr.length - ioArr.length % 2) / 2;

  for (let i = 0; i < middle_idx; i++) {
    [ioArr[i], ioArr[ioArr.length - i - 1]] = [ioArr[ioArr.length - i - 1], ioArr[i]]; // swap!
  }
}

let arr = [1, 2, 3, 4];
reverseArrayInPlace(arr);
console.log(arr);

let arr_2 = [18, 92, 163e51, "Babar", 0, null, {x: 12, y:-150}, ["hey!", true]];
const arr_2_asString = JSON.stringify(arr_2); // For latter comparison

reverseArrayInPlace(arr_2);
console.log(arr_2);

reverseArrayInPlace(arr_2);
console.assert(arr_2_asString === JSON.stringify(arr_2));

/////////////////////////////////////////
// II - A List (linked list)

// I could also have opted for a recursive version (rest = arrayToList(iArr.slice(1)))
function arrayToList(iArr) {
  // I start from the end which is not linked to anything. 
  let list = {value: iArr[iArr.length-1], rest: null};
  for (let i = iArr.length-2; i >= 0; i--) {
    list = {value: iArr[i], rest:list};
  }
  return list;
}

console.log(arrayToList([3, 4, 5]));

function listToArray(iList) {
  let refList = iList; // To iterate on the list
  let oArr = [refList.value];
  while (refList.rest != null) {
    refList = refList.rest;
    oArr.push(refList.value);
  }
  return oArr;
}

let list = {
  value: 1,
  rest: {
    value: 2,
    rest: {
      value: 3,
      rest: null
    }
  }
};

let myArr = listToArray(list);
console.log(myArr);

function prepend(iElt, ioList) {
  return {value: iElt, rest: ioList};
}

let myOtherList = prepend("Babar", list);
console.log(myOtherList);

function nth(iList, iIdx) {
  if (iIdx == 0) {
    return iList;
  }
  else if (iList === null) {
    return null;
  }

  return nth(iList.rest, iIdx-1);
}

console.log(nth(myOtherList, 1));
console.log(nth(myOtherList, 0));
console.log(nth(myOtherList, 3));
console.log(nth(myOtherList, 4));
console.log(nth(myOtherList, 5));

/////////////////////////////////////////
// III - Deep comparison 

function deepEqual(iVal_1, iVal_2) {
  // Distinction with null values not to fall through the "object" case.
  if (iVal_1 === iVal_2) { // Same underlying object
    return true;
  }
  else if (iVal_1 == null || iVal_2 == null) {
    return false; // If they're both null we'd have taken the first if()
  }
  else if (typeof iVal_1 != typeof iVal_2) {
    return false;
  }
  else if (typeof iVal_1 == "object") { // And thus iVal_2 is object too
    if (Object.keys(iVal_1).length != Object.keys(iVal_2).length) {
      return false;
    }
    // /!\ An array is an object! So this loop iterates over anything ([...], {...})
    for (let prop of Object.keys(iVal_1)) {
      if (!(Object.keys(iVal_2).includes(prop))) {
        return false;
      }

      if (!deepEqual(iVal_1[prop], iVal_2[prop])) {
        return false;
      }

      // Primitive cases and heterogeneous types...
      if (typeof iVal_1[prop] != "object" || typeof iVal_2[prop] != "object") {
        if (iVal_1[prop] !== iVal_2[prop]) { // The strict operator excludes heterogenous values
          return false;
        }
      }
    }
  }
  return true;
}

const obj1 = {x: 20, y:"Babar"};
const obj2 = {y:"Babar", x:20};
console.log(deepEqual(obj1, obj2)); // T

const obj3 = {y:"Babarr", x:20};
console.log(deepEqual(obj3, obj1)); // F

const obj4 = {x: 20, y:"Babar", z: {x: 140, n: "Hey"}};
const obj5 = {y:"Babar", x:20, z: {x: 140, n: "Hey"}};
const obj6 = {y:"Babar", x:20, z: {x: 141, n: "Hey"}};
console.log(deepEqual(obj4, obj5)); // T
console.log(deepEqual(obj4, obj6)); // F
