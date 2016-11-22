"use strict";
var raven_js_1 = require('raven-js');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (_a, transform) {
    var dsn = _a.dsn, _b = _a.configuration, configuration = _b === void 0 ? {} : _b, username = _a.username;
    if (transform === void 0) { transform = {}; }
    var _c = transform.actionTransform, actionTransform = _c === void 0 ? function (a) { return a; } : _c, _d = transform.stateTransform, stateTransform = _d === void 0 ? function (a) { return a.toJS(); } : _d;
    if (dsn) {
        if (raven_js_1.default.isSetup()) {
            if (username) {
                raven_js_1.default.setUserContext({ username: username });
            }
        }
        else {
            raven_js_1.default.config(dsn, configuration).install();
        }
    }
    if (!raven_js_1.default.isSetup()) {
        console.warn('Raven-js isn`t configured. You should configured it before `redux-sentry-middleware` or send dsn to configuration object');
    }
    return function (_a) {
        var getState = _a.getState;
        return function (next) { return function (action) {
            try {
                raven_js_1.default.isSetup() && raven_js_1.default.captureBreadcrumb({
                    category: 'redux',
                    message: action.type
                });
                return next(action);
            }
            catch (err) {
                console.error(err);
                raven_js_1.default.isSetup() && raven_js_1.default.captureException(err, {
                    extra: {
                        action: actionTransform(action),
                        state: stateTransform(getState())
                    }
                });
            }
        }; };
    };
};
