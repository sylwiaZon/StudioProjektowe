import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Islands from './Views/IslandsView.jsx';
import Login from './Views/LoginView.jsx';
import Register from './Views/RegisterView.jsx';
import Profile from './Views/ProfileView.jsx';
import Statistics from './Views/StatisticsView.jsx';
import ChangePassword from './Views/ChangePasswordView.jsx';
import DeleteAccount from './Views/DeleteAccountView.jsx';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Islands} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login}  />
      <Route path="/profile" component={Profile}  />
      <Route path="/statistics" component={Statistics}  />     
      <Route path="/changePassword" component={ChangePassword}  />     
      <Route path="/deleteAccount" component={DeleteAccount}  />
      {/* redirect user to SignIn page if route does not exist and user is not authenticated */}
      <Route component={Islands} />
    </Switch>
  );
}