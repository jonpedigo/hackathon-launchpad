// Prepare the Server
const server = require("http").createServer();
const io = require("socket.io")(server);
const socketioAuth = require("socketio-auth");
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

// Connect to the Database
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const mongoOpts = { useMongoClient: true };
const mongoUrl = "mongodb://pedigojon:asdasd123@ds239206.mlab.com:39206/heroku_8v60t1z3";

io.use((socket, next) => {
  mongoose
    .connect(mongoUrl, mongoOpts)
    .then(() => next())
    .catch(e => console.error(e.stack));
});

// Authenticate!
const User = require("./User");
const authenticate = async (client, data, callback) => {
  const { username, password, register } = data;

  if (client.handshake.headers.cookie){
    const cookieUser = cookie.parse(client.handshake.headers.cookie).user;
    if (cookieUser) {
      const username = jwt.decode(cookieUser, 'secret-words');
      if(username){
        const user = await User.findOne({ username });
        client.user = user;
        return callback(null, !!user);
      }
    }
  }

  try {
    if (register) {
      const user = await User.create({ username, password });
      client.user = user;
      return callback(null, !!user);
    } else {
      const user = await User.findOne({ username });
      client.user = user;
      return callback(null, user && user.validPassword(password));
    }
  } catch (error) {
    callback(error);
  }
  
};

// Register Actions
const postAuthenticate = client => {
  client.emit('authenticated', jwt.sign(client.user.username, 'secret-words'));
};

// Configure Authentication
socketioAuth(io, { authenticate, postAuthenticate, timeout: "none" });

// Start it up!
const port = 3001;
const host = "localhost";
const logger = () => console.log(`Listening: http://${host}:${port}`);
server.listen(port, host, logger);
