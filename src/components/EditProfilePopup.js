import React, { useContext, useEffect, useState } from 'react';
import PopupWithForm from './PopupWithForm';
import CurrentUserContext from '../contexts/CurrentUserContext';
import FormInput from './FormInput';
import { func, bool } from 'prop-types';

EditProfilePopup.propTypes = {
  onClose: func.isRequired,
  onUpdateUser: func.isRequired,
  open: bool,
  submitting: bool,
};

function EditProfilePopup({
  onClose,
  onUpdateUser,
  open = false,
  submitting = false,
}) {
  const currentUser = useContext(CurrentUserContext);
  const [userName, setUserName] = useState(currentUser.name);
  const [userAbout, setUserAbout] = useState(currentUser.about);
  const [nameValid, setNameValid] = useState(true);
  const [aboutValid, setAboutValid] = useState(true);
  const [formValid, setFormValid] = useState(true);

  const onChangeUserNameInput = (value, valid) => {
    setNameValid(valid);
    setUserName(value);
  };

  const onChangeUserAboutInput = (value, valid) => {
    setAboutValid(valid);
    setUserAbout(value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    onUpdateUser({
      name: userName,
      about: userAbout,
    });
  };

  useEffect(() => {
    if (nameValid && aboutValid) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [nameValid, aboutValid]);

  useEffect(() => {
    setUserName(currentUser.name);
    setUserAbout(currentUser.about);

    setNameValid(!!currentUser.name);
    setAboutValid(!!currentUser.about);
  }, [currentUser, open]);

  return (
    <PopupWithForm
      title="Редактировать профиль"
      name="edit-profile"
      isOpen={open}
      disabled={!formValid}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={submitting}
    >
      <FormInput
        type="text"
        name="name"
        id="name-input"
        className="form__input form__input_type_name"
        required
        minLength="2"
        maxLength="40"
        value={userName}
        onChange={onChangeUserNameInput}
      />
      <FormInput
        type="text"
        name="about"
        id="about-input"
        className="form__input form__input_type_about"
        required
        minLength="2"
        maxLength="200"
        value={userAbout}
        onChange={onChangeUserAboutInput}
      />
    </PopupWithForm>
  );
}

export default EditProfilePopup;
