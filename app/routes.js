import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './modules';
import Timer from './modules/Timer';
import Notes from './modules/Notes';
import ParaCoD3 from './modules/ParaCoD3';
import StreamGraph from './modules/StreamGraph';
import ThrashDash from './modules/ThrashDash';
import NOAADash from './modules/NOAADash';
import ReductDash from './modules/ReductDash';
import NasDash from './modules/NasDash';


export default (
    <Route path="/" component={App}>
      <IndexRoute component={Timer} />
      <Route path="parallel" component={ParaCoD3} />
      <Route path="streamgraph" component={StreamGraph} />
      <Route path="nasdash" component={NasDash} />
      <Route path="thrashdash" component={ThrashDash} />
      <Route path="noaadash" component={NOAADash} />
  </Route>
);
