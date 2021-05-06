import React, { useContext, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import CurrentUserContext from '../contexts/CurrentUserContext';
import { bool, func, object, string } from 'prop-types';
import logo from '../assets/images/logo.svg';
import menuIcon from '../assets/icons/menu.svg';
import closeIcon from '../assets/icons/close_icon.svg';

UserInfo.propTypes = {
  user: object,
  openMenu: bool,
  setOpenMenu: func,
};

HeaderLink.propTypes = {
  path: string,
};

function UserInfo({ user, openMenu, setOpenMenu }) {
  const history = useHistory();
  const { setIsloggedIn } = useContext(CurrentUserContext);

  const logout = () => {
    localStorage.removeItem('jwt');
    setOpenMenu(false);
    setIsloggedIn(false);
    history.push('/sign-in');
  };

  return (
    <>
      <div className={`header__menu ${openMenu ? 'header__menu_visible' : ''}`}>
        <span className="header__email">{user.name}</span>
        <button onClick={logout} className="link header__link">
          Выйти
        </button>
      </div>
      <button
        onClick={() => setOpenMenu(!openMenu)}
        type="button"
        aria-label="Меню"
        className="btn btn_type_menu"
        style={{ backgroundImage: `url(${openMenu ? closeIcon : menuIcon}` }}
      />
    </>
  );
}

function HeaderLink({ path }) {
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
  const { isLoggedIn, currentUser } = useContext(CurrentUserContext);
  const { pathname } = useLocation();

  return (
    <header
      className={`header container ${openMenu ? 'header_menu-opened' : ''}`}
    >
      <a href="/" className="logo" target="_self">
        <img src={logo} alt="Mesto Russia" className="logo__img" />
      </a>
      {isLoggedIn ? (
        <UserInfo
          user={currentUser}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
        />
      ) : (
        <HeaderLink path={pathname} />
      )}
    </header>
  );
}

export default Header;
