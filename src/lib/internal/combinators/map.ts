/**
 * @module parjs/combinators
 */
/** */

import {ParsingState} from "../state";
import {ParjsCombinator} from "../../index";
import {ParjsProjection} from "../parjser";
import {defineCombinator} from "./combinator";
import {ParjserBase} from "../parser";

/**
 * Applies the source parser and projects its result with `projection`.
 * @param projection The projection to apply.
 */
export function map<TIn, TOut>(projection: ParjsProjection<TIn, TOut>)
    : ParjsCombinator<TIn, TOut>;

export function map(projection: any) {
    return defineCombinator(source => {
        return new class Map extends ParjserBase {
            type = "map";
            expecting = source.expecting;

            _apply(ps: ParsingState): void {
                source.apply(ps);
                if (!ps.isOk) {
                    return;
                }
                ps.value = projection(ps.value, ps.userState);
            }

        }();
    });
}

/**
 * Applies the source parser and yields the constant value `result`.
 * @param result The constant value to yield.
 */
export function mapConst<T>(result: T)
    : ParjsCombinator<any, T> {
    return map(() => result);
}
