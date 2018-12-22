import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import styled from 'styled-components';
import {red500,white,orange500, blue50} from 'material-ui/styles/colors';
import Checkbox from 'material-ui/Checkbox';

// The login form loads the login page component on the homepage
const styles = {
  errorStyle: {
    color: red500,
  },
  underlineStyle: {
    borderColor: red500,
  },
  underlineFocusStyle: {
    borderColor: red500,
  },
  floatingLabelStyle: {
    color: red500,
  },
  floatingLabelFocusStyle: {
    color: red500,
  }
};


// The following are the style of the login form 
const Divider=styled.hr`
  border: 0; 
  height: 1px; 
  background-image: -webkit-linear-gradient(left, #BDBDBD, #f44336, #BDBDBD);
  background-image: -moz-linear-gradient(left, #BDBDBD, #f44336, #BDBDBD);
  background-image: -ms-linear-gradient(left, #BDBDBD, #f44336, #BDBDBD);
  background-image: -o-linear-gradient(left, #BDBDBD, #f44336, #BDBDBD); 
`;

const LoginTag = styled.h2`
 color: #f44336;
 font-family: Roboto, sans-serif;
 font-size: 32px;
 text-align:center;
 margin: 6px; 
 padding: 20px;
`;



const SocialContainer =styled.div`

 display: -webkit-flex;
 display:         flex;
 -webkit-align-items: center;
          align-items: center;
 -webkit-justify-content: center;
          justify-content: center;



`;


const SocialButtonFacebook = styled.a`
 align:center;
background-color: #3b5998;
color: #fff !important;
:hover {
  background-color: #4c70ba !important;
}
    display:inline-block;
 margin: 4px; 



`;

const SocialButtonIconFacebook = styled.i`
  color: #fff !important;
 text-align:center;

`;

const SocialButtonGoogle = styled.a`
 align:center;
  background-color: #dd4b39;
  color: #fff !important;
:hover {
  background-color: #e47365 !important;
}
    display:inline-block;
 margin: 4px; 


`;

const SocialButtonIconGoogle = styled.i`
 color: #fff !important;
 text-align:center;
`;

const SocialButtonTwitter = styled.a`
  align:center;
  background-color: #55acee;
  color: #fff !important;
:hover {
  background-color: #83c3f3 !important;
}
    display:inline-block;
 margin: 4px; 


`;


const ErrorText = styled.p`

color:#f44336;
align:center;


`;


const SocialButtonIconTwitter = styled.i`
 color: #fff !important;
 vertical-align: middle;

`;


const GroupDiv = styled.div`
 position:relative; 
 margin-bottom:45px; 
`;

const FormInput = styled.input`
  font-size:18px;
  padding:10px 10px 10px 5px;
  display:block;
  width:300px;
  border:none;
  font-family:'Roboto';
  :focus    { outline:none; }

`;

//this os the login form and the props passed to the login form from the homepage component
const LoginForm = ({
  onSubmit,
  onChange,
  errors,
  user,
  onSignUp
}) => (

<MuiThemeProvider>
  <Card zDepth={5} className="container" style={{backgroundColor: '#FFF', height:'450px', width:'280px',  outline:'none' }}>
    <form action="/" onSubmit={onSubmit}>
      <LoginTag>Login or SignUp</LoginTag>
    <SocialContainer>
            <SocialButtonFacebook href="/auth/facebook" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect  social-icon btn-large "><SocialButtonIconFacebook className="fa fa-facebook"></SocialButtonIconFacebook>Facebook </SocialButtonFacebook>
            <SocialButtonGoogle href="/auth/google" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect btn-large "><SocialButtonIconGoogle className="fa fa-google"></SocialButtonIconGoogle> Google</SocialButtonGoogle>
            <SocialButtonTwitter href="/auth/twitter" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect btn-large "><SocialButtonIconTwitter className="fa fa-twitter"></SocialButtonIconTwitter> Twitter</SocialButtonTwitter>
    </SocialContainer>
          <Divider/>
<SocialContainer>
    <TextField
      hintText="Existing or new username"
      underlineFocusStyle={styles.underlineStyle}
      name="email"
      inputStyle={{ borderColor: 'inherit', boxShadow: 'none', appearance:'none',
outline:'none', border: 0 }}
       hintStyle={{ textAlign: 'center', marginLeft:'10px' }}
       errorText={errors.email}
       onChange={onChange}
       value={user.email}
    ></TextField>
</SocialContainer>
<br/>
<SocialContainer>
    <TextField
      hintText="Existing or new password"
      name="password"
      type="password"
      underlineFocusStyle={styles.underlineStyle}
      inputStyle={{  borderColor: 'inherit', boxShadow: 'none', appearance:'none',
      outline:'none', border: 0 }}
      hintStyle={{ textAlign: 'center', marginLeft:'10px' }}
      onChange={onChange}
      errorText={errors.password}
      value={user.password}
    ></TextField>
</SocialContainer>
<br/>
<br/>
<SocialContainer>
    <Checkbox
      label="I am Signing Up by aggreeing to the Terms and Conditions."
      style={styles.checkbox}
      style={{marginLeft:'10px'}}
      name="checkbox"
      onCheck={onSignUp}
    />
  </SocialContainer>
<br/>
<SocialContainer>
      <RaisedButton type="submit" label="login" backgroundColor="#f44336" labelColor='#fff'/>
</SocialContainer>

    </form>
  </Card>
</MuiThemeProvider>
);


LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onSignUp: PropTypes.func.isRequired
};

export default LoginForm;

