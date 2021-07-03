import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Content } from 'carbon-components-react';

import '@cpv/app.scss';
import CPVHeader from '@cpv/components/CPVHeader';
import CPVLandingPage from '@cpv/content/CPVLandingPage';

function App() {
  return (
    <>
      <CPVHeader/>
      <Content className="app__content">
        <Switch>
          <Route exact path="/" component={CPVLandingPage} />
        </Switch>
      </Content>
    </>
  );
}

export default App;
