"use strict";
/**
 * Created by lifeg on 04/04/2017.
 */
require("source-map-support/register");
const parsers_1 = require("../../src/bindings/parsers");
//+ DEFINING THE PARSER
//Parse an identifier, an asciiLetter followed by an asciiLetter or digit, e.g. a12b but not 1ab.
let ident = parsers_1.Parjs.asciiLetter.then(parsers_1.Parjs.asciiLetter.or(parsers_1.Parjs.digit).many()).str;
//Parse a format token, an `ident` between `{` and `}`. Return the result as a Token object.
let formatToken = ident.between(parsers_1.Parjs.string("{"), parsers_1.Parjs.string("}")).map(x => ({ token: x }));
//Parse an escaped character. This parses "`{a}" as the text "{a}" instead of a token.
//Also escapes the escaped char, parsing "``" as "`".
//Works for arbitrary characters like `a being parsed as a.
let escape = parsers_1.Parjs.string("`").then(parsers_1.Parjs.anyChar).str.map(x => ({ text: x.substr(1) }));
//Parse text which is not an escape character or {.
let text = parsers_1.Parjs.noCharOf("`{").many(1).str.map(x => ({ text: x }));
//The parser itself. Parses either a formatToken, e.g. {abc} or an escaped combo `x, or text that doesn't contain `{.
//Parses many times.
let formatParser = formatToken.or(escape, text).many();
function toTemplate(formatString) {
    let stream = formatParser.parse(formatString).resolve;
    return {
        inject(args) {
            let str = "";
            stream.forEach((x) => {
                if (x.text) {
                    str += x.text;
                }
                else if (x.token) {
                    str += args[x.token];
                }
            });
            return str;
        }
    };
}
let template = toTemplate("hello, my name is {name} and I am {age} years old. This is `{escaped}. This is double escaped: ``{name}.");
console.log(template.inject({
    name: "Greg",
    age: 28
}));
//# sourceMappingURL=string.format.js.map