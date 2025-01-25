// Chapter 6 : OOP
/////////////////////////////////////////
// 1. Methods
// In JS, a method is a property that is actually a function. So we define 
// it like a property : 
function translate(dx, dy) {
  this.x += dx;
  this.y += dy;
}
let point = {x: 10, y:10, translate};

console.log(point);
point.translate(5, 5); // I call the method translate on the object point 
console.log(point);

//translate(5, 5); // translate references 'this' so I can't do this. 
translate.call(point, 5, 5); // I can use call to bind 'this' explicitly 

// I can also define the method directly in the object : 
let point2 = {
  x: 10, y:10,
  translate(dx, dy) { // It's a quicker way to define methods : no function keyword
    this.x += dx; 
    this.y += dy;
  }
};

point2.translate(5, 5);
console.log(point2);

/////////////////////////////////////////
// 2. Prototypes and OOP : producing instances of objects 
// I can do this to produce points : 

function newPoint(x, y) {
  return {
    x, 
    y, 
    translate(dx, dy) {
      this.x += dx; 
      this.y += dy;
    }
  }
}

let p = newPoint(5, 5);
p.translate(12, 10);
console.log(p);
let p2 = newPoint(0, 0); // etc etc 

// We could create functions like that for every type we want but this would be quite repetitive
// Besides there will be N instances of the method speak() if we create N objects while we know 
// this is the same method for all objects. So there should be one speak() method !
// Objects are fortunately tied to prototypes that are like meta-objects.

console.log(Object.getPrototypeOf({}) == Object.prototype);

// When a property is not found on an object, the engine looks on the prototype.
// (and can then explore the prototype of the prototype, etc.)
// Functions derive from Function.prototype and arrays derive from Array.prototype.

// So sometimes we don't want to derive directly from that Object.prototype, and we 
// want to put our own prototype before :

let protoRabbit = {
  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
  }
};

// Nothing different from a classical object. But we can create others objects from it :
let blackRabbit = Object.create(protoRabbit);
blackRabbit.type = "black";
blackRabbit.speak("I am fear and darkness");

// The objects created from the prototype will have the same methods. So it's as if they were
// all instances of the same ... class.

// All techniques presented in the latter points are derived from that prototype chain 
// idea. Those techniques give us something we didn't have with the object factory (cf newPoint) :
// an actual chain of inheritance, and also the fact that we won't duplicate the same methods 
// ever and ever in memory when creating instances.

// The problem of that prototype object creation is that it's quite error-prone : 
// e.g. the speak() method refers to "this.type", but as there's no concrete interface/contract
// or attribute list, it's easy to create an object from the prototype and forget 
// about defining that property. We have to set that "type" property manually. 

// But we'll gradually improve that, first with constructors. 
// Constructors are like the newPoint method we created before : they encapsulate "what's needed"
// to build an object but they also specify the attributes of the object.

// This is the "old way" of defining constructors : 
function ArchaicRabbit(type) { // With a capital letter to know we want to define a type 
  this.type = type; // Creates the type property !
}
let myArchaicRabbit = new ArchaicRabbit("old school"); // Call the constructor

// To add methods on those types we do : 
ArchaicRabbit.prototype.someMethod = function(a) {
  // ...
};

// Now we can do that thanks to the prototype chain and constructors identifying the type
// And this will work even with N levels of inheritance.
console.log("instanceof(test 1)"); 
console.log([1] instanceof Array);
console.log("instanceof(test 2)"); 
console.log(myArchaicRabbit instanceof ArchaicRabbit); 
console.log("instanceof(test 3)"); 
console.log(myArchaicRabbit instanceof Array); 

/////////////////////////////////////////
// 3. Classes (introduced in 2015) and inheritance
// Classes are closer to what is done in modern OOP, as it defines the shape of an object, 
// i.e. its methods and properties, in a more expressive way : 

class Rabbit {
  constructor(type) { // A modern constructor
    this.type = type; // Here we declare the various data attributes
  }

  speak(line) { // A method 
    console.log(`The ${this.type} rabbit says '${line}'`);
  }
}

// Under the hood:
// a class == {a prototype defining methods} + {a set of attributes specified by a constructor}

// This is how we call a constructor : 
let killerRabbit = new Rabbit("killer");

// The class name 'Rabbit' is assimilated to its constructor, so Rabbit's proto is Function.prototype
console.log(Object.getPrototypeOf(Rabbit) == Function.prototype);
// While the prototype of every instance is Rabbit.prototype which contains the methods.
console.log(Object.getPrototypeOf(killerRabbit) == Rabbit.prototype);

// That is why JS functions, still today, have a property named "prototype". 
// /!\ This is not the prototype of the function, this is a property, 
// named prototype, that is the prototype of the defined type ! 
console.log(Rabbit.prototype != Object.getPrototypeOf(Rabbit));

