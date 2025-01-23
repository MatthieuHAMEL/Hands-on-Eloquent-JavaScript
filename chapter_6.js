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

// 2. Prototypes : producing instances of objects 

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

// That would be a bit confusing to create functions like that for every type we want. 

