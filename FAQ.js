import React from 'react';
import styled from 'styled-components';
import { slide as Menu } from 'react-burger-menu';
import WelcomeMenu from './WelcomeMenu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {red500} from 'material-ui/styles/colors';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

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
// This is the faq page component


     
const DivContent= styled.div`
           height: 100%;
           width: 95%;
           margin: 100px auto;
           background-color:#ffebee;

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


export default class FAQ extends React.Component {
    // the keywords identify the state of this component
   static isPrivate = true;
   static isAuthenticated = false;

	render() {
// the following code renders the view from the component
	return(
<DivParent>
    <WelcomeMenu/>
   <HeaderContainer>

   <Header>Frequently Asked Questions</Header>

   </HeaderContainer>
  <DivContent>

  
  <MuiThemeProvider>

<div>

  <Card style={{backgroundColor: '#f44336'}}>
    <CardHeader
      title="Who Am I ?"
      actAsExpander={true}
      showExpandableButton={true}
      titleColor='#fff'
    />
    <CardText color='#fff' expandable={true}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
    </CardText>
  </Card>
<br/>
<Card style={{backgroundColor: '#f44336'}}>
    <CardHeader
      title="Who Am I ?"
      actAsExpander={true}
      showExpandableButton={true}
      titleColor='#fff'
    />
    <CardText color='#fff' expandable={true}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
    </CardText>
  </Card>

</div>

  </MuiThemeProvider>

    </DivContent>


    </DivParent>


       );

	}
}














