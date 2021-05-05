import React, { useContext } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import logo from '../images/logo.svg';
import CurrentUserContext from '../contexts/CurrentUserContext';
import { object, string } from 'prop-types';

UserInfo.propTypes = {
  user: object,
};

HeaderLink.propTypes = {
  path: string,
};

function UserInfo({ user }) {
  const history = useHistory();
  const { setIsloggedIn } = useContext(CurrentUserContext);

  const logout = () => {
    localStorage.removeItem('jwt');
    setIsloggedIn(false);
    history.push('/sign-in');
  };

  return (
    <div>
      <span>{user.name}</span>
      <button onClick={logout} className="link header__link">
        Выйти
      </button>
    </div>
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
  const { isLoggedIn, currentUser } = useContext(CurrentUserContext);
  const { pathname } = useLocation();

  return (
    <header className="header container">
      <a href="/" className="logo" target="_self">
        <img src={logo} alt="Mesto Russia" className="logo__img" />
      </a>
      {isLoggedIn ? (
        <UserInfo user={currentUser} />
      ) : (
        <HeaderLink path={pathname} />
      )}
    </header>
  );
}

export default Header;
