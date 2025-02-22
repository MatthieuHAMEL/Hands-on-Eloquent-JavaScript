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

/////////////////////////////////////////
// 10. Choice patterns (the | operator)

let animalCount = /\d+ (pig|cow|chicken)s?/;
animalCount.test("15 pigs"); // t
animalCount.test("15 chickens"); // t
animalCount.test("1 cow"); // t
animalCount.test("0 pig"); // t 
animalCount.test("0 pigs"); // t also :) 

/////////////////////////////////////////
// 11. Backtracking 

// Consider :
/^([01]+b|[\da-f]+h|\d+)$/;

// Either a binary number followed by b, an hexadecimal number followed by h
// or a decimal number.

// If we run a naive - character by character - automaton on this regexp using the 
// input "103", it is clear that we may first, seeing the 1 and the 0, consider it's 
// a binary number, then going back (backtracking) when seeing the 3, choosing the hex 
// branch, then falling back to the last branch because we didn't see that 'h' at the end.
// + and * work with backtracking too : with "abcxe" for the regex /^.*x/, the engine does :
// - What if .* is "abcxe" ? there's no 'x' after, so ... 
// - What if .* is "abcx" ? It's an 'e' after, not a 'x' ... so ... 
// - What if .* is "abc" ? OK

// The match is concluded as ["abcx"], pos 0 to 4.

// We should be aware of backtracking when writing regexps, because some regexps are 
// more CPU-efficient than others!... 

// Also, if several branches lead to a match, the engine will return after seeing the 
// first one - which can be different from what we'd have found in other branches!

/////////////////////////////////////////
// 12. String.replace

let res1 = "papa".replace("p", "m"); // mapa
let res2 = "Borobudur".replace(/[ou]/, "a"); // "Barobudur" : replace the 1st match by "a"
let res3 = "Borobudur".replace(/[ou]/g, "a"); // "Barabadar"
// -> /g is for "global" : replace all matches. 

// We can do even better
let res4 = "Liskov, Barbara\nMcCarthy, John\nMilner, Robin"
  .replace(/(\p{L}+), (\p{L}+)/gu, "$2 $1"); // /u is for unicode.
// We match every group LastName, FirstName and we refer to matched subgroups using $1, $2.
console.log(res4);

// We can also pass a function as the 2nd parameter of replace ; it will take the same 
// input as what's returned by exec() but spread in arguments : the match, then every group. 
// If there's a /g, the function may be called several times. 

/////////////////////////////////////////
// 13. Greed

