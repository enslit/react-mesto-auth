import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import CurrentUserContext from '../contexts/CurrentUserContext';
import Header from './Header';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from '../hoc/ProtectedRoute';
import Loader from './Loader';
import InfoTooltip from './InfoTooltip';
import { api, auth } from '../utils/api';
import { logError } from '../utils/utils';
import spinner from '../images/spinner.svg';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmDeleteCardPopup from './ConfirmDeleteCardPopup';
import EditAvatarPopup from './EditAvatarPopup';
import Main from './Main';

function App() {
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState(
    useContext(CurrentUserContext)
  );
  const [authStatus, setAuthStatus] = useState({ status: false, message: '' });
  const [authorized, setAuthorized] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deletingCardId, setDeletingCardId] = useState(null);

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

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleDeleteCardClick = (id) => {
    setDeletingCardId(id);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleUpdateUser = (userData) => {
    setFormSubmitting(true);
    api
      .updateProfile(userData)
      .then((newUserData) => {
        setCurrentUser({
          ...currentUser,
          ...newUserData,
        });
        setIsEditProfilePopupOpen(false);
      })
      .catch(logError)
      .finally(() => setFormSubmitting(false));
  };

  const handleUpdateAvatar = (formData) => {
    setFormSubmitting(true);
    api
      .updateAvatar(formData)
      .then((newUserData) => {
        setCurrentUser({
          ...currentUser,
          ...newUserData,
        });
        setIsEditAvatarPopupOpen(false);
      })
      .catch(logError)
      .finally(() => setFormSubmitting(false));
  };

  const handleAddPlaceSubmit = (cardData, clearCallback) => {
    setFormSubmitting(true);
    api
      .postCard(cardData)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        setIsAddPlacePopupOpen(false);
        clearCallback();
      })
      .catch(logError)
      .finally(() => setFormSubmitting(false));
  };

  const handleDeleteCardSubmit = (id) => {
    setFormSubmitting(true);
    api
      .delete(id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== id));
        setDeletingCardId(null);
      })
      .catch(logError)
      .finally(() => setFormSubmitting(false));
  };

  const handleCardLike = (card, setLikeFetching) => {
    const isLiked = card.likes.some((user) => user._id === currentUser._id);

    setLikeFetching(true);
    api
      .like(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch(logError)
      .finally(() => setLikeFetching(false));
  };

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setDeletingCardId(null);
    setSelectedCard(null);
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

  useEffect(() => {
    if (authorized) {
      setLoading(true);
      Promise.all([api.getUserInfo(), api.getCardList()])
        .then(([userData, cardList]) => {
          setCurrentUser((user) => ({
            ...user,
            ...userData,
          }));
          setCards(cardList);
        })
        .catch(logError)
        .finally(() => {
          setLoading(false);
        });
    }
  }, [authorized]);

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
            authorized={authorized}
            component={Main}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleDeleteCardClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            loading={loading}
          />
        </Switch>
        <Footer />
        <InfoTooltip
          open={showInfoTooltip}
          title={authStatus.message}
          success={authStatus.status}
          onClose={closeAllPopups}
        />
        {authorized && (
          <>
            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
            <EditProfilePopup
              open={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
              submitting={formSubmitting}
            />
            <AddPlacePopup
              open={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}
              submitting={formSubmitting}
            />
            <ConfirmDeleteCardPopup
              cardId={deletingCardId}
              onClose={closeAllPopups}
              onDeleteCard={handleDeleteCardSubmit}
              submitting={formSubmitting}
            />
            <EditAvatarPopup
              open={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
              submitting={formSubmitting}
            />
          </>
        )}
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
