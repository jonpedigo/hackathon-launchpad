import React, { Component, useState } from "react";
import io from "socket.io-client";
import { useCookies } from 'react-cookie'
import Login from "./Login";

if (window.location.origin.indexOf('localhost') > 0) {
  window.socket = io.connect('http://localhost:3001');
} else {
  window.socket = io.connect();
}

function App() {
  const [state, setState] = useState({ username: '', password: ''});
  const [cookies, setCookie] = useCookies(['user']);

  if(cookies.user && !window.user) {
    window.socket.emit("authentication", {})
  }

  window.socket.on("authenticated", (user) => {
    window.user = user
    setCookie('user', user, { path: '/' });
  });

  const onLogIn = () => {
    window.socket.emit("authentication", {username: state.username, password: state.password});
  };

  const onSignUp = () => {
    window.socket.emit("authentication", { username: state.username, password: state.password, register: true });
  };

  const onSocket = event => () => {
    window.socket.emit(event);
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
