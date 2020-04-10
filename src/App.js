import React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import { SocketProvider, useEmitEvent } from "react-socket-io-hooks";
import TwitchSongRequests from "./containers/TwitchSongRequests/TwitchSongRequests";
import StreamerInput from "./components/StreamerInput/StreamerInput";
import reducer from "./reducers/socketReducer";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <SocketProvider
          uri={`https://twitch-youtube-bot-backend.herokuapp.com`}
          reducer={reducer}
          initialState={{
            streamer: "",
            requests: [],
          }}
        >
          <Switch>
            <Route path="/" exact component={StreamerInput} />
            <Route path="/requests" exact component={TwitchSongRequests} />
          </Switch>
        </SocketProvider>
      </Router>
    </div>
  );
}

export default App;
