"use strict";
/**
 * Created by lifeg on 10/12/2016.
 */
const custom_matchers_1 = require("../../custom-matchers");
const parsers_1 = require("../../../dist/bindings/parsers");
const result_1 = require("../../../dist/abstract/basics/result");
let goodInput = "abcd";
let badInput = "";
let uState = {};
let loudParser = parsers_1.Parjs.stringLen(4);
describe("map combinators", () => {
    describe("map", () => {
        let parser = loudParser.map(x => 1);
        it("maps on success", () => {
            custom_matchers_1.expectSuccess(parser.parse(goodInput, uState), 1);
        });
        it("fails on failure", () => {
            custom_matchers_1.expectFailure(parser.parse(badInput, uState), result_1.ResultKind.SoftFail, uState);
        });
    });
    describe("Parjs.result(1)", () => {
        let parser = loudParser.result(1);
        it("maps on success", () => {
            custom_matchers_1.expectSuccess(parser.parse(goodInput, uState), 1);
        });
        it("fails on failure", () => {
            custom_matchers_1.expectFailure(parser.parse(badInput, uState));
        });
    });
    describe("cast", () => {
        let parser = loudParser.cast();
        it("maps on success", () => {
            custom_matchers_1.expectSuccess(parser.parse(goodInput), "abcd");
        });
        it("fails on failure", () => {
            custom_matchers_1.expectFailure(parser.parse(badInput));
        });
    });
    describe("quiet", () => {
        let parser = loudParser.q;
        it("is quiet", () => {
            expect(parser.isLoud).toBe(false);
        });
        it("maps to undefined on success", () => {
            custom_matchers_1.expectSuccess(parser.parse(goodInput), undefined);
        });
        it("fails on failure", () => {
            custom_matchers_1.expectFailure(parser.parse(badInput));
        });
        it("does not support loud combinators, like .map", () => {
            expect(() => parser.map(x => 1)).toThrow();
        });
    });
    describe("str", () => {
        it("quiet", () => {
            let p = parsers_1.Parjs.eof.str;
            custom_matchers_1.expectSuccess(p.parse(""), "");
        });
        it("array", () => {
            let p = parsers_1.Parjs.result(["a", "b", "c"]).str;
            custom_matchers_1.expectSuccess(p.parse(""), "abc");
        });
        it("nested array", () => {
            let p = parsers_1.Parjs.result(["a", ["b", ["c"], "d"], "e"]).str;
            custom_matchers_1.expectSuccess(p.parse(""), "abcde");
        });
        it("null", () => {
            let p = parsers_1.Parjs.result(null).str;
            custom_matchers_1.expectSuccess(p.parse(""), "null");
        });
        it("undefined", () => {
            let p = parsers_1.Parjs.result(undefined).str;
            custom_matchers_1.expectSuccess(p.parse(""), "undefined");
        });
        it("string", () => {
            let p = parsers_1.Parjs.string("a").str;
            custom_matchers_1.expectSuccess(p.parse("a"), "a");
        });
        it("symbol", () => {
            let p = parsers_1.Parjs.result(Symbol("hi")).str;
            custom_matchers_1.expectSuccess(p.parse(""), "hi");
        });
        it("object", () => {
            let p = parsers_1.Parjs.result({}).str;
            custom_matchers_1.expectSuccess(p.parse(""), {}.toString());
        });
    });
});
//# sourceMappingURL=mappers.spec.js.map