import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './modules';
import Timer from './modules/Timer';
import Notes from './modules/Notes';
import Charts from './modules/Charts';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Timer} />
    <Route path="charts" component={Charts} />
  </Route>
);
