import { Route, MemoryRouter as Router, Switch } from 'react-router-dom';

import Home from './pages/Home';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}