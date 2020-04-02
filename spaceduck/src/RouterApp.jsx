import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Islands from './Views/IslandsView.jsx';
import Login from './Views/LoginView.jsx';
import Register from './Views/RegisterView.jsx';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Islands} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login}  />
      
      {/* redirect user to SignIn page if route does not exist and user is not authenticated */}
      <Route component={Islands} />
    </Switch>
  );
}