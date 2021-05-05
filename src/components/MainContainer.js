import React, { useContext, useEffect, useState } from 'react';
import { api } from '../utils/api';
import { logError } from '../utils/utils';
import CurrentUserContext from '../contexts/CurrentUserContext';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmDeleteCardPopup from './ConfirmDeleteCardPopup';
import EditAvatarPopup from './EditAvatarPopup';

function MainContainer() {
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deletingCardId, setDeletingCardId] = useState(null);
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

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
        setCurrentUser(newUserData);
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
        setCurrentUser(newUserData);
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
  };

  useEffect(() => {
    setLoading(true);

    Promise.all([api.getUserInfo(), api.getCardList()])
      .then(([userData, cardList]) => {
        setCurrentUser(userData);
        setCards(cardList);
      })
      .catch(logError)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Main
        cards={cards}
        onCardLike={handleCardLike}
        onCardDelete={handleDeleteCardClick}
        onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddPlaceClick}
        onEditAvatar={handleEditAvatarClick}
        onCardClick={handleCardClick}
        loading={loading}
      />
      <Footer />
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
  );
}

export default MainContainer;
