import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useCookies } from 'react-cookie'
import Login from "./Login";
import Sample from "./sample";

if (window.location.origin.indexOf('localhost') > 0) {
  window.socket = io.connect('http://localhost:4000');
} else {
  window.socket = io.connect();
}

function App() {
  const [cookies, setCookie] = useCookies(['user']);
  const [state, setState] = useState({ username: '', password: '', message: '', checkingCookie: !!cookies.user});

  useEffect(() => {
    if(cookies.user && !window.user) {
      window.socket.emit("authentication", {})
    }
  }, [])

  window.socket.on("authenticated", (user) => {
    setCookie('user', user, { path: '/' });
    window.user = user;
    setState({...state, checkingCookie: false});
  });

  window.socket.on("auth_message", ({ message }) => {
    setState({...state, message, checkingCookie: false})
  });

  const onLogIn = () => {
    window.socket.emit("authentication", {username: state.username, password: state.password});
  };

  const onSignUp = () => {
    window.socket.emit("authentication", { username: state.username, password: state.password, signup: true });
  };

  const onChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  if (window.user) {
    return <Sample/>
  }

  if (!state.checkingCookie) {
    return (
      <Login actions={{
        onLogIn,
        onSignUp,
        onChange
      }} values={state} />
    )
  }

  return null
}

export default App;
