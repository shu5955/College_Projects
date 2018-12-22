import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import Auth from './Auth';

//Mock of an Auth method, can be replaced with an async call to the backend. Must return true or false as output
const isAuthenticated = () => true;

const PRIVATE_ROOT = '/welcome';
const PUBLIC_ROOT = '/';

const AuthRoute = ({component, ...props}) => {
  const { isPrivate } = component;
  if (!Auth.isUserAuthenticated()) {
    console.log("The user is  authenticated and the value of isPrivate is :"+ isPrivate);

    if (isPrivate === true) {
      //If the route is private the user may proceed.
      return <Route { ...props } component={ component } />;
    }
    else {
      //If the route is public, the user is redirected to the app's private root.
      return <Redirect to={ PRIVATE_ROOT } />;
    }
  }
  else {
    //User is not Authenticated
    console.log("The user is not authenticated and the value of isPrivate is :"+ isPrivate);

    if (isPrivate === true) {
      //If the route is private the user is redirected to the app's public root.
      return <Redirect to={ PUBLIC_ROOT } />;
    }
    else {
      //If the route is public, the user may proceed.
      return <Route { ...props } component={ component } />;
    }
  }
};

AuthRoute.propTypes = {
  component: React.PropTypes.oneOfType([
    React.PropTypes.element,
    React.PropTypes.func
  ])
};

export default AuthRoute;