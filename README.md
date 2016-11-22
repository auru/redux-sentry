# Redux sentry

> Includes middleware that logs all your store and actions on exception to Sentry with raven-js

# Table of Contents

  * [Installation](#installation)
  * [Usage](#usage)
  * [Contributing](#contributing)
  * [License](#license)

# Installation

Install `redux-sentry` package from npm:

```bash
npm i --save redux-sentry
```

# Usage

`redux-sentry` can be used in cases:

* Raven has been initialized before 

```js
/* store.js */

import { SENTRY_SETTINGS, VERSION } from './constants';

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

import createSentryMiddleware from 'redux-sentry';

const sentryMiddleware = createSentryMiddleware();

// Add sentry middleware to your list of middlewares
const middlewares = [ sentryMiddleware ];

// Enhance your store by using sentry's enhancer
const toEnhance = [
    applyMiddleware(...middlewares)
];

// Put it all together
const enhancer = compose(...toEnhance);
const reducers = combineReducers({
    // combined reducers
});

const initialState = {}

const store = createStore(reducers, initialState, enhancer);

export default store;
``` 

* Raven hasn't been initialized. It should be configured by params

```js
/* store.js */

import { SENTRY_SETTINGS, VERSION } from './constants';

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

import createSentryMiddleware from 'redux-sentry';

const sentryMiddleware = createSentryMiddleware({
    dsn: SENTRY_SETTINGS.DSN,
    configuration: {
        release: VERSION,
        collectWindowErrors: true
    },
    username: parse(document.cookie).login
});

// Add sentry middleware to your list of middlewares
const middlewares = [ sentryMiddleware ];

// Enhance your store by using sentry's enhancer
const toEnhance = [
    applyMiddleware(...middlewares)
];

// Put it all together
const enhancer = compose(...toEnhance);
const reducers = combineReducers({
    // combined reducers
});

const initialState = {}

const store = createStore(reducers, initialState, enhancer);

export default store;
```

# API

## `createSentryMiddleware({ dsn, configuration = {}, username }, transform = {})`

```js
import createSentryMiddleware from 'redux-sentry';
```

Middleware that logs all your store and actions on exception to Sentry with raven-js

### `dsn` {String}
`DSN` – [Data Source Name](https://docs.sentry.io/quickstart/#about-the-dsn). Unique name generated for the project by you Sentry.

### `configuration` {Object} *optional*
Raven configuration object. Full list of keys can be found [here](https://docs.sentry.io/clients/javascript/config/).

### `username` {String} *optional* 
**Default:** `Guest`
`username` used for [setting user context](https://docs.sentry.io/clients/javascript/usage/#tracking-users).

```js
Raven.setUserContext({ username });
``` 

### `transform` {Object} *optional*
**Default:**
```js
{
    actionTransform: a => a,
    stateTransform: a => a.toJS()
}
```
Functions used for cooking action object, store for Raven's `extra` field.
`stateTransform` uses toJS from immutable.js to convert state back to raw JavaScript object.

# Contributing

* Provide [conventional commit messages](https://github.com/conventional-changelog/conventional-changelog-angular/blob/master/convention.md) by using `npm run commit` instead of `git commit`.
* **Core contributors:** use GitHub's *Rebase and merge* as a default way of merging PRs.

# License
MIT © AuRu