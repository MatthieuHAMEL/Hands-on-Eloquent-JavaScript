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

/////////////////////////////////////////
// 4. International characters

/* \w is just [a-zA-Z0-9_] (ascii letters, numbers, and underscore)
To support unicode characters, use : 
\p{L} : Any Unicode character considered a letter
\p{N} : Any numeric character
\p{P} : Any punctuation character
\P{L} : Any non-letter character (etc \P{N}, \P{P})
\p{Script=Hangul} : Any character from the Hangul script.
*/

/////////////////////////////////////////
// 5. Repeating

// A+ : match A more than once 
// A* : match A 0 or more times
// A? : match A 0 or 1 time (optional character)
// A{n} : match A n times exactly

// Examples : (It is important to note that regexps don't have to match the entire strings!)
/\d+/.test("Babar 123"); // true (one or more digits)
/\d+/.test("Babar"); // false 
/\d*/.test("Babar"); // true 
/\d*/.test("Babar 123"); // true
/neighbou?r/.test("neighbor"); // Ok (the u is optional)
/neighbou?r/.test("neighbour");
/a{4}/.test("aaa"); //  Regex is "repeat 'a' 4 times" ... false
/a{4}/.test("aaaa"); // true
/a{4}/.test("aaaaa"); // true even if there are 5 or more 'a' ! 
/a{4}b/.test("aaaaab"); // true but it matches from the character with index 1.

// Indeed : from now we only tested that the pattern defined by the regex is included 
// in the string. For example : 
let datetime2 = /\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}/; // \d{1,2} is "match \d 1 or 2 times"
datetime2.test("1-30-2003 8:45"); // true
datetime2.test("21-30-2003 18:45"); // still true, but :
datetime2.test("Babar 21-30-2003 18:45"); // also true ! 
// See 9. (boundaries) to "fix" that.

/////////////////////////////////////////
// 6. Grouping subexpressions

let cartoonCrying = /boo+(hoo+)+/i; 

// -> /i for case-insensitiveness match
// -> first + is for "any number of 'o'"
// -> second + is the same, e.g. hooooooooo
// -> last + is for "any number of (hoo+)".

// E.g. BoooooHooHooHooooohooooooo

/////////////////////////////////////////
// 7. Matches and groups

// The RegExp.test method just returns a bool (match / no match). 
// The exec method is more detailed : 

let match = /\d+/.exec("one two 100");
// match is null if there is no match. 
// here match is an object whose .index is 8
// It is also an array-like object with the matched string and matched subgroups i.e () blocks
// Here it's just ["100"].

/////////////////////////////////////////
// 8. The Date class

let d0 = new Date(); // the current date
d0 = Date.now(); // Same from a static function ... more explicit 
let d1 = new Date(2009, 11, 9); // 4 other args are hour, minute, seconds, milliseconds
// /!\ WARNING : 11 is december, months are 0-indexed. Days are not (RIP logic)

d0.getTime; // UNIX time in ms
let d2 = new Date(2009); // One arg only => treated as UNIX time in milliseconds !

// There are useful methods : getFullYear, getMonth, getHours, getDate, ...

// So, to create a date with a regexp we can do : 
function stringToDate(strDate) {
  let [_, month, day, year] = /(\d{1,2})-(\d{1,2})-(\d{4})/.exec(myDate);
  return new Date(year, month-1, day);
}

// The 3 pairs of parentheses defined 3 groups that we retrieve in the month, day, year 
// variables. We ignore the first element of the exec array since it is the full string 
// and we just needed to split it. 

let myDate = "09-01-2000"; // MM-DD-YYYY     // founding date!...
console.log(stringToDate(myDate));

/////////////////////////////////////////
// 9. Boundaries and look-ahead

// Cf the problem shown in 5. Here's the solution : 

/*         /^    ...    $/
/^ : the regex should match the beginning of the string
$/ : the regex should match the end of the string 
both : the regex should match the whole stirng. 
*/

// Examples : 
/^\d+$/; // The string only consists in one or more digits 
/^!/;    // any string starting with '!'

// Look ahead : 
// /a(?=e)/  : match a, but only if there is an e after it. But the e won't be part of the match!
// /a(?!e)/  : the opposite operator - matches 'a' without an 'e' after them



