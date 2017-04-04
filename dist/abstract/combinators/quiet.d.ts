import { AnyParser } from "./any";
import { QuietParserResult, FailResultKind } from "../basics/result";
import { LoudParser } from "./loud";
export interface QuietParser extends AnyParser {
    parse(input: string, initialState?: any): QuietParserResult;
    /**
     * P tries to apply this parser. If it fails, then it tries to apply `alt` instead.
     * The return depends on which parser succeeded.
     * @param alt The loud parser alternatie.
     */
    or(...alt: QuietParser[]): QuietParser;
    soft: QuietParser;
    map<T>(selector: (state: any) => T): LoudParser<T>;
    /**
     * P applies this parser, and then calls the specified function on the state.
     * @param action The action to call.
     */
    act(action: (state: any) => void): QuietParser;
    /**
     * P applies this parser. If it succeeds, it backtracks to the original position in the input, effectively succeeding without consuming input.
     */
    readonly backtrack: QuietParser;
    /**
     * P applies this parser, and requires that it consume at least one character of the input.
     */
    mustCapture(kind?: FailResultKind): QuietParser;
    /**
     * P applies this parser and then the given parser. P returns the value of the given parser (if any).
     * @param parser The parser to apply next.
     */
    then<TParser extends AnyParser>(parser: TParser): TParser;
    then<S>(...loud: (LoudParser<S> | QuietParser)[]): LoudParser<S[]>;
    then(...quiet: QuietParser[]): QuietParser;
    /**
     * P applies this parser, and then calls a function to determine which parser to apply next. The function takes no parameters.
     * P returns the value of the following parser.
     * @param selector The function that returns the proceeding parser.
     */
    then<TParser extends AnyParser>(selector: () => TParser): TParser;
    /**
     * P applies this parser repeatedly until it fails.
     * @param minSuccess The minimum number of times this parser must succeed.
     * @param maxIterations The maximum number of times this parser is applied.
     */
    many(minSuccess?: number, maxIterations?: number): QuietParser;
    /**
     * P applies this parser repeatedly until the `till` parser succeeds.
     * P fails if this parser fails before the `till` parser does.
     * @param till The parser
     * @param tillOptional Whether or not the `till` parser is optional. I.e. without this, P will behave similarly to a many
     * parser too, terminating once this parser fails.
     */
    manyTill(till: AnyParser, tillOptional?: boolean): QuietParser;
    /**
     * P applies this parser repeatedly, every two occurrences separated by the delimeter parser.
     * If `allowTrailing` is true, the delimeter parser follows every occurrence of this parser.
     * @param delimeter The delimeter parser.
     * @param max The maximum number of times this parser is applied.
     */
    manySepBy(delimeter: AnyParser, max?: number): QuietParser;
    /**
     * P applies this parser exactly {count} times.
     * @param count The number of times to apply this parser.
     */
    exactly(count: number): QuietParser;
    /**
     * P applies this parser and applies {reducer} to the current state state.
     * The initial internal state is normally undefined.
     * @param reducer Transformation to apply to the state state.
     */
    withState(reducer: (state: any) => any): QuietParser;
}
