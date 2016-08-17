### Features
- ES6 on client and server;
- CSSNext and modules;
- Hot module reloading;
- Build server bundle for production;
- Karma webpack jasmine testing with enzyme
- Mobx for state management
- React
- D3

### To start

- `npm i`
- `npm start` — development server on port 8080;


### test

- `npm test` - PhantomJS jasmine acceptance testing


### Preparing for production
- `npm run prod` — build all bundles and start in production mode;

### Command list
- `npm start` — start in development mode;
- `npm start:prod` — start in production mode (only after build process);
- `npm run build:all` — build server and client bundles for production;
- `npm run build:client` — build client bundles;
- `npm run build:server` — build server bundle;
- `npm run prod` — alias for build:all and start:prod
- `npm run clear:builds` — delete all generated bundles;
- `npm test` — single test run
- `npm test:watch` — watch for changes an rerun tests on file change


### Structure
```
app
├── client.js # client entry point
├── modules # parts of an app
│   ├── Blah
│   │   ├── components
│   │   │   ├── AddBlash.js
│   │   │   ├── Blah.js
│   │   │   └── BlahList.js
│   │   ├── index.js # must export store
│   │   ├── store.js # mobx store for state and actions
│   │   └── styles.css
│   ├── index.js # gathering stores and passing to component tree
│   └── sharedStyles.css
├── routes.js
└── shared # shared folder available anywhere in the app
    ├── components
    │   └── Header
    └── services
```
