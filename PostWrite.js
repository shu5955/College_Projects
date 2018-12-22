// - Import react components
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {  white,grey400, grey800, darkBlack, lightBlack,deepOrange300 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Avatar from 'material-ui/Avatar';
import * as PostAPI from './PostAPI';    

// The avatar loader function puts user profile picture on the user card

function AvatarLoader(props) {
    var profile_picture = props.profilepicture+"";

    var name = props.name+"";

    const style = {margin: 20};

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


// - Create PostWrite component class
export default class PostWrite extends React.Component {

  static propTypes = {
    /**
     * If it's true post writing page will be open
     */
    open: PropTypes.bool,
    /**
     * Recieve request close function
     */
    onRequestClose: PropTypes.func,
    /**
     * Post write style
     */
    style: PropTypes.object,
    /**
    * If it's true, post will be in edit view
    */
    edit: PropTypes.bool.isRequired,
    /**
     * The text of post in editing state
     */
    text: PropTypes.string,
    /**
     * If post state is editing this id sould be filled with post identifier
     */
    id: PropTypes.string

  }
  /**
   * Component constructor
   * @param  {object} props is an object properties of component
   */
  constructor(props) {
    super(props)
    // Default state
    this.state = {
      /**
       * Post text
       */
      postText: this.props.edit ? this.props.text : '',
      /**
       * If it's true post button will be disabled
       */
      disabledPost: true,
      /**
       * If it's true comment will be disabled on post 
       */
      disableComments: this.props.edit ? this.props.disableComments : false,
      /**
       * If it's true share will be disabled on post 
       */
      disableSharing: this.props.edit ? this.props.disableSharing : false,

    }

    // Binding functions to `this`
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handlePost = this.handlePost.bind(this)
    this.handleToggleComments = this.handleToggleComments.bind(this)
    this.handleToggleSharing = this.handleToggleSharing.bind(this)

  }

  /**
   * Toggle comments of the post to disable/enable 
   * 
   * 
   * @memberof PostWrite
   */
  handleToggleComments = () => {
    this.setState({
      disableComments: !this.state.disableComments,
      disabledPost: false
    })
  }

  /**
   * Toggle sharing of the post to disable/enable
   * 
   * 
   * @memberof PostWrite
   */
  handleToggleSharing = () => {
    this.setState({
      disableSharing: !this.state.disableSharing,
      disabledPost: false
    })
  }



  /**
   * Handle send post to the server
   * @param  {event} evt passed by clicking on the post button
   */
  handlePost = (evt) => {
    const {
      disableComments,
      disableSharing,
      postText } = this.state
    const {
      id,
      avatar,
      name,
      edit,
      onRequestClose,
      post,
      update } = this.props
    let tags = PostAPI.getContentTags(postText)
    // In edit status we should fire update if not we should fire post function
    if (!edit) {
        post({
          body: postText,
          tags: tags,
          avatar: avatar,
          name: name,
          disableComments: disableComments,
          disableSharing: disableSharing
        }, onRequestClose)
    }
    // In edit status we pass post to update functions
    else {
      update({
        id: id,
        body: postText,
        tags: tags,
        disableComments: disableComments,
        disableSharing: disableSharing
      }, onRequestClose)
    }
  }


  /**
   * When the post text changed
   * @param  {event} evt is an event passed by change post text callback funciton
   * @param  {string} data is the post content which user writes
   */
  handleOnChange = (evt, data) => {
    this.setState({ postText: data })
    if (data.length === 0 || data.trim() === '' || (this.props.edit && data.trim() === this.props.text)) {
      this.setState({
        postText: data,
        disabledPost: true
      })
    }
    else {
      this.setState({
        postText: data,
        disabledPost: false
      })
    }

  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.open) {
      this.setState({
        /**
         * Post text
         */
        postText: this.props.edit ? this.props.text : '',
    
        /**
         * If it's true post button will be disabled
         */
        disabledPost: true,
        /**
         * If it's true comment will be disabled on post 
         */
        disableComments: this.props.edit ? this.props.disableComments : false,
        /**
         * If it's true share will be disabled on post 
         */
        disableSharing: this.props.edit ? this.props.disableSharing : false,

      })
    }
  }

  /**
   * Reneder component DOM
   * @return {react element} return the DOM which rendered by component
   */
  render() {

    const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left"
      >
        <MoreVertIcon color={grey400} />
      </IconButton>
    )

    const rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem onClick={this.handleToggleComments} style={{ fontSize: "14px" }}>{!this.state.disableComments ? 'Disable comments' : 'Enable comments'} </MenuItem>
        <MenuItem onClick={this.handleToggleSharing} style={{ fontSize: "14px" }}>{!this.state.disableSharing ? 'Disable sharing' : 'Enable sharing'}</MenuItem>
      </IconMenu>
    )
    let postAvatar = <AvatarLoader profilepicture={this.props.photo} style={{ top: "8px" }} name={this.props.name}/>

    let author = (
      <div>
        <span style={{
          fontSize: "14px",
          paddingRight: "10px",
          fontWeight: 400,
          color: "rgba(0,0,0,0.87)",
          textOverflow: "ellipsis",
          overflow: "hidden",
          paddingLeft: "50px",
          lineHeight: "25px"
        }}>{this.props.name}</span><span style={{
          fontWeight: 100,
          fontSize: "10px"
        }}> | Public</span>
      </div>
    )

    const writeActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        keyboardFocused={false}
        onTouchTap={this.props.onRequestClose}
        style={{ color: grey800 }}
      />,
      <FlatButton
        label={this.props.edit ? 'UPDATE' : 'POST'}
        primary={true}
        keyboardFocused={false}
        onTouchTap={this.handlePost}
        disabled={this.state.disabledPost}
      />
    ]


    const styles = {
      dialog: {
        width: '',
        maxWidth: '530px',
        borderRadius: "4px"
      }
    }

    return (
      <div style={this.props.style}>
        {this.props.children}
        <Dialog
          id={this.props.id || 0}
          actions={writeActions}
          modal={false}
          open={this.props.open}
          contentStyle={styles.dialog}
          onRequestClose={this.props.onRequestClose}
          overlayStyle={{ background: "rgba(0,0,0,0.12)" }}
          bodyStyle={{ padding: 0 }}
          autoDetectWindowHeight={false}
          actionsContainerStyle={{ borderTop: "1px solid rgb(224, 224, 224)" }}>

          <ListItem
            disabled={true}
            leftAvatar={postAvatar}
            rightIconButton={rightIconMenu}
            primaryText={author}
            style={{ padding: "16px 4px 30px 16px" }}
          />
          <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, overflow: "hidden" }}>
            <div style={{ position: "relative", flexDirection: "column", display: "flex", flexGrow: 1, overflow: "hidden", overflowY: "auto", maxHeight: "300px" }}>
              <TextField
                value={this.state.postText}
                onChange={this.handleOnChange}
                hintText="What is new with you?"
                underlineShow={false}
                multiLine={true}
                rows={2}
                hintStyle={{ fontWeight: 200, fontSize: "14px" }}
                textareaStyle={{ fontWeight: 200, fontSize: "14px" }}
                style={{ margin: "0 16px", flexShrink: 0, width: "initial", flexGrow: 1 }}
              />
            </div>
          </div>
        </Dialog>
      </div>
    )
  }
}

