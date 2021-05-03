import React, { useEffect, useState } from 'react';
import PopupWithForm from './PopupWithForm';
import FormInput from './FormInput';
import { func, bool } from 'prop-types';

AddPlacePopup.propTypes = {
  onClose: func.isRequired,
  onAddPlace: func.isRequired,
  open: bool,
  submitting: bool,
};

function AddPlacePopup({
  onClose,
  onAddPlace,
  submitting = false,
  open = false,
}) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [nameValid, setNameValid] = useState(false);
  const [linkValid, setLinkValid] = useState(false);
  const [formValid, setFormValid] = useState(false);

  const handleClose = () => {
    setNameValid(false);
    setLinkValid(false);
    setName('');
    setLink('');
    onClose();
  };

  const handleChangeNameInput = (value, valid) => {
    setNameValid(valid);
    setName(value);
  };

  const handleChangeLinkInput = (value, valid) => {
    setLinkValid(valid);
    setLink(value);
  };

  const clearForm = () => {
    setName('');
    setLink('');
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    onAddPlace({ name, link }, clearForm);
  };

  useEffect(() => {
    if (nameValid && linkValid) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [nameValid, linkValid]);

  return (
    <PopupWithForm
      title="Новое место"
      name="add-card"
      isOpen={open}
      disabled={!formValid}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitting={submitting}
    >
      <FormInput
        value={name}
        onChange={handleChangeNameInput}
        type="text"
        name="name"
        id="place-input"
        placeholder="Название"
        className="form__input form__input_type_card-name"
        required
        minLength="2"
        maxLength="30"
      />
      <FormInput
        value={link}
        onChange={handleChangeLinkInput}
        type="url"
        name="link"
        id="link-input"
        placeholder="Ссылка на картинку"
        className="form__input form__input_type_link"
        required
      />
    </PopupWithForm>
  );
}

export default AddPlacePopup;
