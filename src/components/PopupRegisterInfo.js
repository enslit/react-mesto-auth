import React from 'react';
import { bool, func } from 'prop-types';
import successIcon from '../assets/icons/success-icon.svg';
import failIcon from '../assets/icons/fail-icon.svg';

PopupRegisterInfo.propTypes = {
  open: bool,
  onClose: func,
  success: bool,
};

function PopupRegisterInfo({ open, onClose, success }) {
  return (
    <div className={`popup ${open ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <button
          type="button"
          aria-label="Закрыть"
          className="popup__close btn btn_type_close"
          onClick={onClose}
        />
        <div
          className="popup__icon"
          aria-label={success ? 'Успешная регистрация' : 'Ошибка регистрации'}
          style={{
            backgroundImage: `url(${success ? successIcon : failIcon})`,
          }}
        />
        <h2 className="popup__title popup__title_place_register">
          {success
            ? 'Вы успешно зарегистрировались!'
            : 'Что-то пошло не так! Попробуйте ещё раз.'}
        </h2>
      </div>
    </div>
  );
}

export default PopupRegisterInfo;
