// Chapter 7 : Project
// The mail-delivery robot

// There are 14 roads in Meadowfield forming a graph 
const roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];

function buildGraph(edges) {
  let graph = Object.create(null);
  function addEdge(from, to) {
    if (from in graph) {
      graph[from].push(to);
    } else {
      graph[from] = [to];
    }
  }

  for (let [from, to] of edges.map(r => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);
// ...Will look like 
// {Marketplace: [Post Office, Town Hall, Farm, Shop], 
//  Alice's House: [Bob's House, Post Office, Cabin], ... }

class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }
  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this; // Do not change the state (no path to the destination)
    } else {
      let parcels = this.parcels.map(p => {
          if (p.place != this.place) return p; // All the parcels that are elsewhere stay elsewhere
          return {place: destination, address: p.address}; // All the parcels that were here are collected
        }
      ).filter(p => p.place != p.address); // Eliminate the parcels that were delivered here.
      return new VillageState(destination, parcels);
    }
  }
} 

let first = new VillageState(
  "Post Office", // We're here
  [{place: "Post Office", address: "Alice's House"}] 
  // => 1 parcel to deliver, it is in Post Office, it should be delivered to Alice's House
);

// Let the village state evolve by moving to Alice's House
let next = first.move("Alice's House");
console.log(next.place); // → Alice's House (we're here now)
console.log(next.parcels); // → [] (there's nothing left to deliver)
console.log(first.place); // → Post Office : (we didn't change the first state)

function runRobot(state, robot, memory) {
  for (let turn = 0;; turn++) {
    if (state.parcels.length == 0) { // No parcel left 
      console.log(`Done in ${turn+1} turns`);
      return turn+1;
    }
    let action = robot(state, memory); // action == {direction, memory}
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
  }
}

function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

// Robot with no memory that just travel randomly 
function randomRobot(state) {
  return {direction: randomPick(roadGraph[state.place])};
}

// Let's build 5 random parcels 
VillageState.random = function(parcelCount = 5) {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place == address); // Don't destinate a parcel to the place it is stored right now!
    parcels.push({place, address});
  }
  return new VillageState("Post Office", parcels);
};

runRobot(VillageState.random(10), randomRobot);

// For the 2nd strategy we'll just follow this route twice (in both ways) :
const mailRoute = [
  "Alice's House", "Cabin", "Alice's House", "Bob's House",
  "Town Hall", "Daria's House", "Ernie's House",
  "Grete's House", "Shop", "Grete's House", "Farm",
  "Marketplace", "Post Office" ];

// /!\ There is a route from the last element (Post) to the first and it's an important assumption!
// I tried to implement this without reading the solution :
  // memory: int (the current index)
function routeRobot(state, memory) {
  if (memory == mailRoute.length - 1) { // Finished! ... go back to the first place 
    return {direction: mailRoute[0], memory: 0};
  }
  // Else, keep going 
  return {direction: mailRoute[memory+1], memory: memory+1};
}
// The book's solution is a bit more expressive but mine doesn't change structure sizes 
// since 'memory' is just an index.
// There is clearly an upper bound (26) to the number of steps thanks to this strategy 
runRobot(VillageState.random(3500), routeRobot, 0); 

// Path finding 
function findRoute(graph, from, to) {
  let work = [{at: from, route: []}];
  for (let i = 0; i < work.length; i++) {
    let {at, route} = work[i];
    for (let place of graph[at]) {
      if (place == to) return route.concat(place);
      if (!work.some(w => w.at == place)) {
        work.push({at: place, route: route.concat(place)});
      }
    }
  }
}

