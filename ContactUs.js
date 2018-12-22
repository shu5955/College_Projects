import React from 'react';
import styled from 'styled-components';
import { slide as Menu } from 'react-burger-menu';
import Auth from './Auth';
import WelcomeMenu from './WelcomeMenu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {red500} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
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

/*
    The react component for contact us page. 

*/

     
const DivContent= styled.div`
           height: 100%;
           width: 95%;
           margin: 100px auto;
           background-color:#fff;

`;     
     
const DivParent= styled.div`
          width:100%;
          min-height:200%;
          background-color:#ffebee;
          position:relative;

`;     


const HeaderContainer= styled.div`
      
    margin: auto;
    width: 60%;
    padding: 10px;
    text-align: center;

`; 

const Header= styled.a`
      color: #f44336;
      font-size: 48px;
      line-height: 50px;
      font-family: 'Roboto', sans-serif;
       letter-spacing: 1px;
      :hover {
      color: #ff5252 !important;
      }

`;     



const SocialContainer =styled.div`

 display: -webkit-flex;
 display:         flex;
 -webkit-align-items: center;
          align-items: center;
 -webkit-justify-content: center;
          justify-content: center;



`;


export default class ContactUs extends React.Component {

   static isPrivate = true;
   static isAuthenticated = false;
// The initial state of the application
  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      errors: {},
      contact: {
        subject: '',
        message: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.onChange = this.onChange.bind(this);

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
    const subject = encodeURIComponent(this.state.contact.subject);
    const message = encodeURIComponent(this.state.contact.message);
    const formData = `subject=${subject}&message=${message}`;
    console.log(formData);
  }


  onChange(event) {
    const field = event.target.name;
    const contact = this.state.contact;
    contact[field] = event.target.value;
    this.setState({
      contact
    });
  }
  
// This is the render method that renders the view and form for the contact us page

	render() {

	return(
<DivParent>
    <WelcomeMenu/>
   <HeaderContainer>

   <Header>Contact Us</Header>

   </HeaderContainer>

    <DivContent>
    <br/>
    <br/>
  <MuiThemeProvider>


<form className="commentForm" onSubmit={this.processForm}>

      <SocialContainer>
          <TextField
            name="subject"
            type="text"
            underlineFocusStyle={styles.underlineStyle}
            floatingLabelStyle={styles.floatingLabelStyle}
            inputStyle={{  borderColor: 'inherit', boxShadow: 'none', appearance:'none',
            outline:'none', border: 0 }}
            style={{width:'600px'}}
            hintStyle={{ textAlign: 'center', marginLeft:'10px' }}
            onChange={this.onChange}
            value={this.state.contact.subject}
            floatingLabelText="Subject"
          ></TextField>
      </SocialContainer>

      <SocialContainer>
          <TextField
            name="message"
            type="text"
            underlineFocusStyle={styles.underlineStyle}
            floatingLabelStyle={styles.floatingLabelStyle}
            inputStyle={{  borderColor: 'inherit', boxShadow: 'none', appearance:'none',
            outline:'none', border: 0 }}
            style={{width:'600px'}}
            hintStyle={{ textAlign: 'center', marginLeft:'10px' }}
            onChange={this.onChange}
            errorText={this.state.errors.password}
            value={this.state.contact.message}
            floatingLabelText="Message"
            multiLine={true}
            rows={4}
          ></TextField>
      </SocialContainer>

<br/>
      <SocialContainer>
            <RaisedButton type="submit" label="Submit" backgroundColor="#f44336" labelColor='#fff'/>
      </SocialContainer>

  </form>
</MuiThemeProvider>


<br/>
<br/>
    </DivContent>

    </DivParent>


       );

	}
}














