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
// The problem is that it is quite error-prone : for example the speak() method refers to "this.type"
// As there is no real interface/contract/attribute list, it's easy to create an object from 
// the prototype and forget about defining that property. We have to set that "type" property 
// manually. 

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

/////////////////////////////////////////
// 3. Classes (introduced in 2015)
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





