import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Tables from './views/TablesView.jsx';

export default function Routes() {
  return (
    <Switch>
      <Route path="/tables" component={Tables} />
      />
    </Switch>
  );
}