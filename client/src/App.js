import React, { Component, useState } from "react";
import io from "socket.io-client";
import { useCookies } from 'react-cookie'
import Login from "./Login";

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});
socket = new io.Socket();

window.socket = socket;

function App() {
  const [state, setState] = useState({ username: '', password: ''});
  const [cookies, setCookie] = useCookies(['user']);

  if(cookies.user && !window.user) {
    socket.emit("authentication", {})
  }

  socket.on("authenticated", (user) => {
    window.user = user
    setCookie('user', user, { path: '/' });
  });

  const onLogIn = () => {
    socket.emit("authentication", {username: state.username, password: state.password});
  };

  const onSignUp = () => {
    socket.emit("authentication", { username: state.username, password: state.password, register: true });
  };

  const onSocket = event => () => {
    socket.emit(event);
  };

  const onChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const actions = {
    onLogIn,
    onSignUp,
    onChange
  };

  if (window.user){
    return <div>Logged In</div>
  } else {
    return <Login actions={actions} values={state} />
  }
}

export default App;
