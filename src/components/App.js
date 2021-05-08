import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import CurrentUserContext from '../contexts/CurrentUserContext';
import Header from './Header';
import Login from './Login';
import Content from './Content';
import Register from './Register';
import ProtectedRoute from '../hoc/ProtectedRoute';
import Loader from './Loader';
import InfoTooltip from './InfoTooltip';
import { auth } from '../utils/api';
import { logError } from '../utils/utils';
import spinner from '../images/spinner.svg';

function App() {
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState(
    useContext(CurrentUserContext)
  );
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [authStatus, setAuthStatus] = useState({ status: false, message: '' });
  const [authorized, setAuthorized] = useState(false);
  const [appReady, setAppReady] = useState(false);

  const onSignUp = ({ email, password }, setSubmitting) => {
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
        setAuthorized(true);
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
        setShowInfoTooltip(true);
        setSubmitting(false);
      });
  };

  const onSignIn = ({ email, password }, setSubmitting) => {
    auth
      .auth(email, password)
      .then(({ token, message }) => {
        if (!token) {
          return Promise.reject(message);
        }

        localStorage.setItem('jwt', token);
        return auth.checkToken(token);
      })
      .then((data) => {
        authorize(data);
        history.push('/');
      })
      .catch((error) => {
        setAuthStatus({
          status: false,
          message:
            error.toString() || 'Что-то пошло не так! Попробуйте ещё раз.',
        });
        setShowInfoTooltip(true);
        logError(error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const onSignOut = () => {
    localStorage.removeItem('jwt');
    setAuthorized(false);
    setCurrentUser({
      _id: null,
      email: null,
      name: 'Загрузка...',
      about: null,
      avatar: spinner,
    });
    history.push('/sign-in');
  };

  const handleClosePopup = () => {
    setShowInfoTooltip(false);
  };

  // Авторизовать пользователя в приложении
  const authorize = useCallback(
    ({ data }) => {
      const { email } = data;
      setCurrentUser({ ...currentUser, email });
      setAuthorized(true);
    },
    [currentUser, setCurrentUser, setAuthorized]
  );

  // Проверим JWT в LS. Если есть, пробуем авторизовать
  useEffect(() => {
    if (!appReady) {
      const jwt = localStorage.getItem('jwt');

      if (jwt) {
        auth
          .checkToken(jwt)
          .then((data) => {
            authorize(data);
            history.push('/');
          })
          .catch(logError)
          .finally(() => setAppReady(true));
      } else {
        setAppReady(true);
      }
    }
  }, [appReady, setAppReady, authorize, history]);

  // Ждем проверки JWT, чтобы понять куда выполнить редирект
  if (!appReady) {
    return (
      <div className="page page_loading">
        <Loader size={150} count={20} />
      </div>
    );
  }

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        authorized,
        onSignOut,
      }}
    >
      <div className="page">
        <Header />
        <Switch>
          <Route path="/sign-in">
            <Login onSubmit={onSignIn} />
          </Route>
          <Route path="/sign-up">
            <Register onSubmit={onSignUp} />
          </Route>
          <ProtectedRoute
            path="/"
            component={Content}
            authorized={authorized}
          />
        </Switch>
        <InfoTooltip
          open={showInfoTooltip}
          title={authStatus.message}
          success={authStatus.status}
          onClose={handleClosePopup}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