// Instead of declaring properties in the constructor we can put them in the class{} :
class Particle {
  speed = 0;
  constructor(position) {
    this.position = position;
  }
} // This class has two properties, speed and position. 
// None of those will be global nor attached to the prototype. They'll be by instance.
// It's just that 'speed' won't be defined by the constructor. Maybe it's const, 
// maybe it'll be changed later...

// Defining an anonymous class inline :
let object = new class { getWord() { return "hello"; } };
console.log(object.getWord());

// This is how inheritance happens with this syntax : 

class List {
  constructor(value, rest) {
    this.value = value;
    this.rest = rest;
  }
  get length() {
    return 1 + (this.rest ? this.rest.length : 0);
  }
  static fromArray(array) {
    let result = null;
    for (let i = array.length- 1; i >= 0; i--) {
      result = new this(array[i], result);
    }
    return result;
  }
}

class LengthList extends List {
  #length;
  constructor(value, rest) {
    super(value, rest);
    // /!\ We're not assigning the length() method defined in List, since it is 
    // a property, we're calling length and storing the result in #length
    // This means the optimization is valid (we won't recurse every time we call
    // LengthList.length) but it won't be synchronized if the list actually changes!
    this.#length = super.length; 
  }
  get length() {
    return this.#length;
  }
}
/////////////////////////////////////////
// 4. Private properties

class SecretiveObject {
  #getSecret() { // This is a private method 
    return "I ate all the plums";
  }
  interrogate() {
    let shallISayIt = this.#getSecret();
    return "never";
  }
} 

let myObject = new SecretiveObject();
// interrogate() has the right to call #getSecret and do whatever it wants with it
console.log(myObject.interrogate()); 
// But from outside the class I can't :
// console.log(myObject.#getSecret()); // Try this !

// Private properties must be declared in the class body. 
class Foo {
  #bar; // This is compulsory. Try to comment this line !
  constructor(anything) {
    this.#bar = anything + 1789;
  }
} 

/////////////////////////////////////////
// 5. Overriding (hiding) derived properties

Rabbit.prototype.teeth = "small";
console.log(killerRabbit.teeth);
killerRabbit.teeth = "long, sharp, and bloody"; // We don't get the proto property anymore 
console.log(killerRabbit.teeth)

// The new instances still benefit from the prototype's property value.
console.log((new Rabbit("basic")).teeth);

// E.g. : The Array.prototype object, which inherits Object.prototype, overrides 
// the toString method. Indeed if we try to call Object.prototype.toString on an array :
console.log(Object.prototype.toString.call([1, 2])); 
// This is very different from what the toString method usually does! 

/////////////////////////////////////////
// 6. Maps

// We can be tempted by this : 
let myMap = {
  key1: "value1", 
  key2: 543,
  key3: "Babar" 
};

console.log(myMap.key3);

// Since it is an object it inherits from Object.prototype. So sadly : 
console.log("toString" in myMap); // true
// We can still use Object.hasOwn since it uses Object.keys and doesn't include proto's properties:
console.log(Object.hasOwn(myMap, "toString")); // false
// ... but this won't be very efficient. 

// So all of this is dangerous. Instead we can use the Map type : 
let myMap2 = new Map();
myMap2.set("value1", 39);
myMap2.set(543, 22);
myMap2.set("Babar", 62);
console.log(myMap2);

// Bad things can still happen silently, sadly :
myMap2["dog"] = "Bob";
console.log(myMap2.has("dog")); // false: we added a property to the object! It didn't populate the map
myMap.dog = "Babar"; // Same thing.
console.log(myMap2.has("dog"));

/////////////////////////////////////////
// 7. Getters and setters, static methods 

// A getter
let varyingSize = {
  get size() { // This is a special property that, when read, actually calls a method
  return Math.floor(Math.random() * 100);
  }
};

console.log(varyingSize.size);
//console.log(varyingSize.size()); // Not a function! from an outside POV...
// With that getter, we didn't specify a way to modify the property -> it is Read-Only. 
// varyingSize.size = 22222222; // Try this!

class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }
  get fahrenheit() {
    return this.celsius * 1.8 + 32;
  }
  set fahrenheit(value) {
    this.celsius = (value- 32) / 1.8;
  }
  static fromFahrenheit(value) {
    return new Temperature((value- 32) / 1.8);
  }
} 

// Above, that Temperature class has two properties, celsius and fahrenheit.

// The static methods are called like that : 
let myTemperature = Temperature.fromFahrenheit(100);
// Similarly to other OOP languages, static methods can be used for 
// factories or any other kind of procedural code that the class wants 
// to make available to the user. 

/////////////////////////////////////////
// 8. Symbols

// "Interfaces" is not a real JS concept since JS uses duck-typing. 
// so an object implements an interface if it has the various properties and 
// methods that may be called by objects interacting with instances of this interface. 

// e.g. an interface "geometry" implicitly defined by that getSize function
// It requires object to have a numeric 'size' property and a 'metric_system' bool.
// This is actual polymorphism, as several different types can indeed comply to this spec.

