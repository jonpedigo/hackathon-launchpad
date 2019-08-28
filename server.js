const express = require('express');
const socketioAuth = require("socketio-auth");
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const app = express();

// Start it up!
const port = process.env.PORT || 4000;
const logger = () => console.log(`Listening: ${port}`);
const server = app.listen(port);

// serve it up!
app.get('/', (req, res, next) => {
  res.sendFile(require('path').resolve('./client/build/index.html'));
})

// Set static file location for production
app.use(express.static(require('path').resolve('./client/build')));

// Connect to the Database
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const mongoOpts = { useMongoClient: true };
const mongoUrl = "mongodb://heroku_39lqpvm0:k0m7rc2pligndujih4hhlbl4vj@ds139480.mlab.com:39480/heroku_39lqpvm0";
mongoose
  .connect(mongoUrl, mongoOpts)
  .catch(e => console.log(e));

// connect sockets
const io = require("socket.io")(server);

// Authenticate!
const User = require("./User");
const authenticate = async (client, data, callback) => {
  const { username, password, signup } = data;

  try {
    // session
    if (client.handshake.headers.cookie){
      const cookieUser = cookie.parse(client.handshake.headers.cookie).user;
      if (cookieUser) {
        const username = jwt.decode(cookieUser, 'secret-words');
        if(username){
          const user = await User.findOne({ username });
          if (!user) {
            client.emit('auth_message', { message: 'No such user'})
            return;
          }
          client.user = user;
          return callback(null, !!user);
        }
      }
    }

    // sign up
    if (signup) {
      const user = await User.create({ username, password });
      client.user = user;
      return callback(null, !!user);
    }

    // login
    const user = await User.findOne({ username });
    if (!user) {
      client.emit('auth_message', { message: 'No such username and password combination'})
      return;
    }
    if(user.validPassword(password)) {
      client.user = user;
      return callback(null, user);
    }

    client.emit('auth_message',  { message: 'No such username and password combination'})
  } catch (error) {
    client.emit('auth_message', { message: 'Authentication error. Username probably already exists'})
    console.log(error)
    callback(error);
  }

};

// Register Actions
const postAuthenticate = client => {
  client.emit('authenticated', jwt.sign(client.user.username, 'secret-words'));
};

// Configure Authentication
socketioAuth(io, { authenticate, postAuthenticate, timeout: "none" });
