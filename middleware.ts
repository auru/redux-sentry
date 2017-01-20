import Raven from 'raven-js';

interface ravenInterface {
    dsn: string,
    configuration?: any,
    username?: string
}

interface transformationsInterface {
    actionTransform?: Function,
    stateTransform?: Function
}

export default ({ dsn, configuration = {}, username }:ravenInterface, transform: transformationsInterface = {}) => {

    const {
        actionTransform = a => a,
        stateTransform = a => a.toJS()
    } = transform;

    if (dsn) {
        if (Raven.isSetup()) {
            if (username) {
                Raven.setUserContext({ username });
            }
        } else {
            Raven.config(dsn, configuration).install();
        }
    }

    if (!Raven.isSetup()) {
        console.warn('Raven-js isn`t configured. You should configured it before `redux-sentry-middleware` or send dsn to configuration object');
    }

    return ({ getState }) => next => action => {

        try {
            if (Raven.isSetup()) {
                Raven.captureBreadcrumb({ 
                    category: 'redux', 
                    message: action.type 
                });
                Raven.setExtraContext({
                    action: actionTransform(action),
                    state: stateTransform(getState())
                });
            }

            return next(action);
        } catch (err) {
            
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