function getSize(obj) {
  if (!obj.metric_system) {
    console.log("Warning: object uses a custom, prehistorical measurement system");
  }
  return obj.size;
}

// An object can implement to several interfaces, e.g. an object complying to "geometry"
// can also implement an interface "physics" with weight, a function to increase the object 
// weight, etc. 

// We have a real problem though, if two pieces of code  define two 
// interfaces requiring a homonym property : e.g. an array-like object having a length 
// property (this is needed to work with the for..of loop, for instance), but that object 
// may be passed to a function that expects "length" to be the length of a road and not 
// the number of elements of the object. 

// Symbols (2015) solve this problem, or at least it avoids 3rd-party code to 
// wrongly use our property P if we called them with the same name 'P', 
// without the intention to comply to that code. 
let sym = Symbol("name");
console.log(sym == Symbol("name")); // false: it just created another symbol here 

Rabbit.prototype[sym] = 55;
console.log(killerRabbit[sym]);

const length = Symbol("length");
let myTrip = {
  length: 2,
  0: "Lankwitz",
  1: "Babelsberg",
  [length]: 21500 // No external code will ever access this. I am the symbol owner, and it's unique!
};

console.log(myTrip[length], myTrip.length);

/////////////////////////////////////////
// 9. The iterator interface 

// A concrete example of those (quite abstract) polymorphism considerations is the 
// Symbol.iterator value, it is a special symbol available in the language. 
// If I want my object to be iterable, It must have the [Symbol.iterator] method.
// This method returns an object on which the next() method is available. 

// This is what happens when we do a for..of on a string :
let okIterator = "OK"[Symbol.iterator]();
console.log(okIterator.next());
// → {value: "O", done: false}
console.log(okIterator.next());
// → {value: "K", done: false}
console.log(okIterator.next());
// → {value: undefined, done: true}

// It's possible to use a for..of loop on any object implementing that special iterator method.

/////////////////////////////////////////
// Exercises
/////////////////////////////////////////
// I. A vector type 

/* 
Write a class Vec that represents a vector in two-dimensional space. It takes x
 and y parameters (numbers), that it saves to properties of the same name.
 Give the Vec prototype two methods, plus and minus, that take another
 vector as a parameter and return a new vector that has the sum or difference
 of the two vectors’ (this and the parameter) x and y values.
 Add a getter property length to the prototype that computes the length of
 the vector—that is, the distance of the point (x, y) from the origin (0, 0).
 */

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get length() {
    return Math.sqrt(this.x**2 + this.y**2);
  }

  plus(iVec) {
    return new Vec(this.x + iVec.x, this.y + iVec.y);
  }

  minus(iVec) {
    return new Vec(this.x - iVec.x, this.y - iVec.y);
  }
}

let myVector = new Vec(2, 3);
console.log(myVector);
console.log(myVector.length); // sqrt(15)
let myOtherVector = myVector.plus(new Vec(1, 1));
console.log(myOtherVector); // Vec with (3, 4) coordinates
let myThirdVector = myOtherVector.minus(myVector);
console.log(myThirdVector); // Vec with (1, 1) coordinates

/////////////////////////////////////////
// II. Groups (a set structure)

class Group {
  #set;
  constructor() {
    this.#set = []; // Of course I could use the built-in Set class internally but that's cheating
  }

  add(iVal) {
    if (!this.#set.includes(iVal)) {
      this.#set.push(iVal);
    }
  }

  delete(iVal) {
    const index = this.#set.indexOf(iVal);
    if (index > -1) {
      this.#set.splice(index, 1);
    }
  }

  has(iVal) {
    return this.#set.includes(iVal);
  }

  toString() {
    return `{ ${this.#set.join(', ')} }`;
  }

  static from(iIterable) {
    let group = new Group();
    for (let elt of iIterable) {
      group.add(elt);
    }
    return group;
  }

  // This is exercise III.
  [Symbol.iterator]() {
    let index = 0;
    const items = this.#set; // for the closure.. this way I don't have to make #set public  
    return {
      next() {
        if (index < items.length) {
          return { value: items[index++], done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
}

let mySet = new Group();
console.log(mySet.toString());
mySet.add(2);
mySet.add("Babar");
console.log(mySet.toString());
mySet.add("Babar");
console.log(mySet.toString());
console.log(mySet.has("Babar")); // true
console.log(mySet.has("babar")); // false
mySet.delete("Babar");
console.log(mySet.has("Babar")); // false
console.log(mySet.toString());
// Of course it would require much more tests. ...

let myOtherSet = Group.from([null, 2, 3, "Babar"]);
console.log(myOtherSet.toString());

/////////////////////////////////////////
// III. Iterable Groups

// I can't use an class defined externally "GroupIterator" like the ListIterator 
// showed in the book, because I want to keep #set (the internal array) private.
// So I defined the method internally and the next() method captures the private attribute.

for (const elt of myOtherSet) {
  console.log(elt);
}

