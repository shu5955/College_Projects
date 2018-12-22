import React from 'react';
import styled from 'styled-components';
import { push as Menu } from 'react-burger-menu';

// This is the welcome menu. I AM NOT USING THIS COMPONENT NO MORE BECAUSE I REPLACED THE HANBURGER MENU WITH THE NAVBAR
const StyledMenuItem=styled.a`
    color: #fff;
    text-decoration: none;
    display: inline-block;
    margin: 0.75em;
    padding: 1.35em 1.1em;
    width: 15em;
    color: #fffff;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 800;
    border-top-left-radius: 20px 50px;
    border-top-right-radius: 20px 50px;
    border-bottom-right-radius: 20px 50px;
    border-bottom-left-radius: 20px 50px;
    cursor: pointer;
    &.current-demo {
      background: #e8e8e8;
      color: #fffff;
    }
  &:hover,
  &:focus {
     color: #e8e8e8;
  }
`;


const StyledIconItem=styled.i`

 vertical-align: middle;

`;


var styles = {
  bmBurgerButton: {
    position: 'absolute',
    width: '36px',
    height: '30px',
    left: '30px',
    top: '30px'
  },
  bmBurgerBars: {
    background: '#f44336'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#373a47'
  },
  bmMenu: {
    background: '#f44336',
    padding: '1.5em 1.em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#f44336'
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }
}


export default class WelcomeMenu extends React.Component {


	render() {

	return(
 	  <Menu  width={ '250' } styles={styles}>
        <StyledMenuItem id="home" className="menu-item" href="/welcome"><StyledIconItem className="material-icons md-light md-48">home</StyledIconItem> Home</StyledMenuItem>
        <StyledMenuItem id="causes" className="menu-item" href="/welcome"> <StyledIconItem className="material-icons md-light md-48">work</StyledIconItem> <span>Causes</span> </StyledMenuItem>
        <StyledMenuItem id="about" className="menu-item" href="/about"><StyledIconItem className="material-icons md-light md-48">info</StyledIconItem> About Us</StyledMenuItem>
        <StyledMenuItem id="faqs" className="menu-item" href="/faqs"><StyledIconItem className="material-icons md-light md-48">question_answer</StyledIconItem> FAQ </StyledMenuItem>
        <StyledMenuItem id="contact" className="menu-item" href="/contact"><StyledIconItem className="material-icons md-light md-48">contact_mail</StyledIconItem> Contact Us</StyledMenuItem>
        <StyledMenuItem id="logout" className="menu-item" href="/logout"><StyledIconItem className="material-icons md-light md-48">sentiment_dissatisfied</StyledIconItem> Logout</StyledMenuItem>
      </Menu>
      				);

	}
}



