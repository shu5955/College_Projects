'use strict'
/*
This is the react component for rendering the sockets and chat room that server creates in the server file. 
The following code creates a chat room for the user. 
*/

//react class called chat
var Chat = React.createClass({
  // The is the initial state of the component
  getInitialState: function () {
    return {
      user: null, //there user is null
      users: [], //there are no users 
      currentUser: {
        messages: [] //the message is also null because the user is null
      }
    };
  },
  contextTypes: {
    socket: React.PropTypes.object.isRequired //this is the socket and it comes as a prop to this component. check the rendering of this method.
  },
  componentDidMount: function() {
    //this is the lifecycle method that invokes when the component mounts. It is called after component will mount. 
    this.refs.chatTextarea.focus();
    this.context.socket.emit('user:login'); //this is the time to log user in because the component succesfully mounted. Check the server side code for this socket emit. 
  },
  scrollToBottom: function(name) {
    if (this.refs[name]) {
      this.refs[name].scrollTop = this.refs.messages.scrollHeight;
    }
  },
  selectUser: function(index){
    // method for selecting user. 
    var users = this.state.users; //get the users
    var selectedUser= this.state.users[index]; //get the selected user
    selectedUser.unreadMessageCount = 0; // set the message count to 0
    users[index] = selectedUser;
    this.setState({users: users}); //set the user to the state of the app 
    this.setState({currentUser: this.state.users[index]}); //set the selected user as the current user. 
  },
  loadOnlineUsers: function() {
    this.context.socket.emit('users:get'); //this loads the online users. Check the emit function users:get in the server side code. 
  },
  handleMessageNew: function (message) {

    // helper method to handle a new message. Loads the current user and message from him. Does a sanity check and warns if user not found. 
    //uodates the message counts after checking that the current user is the one who sent the message. 

    console.info('Got event message_new: ', message);
    var currentUser = this.state.currentUser;
    var users = this.state.users;
    var index = users.findIndex(function(u) { return message.from === u.userId });
    var messageFromUser = users[index];

    if (!messageFromUser) {
      console.warn('Not found user!')
      return;
    }

    messageFromUser.messages.push(message);

    if (currentUser && currentUser.nickname === messageFromUser.nickname ) {
      this.scrollToBottom('messages');
    } else {
      if (messageFromUser.unreadMessageCount) {
        messageFromUser.unreadMessageCount += 1;
      } else {
        messageFromUser.unreadMessageCount = 1
      }
    }
    console.log(messageFromUser)
    users.splice(index, 1);
    users.unshift(messageFromUser);
    this.setState({users: users});
  },
  handleEventResponse: function(response) {

    //this method handles the response emitted by the server socket. Please check the file for the emit key
    console.debug('Got response event: ', response.type, response.data);
    switch (response.type) {
      case 'user:login':
        this.setState({user: response.data}) // login user by setting the user to the state
        this.loadOnlineUsers();
        break;
      case 'users:get':
        var users = Array.isArray(response.data) ? response.data : [response.data] // retrive the users from the response and set it to the state
        this.setState({users: users})
        break;
      case 'message:send':
        break;
      case 'user:logout':
        break;
    }
  },
  handleUserAdded: function(user) {

    //adds the user to the state
    console.info('Got user:added event: ', user);
    var users = this.state.users;
    user.messages = []
    users.push(user);
    this.setState({users: users});
  },
  handleUserRemoved: function(user) {
    // remove the users from the state 

    console.info('Got user:removed event: ', user);
    var users = this.state.users;
    var index = users.findIndex(function(u) { user.userId === u.userId; });
    users.splice(index, 1);
    this.setState({users: users});
  },
  sendMessage: function() {

    // retreive the message from the user's chat area 
    var msg = this.refs.chatTextarea.value;
    // warns when the user is not logged in (not set to the state )
    if (!this.state.user) {
      console.warn('Not logged in!');
      return;
    }

    if (!this.context.socket || this.context.socket.status !== 'connected') {
      console.warn('Socket is unavailable!');
      return;
    }

    if (this.refs.chatTextarea.value.length <= 0) {
      console.warn('Can not send empty!');
      return;
    }
    //get the current user
    var currentUser = this.state.currentUser;
    // create a message object
    var message = {
      content: this.refs.chatTextarea.value,
      from: this.state.user.userId,
      time: new Date().getTime(),
      to: currentUser.userId
    };
    // send the message 
    this.context.socket.emit('message:send', message);

    message.isMine = true;
    currentUser.messages.push(message);
    this.setState({currentUser: currentUser}, function() {
      this.scrollToBottom('messages');
    });
    this.refs.chatTextarea.value = '' // empty the text area
  },
  handleKeyEvent: function (event) {
    var e = event || window.event;
      //handles the key event to send the message 
    if (e.ctrlKey) {
      if (e.keyCode === 13) {
        var value = this.refs.chatTextarea.value;
        if (value && value.length > 0) {
          this.refs.chatTextarea.value += '\r\n';
          this.scrollToBottom('chatTextarea');
        } else {
          this.refs.chatTextarea.value = '\r\n';
        }
      }
    } else {
      if (e.keyCode === 13) {
        e.preventDefault();
        this.sendMessage();
      }
    }
  },
  render: function () {
    var self = this;
      // HTML code to render the chat room and socket events present in server file
    return (
      <div>
        <h1>React Chat Example</h1>
        <ReactSocketIO.Event event="message:new" handler={self.handleMessageNew} />
        <ReactSocketIO.Event event="response" handler={self.handleEventResponse} />
        <ReactSocketIO.Event event="user:added" handler={self.handleUserAdded} />
        <ReactSocketIO.Event event="user:removed" handler={self.handleUserRemoved} />
        <div className="chat-section" ref="chat">
          <div className="chat-users-section">
            <div className="title">Online Users</div>
            <div className="users">
              {
                self.state.users.map(function (user, index) {
                  var unreadMessageCountClass = "unreadMessageCount";
                  var userClass = "user";

                  if (user.unreadMessageCount <= 0) unreadMessageCountClass += " hidden"
                  if (self.state.currentUser && user.nickname === self.state.currentUser.nickname) {
                    userClass += " active";
                  }

                  return (
                    <div className={userClass} key={index} onClick={function(e){self.selectUser(index)}}>
                      <img className="avatar" src="https://dn-daniujia.qbox.me/moren.png" />
                      <div className="others">
                        <span className="username">{user.username}</span>
                      </div>
                      <div className={unreadMessageCountClass}>{user.unreadMessageCount}</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="chat-body-section">
            <div className="title">{self.state.currentUser && self.state.currentUser.username}</div>
            <div className="messages" ref="messages">
              {
                self.state.currentUser.messages.map(function (message, index) {
                  var classes = "message";
                  if (self.state.user && self.state.user.userId === message.from) classes += " isMine";

                  var time = new Date(message.time);
                  return (
                    <div className={classes} key={index}>
                      <div className="info">
                        <span className="name"></span>
                        <span className="time">{time.toLocaleTimeString()}</span>
                      </div>
                      <pre className="content">
                        {message.content}
                      </pre>
                    </div>
                  );
                })
              }
            </div>
            <div className="footer">
              <textarea
                className="chat-textarea"
                placeholder='Input there, press "Enter" to send message or "Ctrl + Enter" to add a newline.'
                ref="chatTextarea"
                onKeyDown={ self.handleKeyEvent }
              >
              </textarea>
            </div>
          </div>
        </div>
      </div>
    );
  }
});


// render the app container with socket configuration. 
var AppContainer = React.createClass({
  render() {
    var uri = 'http://localhost:8090'
    var options = { transports: ['websocket'] }

    return (
      <ReactSocketIO.Socket uri={uri} options={options}>
        <Chat />
      </ReactSocketIO.Socket>
    )
  }
});


// render the parent component. 
ReactDOM.render(
  <AppContainer />,
  document.getElementById('container')
);
