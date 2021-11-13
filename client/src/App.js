import {Switch,BrowserRouter as Router,Route} from 'react-router-dom';
import { Introduction } from './components/introduction/Introduction.js';
import { JoinRoom } from './components/joinRoom/JoinRoom.js';
import { Room } from './components/room/Room.js';
import { useEffect } from 'react';
import { connectWithServer } from './util/wss.js';
import { useDispatch } from 'react-redux';
import { Container } from './components/room/whiteBoardSection/Container.js';
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    connectWithServer(dispatch);
  }, [])
  return (
    <Router>
        <Switch>
          <Route path="/join-room" component={JoinRoom}/>
          <Route path="/room" component={Room}/>
          <Route path="/board" component={Container}/>
          <Route path="/" component={Introduction}/>
        </Switch>
    </Router>
  );
}

export default App;
