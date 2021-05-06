import React, { useState } from 'react';
import FormInput from './FormInput';
import { Link } from 'react-router-dom';
import './styles/auth.css';
import { func } from 'prop-types';

Register.propTypes = {
  onSubmit: func,
};

function Register({ onSubmit }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleInput = (value, name) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    onSubmit(form);
  };

  return (
    <main className="content">
      <form
        noValidate
        name="sign-up"
        className="form form_type_auth"
        onSubmit={handleSubmit}
      >
        <div className="form__body">
          <h1 className="form__title">Регистрация</h1>
          <FormInput
            type="email"
            name="email"
            placeholder="Email"
            id="username-input"
            className="form__input form__input_type_email form__input_style_dark"
            required
            minLength="2"
            maxLength="40"
            onChange={handleInput}
            value={form.email}
          />
          <FormInput
            type="password"
            name="password"
            placeholder="Пароль"
            id="password-input"
            className="form__input form__input_type_password form__input_style_dark"
            required
            minLength="6"
            maxLength="40"
            onChange={handleInput}
            value={form.password}
          />
        </div>
        <div className="form__actions">
          <button
            type="submit"
            name="save"
            className="form__save form__save_style_dark"
          >
            Зарегистрироваться
          </button>
          <div className="form__after-save">
            Уже зарегистрированы?{' '}
            <Link to="/sign-in" className="link form__link">
              Войти
            </Link>
          </div>
        </div>
      </form>
    </main>
  );
}

export default Register;
