import React, {PropTypes} from 'react';
import ProfileContainer from './ProfileContainer';
import axios from 'axios';
import styled from 'styled-components';
import WelcomeMenu from './WelcomeMenu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {red500} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import AppBar from 'material-ui/AppBar';
import NavBar from './NavBar';
import Cookies from 'universal-cookie';
// this component is the user profile for the service


    
const DivContent= styled.div`
           height: 100%;
           width: 95%;
           margin: 200px auto;
           background-color:#fff;

`;     
     
const DivParent= styled.div`
          width:100%;
          min-height:100%;
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








class Profile extends React.Component {
  
//the user object constructor
constructor(props) {
      super(props);     
      this.getProfile = this.getProfile.bind(this);
      this.updateProfile = this.updateProfile.bind(this);
      this.onChange = this.onChange.bind(this);

      this.state = {
        id:'',
        token:'',
        name:'',
        handle:'', 
        email:'',
        photo:'',
        location:'',
        description:'',
        route:'' //must be changed if login integration is finished. 
      };  
    }


    componentDidMount(){
      this.getProfile();
    }

    updateProfile(event){
          let user_data={
                email:this.state.email,
                name:this.state.name
          }

          axios.post('http://localhost:3000/updateProfile', {
                email:this.state.email,
                name:this.state.name,
                route:this.state.route,
                id:this.state.id
          }).then(function(response){
                console.log(response);
                })

    }

    onChange(event){
       console.log(event.target.value);
       console.log(event.target.name);



    if(event.target.name=="name"){
        this.setState({name: event.target.value
    });

    }else if(event.target.name=="email"){
        this.setState({email: event.target.value
    });


    }
      }

    getProfile(){
 				// get the profile from the database to recieve the information about the user,
	// get the profile from the database to recieve the information about the user,
    
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

                                  self.setState({route:'social'});
 
                                    if(response.data.social.fb){
                                      //this is a facebook profile 
                                       self.setState({id:response.data.social.fb.id});

                                       self.setState({token:response.data.social.fb.token});

                                       self.setState({name:response.data.social.fb.displayName});

                                       self.setState({email:response.data.social.fb.email});

                                       self.setState({photo:response.data.social.fb.photo});

                                       self.setState({route:'fb'});

                                    }else if(response.data.social.google){
                                      //this is a google profile 
                                       self.setState({id:response.data.social.google.id});

                                       self.setState({token:response.data.social.google.token});

                                       self.setState({name:response.data.social.google.displayName});

                                       self.setState({email:response.data.social.google.email});

                                       self.setState({photo:response.data.social.google.photo});

                                       self.setState({route:'google'});

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

                                       self.setState({route:'twitter'});

                                    }
                           }else{

                                //the response is local. 
                                //Therefore, the profile of the user should be retrived from here. 
                                //Under the current setup, this should always be null because we are useing xhr in Homepage for local login. 
                                // Therefore, we will implement later. 
                                //CURRENTLY WORKING ON THE SOCIAL ROUTE
                                       self.setState({route:'local'});
                                       var test_name='John Doe';
                                       console.log(response.data);
                                       self.setState({id:response.data._id});
                                       self.setState({name:test_name});
                                       self.setState({email:response.data.local.email});
                                       self.setState({route:'local'});


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
    }
  


//The render method is responsible for rendering the view
    render() {
      return (
  <DivParent>
    <MuiThemeProvider>
      <NavBar profilepicture={this.state.photo} name={this.state.name}/>
   </MuiThemeProvider>
  <ProfileContainer
              name={this.state.name}
              emailAddress={this.state.email}
              profilepicture={this.state.photo}
              aboutme={this.state.aboutme}
              onSubmit={this.updateProfile}
              onChange={this.onChange}

        />
 <DivContent>
 </DivContent>
</DivParent>
    );
  }

}

Profile.propTypes = {
};

export default Profile;