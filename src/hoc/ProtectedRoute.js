import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { func, bool, string } from 'prop-types';

ProtectedRoute.propTypes = {
  component: func,
  isloggedIn: bool,
  path: string,
};

function ProtectedRoute({ component: Component, isloggedIn, path, ...props }) {
  return (
    <Route path={path}>
      {!isloggedIn ? <Redirect to="/sign-in" /> : <Component {...props} />}
    </Route>
  );
}

export default ProtectedRoute;
