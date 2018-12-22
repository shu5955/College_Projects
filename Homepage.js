import React from 'react';
import styled from 'styled-components';
import Auth from './Auth';
import LoginForm from './LoginForm.js';
import WelcomeUser from './WelcomeUser.js';
import { browserHistory } from 'react-router'
import Cookies from 'universal-cookie';
 
// The homepage component
 //the following is the styled component
const DivParent= styled.div`
 height: 100%;
`;


const DivHomepage = styled.div`
 height: 100%;
 width: 100%;
 background-color: #f44336;
 display: -webkit-flex;
 display:         flex;
 -webkit-align-items: center;
          align-items: center;
 -webkit-justify-content: center;
          justify-content: center;
`;

const DivAboutus = styled.div`
 height: 100%;
 width: 100%;
 background-color: #ffebee;
 display: -webkit-flex;
 display:         flex;
 -webkit-align-items: center;
          align-items: center;
 -webkit-justify-content: center;
          justify-content: center;
`;

const Paragraph = styled.div`
  font-size: 15px;
  margin: 0 auto;

`;

export default class Homepage extends React.Component {
 
  static isPrivate = false
/**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        email: '',
        password: ''
      },
      isSignUp: false
    };
      // the helper methods to sign up 
    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.triggerSignup = this.triggerSignup.bind(this);

  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `email=${email}&password=${password}`;
    const isChecked = this.state.isSignUp;
    const xhr = new XMLHttpRequest();
    const cookies = new Cookies();
 // makes an http request to the server to process the signup/login form 
if(!isChecked){
    xhr.open('post', '/auth/login'); // login route
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

       //document.cookie="method=local";  

        // save the token
        Auth.authenticateUser(xhr.response.token);
        console.log(xhr.response.token);
        Auth.setAuthenticateRoute("local");
        cookies.set('route', 'local', { path: '/' });

       const path = '/welcome';
       browserHistory.push(path); //push the /welcome route to the browsehistory if user is successfully logged in 
      } else {
        // failure

        // change the component state
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });
      }
    });
}
else{
    xhr.open('post', '/auth/signup'); //signup route
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

        localStorage.setItem('successMessage', xhr.response.message);

       // sessionStorage.setItem('method','local');      
       //document.cookie="method=local";  
        Auth.authenticateUser(xhr.response.token);
        Auth.setAuthenticateRoute("local");
        cookies.set('route', 'local', { path: '/' });


        const path = '/welcome'; //push the path to the browserhistory if successfully signed up 
        browserHistory.push(path);
     
      } else {
        // failure
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });
      }
    });
}
    xhr.send(formData);
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }
  // the trigger signup function lets the component know that user wants to signup for the service
  triggerSignup(event) {
    this.state.isSignUp=true;
      }



	render() {
			return(
				<DivParent>
				<DivHomepage>
							<div style={{position:'relative'}}>
								<h1 style={{color:'#fff',marginRight:'50px'}}>Shubham's Independent Study 490</h1>
								<h2 style={{color:'#fff',float: 'right', marginRight:'50px'}}>Hopefully he will pass it!</h2>
							</div>
							<LoginForm onSubmit={this.processForm} onChange={this.changeUser} errors={this.state.errors} user={this.state.user} onSignUp={this.triggerSignup} />
				</DivHomepage>
				<DivAboutus>
					<Paragraph>This is About Us Page</Paragraph>
				</DivAboutus>
				</DivParent>

				);

	}


}

