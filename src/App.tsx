import React from 'react';
import { Route, Switch } from 'react-router-dom';

import '@cpv/app.scss';
import CPVLandingPage from '@cpv/content/CPVLandingPage';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={CPVLandingPage} />
    </Switch>
  );
}

export default App;
