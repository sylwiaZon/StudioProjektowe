import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Tables from './views/TablesView.jsx';
import Chinczyk from './views/Chinczyk.jsx';
import Game from './views/GameView.jsx' 
export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Chinczyk} />
      <Route path="/tables" component={Tables} />
      <Route path="/game" component={Game} />

       <Route component={Chinczyk} />
      />
    </Switch>
  );
}