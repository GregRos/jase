import {Parjs} from "../../../src/bindings/parsers";
import {expectFailure, expectSuccess} from "../../custom-matchers";
import {ResultKind} from "../../../src/abstract/basics/result";
/**
 * Created by User on 14-Dec-16.
 */

describe("numeric parsers", () => {
    describe("int parser", () => {
        describe("default settings", () => {
            let parser = Parjs.int({
                base : 10,
                allowSign : true
            });
            it("fails for empty input", () => {
                expectFailure(parser.parse(""), ResultKind.SoftFail);
            });
            it("fails for bad digits", () => {
                expectFailure(parser.parse("a"), ResultKind.SoftFail);
            });
            it("succeeds for sequence of with sign digits", () => {
                expectSuccess(parser.parse("-24"), -24);
            });
            it("succeeds for sequence of digits without sign", () => {
                expectSuccess(parser.parse("24"), 24);
            });
            it("fails for extra letters", () => {
                expectFailure(parser.parse("22a"), ResultKind.SoftFail);
            });
            it("chains into rest", () => {
                expectSuccess(parser.then(Parjs.rest.quiet).parse("22a"), 22);
            });
            it("fails hard if there are no digits after sign", () => {
                expectFailure(parser.parse("+a"), ResultKind.HardFail);
            });
        });
        describe("no sign", () => {
            let parser = Parjs.int({
                base : 16,
                allowSign : false
            });
            it("fails for sign start", () => {
                expectFailure(parser.parse("-f"), ResultKind.SoftFail);
            });
            it("succeeds without sign, higher base", () => {
                expectSuccess(parser.parse("f"), 15);
            });
        });
    });

    describe("float parser", () => {
        describe("default settings", () => {
            let parser = Parjs.float();
            it("regular float", () => {
                expectSuccess(parser.parse("0.11"), 0.11);
            });
            it("integer", () => {
                expectSuccess(parser.parse("15"), 15);
            });
            it("float without whole part", () => {
                expectSuccess(parser.parse(".1"), .1);
            });
            it("float without fractional part", () => {
                expectSuccess(parser.parse("1."), 1.);
            });
            it("integer with positive exponent", () => {
                expectSuccess(parser.parse("52e+12"), 52e+12);
            });
            it("float with negative exponent", () => {
                expectSuccess(parser.parse("5.1e-2"), 5.1e-2);
            });
            it("float without whole part and exponent", () => {
                expectSuccess(parser.parse(".5e+5"), .5e+5);
            });
            it("float without fractional and exponent", () => {
                expectSuccess(parser.parse("5.e+2"), 5.e+2);
            });
            it("integer with negative exponent", () => {
                expectSuccess(parser.parse("52e-12"), 52e-12)
            });
            it("fails soft on dot", () => {
                expectFailure(parser.parse("."), ResultKind.SoftFail);
            });
            it("fails hard on dot after sign", () => {
                expectFailure(parser.parse("+."), ResultKind.HardFail);
            });
            it("fails hard on sign and invalid char", () => {
                expectFailure(parser.parse("+a"), ResultKind.HardFail);
            });
            it("fails soft on invalid char", () => {
                expectFailure(parser.parse("a"), ResultKind.SoftFail);
            });
            it("fails hard on invalid exponent after sign", () => {
                expectFailure(parser.parse("1.0e+a"), ResultKind.HardFail);
            });
            it("fails hard on exponent without sign", () => {
                expectFailure(parser.parse("1.0e+"), ResultKind.HardFail);
            });
            it("fails softly for just exponent", () =>{
                expectFailure(parser.parse("e+12"), ResultKind.SoftFail);
            });
        });
        describe("no sign", () => {
            let parser = Parjs.float({
               allowSign : false
            } as any);
            it("fails on sign", () => {
                expectFailure(parser.parse("+1"), ResultKind.SoftFail);
            });
            it("succeeds on exp without sign", () => {
                expectSuccess(parser.parse("1.0e-12"), 1.0e-12);
            });
        });
        describe("no implicit zero", () => {
            let parser = Parjs.float({
                allowImplicitZero : false
            } as any);
            it("fails on implicit zero whole", () => {
                expectFailure(parser.parse(".1"), ResultKind.SoftFail);
            });
            it("succeeds on implicit zero fraction when chained into rest", () => {
                expectSuccess(parser.then(Parjs.rest.quiet).parse("1."), 1);
            });
            it("succeeds on regular", () => {
                expectSuccess(parser.parse("1.0"), 1.0);
            });
            it("succeeds on exponent", () => {
                expectSuccess(parser.parse("1.0e+2"), 1.0e+2);
            });
        });
        describe("no decimal point", () => {
            let parser = Parjs.float({
                allowFloatingPoint : false
            });
            it("succeeds on integer", () => {
                expectSuccess(parser.parse("123"), 123);
            });
            it("fails on floating point due to excess input", () => {
                expectFailure(parser.parse("1.0"), ResultKind.SoftFail);
            });
            it("succeeds on floating point with chained rest", () => {
                expectSuccess(parser.then(Parjs.rest.quiet).parse("1.5"), 1);
            });
            it("succeeds on exponent integer", () => {
                expectSuccess(parser.parse("23e+2"), 23e+2);
            });
        });
        describe("no exponent", () => {
            let parser = Parjs.float({
                allowExponent : false
            });
            it("succeeds on floating point", () => {
                expectSuccess(parser.parse("23.12"), 23.12);
            });
            it("succeeds on exponent with trailing rest", () => {
                expectSuccess(parser.then(Parjs.rest.quiet).parse("12e+2", 12));
            });
        });
    })
});