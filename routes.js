import HomePage from './Homepage';
import WelcomeUser from './WelcomeUser';
import ContactUs from './ContactUs';
import AboutUs from './AboutUs';
import FAQ from './FAQ';
import Base from './Base';
import Auth from './Auth';
//old route file. Not working 
const routes = {
  component: Base,
  childRoutes: [ 
    {
      path: '/',
      component: WelcomeUser
    },
    {
      path: '/welcome',
      getComponent: (location, callback) => {
          if (Auth.getAuthenticateRoute()=="local"){
            console.log("I AM HERE");
                if (Auth.isUserAuthenticated()) {
                  console.log("The User Is Authenticated");
                  callback(null, WelcomeUser);
                } else {
                  console.log("The User is not Authenticated");
                  callback(null, HomePage);
                }
             }
          else{
                if (document.cookie=="route=social") {
                  callback(null, WelcomeUser);
                } 
                else 
                {
                  callback(null, HomePage);
                }
             }
            }, 
      routes: [
            {
              path: '/about',
              component: AboutUs,
            },
            {
              path: '/faqs',
              component: FAQ,
            },
            {
              path: '/contact',
              component: ContactUs,
            },
      ],
    },
    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();

        // change the current URL to /
        replace('/');
      }
    }
  ]
};


export default routes;