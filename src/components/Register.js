import React, { useState } from 'react';
import { func } from 'prop-types';
import FormInput from './FormInput';

Register.propTypes = {
  onSubmit: func,
};

function Register({ onSubmit }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const handleInput = ({ target }) => {
    setForm({
      [target.name]: target.value,
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
        className="form form_type_sign-up"
        onSubmit={handleSubmit}
      >
        <h1 className="form__title">Регистрация</h1>
        <FormInput
          type="text"
          name="username"
          placeholder="Email"
          id="username-input"
          className="form__input form__input_type_username"
          required
          minLength="2"
          maxLength="40"
          onChange={handleInput}
          value={form.username}
        />
        <FormInput
          type="password"
          name="password"
          placeholder="Пароль"
          id="password-input"
          className="form__input form__input_type_password"
          required
          minLength="6"
          maxLength="40"
          onChange={handleInput}
          value={form.password}
        />
        <button type="submit" name="save" className="form__save">
          Зарегистрироваться
        </button>
      </form>
    </main>
  );
}

export default Register;
