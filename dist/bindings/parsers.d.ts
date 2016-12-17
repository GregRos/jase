import { ParjsParser } from "./instance-combinators";
import { CharParsers } from "../abstract/parsers/char";
import { StringParsers } from "../abstract/parsers/string";
import { PrimitiveParsers } from "../abstract/parsers/primitives";
import { SpecialParsers } from "../abstract/parsers/special";
import { StaticCombinators } from "../abstract/combinators/static";
import { AnyParser } from "../abstract/combinators/any";
import { ResultKind } from "../abstract/basics/result";
import { IntOptions } from "../implementation/parsers/numbers/int";
import { FloatOptions } from "../implementation/parsers/numbers/float";
import { NumericParsers } from "../abstract/parsers/numeric";
export declare class ParjsParsers implements CharParsers, NumericParsers, StringParsers, PrimitiveParsers, SpecialParsers, StaticCombinators {
    any(...parsers: AnyParser[]): ParjsParser;
    seq(...parsers: AnyParser[]): ParjsParser;
    readonly anyChar: ParjsParser;
    charWhere(predicate: (char: string) => boolean): ParjsParser;
    anyCharOf(options: string): ParjsParser;
    noCharOf(options: string): ParjsParser;
    readonly digit: ParjsParser;
    readonly hex: ParjsParser;
    readonly upper: ParjsParser;
    readonly lower: ParjsParser;
    readonly asciiLower: ParjsParser;
    readonly asciiUpper: ParjsParser;
    readonly newline: ParjsParser;
    readonly unicodeNewline: ParjsParser;
    readonly space: ParjsParser;
    readonly unicodeSpace: ParjsParser;
    readonly spaces: ParjsParser;
    readonly unicodeSpaces: any;
    readonly rest: ParjsParser;
    string(str: string): ParjsParser;
    anyStringOf(...strs: string[]): ParjsParser;
    stringLen(length: number): ParjsParser;
    regexp(regex: RegExp): ParjsParser;
    result(x: any): ParjsParser;
    readonly eof: ParjsParser;
    fail(expecting?: string, kind?: ResultKind): ParjsParser;
    readonly position: ParjsParser;
    readonly state: ParjsParser;
    int(options?: IntOptions): ParjsParser;
    float(options?: FloatOptions): ParjsParser;
}
export declare const Parjs: CharParsers & NumericParsers & StringParsers & PrimitiveParsers & SpecialParsers & StaticCombinators;
