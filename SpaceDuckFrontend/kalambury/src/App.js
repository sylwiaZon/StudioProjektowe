import React from 'react';
import { Router } from 'react-router-dom';
import Routes from './RouterApp.jsx';
import history from './history.jsx';
import './App.css';

function App() {
  return (
    <Router history={history}>
      <Routes />
    </Router>
  );
}

export default App;
