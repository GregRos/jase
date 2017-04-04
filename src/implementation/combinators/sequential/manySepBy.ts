import {ParjsAction} from "../../../base/action";
import {QUIET_RESULT, Issues} from "../../common";
import {ResultKind} from "../../../abstract/basics/result";
import {AnyParserAction} from "../../../abstract/basics/action";
import {ParsingState} from "../../../abstract/basics/state";
/**
 * Created by User on 21-Nov-16.
 */
export class PrsManySepBy extends ParjsAction {
    isLoud : boolean;
    displayName="manySepBy";
    expecting : string;
    constructor(private many : AnyParserAction, private sep : AnyParserAction, private maxIterations : number) {
        super();
        this.isLoud = many.isLoud;
        this.expecting = many.expecting;
    }

    _apply(ps : ParsingState) {
        let {many, sep, maxIterations, isLoud} = this;

        let arr = [];
        many.apply(ps);
        if (ps.atLeast(ResultKind.HardFail)) {
            return;
        } else if (ps.isSoft) {
            ps.value = [];
            ps.kind = ResultKind.OK;
            return;
        }
        let {position} = ps;
        arr.maybePush(ps.value);
        let i = 1;
        while (true) {
            if (i >= maxIterations) break;
            sep.apply(ps);
            if (ps.isSoft) {
                break;
            } else if (ps.atLeast(ResultKind.HardFail)) {
                return;
            }

            many.apply(ps);
            if (ps.isSoft) {
                break;
            } else if (ps.atLeast(ResultKind.HardFail)) {
                return;
            }
            if (maxIterations >= Infinity && ps.position === position) {
                Issues.guardAgainstInfiniteLoop(this);
            }
            arr.maybePush(ps.value);
            position = ps.position;
            i++;
        }
        ps.kind = ResultKind.OK;
        ps.position = position;
        ps.value = arr;
        return;
    }
}