let code = "1 /*a*/ + /*b*/ 1";
let code2 = code.replace(/\/\/.*|\/\*[^]*\*\//g, "");
// The above regex's intent is to remove comments in a JS (or C) code. 
// The first parts looks for // with anything after, except a newline (.*)
// The second part looks for /* then any character repeated, including newline ([^]*), 
// then */.

// But we see that on the input we gave it, the result is not what we wanted:
console.log(code2);

//                "1 /*a*/ + /*b*/ 1"
// The regex matched [-----------] all this zone between the first /* and the last */. Oops!

// Indeed the * repetition operator that we used in [^]* is greedy, just like +, ?, {a,b}.
// Greedy operators try to match the largest possible strings. 

// Solution : put an ? after a greedy operator to make it non-greedy : *?, ??, +? etc.

let code3 = code.replace(/\/\/.*|\/\*[^]*?\*\//g, "");
console.log(code3); // 1 + 1 : it works! 

/////////////////////////////////////////
// 14. Search :

// Search is a bit clunky in JS. 

// "Sticky /y option" : when using exec, using this option means search is made
// only at the regexp.lastIndex position. 

const str1 = 'table football';
const regex1 = /foo/y;
regex1.lastIndex = 6;
let result = regex1.exec(str1); // result.index == 6 ; lastIndex == 9

// That means we can use it in a loop since the lastIndex is updated, if we do : 
result = regex1.exec(str1); // It won't work anymore ! we started from 9 !
console.log(result); // null

// However if the match is not precisely found at lastIndex it will not work. 
// To enable finding in the whole string we can use /g instead of /y. 

// There is also a search method : it returns the index of the match
console.log("  word".search(/\S/));  // would return -1 if not found. Here, 2

// ... But we can't make it start at a given position ! ... 

/////////////////////////////////////////
// EXERCISES 
///////////////////////////////////////////
// I -  Regexp Golf

// 1. car and cat 
let r1 = /ca[rt]/; 
console.assert("cat".match(r1)); 
console.assert("car".match(r1)); 
console.assert("This is my cat's car".match(r1));
console.assert(!"Babar".match(r1));

// 2. pop and prop
let r2 = /pr?op/;
console.assert("prop".match(r2)); 
console.assert("pop".match(r2)); 
console.assert("poporico".match(r2));
console.assert("proporico".match(r2));
console.assert(!"piop".match(r2));

// 3. ferret, ferry and ferrari 
let r3 = /ferr(et|erry|ari)/;
console.assert("The ferret embarks on the ferry with its ferrari".match(r3)); 
console.assert(!"Babar doesn't know how to spell \"ferari\"".match(r3)); 

// 4. Any word ending in ious
let r4 = /\b\p{L}*ious\b/u; // \b to express word end and start
console.assert("Obvious".match(r4));
console.assert(!"Jealous".match(r4));

// 5. A whitespace character followed by a period, comma, colon, or semicolon
let r5 = /\s[.,:;]/;
console.assert("La noia è il desiderio della felicità ,lasciato, per così dir, puro.".match(r5));
console.assert(!"Babar embarks on the ferry with his ferrari".match(r5));

// 6. A word longer than six letters
let r6 = /\p{L}{6}/u;
console.assert(!"Babar likes to use short words".match(r6));
console.assert("Babar does not like extraordinary long words".match(r6));

// 7. A word without the letter e (or E)
let r7 = /\b[^e]+?\b/i; // \b for word boundaries 
console.assert("Babar".match(r7));
console.assert(!"Bebar".match(r7));
console.assert("Babar and bananas".match(r7));
console.assert("Bebar and bananas".match(r7)); // true because there are words not containing 'e'.

///////////////////////////////////////////
// II - Quoting style 

let myStory =  // the story of my life 
`'I've' always been fascinated in 'Mediterranean' cuisine. 
It shows us that you can do the best 'things' with a few simple ingredients, 
but that 'little details' may be crucial ... aren't they ? 
In fact, all programmers should learn to cook!`;

// Let's replace single quotes by double quotes but without changing <aren't> and <I've>.
// Single quotes that have letters before and after are considered grammar contractions. 
// This is how I'd match those single quotes: /\p{L}'\p{L}/

// 1) General rule : 
// if there's something that's not a letter before or after we consider it's a real double 
// quote. (like before or after a space, a punctuation symbol, ...)
// 2) If the beginning of the string is followed by a single quote it must match too
// 3) If a single quote is right before the end of the string, it must match too.
let mySingleQuoteRegExp = /(?<=(^|\P{L}))'|'(?=(\P{L}|$))/gu;

let myStory2 = myStory.replace(mySingleQuoteRegExp, "\"");
console.log(myStory2);

// Less interesting content but necessary to test 2 and 3 ... :) 
let myComplicatedString = 
`'Hello' everyone. This is a more complicated 'string'.
It's including a 'few' 'corner cases'...! Testing corner 
cases is always 'useful'
... isn't it? 'Goodbye'`;
let myComplicatedResult = myComplicatedString.replace(mySingleQuoteRegExp, "\"");
console.log(myComplicatedResult);

///////////////////////////////////////////
// III - Numbers again

// This was my first try : it didn't take the "alone dot" constraint into account :
let numberRegExp = /^[+\-]?\d*.?\d*(e[+\-]?\d+)?$/i;
console.log(numberRegExp.test("1"));
console.log(numberRegExp.test("1.18"));
console.log(numberRegExp.test("04.123e12"));
console.log(numberRegExp.test("-04.123e-12"));
console.log(numberRegExp.test("+987.E-12"));

// This takes the constraint into account :
let numberRegExp2 = /[+\-]?(\d*.\d+|\d+.?\d*)(e[+\-]?\d+)*/i;
console.log(numberRegExp2.test("+987.E-12"));
console.log(numberRegExp2.test("."));
