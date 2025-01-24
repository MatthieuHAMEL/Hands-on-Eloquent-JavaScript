// Chapter 6 : OOP

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
console.log(blackRabbit.x);

// The objects created from the prototype will have the same methods. So it's as if they were
// all instances of the same ... class.

// 3. Classes (introduced in 2015)
// As we saw prototypes are nothing more than objects. We do Object.create(proto) to 
// create objects sharing the proto's properties. But this may be error-prone: 
// for example the speak() method of protoRabbit refers to the property "this.type". 
// As there is no contract, no real interface nor attribute list, it is easy to 
// create an object from the proto and forget about defining that property. We have to 
// set that "type" property manually. 

// Classes are closer to what is done in modern OOP, as it defines the shape of an object, 
// i.e. its methods and properties. 

// This is what a constructor would look like if we had only prototypes to play with 
function makeRabbit(type) {
  let rabbit = Object.create(protoRabbit);
  rabbit.type = type;
  return rabbit;
}

// Basically it is a function ensuring the necessary properties are defined on the resulting objects.
// The class syntax does that more formally : 

class Rabbit {
  constructor(type) { // It is a special function 
    this.type = type; // Here we declare the various data attributes
  }

  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
  }
}

// So a class == {a prototype defining methods} + {a set of attributes specified by a constructor}

// This is how we call a constructor : 
let killerRabbit = new Rabbit("killer");

// The class name 'Rabbit' is assimilated to its constructor.
console.log(Object.getPrototypeOf(Rabbit) == Function.prototype);
console.log(Object.getPrototypeOf(killerRabbit) == Rabbit.prototype);

// Indeed in the past we defined constructors manually like this : 
function ArchaicRabbit(type) { // With a capital letter to know we want to define a type 
  this.type = type;
}
let myArchaicRabbit = new ArchaicRabbit("old school");

// To add methods on those types we did : 
ArchaicRabbit.prototype.someMethod = function(a) {
  // ...
};

// That is why functions, still today, have a property named "prototype". 
// /!\ This is not the prototype of the function, this is a property, 
// named prototype, that is the prototype of the defined type ! 

// Instead of declaring properties in the constructor we can put them in the class{} :
class Particle {
  speed = 0;
  constructor(position) {
    this.position = position;
  }
} // This class has two properties, speed and position. 
// None of those will be global nor attached to the prototype. They'll be by instance.

// Defining an anonymous class inline :
let object = new class { getWord() { return "hello"; } };
 console.log(object.getWord());

