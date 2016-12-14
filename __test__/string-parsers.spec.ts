/**
 * Created by lifeg on 09/12/2016.
 */
import {verifyFailure, verifySuccess} from './custom-matchers';
import {LoudParser} from "../src/abstract/combinators/loud";
import {Parjs} from "../src/bindings/parsers";
import {ResultKind} from "../src/abstract/basics/result";
import {AnyParser} from "../src/abstract/combinators/any";



let uState = {};

function forParser<TParser extends AnyParser>(parser : TParser, f : (action : TParser) => void) {
    describe(`Parjs.${parser.displayName}`, () => {
        f(parser);
    });
}

describe("basic string parsers", () => {
    forParser(Parjs.anyChar, parser => {
        let successInput = "a";
        let failInput = "";
        let tooLongInput = "ab";
        it("succeeds on single char", () => {
            verifySuccess(parser.parse(successInput, uState), successInput, uState);
        });
        it("fails on empty input", () => {
            verifyFailure(parser.parse(failInput, uState), ResultKind.SoftFail, uState);
        });
        it("fails on too long input", () => {
            verifyFailure(parser.parse(tooLongInput, uState), ResultKind.SoftFail, uState);
        });
    });

    forParser(Parjs.anyCharOf("abcd"), parser => {
        let success = "c";
        let fail = "1";
        it("succeeds on single char from success", () => {
            verifySuccess(parser.parse(success), success);
        });
        it("fails on invalid single char", () => {
            verifyFailure(parser.parse(fail), ResultKind.SoftFail);
        });
        it("fails on too long input", () => {
            verifyFailure(parser.parse("ab"), ResultKind.SoftFail);
        });
    });

    forParser(Parjs.noCharOf("abcd"), parser => {
        let success = "1";
        let fail = "a";
        it("success on single char not from list", () => {
            verifySuccess(parser.parse(success), success);
        });
        it("fails on single char from list", () => {
            verifyFailure(parser.parse(fail), ResultKind.SoftFail);
        });
        it("fails on too long input", () => {
            verifyFailure(parser.parse("12"), ResultKind.SoftFail);
        });
    });

    forParser(Parjs.eof, parser => {
        let fail = "a";
        let success = "";
        it("success on empty input", () => {
            verifySuccess(parser.parse(success), undefined);
        });
        it("fail on non-empty input", () => {
            verifyFailure(parser.parse(fail), ResultKind.SoftFail);
        });
    });

    forParser(Parjs.string("hi"), parser => {
        let success = "hi";
        let fail = "bo";
        it("success", () => {
            verifySuccess(parser.parse(success), success);
        });
        it("fail", () => {
            verifyFailure(parser.parse(fail), ResultKind.SoftFail)
        });
        it("fail too long", () => {
            verifyFailure(parser.parse(success + "1"), ResultKind.SoftFail);
        });
    });

    forParser(Parjs.anyStringOf("hi", "hello"), parser => {
        let success1 = "hello";
        let success2 = "hi";
        let fail = "bo";
        it("success1", () => {
            verifySuccess(parser.parse(success1), success1);
        });
        it("success2", () => {
            verifySuccess(parser.parse(success2), success2);
        });
        it("fail", () => {
            verifyFailure(parser.parse(fail), ResultKind.SoftFail)
        });
        it("fail too long", () => {
            verifyFailure(parser.parse(success2 + "1"), ResultKind.SoftFail);
        });
    });

    forParser(Parjs.newline, parser => {
        let unix = "\n";
        let winNewline = "\r\n";
        let badInput = "a";
        let empty = "";
        let tooLong1 = "\r\n1";
        let tooLong2 = "\n\r";
        it("success unix newline", () => {
            verifySuccess(parser.parse(unix), unix)
        });
        it("success windows newline", () => {
            verifySuccess(parser.parse(winNewline), winNewline);
        });
        it("fails on empty", () => {
            verifyFailure(parser.parse(empty));
        });
        it("fails on bad", () => {
            verifyFailure(parser.parse(badInput));
        });
        it("fails on too long 1", () => {
            verifyFailure(parser.parse(tooLong1));
        });
        it("fails on too long 2", () => {
            verifyFailure(parser.parse(tooLong2));
        });
    });

    forParser(Parjs.rest, parser => {
        let nonEmpty = "abcd";
        let empty = "";
        it("success on non-empty let input", () => {
            verifySuccess(parser.parse(nonEmpty));
        });
        it("success on empty input", () => {
            verifySuccess(parser.parse(empty));
        })
    });

    forParser(Parjs.state, parser => {
        let uState = {};
        let someInput = "abcd";
        let noInput = "";
        it("succeeds on empty input", () => {
            let result = parser.parse(noInput, uState);
            verifySuccess(result, uState);
        });
        it("fails on non-empty input", () => {
            let result = parser.parse(someInput, uState);
            verifyFailure(result);
        });
    });

    forParser(Parjs.position, parser => {
        let noInput = "";
        it("succeeds on empty input", () => {
            let result = parser.parse(noInput);
            verifySuccess(result, 0);
        });
        it("fails on non-empty input", () => {
            let result = parser.parse("abc");
            verifyFailure(result);
        })
    });

    forParser(Parjs.result("x"), parser => {
        let noInput = "";
        it("succeeds on empty input", () => {
            verifySuccess(parser.parse(noInput), "x");
        });
        it("fails on non-empty input", () => {
            verifyFailure(parser.parse("a"));
        })
    });

    forParser(Parjs.fail("error", ResultKind.FatalFail), parser => {
        let noInput = "";
        let input = "abc";
        it("fails on no input", () => {
            verifyFailure(parser.parse(noInput), ResultKind.FatalFail);
        });
        it("fails on non-empty input", () => {
            verifyFailure(parser.parse(input), ResultKind.FatalFail);
        });
    });

    forParser(Parjs.stringLen(3), parser => {
        let shortInput = "a";
        let goodInput = "abc";
        let longInput = "abcd";
        it("fails on too short input", () => {
            verifyFailure(parser.parse(shortInput));
        });
        it("succeeds on good input", () => {
            verifySuccess(parser.parse(goodInput), goodInput);
        });
        it("fails on long input", () => {
            verifyFailure(parser.parse(longInput));
        })
    });
});