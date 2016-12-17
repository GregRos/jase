"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_1 = require("../../../base/action");
var result_1 = require("../../../abstract/basics/result");
/**
 * Created by User on 27-Nov-16.
 */
var PrsPosition = (function (_super) {
    __extends(PrsPosition, _super);
    function PrsPosition() {
        var _this = _super.apply(this, arguments) || this;
        _this.displayName = "position";
        _this.isLoud = true;
        _this.expecting = "anything";
        return _this;
    }
    PrsPosition.prototype._apply = function (ps) {
        ps.value = ps.position;
        ps.kind = result_1.ResultKind.OK;
    };
    return PrsPosition;
}(action_1.ParjsAction));
exports.PrsPosition = PrsPosition;

//# sourceMappingURL=position.js.map
