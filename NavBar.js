import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Avatar from 'material-ui/Avatar';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { Link } from 'react-router';
import { NavLink } from 'react-router';

import {
  blue300,
  indigo900,
  orange200,
  deepOrange300,
  pink400,
  purple500,
  red400,
  grey400,
  white
} from 'material-ui/styles/colors';


/*
This is the navbar for the web app. The navbar has avatar loader that loads the profile picture for the user and links to the other pages of the webapp
React Router Link is used for navigation.
*/

const style = {margin: 20};
const textstyle = {color: '#fff'};

function AvatarLoader(props) {
    var profile_picture = props.profilepicture+"";

    var name = props.name+"";


    var initials = name.match(/\b\w/g) || [];

    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();

  if (profile_picture) 
  {
       return  <Avatar color={deepOrange300} backgroundColor={white} size={45} src={profile_picture} style={style}/>;
  }
  else
  {
       return  <Avatar color={deepOrange300} backgroundColor={white} size={45}  style={style}> {initials} </Avatar>;
  }

}

export default class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 3,
    };
  }

  handleChange = (event, index, value) => this.setState({value});

  componentDidMount(){


  }


  render() {

    return (
      <Toolbar style={{ backgroundColor: 'rgb(239,83,80)' }}>
        <ToolbarGroup firstChild={true}>
                   <Link to="/profile"> <AvatarLoader profilepicture={this.props.profilepicture} name={this.props.name}/> </Link>
        </ToolbarGroup>
        <ToolbarGroup>
          <FontIcon className="muidocs-icon-custom-sort" /> 
          <Link to="/welcome"> <ToolbarTitle style={textstyle} text="Home"></ToolbarTitle></Link>
          <Link to="/about"> <ToolbarTitle style={textstyle} text="News" /></Link>
          <Link to="/about"> <ToolbarTitle style={textstyle} text="Notification" /></Link>
          <Link to="/connections"> <ToolbarTitle style={textstyle} text="Connections" /></Link>
           <IconMenu iconButtonElement={<IconButton><MoreVertIcon iconStyle={textstyle}/></IconButton>} anchorOrigin={{horizontal: 'left', vertical: 'top'}} style={textstyle} targetOrigin={{horizontal: 'left', vertical: 'top'}}>
      <MenuItem href="/about" primaryText="About Us" />
     <Link to="/faqs"><MenuItem primaryText="FAQ" /></Link>
     <Link to="/about"> <MenuItem primaryText="Contact Us" /></Link>
     <Link to="/about"> <MenuItem primaryText="Help" /></Link>
     <MenuItem primaryText="Sign out" href="/logout" />
    </IconMenu>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
