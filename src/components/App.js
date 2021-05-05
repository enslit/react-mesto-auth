import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import CurrentUserContext from '../contexts/CurrentUserContext';
import Header from './Header';
import Login from './Login';
import MainContainer from './MainContainer';
import Register from './Register';
import ProtectedRoute from '../hoc/ProtectedRoute';
import Loader from './Loader';

function App() {
  const [currentUser, setCurrentUser] = useState(
    useContext(CurrentUserContext)
  );
  const [isLoggedIn, setIsloggedIn] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      setIsloggedIn(true);
    }

    setAppReady(true);
  }, []);

  if (!appReady) {
    return (
      <div className="page page_loading">
        <Loader size={150} count={20} />
      </div>
    );
  }

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setCurrentUser, isLoggedIn }}
    >
      <div className="page">
        <Header />
        <Switch>
          <Route path="/sign-in">
            <Login />
          </Route>
          <Route path="/sign-up">
            <Register />
          </Route>
          <ProtectedRoute
            path="/"
            component={MainContainer}
            isloggedIn={isLoggedIn}
          />
        </Switch>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
