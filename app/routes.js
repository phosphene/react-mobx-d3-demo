import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './modules';
import Timer from './modules/Timer';
import Notes from './modules/Notes';
import BubbleWrap from './modules/AnimatedBubble/components/BubbleWrap';
import V4Port from './modules/V4Port';
import ThrashDash from './modules/ThrashDash';
import NOAADash from './modules/NOAADash';
import ReductDash from './modules/ReductDash'

export default (
    <Route path="/" component={App}>
      <IndexRoute component={Timer} />
      <Route path="bubble" component={BubbleWrap} />
      <Route path="v4port" component={V4Port} />
      <Route path="thrashdash" component={ThrashDash} />
      <Route path="noaadash" component={NOAADash} />
      <Route path="reductdash" component={ReductDash} />
  </Route>
);
