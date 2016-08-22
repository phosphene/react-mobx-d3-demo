import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './modules';
import Timer from './modules/Timer';
import Notes from './modules/Notes';
import BubbleWrap from './modules/Charts/components/BubbleWrap';
import Dashboards from './modules/Dashboards';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={Timer} />
    <Route path="bubble" component={BubbleWrap} />
    <Route path="dash" component={Dashboards} />
  </Route>
);
