import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import routes from './routes2';
import HomePage from './Homepage';
import WelcomeUser from './WelcomeUser';
// import { Router, Route, browserHistory } from 'react-router'
import { browserHistory, Router } from 'react-router';
import { Route, Switch,Redirect  } from 'react-router';
// remove tap delay, essential for MaterialUI to work properly
injectTapEventPlugin();


/*
This is the render method to start my website's main component using react router. 
Check routes2.js for the router configuration and pages. 
I also need to add the registerserviceworker.js to add the offline and load data faster. check the crud sample project for that functionality. 
*/

ReactDOM.render(
	      <Router history={browserHistory} routes={routes} />,
    document.querySelector('.root')
);