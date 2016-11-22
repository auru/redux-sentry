import Raven from 'raven-js';
export default ({ dsn, configuration = {}, username }, transform = {}) => {
    const { actionTransform = a => a, stateTransform = a => a.toJS() } = transform;
    if (dsn) {
        if (Raven.isSetup()) {
            if (username) {
                Raven.setUserContext({ username });
            }
        }
        else {
            Raven.config(dsn, configuration).install();
        }
    }
    if (!Raven.isSetup()) {
        console.warn('Raven-js isn`t configured. You should configured it before `redux-sentry-middleware` or send dsn to configuration object');
    }
    return ({ getState }) => next => action => {
        try {
            Raven.isSetup() && Raven.captureBreadcrumb({
                category: 'redux',
                message: action.type
            });
            return next(action);
        }
        catch (err) {
            console.error(err);
            Raven.isSetup() && Raven.captureException(err, {
                extra: {
                    action: actionTransform(action),
                    state: stateTransform(getState())
                }
            });
        }
    };
};