function goalOrientedRobot({place, parcels}, route) {
  if (route.length == 0) {
    // Consider the first parcel on the list
    let parcel = parcels[0]; 
    if (parcel.place != place) { // Fetch that parcel ! We may enter here N times if route is N-sized
      route = findRoute(roadGraph, place, parcel.place);
    } else { // We have the parcel : go to its destination
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return {direction: route[0], memory: route.slice(1)};
}

runRobot(VillageState.random(3500), goalOrientedRobot, []); 
/////////////////////////////////////////
// Exercises 
/////////////////////////////////////////
// I. Measuring a robot 

function compareRobots(robot_1, memory_1, robot_2, memory_2) {
  let [total_1, total_2] = [0, 0];
  for (let i = 0; i < 100; i++) {
    let state = VillageState.random(5); // A priori we still have 5 parcels for the test
    total_1 += runRobot(state, robot_1, memory_1);
    total_2 += runRobot(state, robot_2, memory_2);
  }
  return [total_1/100, total_2/100];
}

// routeRobot is clearly better than randomRobot 
console.log(compareRobots(randomRobot, null, routeRobot, 0));

// goalOrientedRobot is better than routeRobot, at least for 5 parcels to deliver.
console.log(compareRobots(goalOrientedRobot, [], routeRobot, 0));

/////////////////////////////////////////
// II. Robot efficiency 

// LAZY ANSWER :
// If we consider a lot more than 5 parcels (try with 500) to deliver, routeRobot 
// is actually better than goalOrientedRobot. 
// There's a clear upper bound (26) on the number of steps for routeRobot, 
// and the average number of steps may be higher for goalOrientedRobot.
// Empirically, I found that the latter is often passing to the same places 
// several times, depending on the parcel it considers - since it targets only the first. 
// Imagine there are 5 places in a linear path: A B C D E.
// While the upper bound is 10 steps for routeRobot, the goalOrientedRobot starting in C may do :
// C - D - C - B - C - D - E - D - C - B - A
// If there are parcels to deliver in A, B, D, E and if the targets are, in order : D, B, E, A
// And this is 11 steps ! So if the set of places to deliver is 'dense' enough 
// The robot can easily end up with a very sub-optimized path.

// LESS LAZY ANSWER :
// Instead of taking one parcel and traversing potentially the whole village 
// to deliver it, I'll try instead to consider every parcel and find the route 
// that is the shortest for our robot. (So it's the robot's turn to be lazy! :) )
// (computed routes will be either roads to deliver some parcel we have, or roads to get a parcel)
// Intuitively this will minimize the total steps but I don't know yet if it's gonna work.

function lazyRobot({place, parcels}, route) {
  if (route.length == 0) { 
    let chosenRoute = null;
    for (let parcel of parcels) { // We know there are parcels, by construction... 
      // Either the parcel is elsewhere, we calculate the route to it
      let curRoute = null;
      if (parcel.place != place) { 
        curRoute = findRoute(roadGraph, place, parcel.place);
      }
      else { // The other parcels are those we have in our pocket
        curRoute = findRoute(roadGraph, place, parcel.address);
      }

      if (chosenRoute == null || curRoute.length < chosenRoute.length) {
        // That route is shorter than what we had, so, retain it 
        chosenRoute = curRoute;
      }
    }
    return {direction: chosenRoute[0], memory: chosenRoute.slice(1)}
  }
  // Else just follow the road. Don't look elsewhere!
  return {direction: route[0], memory: route.slice(1)};
}

console.log("Exercise II");
console.log(compareRobots(goalOrientedRobot, [], lazyRobot, []));
// Yippee ! [ 15.79, 13.45 ] for 5 parcels. 
// My lazyRobot is still better than goalOrientedRobot for 50 or 500 parcels.
// Though it is still worse than routeRobot for a big number of parcels.

// So it is clearly not optimal and I will try, later, to find if graph 
// theory can help me to find an even better solution. 

// Also, the lazyRobot is more CPU intensive since we're computing a lot more 
// routes (5 per step, vs 1 per step for the goalOrientedRobot) just to 
// have 2 less steps in average at the end (with 5 parcels...). 
// (But in the real world this would be neglictible compared to the fuel or 
// electricity price!!!)  

/////////////////////////////////////////
// III. Persistent group 

class PGroup {
  #set;
  constructor(iArr) {
    this.#set = iArr; 
  }

  add(iVal) {
    if (!this.#set.includes(iVal)) {
      return new PGroup(this.#set.concat(iVal));
    }
    return this;
  }

  delete(iVal) {
    if (this.#set.includes(iVal)) {
      return new PGroup(this.#set.filter(elt => elt !== iVal));
    }
    return this;
  }

  has(iVal) {
    return this.#set.includes(iVal);
  }

  toString() {
    return `{ ${this.#set.join(', ')} }`;
  }
}

PGroup.empty = new PGroup([]); // It won't be affected so we just need one. 

let myFirstPGroup = PGroup.empty.add("Babar");
console.log(myFirstPGroup.toString()); 
let mySecondPGroup = myFirstPGroup.add(1515);
console.log(myFirstPGroup.toString()); // Still Babar 
console.log(mySecondPGroup.toString()); // Babar and 1515 
let myThirdPGroup = mySecondPGroup.delete(2);
console.log(mySecondPGroup.toString()); // still Babar and 1515 
console.log(myThirdPGroup.toString()); // still Babar and 1515
console.log(myThirdPGroup.has(1515)); // true
