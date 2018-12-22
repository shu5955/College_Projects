import React from 'react';
import styled from 'styled-components';
import { slide as Menu } from 'react-burger-menu';
import WelcomeMenu from './WelcomeMenu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// A simple react component for the about us page. loads the website style. 

/*
I WILL SEPERATE THE STYLE IN TO A SEPRATE FILE and import it later
*/


     
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

   static isPrivate = true;
   static isAuthenticated = false;

	render() {

	return(
<DivParent>
    <WelcomeMenu/>
    
   <HeaderContainer>

   <Header>About Us</Header>

   </HeaderContainer>
  <DivContent>



    </DivContent>


    </DivParent>


       );

	}
}














