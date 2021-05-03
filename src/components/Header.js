import React from 'react';
import logo from '../images/logo.svg';

function Header() {
  return (
    <header className="header container">
      <a href="/" className="logo" target="_self">
        <img src={logo} alt="Mesto Russia" className="logo__img" />
      </a>
    </header>
  );
}

export default Header;
