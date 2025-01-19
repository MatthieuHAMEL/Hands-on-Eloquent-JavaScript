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
  const r = size % 2; // For integer division below:
  
  // Repeat the pattern (# + space) size/2 times. If size is even, strip the last space.
  // So line_base is 'size-1' characters long whether 'size' is even or not.
  let line_base = "# ".repeat((size - r) / 2);
  if (r == 0) {
    line_base.slice(0, -1);
  }

  // Shift line_base 2 times. Subtlety for an odd size where we have to add a # one line over two. 
  const line_one = ' ' + line_base + '\n'; 
  const line_two = line_base + ((r == 1) ? '#' : ' ') + '\n'; // That end space is not visible here but useful in a "real" grid context ...
  
  // Now just alternate between line_one and line_two  
  let chessboard = '';
  for (let i = 0; i < size; i++) {
    chessboard += (i%2 == 0) ? line_one : line_two; 
  }
  console.log(chessboard);
}

//////////////////////////////////////////////////////
// Launch what you want : 
ex_3();
