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
      break;
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

