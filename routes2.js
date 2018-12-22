import HomePage from './Homepage';
import WelcomeUser from './WelcomeUser';
import ContactUs from './ContactUs';
import AboutUs from './AboutUs';
import Profile from './Profile';
import FAQ from './FAQ';
import Base from './Base';
import Auth from './Auth';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
/*
    This is the routes file for the web app. It loads the correct component by matching the route. 
    It also performs is user authenticated check on every page requests. This makes our app more secure
*/

const routes = {
  // base component (wrapper for the whole application).
  component: Base, //base route loads homepage
  childRoutes: [ 
    {
      path: '/',
      component: HomePage //base route
    },
    {
      path: '/welcome', //welcome route 
              getComponent: (location, callback) => {

                //see how user logged in to use our service
            if (cookies.get('route')=="local"){ 
                   console.log("I AM IN THE LOCAL ROUTE");
                   callback(null, WelcomeUser);
                }
          else if (cookies.get('route')=="social") {
                  console.log("I AM IN THE SOCIAL ROUTE");
                  callback(null, WelcomeUser);
                } 
          else 
                {
                  console.log(document.cookie);
                  console.log(cookies.get('route'));
                  callback(null, HomePage);
                }
             }
    },
    {
      path: '/about',
      onEnter: (nextState, replace) => {
          console.log(cookies.get('isLoggedIn'));
          if(cookies.get('isLoggedIn')==null){
                    replace('/');
          }

      },
       getComponent: (location, callback) => {
           callback(null, AboutUs );
      }
    },
   {
      path: '/profile',
      onEnter: (nextState, replace) => {
          console.log(cookies.get('isLoggedIn'));
          if(cookies.get('isLoggedIn')==null){
                    replace('/');
          }

      },
       getComponent: (location, callback) => {
           callback(null, Profile);
      }
    },

    {
     path: '/contact',
      onEnter: (nextState, replace) => {
        if(cookies.get('isLoggedIn')==null){
                    replace('/');
          }
      },
       getComponent: (location, callback) => {
                  callback(null, ContactUs);

      }
    },
    {
     path: '/faqs',
      onEnter: (nextState, replace) => {
        if(cookies.get('isLoggedIn')==null){
                    replace('/');
          }
      },
       getComponent: (location, callback) => {
                 callback(null, FAQ);

      }
    }
    // {
    //   path: '/logout',
    //   onEnter: (nextState, replace) => {
    //     Auth.deauthenticateUser();
    //     localStorage.clear();
    //     sessionStorage.clear();
    //     var cookies = document.cookie.split(";");

    //     for (var i = 0; i < cookies.length; i++) {
    //           var cookie = cookies[i];
    //           var eqPos = cookie.indexOf("=");
    //           var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    //           document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    //     }
    //     // change the current URL to /
    //     replace('/');
    //   }
    // }
  ]
};


export default routes;