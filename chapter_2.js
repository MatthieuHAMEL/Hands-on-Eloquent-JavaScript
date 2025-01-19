console.log("Chapter 2 exercises");

// "Looping a triangle"
function ex_1() {
  const NB_LINES = 7;
  let res = "";
  for (let i = 0; i < NB_LINES; i+=1) {
    res += '#'.repeat(i+1) + '\n';
  }
  console.log(res);
}

// "FizzBuzz". Non-eloquent but simple solution! 
function ex_2() {
  for (let i = 1; i <= 100; i++) {
    if ((i%3 == 0) && (i%5 == 0)) {
      console.log("FizzBuzz");
    }
    else if (i%3 == 0) {
      console.log("Fizz");
    }
    else if (i%5 == 0) {
      console.log("Buzz");
    }
    else {
      console.log(i);
    }
  }
}

// "Chessboard"
function ex_3() {
  const size = 19;
  const r = size % 2; // Integer division below: 
  const line_base = ("# ".repeat((size - r) / 2) + ((r == 1) ? '#' : '')).slice(0, -1);
  const line_one = ' ' + line_base + '\n'; 
  const line_two = line_base + ' \n'; // That end space is not visible here but useful in a "real" grid context ...
  // Now I just have to alternate between line_one ans line_two  
  let chessboard = '';
  for (let i = 0; i < size; i++) {
    chessboard += (i%2 == 0) ? line_one : line_two; 
  }
  console.log(chessboard);
}

//////////////////////////////////////////////////////
// Launch what you want : 
ex_1();
