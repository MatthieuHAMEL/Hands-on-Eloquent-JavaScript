// Chapter 8: Bugs and errors 

/////////////////////////////////////////
// 1. Strict mode 
function canYouSpotTheProblem() {
  "use strict"; // Activates strict mode 
  for (counter = 0; counter < 10; counter++) {
    console.log("Happy happy");
  }
}

//canYouSpotTheProblem(); // try this!
// Whether I put "use strict" or not I don't see any difference in my env (BunJS) since 
// .js file are considered ES Modules and strict mode is enabled by default ... for the better.

// Without that strict mode, counter would have been created silently as a global binding.

// Many bad things can happen if we're not in strict mode 
// Below I forgot "new" when creating a Person object. So 'this', instead of designating 
// the object to be created, designates the global program scope and I'm just creating 
// a "name" variable. In strict mode, I have an error because it set "this" to undefined 
// If we're not in an appropriate context (in a method call or in a constructor call with new
// Try it!
// function Person(name) { this.name = name; }
// let ferdinand = Person("Ferdinand"); // oops
// console.log(name); // → Ferdinand

// Fortunately I was in strict mode since the beginning of my JS journey.

/////////////////////////////////////////
// 2. Types
// Cf. TypeScript for a strongly-typed and statically-typed "extension" of JS

/////////////////////////////////////////
// 3. Testing 

function test(label, body) {
  if (!body()) console.log(`Failed: ${label}`);
}

test("convert Latin text to uppercase", () => {
  return "hello".toUpperCase() == "HELLO";
});
  
test("convert Greek text to uppercase", () => {
  return "Χαίρετε".toUpperCase() == "ΧΑΊΡΕΤΕ";
});

// Test suites help a lot. cf Jest and https://bun.sh/docs/test/writing

/////////////////////////////////////////
// 4. Exceptions

function promptDirection(question) {
  // let result = prompt(question); // Uncomment this !
  let result = "Something wrong"; // Comment this !
  if (result.toLowerCase() == "left") return "L";
  if (result.toLowerCase() == "right") return "R";
  throw new Error("Invalid direction: " + result); // Object with a message and a stack property
}

function look() {
  if (promptDirection("Which way?") == "L") {
    return "a house";
  } else {
    return "two angry bears";
  }
}

try {
  console.log("You see", look());
} catch (error) {
  console.log("Something went wrong: " + error);
  console.log(error.stack);
}

// Exceptions can be dangerous and lead to logic errors ; the finally{} block can help.

// If an exception is left uncaught, the behaviour of the programs depends on the environment, 
// browsers just print the stacktrace, Node-like envs abort the whole program.

// Selective catching : here we catch all exceptions but since we misspelled 'promptDirection'
// the loop will not end ever. 
/*
for (;;) {
  try {
    let dir = promtDirection("Where?"); // ← typo!
    console.log("You chose ", dir);
    break;
  } catch (e) {
    console.log("Not a valid direction. Try again.");
  }
}
*/ 
// -> Don't assume that an exception is the one you expected! 
// There can be other exceptions in the code you call

// We can use type checking to filter exceptions 
class InputError extends Error {}
// throw new InputError("...");
try {
  // ... 
  throw new InputError("...");
} catch (e) {
  if (e instanceof InputError) {
    console.log("Not a valid direction. Try again.");
  } else {
    throw e; // Rethrow since we don't really care of other exceptions (we don't expect them...)
  }
}

/////////////////////////////////////////
// Exercises 
/////////////////////////////////////////
// I. Retry

class MultiplicatorUnitFailure extends Error{};

function primitiveMultiply(a, b) {
  if (Math.random() < 0.2) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure("I am not a very stable function...");
  }
} 

for (;;) {
  try {
    primitiveMultiply(50, 50);
    break;
  }
  catch (e) {
    if (e instanceof MultiplicatorUnitFailure) {
      console.log(e.message);
      console.log("I'll guess I'll just try again ...")
    }
    else {
      throw e;
    }
  }
}

/////////////////////////////////////////
// II. The locked box 

const box = new class {
  locked = true;
  #content = [];
  unlock() { this.locked = false; }
  lock() { this.locked = true; }
  
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this.#content;
  }
};

function withBoxUnlocked(func) {
  box.unlock();
  try {
    func();
  }
  finally {
    box.lock();
  }
}

try {
  withBoxUnlocked(() => {throw new Error("Oops")});
} catch (e) {
  // ... 
}
console.log(box.locked); // locked !



