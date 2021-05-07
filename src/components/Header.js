import React, { useContext, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import CurrentUserContext from '../contexts/CurrentUserContext';
import { bool, func, object, string } from 'prop-types';
import logo from '../assets/images/logo.svg';
import menuIcon from '../assets/icons/menu.svg';
import closeIcon from '../assets/icons/close_icon.svg';
import spinner from '../assets/icons/spinner.svg';

UserInfo.propTypes = {
  user: object,
  openMenu: bool,
  setOpenMenu: func,
};

HeaderLink.propTypes = {
  path: string,
};

function UserInfo({ openMenu, setOpenMenu }) {
  const history = useHistory();
  const { setIsloggedIn, currentUser, setCurrentUser } = useContext(
    CurrentUserContext
  );

  const logout = () => {
    localStorage.removeItem('jwt');
    setOpenMenu(false);
    setIsloggedIn(false);
    setCurrentUser({
      _id: null,
      email: '',
      name: 'Загрузка...',
      about: '',
      avatar: spinner,
    });
    history.push('/sign-in');
  };

  return (
    <>
      <div className={`header__menu ${openMenu ? 'header__menu_visible' : ''}`}>
        <span className="header__email">{currentUser.email}</span>
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
  const { isLoggedIn } = useContext(CurrentUserContext);
  const { pathname } = useLocation();

  return (
    <header
      className={`header container ${openMenu ? 'header_menu-opened' : ''}`}
    >
      <a href="/" className="logo" target="_self">
        <img src={logo} alt="Mesto Russia" className="logo__img" />
      </a>
      {isLoggedIn ? (
        <UserInfo openMenu={openMenu} setOpenMenu={setOpenMenu} />
      ) : (
        <HeaderLink path={pathname} />
      )}
    </header>
  );
}

export default Header;
