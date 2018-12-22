import React, {PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import {red500,grey400,deepOrange300,white} from 'material-ui/styles/colors';

/**
Parent component is Profile. This is just the view of the profile 

*/


// Avatar loader loads the profile of the user. If he has a picture then it shows the profile picture, otherwise it shows an image with initials
function AvatarLoader(props) {
    var profile_picture = props.profilepicture+"";
		console.log("The profile profile_picture: "+ profile_picture);
    var name = props.name+"";



    var initials = name.match(/\b\w/g) || [];

    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  console.log(profile_picture);


  if (props.profilepicture!=undefined) 
  {  
  	  	console.log("I Should not be HERE");
       return  <Avatar color={white} backgroundColor={red500} size={45} src={profile_picture} size={120} style={style}/>;
  }
  else
  {
  		console.log("I Should be HERE");
       return  <Avatar color={white} backgroundColor={red500} size={45} size={120} style={style}> {initials} </Avatar>;
  }

}

const underlineStyle = { display: 'none' };
const style = { marginLeft: 20 };

const ProfileContainer = (props) => {


  return (
  	    <MuiThemeProvider>
    <form onSubmit={props.onSubmit}>
     <div className="row middle-xs center-xs" style={{ width: '100%', textAlign: 'initial' }}>
        <Paper className="col-xs-10 col-sm-6" zDepth={1}
          style={{ width: 'auto', padding: 20, margin: 20 }}
        >
          <h2>Profile for {props.name}</h2>
          <div className="row">
            <div className="col-sm-3 center-xs start-md" >
              <AvatarLoader profilepicture={props.profilepicture} name={props.name} />
            </div>
            <div className="col-sm-9">
              <TextField hintText="Full name" name="name" onChange={props.onChange} underlineStyle={underlineStyle} value={props.name} style={style} />
              <Divider />
              <TextField hintText="Email address" name="email" onChange={props.onChange} type="email" underlineStyle={underlineStyle} value={props.emailAddress} style={style} />
              <Divider />
            </div>
          </div>
          <div className="row" style={{ marginTop: 20 }}>
            <div className="col-xs end-xs">
              <RaisedButton className="col end-xs" type="submit" label="Update" backgroundColor="#f44336" labelColor='#fff' />
            </div>
          </div>
        </Paper>
      </div>
      </form>
          </MuiThemeProvider>

  )
};

ProfileContainer.propTypes = {
  username: PropTypes.string.isRequired
};

export default ProfileContainer;