import React from 'react';
import { bool, func, string } from 'prop-types';
import successIcon from '../assets/icons/success-icon.svg';
import failIcon from '../assets/icons/fail-icon.svg';

PopupRegisterInfo.propTypes = {
  open: bool,
  onClose: func,
  success: bool,
  title: string,
};

function PopupRegisterInfo({ open, onClose, success, title }) {
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
        <h2 className="popup__title popup__title_place_register">{title}</h2>
      </div>
    </div>
  );
}

export default PopupRegisterInfo;
