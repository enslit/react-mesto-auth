import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CurrentUserContext from '../contexts/CurrentUserContext';
import { bool, func, string, object } from 'prop-types';
import logo from '../images/logo.svg';
import menuIcon from '../images/menu.svg';
import closeIcon from '../images/close_icon.svg';

Menu.propTypes = {
  user: object.isRequired,
  logout: func.isRequired,
  setOpenMenu: func.isRequired,
  openMenu: bool,
};

AuthLink.propTypes = {
  path: string.isRequired,
};

function Menu({ user, logout, setOpenMenu, openMenu = false }) {
  const handleClickLogout = () => {
    setOpenMenu(false);
    logout();
  };

  const handleClickMenu = () => {
    setOpenMenu(!openMenu);
  };

  const buttonIcon = openMenu ? closeIcon : menuIcon;

  return (
    <>
      <div className={`header__menu ${openMenu ? 'header__menu_visible' : ''}`}>
        <span className="header__email">{user.email}</span>
        <button onClick={handleClickLogout} className="link header__link">
          Выйти
        </button>
      </div>
      <button
        onClick={handleClickMenu}
        type="button"
        aria-label="Меню"
        className="btn btn_type_menu"
        style={{ backgroundImage: `url(${buttonIcon})` }}
      />
    </>
  );
}

function AuthLink({ path }) {
  const isLoginPage = path === '/sign-in';

  return (
    <Link
      to={isLoginPage ? '/sign-up' : '/sign-in'}
      className="link header__link"
    >
      {isLoginPage ? 'Регистрация' : 'Войти'}
    </Link>
  );
}

function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const { authorized, currentUser, onSignOut } = useContext(CurrentUserContext);
  const { pathname } = useLocation();

  return (
    <header
      className={`header container ${openMenu ? 'header_menu-opened' : ''}`}
    >
      <a href="/" className="logo" target="_self">
        <img src={logo} alt="Mesto Russia" className="logo__img" />
      </a>
      {authorized ? (
        <Menu
          user={currentUser}
          logout={onSignOut}
          setOpenMenu={setOpenMenu}
          openMenu={openMenu}
        />
      ) : (
        <AuthLink path={pathname} />
      )}
    </header>
  );
}

export default Header;
