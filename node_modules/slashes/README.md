# slashes

Add or strip backslashes.

Provides two methods, `add` and `strip` which are almost the same as PHP's `addslashes` and `stripslashes` functions
respectively.

The `add` method will prefix backslash (`\`), double quote (`"`), and single quote (`'`) characters with backslashes.
Null (`\0`) characters will be replaced with backslash zero `"\\0"`, and newline (`\n`) characters will be replaced with
`"\\n"`. The newline replacement differs from PHP because JavaScript has ASI (auto semicolon insertion) at the end of
each line, so a newline in a JavaScript string literal does not preserve the newline character correctly.

The `strip` method replaces all sequences of two characters that start with a backslash, with the second character in
the sequence. There are three caveats. A single non-escaped slash at the end of the string will be removed. Backslash
zero `"\\0"` will become a null (`\0`) character. Backslash 'n' `"\\n"` will become a newline (`\n`) character.

The goal of this utility is to make a string safe for concatenation or injection into JavaScript source.

```js
var foo = "\\bar";
var source = "console.log('" + bar + "');";
eval(source);
```

You might expect the above snippet to output `\bar` but instead you will see `ar`, because the source string ends up
being `console.log('\bar');` which is interpreted as starting with an escaped "b" rather than a backslash and then a
"b". It can be fixed using the `add` method.

```js
var foo = "\\bar";
var source = "console.log('" + slashes.add(bar) + "');";
eval(source);
```

Now the source comes out as `console.log('\\bar');` and the output will be `\bar`.

## Install

```sh
npm install slashes --save
```

## Usage

```
slashes.add(string, [number])
slashes.strip(string, [number])
```

If a non-string value is passed as the first parameter, it will be coerced to a string.

If a non-number is passed as the second parameter, it will be coerced to a number. Negative numbers are equivalent to
their positive counter parts. Zero is the same as one.

### Examples
```js
var slashes = require('slashes');

var test = "'test'\n\"ing\"\0";
var added = slashes.add(test);
var stripped = slashes.strip(added);

console.log("test:\n%s\n", test);
console.log("added:\n%s\n", added);
console.log("stripped:\n%s\n", stripped);
```

Output should be...
```
test:
'test'
"ing"

added:
\'test\'
\"ing\"\0

stripped:
'test'
"ing"

```

Both methods also take an optional second number parameter, 1 or greater. This is equivalent to calling the method
that many times.
```js
slashes.add(string, 2);
// ...is the same as...
slashes.add(slashes.add(string));

slashes.strip(string, 2);
// ...is the same as...
slashes.strip(slashes.strip(string));
```

Note that in JavaScript, `"\0"` and `"\u0000"` are identical. The `add` method will convert both to `"\\0"`.