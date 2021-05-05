import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import CurrentUserContext from '../contexts/CurrentUserContext';
import Header from './Header';
import Login from './Login';
import MainContainer from './MainContainer';
import Register from './Register';
import ProtectedRoute from '../hoc/ProtectedRoute';
import Loader from './Loader';

function App() {
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState(
    useContext(CurrentUserContext)
  );
  const [isLoggedIn, setIsloggedIn] = useState(false);
  const [appReady, setAppReady] = useState(false);

  const handleLoginSubmit = (form) => {
    localStorage.setItem('jwt', JSON.stringify(form));
    setIsloggedIn(true);
    history.push('/');
  };

  const handleRegisterSubmit = (form) => {
    localStorage.setItem('jwt', JSON.stringify(form));
    setIsloggedIn(true);
    history.push('/');
  };

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
      value={{ currentUser, setCurrentUser, isLoggedIn, setIsloggedIn }}
    >
      <div className="page">
        <Header />
        <Switch>
          <Route path="/sign-in">
            <Login onSubmit={handleLoginSubmit} />
          </Route>
          <Route path="/sign-up">
            <Register onSubmit={handleRegisterSubmit} />
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
