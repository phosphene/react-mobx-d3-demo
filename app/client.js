import { AppContainer } from 'react-hot-loader';
import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import 'bootstrap/dist/css/bootstrap.css';
import 'dc/dc.css';

import { ThemeSwitcher } from 'react-bootstrap-theme-switcher';


const rootEl = document.getElementById('root');

render(
  <AppContainer>
    <ThemeSwitcher themePath="themes" defaultTheme="cerulean" storeThemeKey="theme">
      <Router
          routes={routes}
          history={browserHistory}
          key={process.env.NODE_ENV !== "production" ? Math.random() : false}
      />
    </ThemeSwitcher>
  </AppContainer>,
  rootEl
);

if (module.hot) {
  module.hot.accept('./routes', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    const routes = require('./routes').default;
    render(
      <AppContainer>
        <ThemeSwitcher themePath="themes" defaultTheme="yeti">
        <Router
          routes={routes}
          history={browserHistory}
          key={process.env.NODE_ENV !== "production" ? Math.random() : false}
        />
        </ThemeSwitcher>
      </AppContainer>,
      rootEl
    );
  });
}
