'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ravenJs = require('raven-js');

var _ravenJs2 = _interopRequireDefault(_ravenJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var dsn = _ref.dsn,
        _ref$configuration = _ref.configuration,
        configuration = _ref$configuration === undefined ? {} : _ref$configuration,
        username = _ref.username;
    var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _transform$actionTran = transform.actionTransform,
        actionTransform = _transform$actionTran === undefined ? function (a) {
        return a;
    } : _transform$actionTran,
        _transform$stateTrans = transform.stateTransform,
        stateTransform = _transform$stateTrans === undefined ? function (a) {
        return a.toJS();
    } : _transform$stateTrans;

    if (dsn) {
        if (_ravenJs2.default.isSetup()) {
            if (username) {
                _ravenJs2.default.setUserContext({ username: username });
            }
        } else {
            _ravenJs2.default.config(dsn, configuration).install();
        }
    }
    if (!_ravenJs2.default.isSetup()) {
        console.warn('Raven-js isn`t configured. You should configured it before `redux-sentry-middleware` or send dsn to configuration object');
    }
    return function (_ref2) {
        var getState = _ref2.getState;
        return function (next) {
            return function (action) {
                try {
                    if (_ravenJs2.default.isSetup()) {
                        _ravenJs2.default.captureBreadcrumb({
                            category: 'redux',
                            message: action.type
                        });
                        _ravenJs2.default.setExtraContext({
                            action: actionTransform(action),
                            state: stateTransform(getState())
                        });
                    }
                    return next(action);
                } catch (err) {
                    console.error(err);
                    _ravenJs2.default.isSetup() && _ravenJs2.default.captureException(err, {
                        extra: {
                            action: actionTransform(action),
                            state: stateTransform(getState())
                        }
                    });
                }
            };
        };
    };
};