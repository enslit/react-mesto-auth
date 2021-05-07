import React, { useState } from 'react';
import { func, bool } from 'prop-types';
import FormInput from './FormInput';
import Loader from './Loader';

Login.propTypes = {
  onSubmit: func,
  fetching: bool,
};

function Login({ onSubmit, fetching }) {
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
          <h1 className="form__title">Вход</h1>
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
            {fetching ? <Loader size={30} color="#000" /> : 'Войти'}
          </button>
        </div>
      </form>
    </main>
  );
}

export default Login;
