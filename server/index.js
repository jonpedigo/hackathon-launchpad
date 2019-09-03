const express = require('express')
const socketioAuth = require("socketio-auth")
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const app = express()
const game = require('./game')
const config = require('./config')

// Start it up!
const port = process.env.PORT || 3000
const logger = () => console.log(`Listening: ${port}`)
const server = app.listen(port)

// serve it up!
app.get('/', (req, res, next) => {
  res.sendFile(require('path').resolve('./client/build/index.html'))
})

// Set static file location for production
app.use(express.static(require('path').resolve('./client/build')))

// Connect to the Database
const mongoose = require("mongoose")
mongoose.Promise = require("bluebird")
const mongoOpts = { useMongoClient: true }
const mongoUrl = config.mongodb
mongoose
  .connect(mongoUrl, mongoOpts)
  .catch(e => console.log(e))

// connect sockets
const io = require("socket.io")(server)

// Authenticate!
const User = require("./db/User")
const authenticate = async (socket, data, callback) => {
  const { username, password, signup } = data

  try {
    // session
    if (socket.handshake.headers.cookie){
      const cookieUser = cookie.parse(socket.handshake.headers.cookie).user
      if (cookieUser) {
        const username = jwt.decode(cookieUser, 'secret-words')
        if(username){
          const user = await User.findOne({ username })
          if (!user) {
            socket.emit('auth_message', { message: 'No such username and password combination'})
          } else {
            socket.user = user
            return callback(null, !!user)
          }
        }
      }
    }

    // sign up
    if (signup) {
      const user = await User.create({ username, password })
      socket.user = user
      return callback(null, !!user)
    }

    // login
    const user = await User.findOne({ username })
    if (!user) {
      socket.emit('auth_message', { message: 'No such username and password combination'})
      return
    }
    if(user.validPassword(password)) {
      socket.user = user
      return callback(null, user)
    }

    // error handling
    socket.emit('auth_message',  { message: 'No such username and password combination'})
  } catch (error) {
    socket.emit('auth_message', { message: 'Authentication error. Username probably already exists'})
    console.log(error)
    callback(error)
  }

}


// start game
game(io).then((game) => {
  const postAuthenticate = socket => {
    socket.emit('authenticated', {cookie: jwt.sign(socket.user.username, 'secret-words'), user: socket.user})
    game.on(socket)
  }

  // Configure Authentication
  socketioAuth(io, { authenticate, postAuthenticate, timeout: "none" })
})
