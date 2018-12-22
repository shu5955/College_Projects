import React from 'react';
import styled from 'styled-components';
import LoginForm from './LoginForm.js';

const DivParent= styled.div`
 height: 100%;
`;
//The loginpage is the parent component of loginform. Homepage renders loginpage

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

export default class LoginPage extends React.Component {
	render() {
			return(
					<LoginForm onSubmit={this.processForm} onChange={this.changeUser} errors={this.state.errors} user={this.state.user}/>
				);
	}
}