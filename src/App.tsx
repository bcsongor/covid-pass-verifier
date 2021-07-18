import { Route, Switch } from 'react-router-dom';

import '@cpv/app.scss';
import CPVLandingPage from '@cpv/content/CPVLandingPage';

function App(): JSX.Element {
  return (
    <Switch>
      <Route exact={true} path="/" component={CPVLandingPage} />
    </Switch>
  );
}

export default App;
