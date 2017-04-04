"use strict";
const action_1 = require("../../../base/action");
const char_indicators_1 = require("../../../functions/char-indicators");
const result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 24-Nov-16.
 */
class PrsNewline extends action_1.ParjsAction {
    constructor(matchUnicode) {
        super();
        this.matchUnicode = matchUnicode;
        this.displayName = "newline";
        this.isLoud = true;
        this.expecting = matchUnicode ? "a unicode newline string" : "a newline string";
    }
    _apply(ps) {
        let { position, input } = ps;
        let { matchUnicode } = this;
        if (position >= input.length) {
            ps.kind = result_1.ResultKind.SoftFail;
            return;
        }
        let charAt = input.charCodeAt(position);
        if (matchUnicode && char_indicators_1.Codes.isUnicodeNewline(charAt)) {
            ps.position++;
            ps.value = input.charAt(position);
            ps.kind = result_1.ResultKind.OK;
            return;
        }
        if (charAt === char_indicators_1.Codes.newline) {
            ps.position++;
            ps.value = '\n';
            ps.kind = result_1.ResultKind.OK;
            return;
        }
        else if (charAt === char_indicators_1.Codes.carriageReturn) {
            position++;
            if (position < input.length && input.charCodeAt(position) === char_indicators_1.Codes.newline) {
                ps.position = position + 1;
                ps.value = '\r\n';
                ps.kind = result_1.ResultKind.OK;
                return;
            }
            ps.position = position;
            ps.value = '\r';
            ps.kind = result_1.ResultKind.OK;
            return;
        }
        ps.kind = result_1.ResultKind.SoftFail;
    }
}
exports.PrsNewline = PrsNewline;

//# sourceMappingURL=newline.js.map
