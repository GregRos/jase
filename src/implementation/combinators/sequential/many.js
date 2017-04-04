"use strict";
const action_1 = require("../../../base/action");
const common_1 = require("../../common");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 21-Nov-16.
 */
class PrsMany extends action_1.ParjsAction {
    constructor(inner, maxIterations, minSuccesses) {
        super();
        this.inner = inner;
        this.maxIterations = maxIterations;
        this.minSuccesses = minSuccesses;
        this.displayName = "many";
        this.isLoud = inner.isLoud;
        this.expecting = inner.expecting;
        maxIterations >= minSuccesses || common_1.Issues.willAlwaysFail(this);
    }
    _apply(ps) {
        let { inner, maxIterations, minSuccesses } = this;
        let { position } = ps;
        let arr = [];
        let i = 0;
        while (true) {
            inner.apply(ps);
            if (!ps.isOk)
                break;
            if (i >= maxIterations)
                break;
            if (maxIterations === Infinity && ps.position === position) {
                common_1.Issues.guardAgainstInfiniteLoop(this);
            }
            position = ps.position;
            arr.maybePush(ps.value);
            i++;
        }
        if (ps.atLeast(result_1.ResultKind.HardFail)) {
            return;
        }
        if (i < minSuccesses) {
            ps.kind = i === 0 ? result_1.ResultKind.SoftFail : result_1.ResultKind.HardFail;
            return;
        }
        ps.value = arr;
        //recover from the last failure.
        ps.position = position;
        ps.kind = result_1.ResultKind.OK;
    }
}
exports.PrsMany = PrsMany;
//# sourceMappingURL=many.js.map