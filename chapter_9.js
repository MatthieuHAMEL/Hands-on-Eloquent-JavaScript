// Chapter 9 : Regular Expressions

/////////////////////////////////////////
// 1. Create a regexp 
let re1 = new RegExp("abc"); // Usual escaping rules apply
let re2 = /abc/; // Alternative syntax : it is only required to escape the '/' character

// Special characters that are meant to be used as characters, like ? or *, also need 
// to be escaped. 

let aPlus = /A\+/;

/////////////////////////////////////////
// 2. Test a regexp 
/abc/.test("abcde"); // true (match!)
/abc/.test("abxde"); // false

/////////////////////////////////////////
// 3. Test if a string matches "any element of a set"

/[0123456789]/.test("in 1992"); // true
/[0-9]/.test("in 1992"); // Alternative syntax, range defined by unicode index
/[0-9]/.test("Babar"); // false (the regexp can't be matched with Babar)

/* Special values : 
\d : a digit character 
\w : an alphanumeric character
\s : a whitespace (blank space, \n, \t, ...)
\D : NOT a digit
\W : NOT a \w
\S : NOT a \s
.  : any character except newline (\n)
*/

// Examples : 
let datetime = /\d\d-\d\d-\d\d\d\d \d\d:\d\d/;
let digit_or_period = /[\d.]/; // ., inside the brackets, has lost its "any character" meaning

// Inversion : 
/[^01]/.test("010100110"); // false
// "Does any character that is not in {0, 1} matches the string ? No."
/[^01]/.test("010200110"); // true





console.log(/\d+/.test("Babar 123"));
console.log(/a{4}/.test("aaaaa"));

let dateTime = /\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}/;
console.log(dateTime.test("Babar 1-30-2003 8:45"));