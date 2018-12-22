var app = require('http').createServer(handler)
var io = require('socket.io')(app, { transports: ['websocket'] });
var fs = require('fs');

app.listen(8090); //port

var sockets = {} // sockets configuration 
var userCounts = 0 // nuber of users 



// the server configuration handler. 

function handler (req, res) {
  var filePath = req.url; // file path

  if (req.url === '/') filePath = '/app/index.html';

  fs.readFile(__dirname + filePath, function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading' + filePath + ': ' + err);
    }

    res.writeHead(200);
    res.end(data);
  });
}

// socket connection. 
io.on('connection', function (socket) {

  //on connect increase the user count as user loads the url 
  socket.on('user:login', function(data) {
    var userId = ++userCounts; //get user id 
    // the user socket 
    socket.user = { 
      userId: userId, 
      username: 'User ' + userId,
      nickname: 'user' + userId
    };

    console.log('response_user:login: ', socket.user);

    //sending response using the socket. 
    socket.emit('response', { type: 'user:login', data: socket.user });


    Object.keys(sockets).map(function(userId) {
      sockets[userId].emit('user:added', socket.user)
    });

    sockets[userId] = socket
  });


//get request 
  socket.on('users:get', function(data) {
    //get the data from the socket
    var data = Object.keys(sockets).map(function(userId) {
      //get the users from a list of sockets. userId helps in identifying the user. 
      var user = sockets[userId].user
      return {
        userId: user.userId, //get the userid into an object
        username: user.username, //get the username
        nickname: user.nickname, //get the nickname 
        unreadMessageCount: 0, //initialize the message count to 0
        messages: [] //message array
      }
    }).filter(function(user) {

      //get the user and perform a sanity check to see if the user is correct return false. 
      if (user.userId === socket.user.userId) return false;

      if (data && data.target && data.targetId !== user.userId) return false;

      return true;
    });

    //send the data using emit
    console.log('response_users:get: ', data);
    socket.emit('response', { type: 'users:get', data: data });
  });



// handler for sending the message. 
  socket.on('message:send', function (message) {
    // the time of the message 
    message.time = new Date().getTime();
    console.log('response_message:send: ', message);
    //send the message with correct date. 
    sockets[message.to] && sockets[message.to].emit('message:new', message);
    //emit the response 
    socket.emit('response', { type: 'message:send', data: message });
  });


// when user logout 
  socket.on('user:logout', function() {
    var user = socket.user;
    // emit the response 
    socket.emit('response', { type: 'user:logout'});
    // if user is null do nothing
    if (!user) return;
    delete sockets[user.userId];     // delete the user from the socket. 
    socket.disconnect(true); //disconnects the socket. 

    Object.keys(sockets).map(function(userId) {
      sockets[userId].emit('user:logged:out', user) //emit confirmation that the user is logged out. 
    });
  });



// disconnect handler
  socket.on('disconnect', function() {
    var user = socket.user; // get the user from the socket. 
    if (!user) return; //if the user is null 

    delete sockets[user.userId]; //delete the socket 
    socket.disconnect(true); //disconnect the socket 

    Object.keys(sockets).map(function(userId) {
      //emit the confirmation that user has been removed. 
      sockets[userId].emit('user:removed', user);
    });
  });
});

console.log('server started at 8090')
