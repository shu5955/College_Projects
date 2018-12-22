import React from 'react';
import styled from 'styled-components';
import { slide as Menu } from 'react-burger-menu';
import Auth from './Auth';
import config from './config';
import WelcomeMenu from './WelcomeMenu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {red500,grey400,deepOrange300,white} from 'material-ui/styles/colors';
import { Link } from 'react-router';
import SvgCamera from 'material-ui/svg-icons/image/photo-camera';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import AppBar from 'material-ui/AppBar';
import NavBar from './NavBar';
import Cookies from 'universal-cookie';
import axios from 'axios';
import PostWrite from './PostWrite.js';
import * as PostAPI from './PostAPI.js';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

/* This is the welcome screen for the users. The welcome component loads after login */     
const DivContent= styled.div`
           height: 100%;
           width: 95%;
           margin: 200px auto;
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


const ProfileContainer= styled.div`
    max-width: 160px;
    width: 100%;
    margin: 0 auto;
    -webkit-transform: translate3d(0, -50%, 0);
    -moz-transform: translate3d(0, -50%, 0);
    -o-transform: translate3d(0, -50%, 0);
    -ms-transform: translate3d(0, -50%, 0);
    transform: translate3d(0, -50%, 0);

`;   

const ProfileImage= styled.img`
    text-align: center;
    box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
`;   

const DivContainer= styled.div`
    padding: 0;
    margin: 0;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: center;

`;   


const StyledSupportContainer=styled.a`
    color: #f44336;
    text-decoration: none;
    margin: 0.75em;
    padding: 1.35em 1.1em;
    width: 15em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 800;
    border-top-left-radius: 20px 50px;
    border-top-right-radius: 20px 50px;
    border-bottom-right-radius: 20px 50px;
    border-bottom-left-radius: 20px 50px;
    cursor: pointer;
    &.current-demo {
      background: #ff5252;
      color: #ff5252;
    }
  &:hover,
  &:focus {
     color: #ff5252;
  }


`;


const StyledSupportIcon=styled.i`
    font-size:60px
