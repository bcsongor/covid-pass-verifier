import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Content } from 'carbon-components-react';

import './app.scss';
import CPVHeader from './components/CPVHeader';
import CPVLandingPage from './content/CPVLandingPage';

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
