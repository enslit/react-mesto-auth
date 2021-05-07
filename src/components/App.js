import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import CurrentUserContext from '../contexts/CurrentUserContext';
import Header from './Header';
import Login from './Login';
import MainContainer from './MainContainer';
import Register from './Register';
import ProtectedRoute from '../hoc/ProtectedRoute';
import Loader from './Loader';
import PopupRegisterInfo from './PopupRegisterInfo';
import { auth } from '../utils/api';
import { logError } from '../utils/utils';

function App() {
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState(
    useContext(CurrentUserContext)
  );
  const [showRegisterInfo, setShowRegisterInfo] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [authStatus, setAuthStatus] = useState({ status: false, message: '' });
  const [isLoggedIn, setIsloggedIn] = useState(false);
  const [appReady, setAppReady] = useState(false);

  const handleRegisterSubmit = ({ email, password }) => {
    setFetching(true);
    auth
      .register(email, password)
      .then(({ data, error }) => {
        if (error) {
          return Promise.reject(error);
        }

        setCurrentUser({ ...currentUser, email: data.email, _id: data._id });
        return auth.auth(email, password);
      })
      .then(({ token, error }) => {
        if (error) {
          return Promise.reject(error);
        }

        localStorage.setItem('jwt', token);
        setIsloggedIn(true);
        history.push('/');
        setAuthStatus({
          status: true,
          message: 'Вы успешно зарегистрировались!',
        });
      })
      .catch((error) => {
        setAuthStatus({
          status: false,
          message:
            error.toString() || 'Что-то пошло не так! Попробуйте ещё раз.',
        });
        logError(error);
      })
      .finally(() => {
        setShowRegisterInfo(true);
        setFetching(false);
      });
  };

  const handleLoginSubmit = ({ email, password }) => {
    setFetching(true);
    auth
      .auth(email, password)
      .then(({ token, message }) => {
        if (!token) {
          return Promise.reject(message);
        }

        localStorage.setItem('jwt', token);
        return auth.checkToken(token);
      })
      .then(changeAuthStatus)
      .catch((error) => {
        setAuthStatus({
          status: false,
          message:
            error.toString() || 'Что-то пошло не так! Попробуйте ещё раз.',
        });
        setShowRegisterInfo(true);
        logError(error);
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const handleClosePopup = () => {
    setShowRegisterInfo(false);
  };

  const changeAuthStatus = ({ data }) => {
    const { email } = data;
    setCurrentUser({ ...currentUser, email });
    setIsloggedIn(true);
    history.push('/');
  };

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      auth
        .checkToken(jwt)
        .then(changeAuthStatus)
        .catch(logError)
        .finally(() => setAppReady(true));
    } else {
      setAppReady(true);
    }
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
            <Login onSubmit={handleLoginSubmit} fetching={fetching} />
          </Route>
          <Route path="/sign-up">
            <Register onSubmit={handleRegisterSubmit} fetching={fetching} />
          </Route>
          <ProtectedRoute
            path="/"
            component={MainContainer}
            isloggedIn={isLoggedIn}
          />
        </Switch>
        <PopupRegisterInfo
          open={showRegisterInfo}
          title={authStatus.message}
          success={authStatus.status}
          onClose={handleClosePopup}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
