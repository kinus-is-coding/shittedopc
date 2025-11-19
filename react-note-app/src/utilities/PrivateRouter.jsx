import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isAuth }) => {
    console.log("hi")
  if (!isAuth) {
    // User is not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render children
  return children;
};

export default PrivateRoute;
