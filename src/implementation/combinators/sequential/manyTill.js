"use strict";
const action_1 = require("../../../base/action");
const common_1 = require("../../common");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
class PrsManyTill extends action_1.ParjsAction {
    constructor(many, till, tillOptional) {
        super();
        this.many = many;
        this.till = till;
        this.tillOptional = tillOptional;
        this.displayName = "manyTill";
        this.isLoud = many.isLoud;
        this.expecting = `${many.expecting} or ${till.expecting}`;
    }
    _apply(ps) {
        let { many, till, tillOptional } = this;
        let { position } = ps;
        let arr = [];
        let successes = 0;
        while (true) {
            till.apply(ps);
            if (ps.isOk) {
                break;
            }
            else if (ps.atLeast(result_1.ResultKind.HardFail)) {
                //if till failed hard/fatally, we return the fail result.
                return;
            }
            //backtrack to before till failed.
            ps.position = position;
            many.apply(ps);
            if (ps.isOk) {
                arr.maybePush(ps.value);
            }
            else if (ps.isSoft) {
                //many failed softly before till...
                if (!tillOptional) {
                    //if we parsed at least one element, we fail hard.
                    ps.kind = successes === 0 ? result_1.ResultKind.SoftFail : result_1.ResultKind.HardFail;
                    return;
                }
                else {
                    //till was optional, so many failing softly is OK.
                    break;
                }
            }
            else {
                //many failed hard/fatal
                return;
            }
            if (ps.position === position) {
                common_1.Issues.guardAgainstInfiniteLoop(this);
            }
            position = ps.position;
            successes++;
        }
        ps.value = arr;
        ps.kind = result_1.ResultKind.OK;
    }
}
exports.PrsManyTill = PrsManyTill;
//# sourceMappingURL=manyTill.js.map