`;

//const style = {margin: 20};
// the avatar loader function that returns the user's profile picture if it's present. Otherwise, it loads a placeholder image with user's initital
function AvatarLoader(props) {
    var profile_picture = props.profilepicture+"";

    var name = props.name+"";
    const style = {margin: 20};
    var initials = name.match(/\b\w/g) || [];

    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();

  if (profile_picture) 
  {
       return  <Avatar color={deepOrange300} backgroundColor={white} size={45} style={style} src={profile_picture} />;
  }
  else
  {
       return  <Avatar color={deepOrange300} backgroundColor={white} size={45} style={style}> {initials} </Avatar>;
  }

}

export default class WelcomeUser extends React.Component {

           static isPrivate = true;
           static isAuthenticated = false;
           // Initial state and constructors

          constructor(props) {
                super(props);
                this.state = {
                  // user profile data
                  id:'',
                  token:'',
                  name:'',
                  handle:'', 
                  email:'',
                  photo:'',
                  location:'',
                  description:'',
                  route:'social',
                  openCardWrite: false
                  //must be changed if login integration is finished. 
                };
                //helper methods for the user card
              this.handleOpenCardWrite = this.handleOpenCardWrite.bind(this);
              this.handleClosePostWrite = this.handleClosePostWrite.bind(this);
                 
              }




        /**
         * Open post write
         * 
         * 
         * @memberof Blog
         */
        handleOpenCardWrite = () => {
          this.setState({
            openCardWrite: true
          })
        }



        /**
         * Close post write
         * 
         * 
         * @memberof Blog
         */
        handleClosePostWrite = () => {
        this.setState({
          openCardWrite: false
        })
      }



   //   <StyledSupportContainer><StyledSupportIcon className="material-icons md-light md-48">thumb_up</StyledSupportIcon></StyledSupportContainer>
   // <Header>#SocialCause</Header>
   //  <StyledSupportContainer><StyledSupportIcon className="material-icons md-light md-48">thumb_down</StyledSupportIcon></StyledSupportContainer>



      // lifecycle method to notify that the user is logged in 

  componentWillMount() {
             const cookies = new Cookies();
             cookies.set('isLoggedIn', true, { path: '/' });
          }



  componentDidMount(){


    // get the profile from the database to recieve the information about the user,
      var self = this;
        axios.post('/getSession', {
            })
            .then(function (response) {
               if(response){
                     //determine the type of response 
                              // step 1 check to see if it is local or social
                           var uniqueid =  response.data._id;

                           if(response.data.social){
                                    console.log("THE RESPONSE WAS SOCIAL");
                                  // the user could be coming from facebook, google, or twitter. 
                                    if(response.data.social.fb){
                                      //this is a facebook profile 
                                       self.setState({id:response.data.social.fb.id});

                                       self.setState({token:response.data.social.fb.token});

                                       self.setState({name:response.data.social.fb.displayName});

                                       self.setState({email:response.data.social.fb.email});

                                       self.setState({photo:response.data.social.fb.photo});


                                    }else if(response.data.social.google){
                                      //this is a google profile 
                                       self.setState({id:response.data.social.google.id});

                                       self.setState({token:response.data.social.google.token});

                                       self.setState({name:response.data.social.google.displayName});

                                       self.setState({email:response.data.social.google.email});

                                       self.setState({photo:response.data.social.google.photo});


                                    }else if(response.data.social.twitter)
                                    {
                                      //this is a twiiter profile 
                                       self.setState({id:response.data.social.twitter.id});

                                       self.setState({token:response.data.social.twitter.token});

                                       self.setState({name:response.data.social.twitter.displayName});

                                       self.setState({handle:response.data.social.twitter.handle});

                                       self.setState({photo:response.data.social.twitter.photo});

                                       self.setState({location:response.data.social.twitter.metaData.location});

                                       self.setState({description:response.data.social.twitter.metaData.description});

                                    }
                           }else{

                                //the response is local. 
                                //Therefore, the profile of the user should be retrived from here. 
                                //Under the current setup, this should always be null because we are useing xhr in Homepage for local login. 
                                // Therefore, we will implement later. 
                                //CURRENTLY WORKING ON THE SOCIAL ROUTE
                                       console.log('THE RESPONSE WAS LOCAL');
                                       var test_name='John Doe';
                                       console.log(response.data);
                                       self.setState({id:response.data._id});
                                       self.setState({name:test_name});
                                       self.setState({email:response.data.local.email});


                           }
                    //self.setState({session:response.data});
                    // self.setState({email:response.data.email});
                    // self.setState({password:response.data.password});  
                     }
                        })
                        .catch(function (error) {
                               console.log('error is ',error);
                                      });
        // map the profile to the state variable and react will send the data to the display component. 


//   var that = this;
//   var url = 'http://localhost:3000/session'


// fetch(url, { 
//   method: 'GET',
//   headers: { 
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   }
// })
//   .then(
//     function(response) {
//       if (response.status !== 200) {
//         console.log('Looks like there was a problem. Status Code: ' +
//           response.status);
//         return;
//       }

//       // Examine the text in the response
//       response.json().then(function(data) {
//         console.log(data);
//       });
//     }
//   )
//   .catch(function(err) {
//     console.log('Fetch Error :-S', err);
//   });

}  
   render() {
return(
  <DivParent>
    <MuiThemeProvider>
      <NavBar profilepicture={this.state.photo} name={this.state.name}/>
   </MuiThemeProvider>
    <MuiThemeProvider>
        <div className='grid grid__gutters grid__1of2 grid__space-around animate-top'>

          <div className='grid-cell animate-top'  style={{maxWidth: '530px', minWidth: '280px'}}>
                <PostWrite profilepicture={this.state.photo} name={this.state.name} open={this.state.openCardWrite} onRequestClose={this.handleClosePostWrite} edit={false} >
                  <Paper zDepth={2} style={{ height: "100px", marginTop:10, marginLeft:350 ,width: "100%" }}>
                    <ListItem
                      primaryText={<span style={{ color: grey400, cursor: "text" }}> What's new with you? </span>}
                      leftAvatar={<AvatarLoader profilepicture={this.state.photo} name={this.state.name}/> }
                      rightIcon={<SvgCamera />}
                      style={{ padding: "0px 0px", fontWeight: "200" }}
                      onTouchTap={this.handleOpenCardWrite}
                    />
                  </Paper>
                 </PostWrite>
                         </div></div>
  
   </MuiThemeProvider>



 <DivContent>
 </DivContent>
</DivParent>
       );
	}
}














